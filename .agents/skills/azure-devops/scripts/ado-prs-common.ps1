# PR-specific helpers. Shared plumbing lives in ado-common.ps1, which must be dot-sourced
# before this file.

function Require-RepoMutationApproval {
    if (-not $AllowRepoMutation) {
        throw "This action changes Azure Repos or PR state. Re-run with -AllowRepoMutation after explicit user approval."
    }
}

function Add-CommonArgs {
    param([string[]] $Arguments)

    return $Arguments + @("--org", $Org)
}

function Add-ProjectArgs {
    param([string[]] $Arguments)

    return $Arguments + @("--org", $Org, "--project", $Project)
}

function Get-DescriptionText {
    if (-not [string]::IsNullOrWhiteSpace($DescriptionPath)) {
        return (Get-Content -LiteralPath $DescriptionPath -Raw -Encoding UTF8)
    }

    if (-not [string]::IsNullOrWhiteSpace($Description)) {
        return $Description
    }

    return ""
}

function Get-CommentText {
    if (-not [string]::IsNullOrWhiteSpace($CommentPath)) {
        return (Get-Content -LiteralPath $CommentPath -Raw -Encoding UTF8)
    }

    if (-not [string]::IsNullOrWhiteSpace($Comment)) {
        return $Comment
    }

    return ""
}

function Get-BranchRef {
    param([Parameter(Mandatory = $true)][string] $Branch)

    if ($Branch.StartsWith("refs/heads/")) {
        return $Branch
    }

    return "refs/heads/$Branch"
}

function ConvertTo-AdoJsonString {
    param([AllowNull()][string] $Value)

    if ($null -eq $Value) {
        return "null"
    }

    $builder = [System.Text.StringBuilder]::new()
    [void] $builder.Append('"')
    foreach ($character in $Value.ToCharArray()) {
        $code = [int] [char] $character
        switch ($code) {
            8 { [void] $builder.Append("\b"); break }
            9 { [void] $builder.Append("\t"); break }
            10 { [void] $builder.Append("\n"); break }
            12 { [void] $builder.Append("\f"); break }
            13 { [void] $builder.Append("\r"); break }
            34 { [void] $builder.Append('\"'); break }
            92 { [void] $builder.Append("\\"); break }
            default {
                if ($code -lt 32 -or $code -gt 126) {
                    [void] $builder.Append(("\u{0:x4}" -f $code))
                }
                else {
                    [void] $builder.Append($character)
                }
            }
        }
    }
    [void] $builder.Append('"')

    return $builder.ToString()
}

function ConvertTo-AdoJson {
    param([AllowNull()][object] $Value)

    if ($null -eq $Value) {
        return "null"
    }
    if ($Value -is [string]) {
        return ConvertTo-AdoJsonString $Value
    }
    if ($Value -is [bool]) {
        if ($Value) {
            return "true"
        }
        return "false"
    }
    if ($Value -is [System.Byte] -or $Value -is [System.SByte] -or $Value -is [System.Int16] -or $Value -is [System.UInt16] -or $Value -is [System.Int32] -or $Value -is [System.UInt32] -or $Value -is [System.Int64] -or $Value -is [System.UInt64] -or $Value -is [System.Single] -or $Value -is [System.Double] -or $Value -is [System.Decimal]) {
        return [System.Convert]::ToString($Value, [System.Globalization.CultureInfo]::InvariantCulture)
    }
    if ($Value -is [System.Collections.IDictionary]) {
        $properties = @()
        foreach ($key in $Value.Keys) {
            $properties += "{0}:{1}" -f (ConvertTo-AdoJsonString ([string] $key)), (ConvertTo-AdoJson $Value[$key])
        }
        return "{0}{1}{2}" -f "{", ($properties -join ","), "}"
    }
    if ($Value -is [System.Collections.IEnumerable]) {
        $items = @()
        foreach ($item in $Value) {
            $items += ConvertTo-AdoJson $item
        }
        return "[{0}]" -f ($items -join ",")
    }

    return ConvertTo-AdoJsonString ([string] $Value)
}

function Write-JsonNoBom {
    param(
        [Parameter(Mandatory = $true)][string] $Path,
        [Parameter(Mandatory = $true)][object] $Value
    )

    $json = ConvertTo-AdoJson $Value
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($Path, $json, $utf8NoBom)
}

function Invoke-GitRest {
    param(
        [Parameter(Mandatory = $true)][string] $Resource,
        [string] $HttpMethod = "GET",
        [string] $InFile,
        [string[]] $ExtraRouteParameters = @(),
        [string[]] $QueryParameters = @()
    )

    $routeParameters = @("project=$Project", "repositoryId=$Repository", "pullRequestId=$PrId")
    if ($ExtraRouteParameters.Count -gt 0) {
        $routeParameters += $ExtraRouteParameters
    }

    $arguments = @(
        "devops", "invoke",
        "--org", $Org,
        "--area", "git",
        "--resource", $Resource,
        "--route-parameters"
    )
    $arguments += $routeParameters
    $arguments += @(
        "--api-version", "7.1",
        "--http-method", $HttpMethod
    )
    if (-not [string]::IsNullOrWhiteSpace($InFile)) {
        # Without an explicit encoding and media type, az devops invoke POSTs with non-ASCII
        # body content can hang until timeout while the server never creates the resource.
        $arguments += @("--in-file", $InFile, "--encoding", "utf-8", "--media-type", "application/json")
    }
    if ($QueryParameters.Count -gt 0) {
        $arguments += @("--query-parameters")
        $arguments += $QueryParameters
    }

    Invoke-AzJson $arguments
}

