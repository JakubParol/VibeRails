# Work-item-specific helpers. Shared plumbing lives in ado-common.ps1, which must be
# dot-sourced before this file.

function Read-TextInput {
    param(
        [string] $Value,
        [string] $Path,
        [string] $Name
    )

    if (-not [string]::IsNullOrWhiteSpace($Value) -and -not [string]::IsNullOrWhiteSpace($Path)) {
        throw "Use either -$Name or -$($Name)Path, not both."
    }

    if (-not [string]::IsNullOrWhiteSpace($Path)) {
        if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
            throw "$($Name)Path does not exist: $Path"
        }

        return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    }

    return $Value
}

function ConvertTo-AdoRichTextArgument {
    param([string] $Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $null
    }

    # Azure DevOps CLI can silently truncate or drop multiline rich-text fields.
    return (($Value -replace "`r`n", " ") -replace "`n", " ").Trim()
}

function New-Utf8JsonFile {
    param([Parameter(Mandatory = $true)][object] $Value)

    $path = Join-Path ([System.IO.Path]::GetTempPath()) ("ado-work-item-" + [Guid]::NewGuid().ToString("N") + ".json")
    $json = $Value | ConvertTo-Json -Depth 20 -Compress
    [System.IO.File]::WriteAllText($path, $json, [System.Text.UTF8Encoding]::new($false))
    return $path
}

function Invoke-AzJsonWithBody {
    param(
        [Parameter(Mandatory = $true)][string[]] $Arguments,
        [Parameter(Mandatory = $true)][object] $Body
    )

    $path = New-Utf8JsonFile -Value $Body
    try {
        return Invoke-AzJson ($Arguments + @("--in-file", $path, "--encoding", "utf-8", "--media-type", "application/json"))
    }
    finally {
        if (Test-Path -LiteralPath $path -PathType Leaf) {
            Remove-Item -LiteralPath $path -Force
        }
    }
}

function Require-WriteApproval {
    if (-not $AllowWrite) {
        throw "This action writes to Azure DevOps. Re-run with -AllowWrite after explicit user approval."
    }
}

function Get-TrackingTags {
    $parts = @()
    if (-not [string]::IsNullOrWhiteSpace($Tags)) {
        $parts += (($Tags -split ";") | ForEach-Object { $_.Trim() } | Where-Object { $_ })
    }
    if (-not [string]::IsNullOrWhiteSpace($Marker)) {
        $parts += "codex-skill-test"
        $parts += $Marker.Trim()
    }

    return (($parts | Select-Object -Unique) -join "; ")
}

function Add-BoardsArgs {
    param([string[]] $Arguments)

    return $Arguments + @("--org", $Org, "--project", $Project)
}

function Add-InvokeArgs {
    param([string[]] $Arguments)

    return $Arguments + @("--org", $Org)
}

function Add-OrgArgs {
    param([string[]] $Arguments)

    return $Arguments + @("--org", $Org)
}
