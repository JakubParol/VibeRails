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
        if ($item.LinkType -notin @("Junction", "SymbolicLink")) {
            $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "skipped"; Detail = "not a link; refusing to delete a real directory" }
            continue
        }

        # Remove only the link itself, never the target content.
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

        if (Test-Path -LiteralPath $linkPath) {
            $item = Get-Item -LiteralPath $linkPath -Force
            if ($item.LinkType -in @("Junction", "SymbolicLink")) {
                $currentTarget = [string] ($item.Target | Select-Object -First 1)
                if ($currentTarget -eq $skillDirectory.FullName) {
                    $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "ok"; Detail = "$linkTypeName already points here" }
                    continue
                }

                $item.Delete()
                New-Item -ItemType $linkItemType -Path $linkPath -Target $skillDirectory.FullName | Out-Null
                $results += [pscustomobject]@{ Skill = $skillDirectory.Name; Status = "repaired"; Detail = "$linkTypeName retargeted from $currentTarget" }
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
    Write-Host "User-scope skill links removed from $skillsTargetRoot."
}
else {
    Write-Host "Skills installed at the Codex user scope: $skillsTargetRoot"
    Write-Host "Restart Codex so it rescans skills."
}
