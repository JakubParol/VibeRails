[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
    param([Parameter(Mandatory = $true)][string] $Message)

    $failures.Add($Message) | Out-Null
}

function Get-RepositoryFiles {
    param([string[]] $Include = @("*"))

    Get-ChildItem -LiteralPath $repoRoot -Recurse -File -Force -Include $Include |
        Where-Object {
            $relativePath = $_.FullName.Substring($repoRoot.Path.Length + 1)
            if ($relativePath -match '(^|[\\/])\.git([\\/]|$)') {
                return $false
            }

            foreach ($pattern in $Include) {
                if ($_.Name -like $pattern) {
                    return $true
                }
            }

            return $false
        }
}

function Test-AsciiFiles {
    $files = Get-RepositoryFiles -Include @("*.md", "*.mjs", "*.sh", "*.ps1", "*.json", "*.yaml", "*.yml", ".gitattributes", "LICENSE")
    foreach ($file in $files) {
        $text = Get-Content -LiteralPath $file.FullName -Raw
        if ($text -match "[^\x00-\x7F]") {
            Add-Failure "Non-ASCII content found in $($file.FullName.Substring($repoRoot.Path.Length + 1))."
        }
    }
}

function Test-LineEndingsAndTrailingWhitespace {
    $files = Get-RepositoryFiles -Include @("*.md", "*.mjs", "*.sh", "*.ps1", "*.json", "*.yaml", "*.yml", ".gitattributes", "LICENSE")
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($repoRoot.Path.Length + 1)
        $text = Get-Content -LiteralPath $file.FullName -Raw
        if ($text.Contains("`r`n")) {
            Add-Failure "$relativePath uses CRLF line endings; use LF for cross-platform diffs."
        }

        $lines = $text -split "`n", -1
        for ($index = 0; $index -lt $lines.Count; $index++) {
            $line = $lines[$index] -replace "`r$", ""
            if ($line -match "[ `t]+$") {
                Add-Failure "${relativePath}:$($index + 1) has trailing whitespace."
            }
        }
    }
}

function Test-NoBom {
    $files = Get-RepositoryFiles -Include @("*.md", "*.mjs", "*.sh", "*.ps1", "*.json", "*.yaml", "*.yml", ".gitattributes", "LICENSE")
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($repoRoot.Path.Length + 1)
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            Add-Failure "$relativePath starts with a UTF-8 BOM; remove it for portable text diffs."
        }
    }
}

function ConvertTo-MarkdownAnchor {
    param([Parameter(Mandatory = $true)][string] $Heading)

    $anchor = $Heading.Trim().ToLowerInvariant()
    $anchor = $anchor -replace "[^\w\s-]", ""
    $anchor = $anchor -replace "\s", "-"

    return $anchor
}

function Get-MarkdownAnchors {
    param([Parameter(Mandatory = $true)][string] $Path)

    $anchors = @{}
    $insideFence = $false
    foreach ($line in (Get-Content -LiteralPath $Path)) {
        if ($line -match '^\s*(```|~~~)') {
            $insideFence = -not $insideFence
            continue
        }
        if ($insideFence) {
            continue
        }
        $headingMatch = [regex]::Match($line, "^#{1,6}\s+(.+?)\s*$")
        if ($headingMatch.Success) {
            $anchors[(ConvertTo-MarkdownAnchor -Heading $headingMatch.Groups[1].Value)] = $true
        }
    }

    return $anchors
}