function Invoke-AdoCliRest {
    param(
        [Parameter(Mandatory = $true)][string] $Area,
        [Parameter(Mandatory = $true)][string] $Resource,
        [string] $HttpMethod = "GET",
        [string] $InFile,
        [string[]] $RouteParameters = @(),
        [string[]] $QueryParameters = @(),
        [string] $ApiVersion = "7.1"
    )

    $arguments = @(
        "devops", "invoke",
        "--org", $Org,
        "--area", $Area,
        "--resource", $Resource,
        "--api-version", $ApiVersion,
        "--http-method", $HttpMethod
    )
    if ($RouteParameters.Count -gt 0) {
        $arguments += @("--route-parameters")
        $arguments += $RouteParameters
    }
    if ($QueryParameters.Count -gt 0) {
        $arguments += @("--query-parameters")
        $arguments += $QueryParameters
    }
    if (-not [string]::IsNullOrWhiteSpace($InFile)) {
        $arguments += @("--in-file", $InFile, "--encoding", "utf-8", "--media-type", "application/json")
    }

    Invoke-AzJson $arguments
}

function Get-AdoAccessToken {
    $az = (Get-Command az -ErrorAction Stop).Source
    $stdoutPath = Join-Path ([System.IO.Path]::GetTempPath()) ("ado-token-out-{0}.txt" -f ([System.Guid]::NewGuid()))
    $stderrPath = Join-Path ([System.IO.Path]::GetTempPath()) ("ado-token-err-{0}.txt" -f ([System.Guid]::NewGuid()))
    $arguments = "account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken --only-show-errors -o tsv"

    try {
        $process = Start-Process -FilePath $az -ArgumentList $arguments -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -WindowStyle Hidden
        if ($null -eq $process) {
            throw "Azure CLI did not start."
        }
        if (-not $process.WaitForExit(60000)) {
            $process.Kill()
            throw "Azure CLI timed out while requesting an Azure DevOps access token."
        }

        $token = ""
        if (Test-Path -LiteralPath $stdoutPath) {
            $token = ([System.IO.File]::ReadAllText($stdoutPath)).Trim()
        }
        if (-not [string]::IsNullOrWhiteSpace($token)) {
            return $token
        }

        $errorText = ""
        if (Test-Path -LiteralPath $stderrPath) {
            $errorText = ([System.IO.File]::ReadAllText($stderrPath)).Trim()
        }
        if ([string]::IsNullOrWhiteSpace($errorText)) {
            $errorText = "Azure CLI returned an empty token."
        }
        throw "Azure DevOps access token was not returned by Azure CLI. $errorText"
    }
    finally {
        Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue -WhatIf:$false
    }
}

function Invoke-AdoRestJson {
    param(
        [Parameter(Mandatory = $true)][string] $Method,
        [Parameter(Mandatory = $true)][string] $Url,
        [AllowNull()][object] $Payload = $null
    )

    Write-Verbose "Requesting Azure DevOps REST access token."
    $token = Get-AdoAccessToken
    Write-Verbose "Received Azure DevOps REST access token."
    $headers = @{ Authorization = "Bearer $token" }
    $timeoutSeconds = Get-AdoDefaultTimeoutSeconds
    try {
        Write-Verbose "Sending Azure DevOps REST request."
        if ($null -eq $Payload) {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers -TimeoutSec $timeoutSeconds
        }
        else {
            $body = ConvertTo-AdoJson $Payload
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers -ContentType "application/json; charset=utf-8" -Body $body -TimeoutSec $timeoutSeconds
        }

        if ($response -is [string]) {
            Assert-NotHtmlResponse -Text $response -Source "Azure DevOps REST ($Url)"
        }
        if ($response -is [System.Xml.XmlDocument]) {
            throw ("Azure DevOps REST ($Url) returned an HTML/XML document instead of JSON. " +
                "This is almost always a sign-in page: the bearer token channel is broken " +
                "(wrong tenant, expired login, or conditional access). Run -Action Doctor and " +
                "prefer the CLI channels.")
        }

        return $response
    }
    catch {
        $errorDetails = ""
        # Not every exception is a WebException; StrictMode throws on missing properties.
        $response = $null
        if ($null -ne $_.Exception.PSObject.Properties["Response"]) {
            $response = $_.Exception.Response
        }
        if ($null -ne $response) {
            try {
                $stream = $response.GetResponseStream()
                if ($null -ne $stream) {
                    $reader = [System.IO.StreamReader]::new($stream)
                    $errorDetails = $reader.ReadToEnd()
                }
            }
            catch {
                $errorDetails = ""
            }
        }
        if (-not [string]::IsNullOrWhiteSpace($errorDetails)) {
            $statusCode = "unknown"
            if ($null -ne $response -and $null -ne $response.PSObject.Properties["StatusCode"]) {
                $statusCode = [int]$response.StatusCode
            }
            if ($errorDetails -match "<html|<title|Sign in|login.microsoftonline.com|Authorization has been denied") {
                throw ("Azure DevOps REST request failed: $($_.Exception.Message) " +
                    "StatusCode=$statusCode. Response looked like an HTML/sign-in or authorization " +
                    "payload; raw response body was not logged. Run -Action Doctor and prefer the CLI channels.")
            }

            throw ("Azure DevOps REST request failed: $($_.Exception.Message) " +
                "StatusCode=$statusCode. Response body was not logged because Azure DevOps " +
                "REST failures can contain identity, authorization, or organization context.")
        }

        throw "Azure DevOps REST request failed: $($_.Exception.Message)"
    }
}
