[CmdletBinding()]
param(
    [switch] $Remove
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Installs the skills from this repository at the Codex user scope by creating directory
# junctions from $HOME\.agents\skills\<skill> to this checkout. A junction keeps a single
# source of truth: git pull here updates the skills everywhere, and skill edits made from any
# repository land in this working tree where they can be reviewed and committed.

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$skillsSource = Join-Path $repoRoot ".agents\skills"
$skillsTargetRoot = Join-Path $HOME ".agents\skills"

if (-not (Test-Path -LiteralPath $skillsSource -PathType Container)) {
    throw "Skill source folder not found: $skillsSource"
}

$results = @()
$skillDirectories = Get-ChildItem -LiteralPath $skillsSource -Directory

if ($Remove) {
    foreach ($skillDirectory in $skillDirectories) {
        $linkPath = Join-Path $skillsTargetRoot $skillDirectory.Name
        if (-not (Test-Path -LiteralPath $linkPath)) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "absent"; Detail = "no user-scope entry" }
            continue
        }

        $item = Get-Item -LiteralPath $linkPath -Force
        if ($item.LinkType -ne "Junction") {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "skipped"; Detail = "not a junction; refusing to delete a real directory" }
            continue
        }

        # Remove only the junction itself, never the target content.
        $item.Delete()
        $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "removed"; Detail = "junction removed" }
    }
}
else {
    if (-not (Test-Path -LiteralPath $skillsTargetRoot -PathType Container)) {
        New-Item -ItemType Directory -Force -Path $skillsTargetRoot | Out-Null
    }

    foreach ($skillDirectory in $skillDirectories) {
        $linkPath = Join-Path $skillsTargetRoot $skillDirectory.Name

        if (Test-Path -LiteralPath $linkPath) {
            $item = Get-Item -LiteralPath $linkPath -Force
            if ($item.LinkType -eq "Junction") {
                $currentTarget = [string] ($item.Target | Select-Object -First 1)
                if ($currentTarget -eq $skillDirectory.FullName) {
                    $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "ok"; Detail = "junction already points here" }
                    continue
                }

                $item.Delete()
                New-Item -ItemType Junction -Path $linkPath -Target $skillDirectory.FullName | Out-Null
                $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "repaired"; Detail = "junction retargeted from $currentTarget" }
                continue
            }

            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "conflict"; Detail = "a real directory exists at $linkPath; resolve manually (vendored copy?)" }
            continue
        }

        New-Item -ItemType Junction -Path $linkPath -Target $skillDirectory.FullName | Out-Null
        $skillFile = Join-Path $linkPath "SKILL.md"
        if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "error"; Detail = "junction created but SKILL.md not readable through it" }
            continue
        }

        $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "installed"; Detail = "junction created" }
    }
}

$results | Format-Table -AutoSize

$problems = @($results | Where-Object { $_.Status -in @("conflict", "error", "skipped") })
if ($problems.Count -gt 0) {
    Write-Host "Completed with items that need attention. Restart Codex after resolving them."
    exit 1
}

if ($Remove) {
    Write-Host "User-scope skill junctions removed."
}
else {
    Write-Host "Skills installed at the Codex user scope: $skillsTargetRoot"
    Write-Host "Restart Codex so it rescans skills. Inside this repository Codex may list each skill twice (repo scope plus user scope); that is expected."
}
