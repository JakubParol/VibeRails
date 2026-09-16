[CmdletBinding()]
param(
    [switch] $Remove
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Installs the skills from this repository at the Codex user scope. On Windows the script uses
# directory junctions; on Unix-like systems PowerShell creates symbolic links. The target root
# is $env:CODEX_HOME\skills when CODEX_HOME is set, otherwise $HOME\.codex\skills.

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$skillsSource = Join-Path $repoRoot ".agents\skills"
$codexHome = if (-not [string]::IsNullOrWhiteSpace($env:CODEX_HOME)) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
$skillsTargetRoot = Join-Path $codexHome "skills"
$isWindowsPlatformVariable = Get-Variable -Name IsWindows -ErrorAction SilentlyContinue
$isWindowsPlatform = if ($null -ne $isWindowsPlatformVariable) { [bool] $isWindowsPlatformVariable.Value } else { $true }
$linkItemType = if ($isWindowsPlatform) { "Junction" } else { "SymbolicLink" }
$linkTypeName = if ($isWindowsPlatform) { "junction" } else { "symlink" }

if (-not (Test-Path -LiteralPath $skillsSource -PathType Container)) {
    throw "Skill source folder not found: $skillsSource"
}

# Enumerate entries so dangling links are not mistaken for missing slots by Test-Path.
function Get-SkillEntry([string] $Name) {
    if (Test-Path -LiteralPath $skillsTargetRoot -PathType Container) {
        Get-ChildItem -LiteralPath $skillsTargetRoot -Force |
            Where-Object { $_.Name -ceq $Name } | Select-Object -First 1
    }
}

function Test-OwnedLink($Item, [string] $ExpectedTarget) {
    $targets = @($Item.Target)
    if ($targets.Count -ne 1 -or [string]::IsNullOrWhiteSpace([string] $targets[0])) { return $false }
    try {
        $target = [string] $targets[0]
        if (-not [IO.Path]::IsPathRooted($target)) {
            $target = Join-Path ([IO.Path]::GetDirectoryName($Item.FullName)) $target
        }
        # Exact normalized identity fails closed for unknown aliases or other checkouts.
        return [string]::Equals([IO.Path]::GetFullPath($target),
            [IO.Path]::GetFullPath($ExpectedTarget), [StringComparison]::Ordinal)
    }
    catch { return $false }
}

$results = @()
$skillDirectories = Get-ChildItem -LiteralPath $skillsSource -Directory

if ($Remove) {
    foreach ($skillDirectory in $skillDirectories) {
        $linkPath = Join-Path $skillsTargetRoot $skillDirectory.Name
        $item = Get-SkillEntry $skillDirectory.Name
        if ($null -eq $item) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "absent"; Detail = "no user-scope entry" }
            continue
        }

        if ($item.LinkType -notin @("Junction", "SymbolicLink")) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "skipped"; Detail = "not a link; refusing to delete a real directory" }
            continue
        }

        if (-not (Test-OwnedLink $item $skillDirectory.FullName)) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "conflict"; Detail = "link is not owned by this checkout; resolve explicitly" }
            continue
        }

        # Remove only the verified owned link itself, never the target content.
        $item.Delete()
        $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "removed"; Detail = "$linkTypeName removed" }
    }
}
else {
    if (-not (Test-Path -LiteralPath $skillsTargetRoot -PathType Container)) {
        New-Item -ItemType Directory -Force -Path $skillsTargetRoot | Out-Null
    }

    foreach ($skillDirectory in $skillDirectories) {
        $linkPath = Join-Path $skillsTargetRoot $skillDirectory.Name

        if (-not (Test-Path -LiteralPath (Join-Path $skillDirectory.FullName "SKILL.md") -PathType Leaf)) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "error"; Detail = "source SKILL.md is missing; no link changed" }
            continue
        }

        $item = Get-SkillEntry $skillDirectory.Name
        if ($null -ne $item) {
            if ($item.LinkType -in @("Junction", "SymbolicLink")) {
                if (Test-OwnedLink $item $skillDirectory.FullName) {
                    $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "ok"; Detail = "$linkTypeName already points here" }
                    continue
                }

                $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "conflict"; Detail = "link is not owned by this checkout; resolve explicitly" }
                continue
            }

            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "conflict"; Detail = "a real directory exists at $linkPath; resolve manually (vendored copy?)" }
            continue
        }

        New-Item -ItemType $linkItemType -Path $linkPath -Target $skillDirectory.FullName | Out-Null
        $skillFile = Join-Path $linkPath "SKILL.md"
        if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "error"; Detail = "$linkTypeName created but SKILL.md not readable through it" }
            continue
        }

        $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "installed"; Detail = "$linkTypeName created" }
    }
}

$results | Format-Table -AutoSize

$problems = @($results | Where-Object { $_.Status -in @("conflict", "error", "skipped") })
if ($problems.Count -gt 0) {
    Write-Host "Completed with items that need attention. Restart Codex after resolving them."
    exit 1
}

if ($Remove) {
    Write-Host "Owned user-scope skill links removed from $skillsTargetRoot."
}
else {
    Write-Host "Skills installed at the Codex user scope: $skillsTargetRoot"
    Write-Host "Restart Codex so it rescans skills."
}
