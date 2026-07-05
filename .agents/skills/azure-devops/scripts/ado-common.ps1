# Shared helpers for ado-work-items.ps1 and ado-prs.ps1. Dot-source this file before the
# script-specific common and api helper files.

function Get-AdoDefaultTimeoutSeconds {
    $configured = $env:AZURE_DEVOPS_TIMEOUT_SECONDS
    if (-not [string]::IsNullOrWhiteSpace($configured)) {
        $parsed = 0
        if ([int]::TryParse($configured, [ref] $parsed) -and $parsed -gt 0) {
            return $parsed
        }
    }

    return 120
}

function Invoke-AzCli {
    param(
        [Parameter(Mandatory = $true)][string[]] $Arguments,
        [int] $TimeoutSeconds = 0
    )

    if ($TimeoutSeconds -le 0) {
        $TimeoutSeconds = Get-AdoDefaultTimeoutSeconds
    }

    # Run az in a background job so a stuck call fails fast with an actionable error
    # instead of hanging the session for minutes.
    $job = Start-Job -ScriptBlock {
        param([string[]] $JobArguments)
        $output = & az @JobArguments 2>&1
        [pscustomobject]@{
            Output = @($output | ForEach-Object { $_.ToString() })
            ExitCode = $LASTEXITCODE
        }
    } -ArgumentList (, [string[]] $Arguments)

    try {
        if (-not (Wait-Job -Job $job -Timeout $TimeoutSeconds)) {
            Stop-Job -Job $job -ErrorAction SilentlyContinue
            throw ("Azure CLI timed out after $TimeoutSeconds seconds: az $($Arguments -join ' '). " +
                "The command did not return. Check network and authentication with -Action Doctor. " +
                "Raise AZURE_DEVOPS_TIMEOUT_SECONDS only when the operation is genuinely slow.")
        }

        $results = @(Receive-Job -Job $job -ErrorAction Stop)
        $result = $results | Where-Object { $null -ne $_ } | Select-Object -Last 1
        if ($null -eq $result) {
            throw "Azure CLI returned no result: az $($Arguments -join ' ')"
        }

        return $result
    }
    finally {
        Remove-Job -Job $job -Force -ErrorAction SilentlyContinue
    }
}

function Assert-NotHtmlResponse {
    param(
        [AllowNull()][string] $Text,
        [Parameter(Mandatory = $true)][string] $Source
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return
    }

    if ($Text -match "^\s*<") {
        throw ("$Source returned HTML instead of JSON. This is almost always a sign-in page, " +
            "which means authentication for this channel is broken (wrong tenant, expired login, " +
            "or conditional access). Run -Action Doctor, then fix the reported channel with " +
            "'az login' or 'az devops login' before retrying.")
    }
}

function Invoke-AzJson {
    param(
        [Parameter(Mandatory = $true)][string[]] $Arguments,
        [int] $TimeoutSeconds = 0
    )

    $fullArguments = $Arguments + @("--only-show-errors", "-o", "json")
    $result = Invoke-AzCli -Arguments $fullArguments -TimeoutSeconds $TimeoutSeconds
    $text = (($result.Output) -join [Environment]::NewLine).Trim()

    if ($result.ExitCode -ne 0) {
        throw $text
    }

    if ([string]::IsNullOrWhiteSpace($text)) {
        return $null
    }

    Assert-NotHtmlResponse -Text $text -Source "az $($Arguments -join ' ')"

    return $text | ConvertFrom-Json
}

function Invoke-AzNoOutput {
    param(
        [Parameter(Mandatory = $true)][string[]] $Arguments,
        [int] $TimeoutSeconds = 0
    )

    $fullArguments = $Arguments + @("--only-show-errors", "-o", "none")
    $result = Invoke-AzCli -Arguments $fullArguments -TimeoutSeconds $TimeoutSeconds
    if ($result.ExitCode -ne 0) {
        throw ((($result.Output) -join [Environment]::NewLine).Trim())
    }
}

function Require-Value {
    param(
        [object] $Value,
        [string] $Name
    )

    if ($null -eq $Value -or ([string] $Value).Trim().Length -eq 0) {
        throw "Missing required parameter: $Name"
    }
}

function Require-PositiveInt {
    param(
        [int] $Value,
        [string] $Name
    )

    if ($Value -le 0) {
        throw "Missing or invalid parameter: $Name must be a positive integer."
    }
}

function Require-PositiveIntArray {
    param(
        [int[]] $Value,
        [string] $Name
    )

    if ($Value.Count -eq 0) {
        throw "Missing required parameter: $Name"
    }
    foreach ($item in $Value) {
        if ($item -le 0) {
            throw "Invalid parameter: $Name values must be positive integers."
        }
    }
}

function Get-ObjectPropertyValue {
    param(
        [AllowNull()][object] $Value,
        [Parameter(Mandatory = $true)][string] $Name
    )

    if ($null -eq $Value) {
        return $null
    }

    $property = $Value.PSObject.Properties[$Name]
    if ($null -eq $property) {
        return $null
    }

    return $property.Value
}