function Test-MarkdownLinks {
    $files = Get-RepositoryFiles -Include @("*.md")
    $anchorCache = @{}
    $linkGraph = @{}

    foreach ($file in $files) {
        $relativeSource = $file.FullName.Substring($repoRoot.Path.Length + 1)
        if (-not $linkGraph.ContainsKey($file.FullName)) {
            $linkGraph[$file.FullName] = @()
        }

        $text = Get-Content -LiteralPath $file.FullName -Raw
        $matches = [regex]::Matches($text, "\[[^\]]+\]\(([^)]+)\)")
        foreach ($match in $matches) {
            $target = $match.Groups[1].Value.Trim()
            if ([string]::IsNullOrWhiteSpace($target)) {
                continue
            }
            if ($target -match "^(https?:|mailto:)") {
                continue
            }
            if ($relativeSource -eq "docs/templates/project-docs-INDEX.md" -and
                ($target -eq "../README.md" -or $target -eq "../AGENTS.md")) {
                continue
            }

            $pathPart = ($target -split "#")[0].Trim("<", ">")
            $anchorPart = ""
            if ($target.Contains("#")) {
                $anchorPart = ($target -split "#", 2)[1].Trim()
            }

            $targetFullPath = $file.FullName
            if (-not [string]::IsNullOrWhiteSpace($pathPart)) {
                if ($pathPart -match "^[a-zA-Z]+:") {
                    continue
                }

                $resolved = Join-Path $file.DirectoryName $pathPart
                if (-not (Test-Path -LiteralPath $resolved)) {
                    Add-Failure "$relativeSource has missing link target '$target'."
                    continue
                }

                $targetFullPath = (Resolve-Path -LiteralPath $resolved).Path
                if ($targetFullPath -like "*.md") {
                    $linkGraph[$file.FullName] += $targetFullPath
                }
            }

            if (-not [string]::IsNullOrWhiteSpace($anchorPart) -and $targetFullPath -like "*.md") {
                if (-not $anchorCache.ContainsKey($targetFullPath)) {
                    $anchorCache[$targetFullPath] = Get-MarkdownAnchors -Path $targetFullPath
                }
                if (-not $anchorCache[$targetFullPath].ContainsKey($anchorPart.ToLowerInvariant())) {
                    Add-Failure "$relativeSource links to missing anchor '#$anchorPart' in '$($targetFullPath.Substring($repoRoot.Path.Length + 1))'."
                }
            }
        }
    }

    return $linkGraph
}

function Test-OrphanMarkdownFiles {
    param([Parameter(Mandatory = $true)][hashtable] $LinkGraph)

    $rootReadme = (Join-Path $repoRoot "README.md")
    if (-not (Test-Path -LiteralPath $rootReadme)) {
        Add-Failure "Repository root README.md is missing."
        return
    }

    $reachable = @{}
    $queue = New-Object System.Collections.Generic.Queue[string]
    $queue.Enqueue((Resolve-Path -LiteralPath $rootReadme).Path)

    while ($queue.Count -gt 0) {
        $current = $queue.Dequeue()
        if ($reachable.ContainsKey($current)) {
            continue
        }
        $reachable[$current] = $true

        if ($LinkGraph.ContainsKey($current)) {
            foreach ($linked in $LinkGraph[$current]) {
                if (-not $reachable.ContainsKey($linked)) {
                    $queue.Enqueue($linked)
                }
            }
        }
    }

    foreach ($file in (Get-RepositoryFiles -Include @("*.md"))) {
        if (-not $reachable.ContainsKey($file.FullName)) {
            Add-Failure "$($file.FullName.Substring($repoRoot.Path.Length + 1)) is an orphan: not reachable from README.md through Markdown links."
        }
    }
}