function Get-ArrayValues {
    param([AllowNull()][object] $Value)

    if ($null -eq $Value) {
        return @()
    }
    if ($Value -is [array]) {
        return @($Value)
    }
    $valueProperty = Get-ObjectPropertyValue -Value $Value -Name "value"
    if ($null -ne $valueProperty) {
        return @($valueProperty)
    }

    return @($Value)
}

function ConvertFrom-AdoRemoteUrl {
    param([string] $RemoteUrl)

    if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
        return $null
    }

    $trimmed = $RemoteUrl.Trim()
    $httpsMatch = [regex]::Match($trimmed, "dev\.azure\.com/([^/]+)/([^/]+)/_git/([^/?#]+)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($httpsMatch.Success) {
        return [ordered]@{
            organization = "https://dev.azure.com/$($httpsMatch.Groups[1].Value)"
            project = [System.Uri]::UnescapeDataString($httpsMatch.Groups[2].Value)
            repository = [System.Uri]::UnescapeDataString($httpsMatch.Groups[3].Value)
        }
    }

    $sshMatch = [regex]::Match($trimmed, "ssh\.dev\.azure\.com[:/]v3/([^/]+)/([^/]+)/([^/?#]+)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($sshMatch.Success) {
        return [ordered]@{
            organization = "https://dev.azure.com/$($sshMatch.Groups[1].Value)"
            project = [System.Uri]::UnescapeDataString($sshMatch.Groups[2].Value)
            repository = [System.Uri]::UnescapeDataString($sshMatch.Groups[3].Value)
        }
    }

    return $null
}

function Get-AdoRemoteContext {
    $remoteNames = @("origin", "upstream")
    foreach ($remoteName in $remoteNames) {
        $remoteUrl = (& git remote get-url $remoteName 2>$null)
        if ($LASTEXITCODE -eq 0) {
            $context = ConvertFrom-AdoRemoteUrl -RemoteUrl $remoteUrl
            if ($null -ne $context) {
                return $context
            }
        }
    }

    return $null
}

function Resolve-AdoOrg {
    param([string] $Org)

    if (-not [string]::IsNullOrWhiteSpace($Org)) {
        return $Org.TrimEnd("/")
    }
    if (-not [string]::IsNullOrWhiteSpace($env:AZURE_DEVOPS_ORG)) {
        return $env:AZURE_DEVOPS_ORG.TrimEnd("/")
    }

    $context = Get-AdoRemoteContext
    if ($null -ne $context -and -not [string]::IsNullOrWhiteSpace([string] $context.organization)) {
        return ([string] $context.organization).TrimEnd("/")
    }

    throw "Azure DevOps organization could not be resolved. Pass -Org, set AZURE_DEVOPS_ORG, or run from an Azure Repos checkout whose remote URL contains the organization."
}

function Resolve-AdoProject {
    param([string] $Project)

    if (-not [string]::IsNullOrWhiteSpace($Project)) {
        return $Project
    }
    if (-not [string]::IsNullOrWhiteSpace($env:AZURE_DEVOPS_PROJECT)) {
        return $env:AZURE_DEVOPS_PROJECT
    }

    $context = Get-AdoRemoteContext
    if ($null -ne $context -and -not [string]::IsNullOrWhiteSpace([string] $context.project)) {
        return [string] $context.project
    }

    throw "Azure DevOps project could not be resolved. Pass -Project, set AZURE_DEVOPS_PROJECT, or run from an Azure Repos checkout whose remote URL contains the project."
}

function Resolve-AdoRepository {
    param(
        [string] $Repository,
        [switch] $Optional
    )

    if (-not [string]::IsNullOrWhiteSpace($Repository)) {
        return $Repository
    }
    if (-not [string]::IsNullOrWhiteSpace($env:AZURE_DEVOPS_REPOSITORY)) {
        return $env:AZURE_DEVOPS_REPOSITORY
    }

    $context = Get-AdoRemoteContext
    if ($null -ne $context -and -not [string]::IsNullOrWhiteSpace([string] $context.repository)) {
        return [string] $context.repository
    }
    if ($Optional) {
        return $null
    }

    throw "Azure DevOps repository could not be resolved. Pass -Repository, set AZURE_DEVOPS_REPOSITORY, or run from an Azure Repos checkout whose remote URL contains the repository."
}

function Invoke-DoctorCheck {
    param(
        [Parameter(Mandatory = $true)][string] $Name,
        [Parameter(Mandatory = $true)][scriptblock] $Check,
        [string] $NextStep = ""
    )

    try {
        $detail = & $Check
        return [ordered]@{
            check = $Name
            status = "ok"
            detail = [string] $detail
            nextStep = $null
        }
    }
    catch {
        return [ordered]@{
            check = $Name
            status = "fail"
            detail = $_.Exception.Message
            nextStep = $NextStep
        }
    }
}