function Test-SkillMetadata {
    $skillsRoot = Join-Path $repoRoot ".agents\skills"
    if (-not (Test-Path -LiteralPath $skillsRoot -PathType Container)) {
        return
    }

    Get-ChildItem -LiteralPath $skillsRoot -Directory | ForEach-Object {
        $skillDirectory = $_
        $skillFile = Join-Path $skillDirectory.FullName "SKILL.md"
        if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
            Add-Failure "Skill $($skillDirectory.Name) is missing SKILL.md."
            return
        }

        $text = Get-Content -LiteralPath $skillFile -Raw
        $frontmatter = [regex]::Match($text, "\A---\r?\n(?<yaml>.*?)\r?\n---", [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if (-not $frontmatter.Success) {
            Add-Failure "Skill $($skillDirectory.Name) is missing YAML frontmatter."
            return
        }

        $yaml = $frontmatter.Groups["yaml"].Value
        $name = [regex]::Match($yaml, "(?m)^name:\s*(?<value>[a-z0-9-]+)\s*$")
        $description = [regex]::Match($yaml, "(?ms)^description:\s*(?<value>.+?)(\r?\n[a-zA-Z_-]+:|\z)")
        if (-not $name.Success) {
            Add-Failure "Skill $($skillDirectory.Name) is missing a valid name field."
        }
        elseif ($name.Groups["value"].Value -ne $skillDirectory.Name) {
            Add-Failure "Skill $($skillDirectory.Name) name field does not match folder name."
        }
        elseif ($name.Groups["value"].Value -notmatch "^[a-z0-9-]{1,63}$") {
            Add-Failure "Skill $($skillDirectory.Name) name field violates naming rules."
        }
        if (-not $description.Success -or [string]::IsNullOrWhiteSpace($description.Groups["value"].Value)) {
            Add-Failure "Skill $($skillDirectory.Name) is missing a non-empty description field."
        }

        $openAiYaml = Join-Path $skillDirectory.FullName "agents\openai.yaml"
        if (-not (Test-Path -LiteralPath $openAiYaml -PathType Leaf)) {
            Add-Failure "Skill $($skillDirectory.Name) is missing agents/openai.yaml."
        }
        else {
            $metadata = Get-Content -LiteralPath $openAiYaml -Raw
            foreach ($required in @("display_name", "short_description", "default_prompt")) {
                if ($metadata -notmatch "(?m)^\s+${required}:\s*`"[^`"]+`"\s*$") {
                    Add-Failure "Skill $($skillDirectory.Name) agents/openai.yaml is missing $required."
                }
            }
            if ($metadata -notmatch [regex]::Escape("`$$($skillDirectory.Name)")) {
                Add-Failure "Skill $($skillDirectory.Name) default_prompt must mention `$$($skillDirectory.Name)."
            }
        }
    }
}

function Test-PowerShellSyntax {
    $files = Get-RepositoryFiles -Include @("*.ps1")
    foreach ($file in $files) {
        $tokens = $null
        $parseErrors = $null
        [System.Management.Automation.Language.Parser]::ParseFile($file.FullName, [ref] $tokens, [ref] $parseErrors) | Out-Null
        foreach ($parseError in $parseErrors) {
            Add-Failure "$($file.FullName.Substring($repoRoot.Path.Length + 1)): $($parseError.Message)"
        }
    }
}

function Test-RepositoryTextIsGeneric {
    $forbiddenPatterns = @(
        "DocMind",
        "docmind",
        "DOCMINDAI",
        "ELITMIND.DOCMINDAI",
        "ElitMind",
        "elitmind",
        "ELITMIND",
        "Elitmindvs",
        "VibeRails-EM",
        "SessionDeck",
        "CrackerAi",
        "SignalBoy",
        "IQControl.Ai"
    )
    $forbiddenRegexes = @(
        "/Users/[A-Za-z0-9._-]+/",
        "/home/[A-Za-z0-9._-]+/",
        "C:\\Users\\[A-Za-z0-9._-]+\\"
    )
    $allowlistedFiles = @(
        "scripts/validate.mjs",
        "scripts/validate.ps1"
    )
    $files = Get-RepositoryFiles -Include @("*.md", "*.mjs", "*.sh", "*.ps1", "*.json", "*.yaml", "*.yml", ".gitattributes", "LICENSE")
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($repoRoot.Path.Length + 1).Replace("\", "/")
        if ($allowlistedFiles -contains $relativePath) {
            continue
        }

        $text = Get-Content -LiteralPath $file.FullName -Raw
        foreach ($pattern in $forbiddenPatterns) {
            if ($text.Contains($pattern)) {
                Add-Failure "$relativePath contains source-specific term '$pattern'."
            }
        }
        foreach ($pattern in $forbiddenRegexes) {
            if ($text -match $pattern) {
                Add-Failure "$relativePath contains a local absolute path '$pattern'."
            }
        }
    }
}

Test-LineEndingsAndTrailingWhitespace
Test-NoBom
Test-AsciiFiles
$markdownLinkGraph = Test-MarkdownLinks
Test-OrphanMarkdownFiles -LinkGraph $markdownLinkGraph
Test-SkillMetadata
Test-PowerShellSyntax
Test-RepositoryTextIsGeneric

if ($failures.Count -gt 0) {
    # Write-Host, not Write-Error: with ErrorActionPreference=Stop the first Write-Error
    # would terminate the run and hide every remaining failure.
    $failures | Sort-Object | ForEach-Object { Write-Host "FAIL: $_" }
    Write-Host "VibeRails validation failed with $($failures.Count) issue(s)."
    exit 1
}

Write-Host "VibeRails validation passed."
