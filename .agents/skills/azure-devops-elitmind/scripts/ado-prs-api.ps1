function Add-QueryString {
    param(
        [Parameter(Mandatory = $true)][string] $Url,
        [Parameter(Mandatory = $true)][hashtable] $Parameters
    )

    $pairs = @()
    foreach ($key in ($Parameters.Keys | Sort-Object)) {
        $value = $Parameters[$key]
        if ($null -ne $value) {
            $pairs += "{0}={1}" -f [System.Uri]::EscapeDataString([string] $key), [System.Uri]::EscapeDataString([string] $value)
        }
    }

    if ($pairs.Count -eq 0) {
        return $Url
    }

    $separator = "?"
    if ($Url.Contains("?")) {
        $separator = "&"
    }

    return "{0}{1}{2}" -f $Url, $separator, ($pairs -join "&")
}

function Get-GitRepositoryApiUrl {
    $baseOrg = $Org.TrimEnd("/")
    $encodedProject = [System.Uri]::EscapeDataString($Project)
    $encodedRepository = [System.Uri]::EscapeDataString($Repository)

    return "$baseOrg/$encodedProject/_apis/git/repositories/$encodedRepository"
}

function Get-PullRequestResourceUrl {
    param(
        [int] $PullRequestId = 0,
        [string] $Suffix
    )

    $url = "$(Get-GitRepositoryApiUrl)/pullrequests"
    if ($PullRequestId -gt 0) {
        $url = "$url/$PullRequestId"
    }
    if (-not [string]::IsNullOrWhiteSpace($Suffix)) {
        $url = "$url/$Suffix"
    }

    return $url
}

function Get-PullRequestsUrl {
    param([int] $PullRequestId = 0)

    return Add-QueryString -Url (Get-PullRequestResourceUrl -PullRequestId $PullRequestId) -Parameters @{ "api-version" = "7.1" }
}

function Get-PullRequest {
    Require-PositiveInt $PrId "PrId"

    $channelErrors = @()

    # Channel order: native CLI first (most reliable in practice), generic invoke second,
    # bearer-token REST last because its authentication breaks independently of the CLI.
    try {
        $pullRequest = Invoke-AzJson (Add-CommonArgs @("repos", "pr", "show", "--id", ([string] $PrId)))
        Assert-PullRequestShape -PullRequest $pullRequest -Source "az repos pr show"
        return $pullRequest
    }
    catch {
        $channelErrors += "az repos pr show: $($_.Exception.Message)"
        Write-Verbose "Native CLI pull request read failed, falling back to az devops invoke. $($_.Exception.Message)"
    }

    try {
        $pullRequest = Invoke-GitRest "pullRequests"
        Assert-PullRequestShape -PullRequest $pullRequest -Source "az devops invoke"
        return $pullRequest
    }
    catch {
        $channelErrors += "az devops invoke: $($_.Exception.Message)"
        Write-Verbose "az devops invoke pull request read failed, falling back to REST. $($_.Exception.Message)"
    }

    try {
        $pullRequest = Invoke-AdoRestJson -Method "get" -Url (Get-PullRequestsUrl -PullRequestId $PrId)
        Assert-PullRequestShape -PullRequest $pullRequest -Source "Azure DevOps REST"
        return $pullRequest
    }
    catch {
        $channelErrors += "Azure DevOps REST: $($_.Exception.Message)"
    }

    throw ("PR $PrId could not be read on any channel. " + ($channelErrors -join " | ") +
        " Run -Action Doctor to diagnose which channel is broken.")
}

function Assert-PullRequestShape {
    param(
        [AllowNull()][object] $PullRequest,
        [Parameter(Mandatory = $true)][string] $Source
    )

    if ($null -eq $PullRequest) {
        throw "$Source did not return PR metadata."
    }

    $returnedPrId = Get-ObjectPropertyValue -Value $PullRequest -Name "pullRequestId"
    if ($null -eq $returnedPrId -or [int] $returnedPrId -le 0) {
        throw "$Source did not return pullRequestId."
    }

    $createdBy = Get-ObjectPropertyValue -Value $PullRequest -Name "createdBy"
    $creatorId = Get-ObjectPropertyValue -Value $createdBy -Name "id"
    if ([string]::IsNullOrWhiteSpace([string] $creatorId)) {
        throw "$Source did not return createdBy.id."
    }
}

function Select-AdoIdentityRef {
    param([AllowNull()][object] $Identity)

    if ($null -eq $Identity) {
        return $null
    }
    if ($Identity -is [string]) {
        return $Identity
    }

    return [ordered]@{
        id = Get-ObjectPropertyValue -Value $Identity -Name "id"
        displayName = Get-ObjectPropertyValue -Value $Identity -Name "displayName"
        uniqueName = Get-ObjectPropertyValue -Value $Identity -Name "uniqueName"
    }
}

function Get-NestedPropertyValue {
    param(
        [AllowNull()][object] $Value,
        [Parameter(Mandatory = $true)][string[]] $Names
    )

    $current = $Value
    foreach ($name in $Names) {
        $current = Get-ObjectPropertyValue -Value $current -Name $name
        if ($null -eq $current) {
            return $null
        }
    }

    return $current
}

function Select-PullRequestSummary {
    param([AllowNull()][object] $PullRequest)

    if ($null -eq $PullRequest) {
        return $null
    }

    $reviewers = @()
    foreach ($reviewer in @(Get-ArrayValues (Get-ObjectPropertyValue -Value $PullRequest -Name "reviewers"))) {
        $reviewers += [ordered]@{
            displayName = Get-ObjectPropertyValue -Value $reviewer -Name "displayName"
            vote = Get-ObjectPropertyValue -Value $reviewer -Name "vote"
            isRequired = Get-ObjectPropertyValue -Value $reviewer -Name "isRequired"
        }
    }

    $workItemIds = @()
    foreach ($workItemRef in @(Get-ArrayValues (Get-ObjectPropertyValue -Value $PullRequest -Name "workItemRefs"))) {
        $workItemIds += Get-ObjectPropertyValue -Value $workItemRef -Name "id"
    }

    return [ordered]@{
        pullRequestId = Get-ObjectPropertyValue -Value $PullRequest -Name "pullRequestId"
        title = Get-ObjectPropertyValue -Value $PullRequest -Name "title"
        status = Get-ObjectPropertyValue -Value $PullRequest -Name "status"
        isDraft = Get-ObjectPropertyValue -Value $PullRequest -Name "isDraft"
        mergeStatus = Get-ObjectPropertyValue -Value $PullRequest -Name "mergeStatus"
        creationDate = Get-ObjectPropertyValue -Value $PullRequest -Name "creationDate"
        createdBy = Select-AdoIdentityRef -Identity (Get-ObjectPropertyValue -Value $PullRequest -Name "createdBy")
        sourceRefName = Get-ObjectPropertyValue -Value $PullRequest -Name "sourceRefName"
        targetRefName = Get-ObjectPropertyValue -Value $PullRequest -Name "targetRefName"
        lastMergeSourceCommit = Get-NestedPropertyValue -Value $PullRequest -Names @("lastMergeSourceCommit", "commitId")
        lastMergeTargetCommit = Get-NestedPropertyValue -Value $PullRequest -Names @("lastMergeTargetCommit", "commitId")
        repository = [ordered]@{
            id = Get-NestedPropertyValue -Value $PullRequest -Names @("repository", "id")
            name = Get-NestedPropertyValue -Value $PullRequest -Names @("repository", "name")
        }
        reviewers = @($reviewers)
        workItemIds = @($workItemIds)
        description = Get-ObjectPropertyValue -Value $PullRequest -Name "description"
    }
}

function Select-PullRequestListRows {
    param([AllowNull()][object] $PullRequests)

    $rows = @()
    foreach ($pullRequest in @(Get-ArrayValues $PullRequests)) {
        $rows += [ordered]@{
            pullRequestId = Get-ObjectPropertyValue -Value $pullRequest -Name "pullRequestId"
            title = Get-ObjectPropertyValue -Value $pullRequest -Name "title"
            status = Get-ObjectPropertyValue -Value $pullRequest -Name "status"
            isDraft = Get-ObjectPropertyValue -Value $pullRequest -Name "isDraft"
            createdBy = Get-NestedPropertyValue -Value $pullRequest -Names @("createdBy", "displayName")
            sourceRefName = Get-ObjectPropertyValue -Value $pullRequest -Name "sourceRefName"
            targetRefName = Get-ObjectPropertyValue -Value $pullRequest -Name "targetRefName"
            creationDate = Get-ObjectPropertyValue -Value $pullRequest -Name "creationDate"
        }
    }

    return @($rows)
}

function Select-PullRequestThreadSummaries {
    param([AllowNull()][object] $Threads)

    $rows = @()
    foreach ($thread in @(Get-ArrayValues $Threads)) {
        if ($true -eq (Get-ObjectPropertyValue -Value $thread -Name "isDeleted")) {
            continue
        }

        $comments = @()
        foreach ($comment in @(Get-ArrayValues (Get-ObjectPropertyValue -Value $thread -Name "comments"))) {
            if ($true -eq (Get-ObjectPropertyValue -Value $comment -Name "isDeleted")) {
                continue
            }
            $commentType = [string] (Get-ObjectPropertyValue -Value $comment -Name "commentType")
            if ($commentType -notin @("text", "1")) {
                continue
            }
            $comments += [ordered]@{
                id = Get-ObjectPropertyValue -Value $comment -Name "id"
                author = Get-NestedPropertyValue -Value $comment -Names @("author", "displayName")
                content = Get-ObjectPropertyValue -Value $comment -Name "content"
            }
        }

        $filePath = Get-NestedPropertyValue -Value $thread -Names @("threadContext", "filePath")
        if ($comments.Count -eq 0 -and [string]::IsNullOrWhiteSpace([string] $filePath)) {
            continue
        }

        $rows += [ordered]@{
            id = Get-ObjectPropertyValue -Value $thread -Name "id"
            status = Get-ObjectPropertyValue -Value $thread -Name "status"
            filePath = $filePath
            line = Get-NestedPropertyValue -Value $thread -Names @("threadContext", "rightFileStart", "line")
            comments = @($comments)
        }
    }

    return @($rows)
}

function Select-PullRequestIterationSummaries {
    param([AllowNull()][object] $Iterations)

    $rows = @()
    foreach ($iteration in @(Get-ArrayValues $Iterations)) {
        $rows += [ordered]@{
            id = Get-ObjectPropertyValue -Value $iteration -Name "id"
            createdDate = Get-ObjectPropertyValue -Value $iteration -Name "createdDate"
            sourceRefCommit = Get-NestedPropertyValue -Value $iteration -Names @("sourceRefCommit", "commitId")
            targetRefCommit = Get-NestedPropertyValue -Value $iteration -Names @("targetRefCommit", "commitId")
        }
    }

    return @($rows)
}

function Select-IterationChangeRows {
    param([AllowNull()][object] $Changes)

    $rows = @()
    foreach ($change in @(Get-ArrayValues $Changes)) {
        $rows += [ordered]@{
            changeTrackingId = Get-ObjectPropertyValue -Value $change -Name "changeTrackingId"
            changeType = Get-ObjectPropertyValue -Value $change -Name "changeType"
            paths = @(Get-ChangeEntryPaths -Change $change)
        }
    }

    return @($rows)
}

function Select-PostedThreadSummary {
    param([AllowNull()][object] $Thread)

    if ($null -eq $Thread) {
        return $null
    }

    $commentIds = @()
    foreach ($comment in @(Get-ArrayValues (Get-ObjectPropertyValue -Value $Thread -Name "comments"))) {
        $commentIds += Get-ObjectPropertyValue -Value $comment -Name "id"
    }

    return [ordered]@{
        threadId = Get-ObjectPropertyValue -Value $Thread -Name "id"
        status = Get-ObjectPropertyValue -Value $Thread -Name "status"
        filePath = Get-NestedPropertyValue -Value $Thread -Names @("threadContext", "filePath")
        line = Get-NestedPropertyValue -Value $Thread -Names @("threadContext", "rightFileStart", "line")
        commentIds = @($commentIds)
    }
}

function Get-PullRequestThreadsUrl {
    return Add-QueryString `
        -Url (Get-PullRequestResourceUrl -PullRequestId $PrId -Suffix "threads") `
        -Parameters @{ "api-version" = "7.1" }
}

function Get-PullRequestIterationsUrl {
    param([bool] $IncludeCommits = $false)

    return Add-QueryString `
        -Url (Get-PullRequestResourceUrl -PullRequestId $PrId -Suffix "iterations") `
        -Parameters @{
            "api-version" = "7.1"
            "includeCommits" = $IncludeCommits.ToString().ToLowerInvariant()
        }
}

function Get-PullRequestIterationChangesUrl {
    param(
        [Parameter(Mandatory = $true)][int] $IterationId,
        [int] $CompareTo = 0,
        [int] $Top = 2000,
        [int] $Skip = 0
    )

    return Add-QueryString `
        -Url (Get-PullRequestResourceUrl -PullRequestId $PrId -Suffix "iterations/$IterationId/changes") `
        -Parameters @{
            "api-version" = "7.1"
            "`$compareTo" = $CompareTo
            "`$skip" = $Skip
            "`$top" = $Top
        }
}

function Get-PullRequestReviewerUrl {
    param([Parameter(Mandatory = $true)][string] $ResolvedReviewerId)

    $encodedReviewerId = [System.Uri]::EscapeDataString($ResolvedReviewerId)
    return Add-QueryString `
        -Url (Get-PullRequestResourceUrl -PullRequestId $PrId -Suffix "reviewers/$encodedReviewerId") `
        -Parameters @{ "api-version" = "7.1" }
}

function Get-ConnectionDataUrl {
    $baseOrg = $Org.TrimEnd("/")

    return Add-QueryString `
        -Url "$baseOrg/_apis/connectionData" `
        -Parameters @{ "api-version" = "7.1-preview.1" }
}

function Add-PrWorkItems {
    param(
        [Parameter(Mandatory = $true)][int] $PullRequestId,
        [Parameter(Mandatory = $true)][int[]] $Ids
    )

    $idArguments = [string[]]@()
    foreach ($id in $Ids) {
        $idArguments += [string] $id
    }

    $arguments = Add-CommonArgs @("repos", "pr", "work-item", "add", "--id", ([string] $PullRequestId), "--work-items")
    $arguments += $idArguments

    Invoke-AzJson $arguments
}

function Get-NormalizedThreadFilePath {
    param([Parameter(Mandatory = $true)][string] $Path)

    $normalizedPath = $Path.Replace("\", "/")
    if (-not $normalizedPath.StartsWith("/")) {
        $normalizedPath = "/$normalizedPath"
    }

    return $normalizedPath
}

function Get-ReviewerVoteValue {
    param([Parameter(Mandatory = $true)][string] $VoteName)

    switch ($VoteName) {
        "reset" { return 0 }
        "approve" { return 10 }
        "approve-with-suggestions" { return 5 }
        "wait-for-author" { return -5 }
        "reject" { return -10 }
        default { throw "Unsupported reviewer vote: $VoteName" }
    }
}

function ConvertTo-PullRequestIterations {
    param(
        [AllowNull()][object] $Response,
        [Parameter(Mandatory = $true)][string] $Source
    )

    $iterations = @(Get-ArrayValues $Response)
    if ($iterations.Count -eq 0) {
        throw "$Source did not return any PR iterations."
    }

    foreach ($iteration in $iterations) {
        $iterationId = Get-ObjectPropertyValue -Value $iteration -Name "id"
        if ($null -eq $iterationId -or [int] $iterationId -le 0) {
            throw "$Source returned a PR iteration without a valid id."
        }
    }

    return @($iterations)
}

function Get-PullRequestIterations {
    $includeCommits = $true
    try {
        $response = Invoke-GitRest "pullRequestIterations" -QueryParameters @("includeCommits=$($includeCommits.ToString().ToLowerInvariant())")
        return @(ConvertTo-PullRequestIterations -Response $response -Source "az devops invoke")
    }
    catch {
        Write-Verbose "az devops invoke iteration read failed, falling back to REST. $($_.Exception.Message)"
        $response = Invoke-AdoRestJson -Method "get" -Url (Get-PullRequestIterationsUrl -IncludeCommits $includeCommits)
        return @(ConvertTo-PullRequestIterations -Response $response -Source "Azure DevOps REST")
    }
}

function Get-LatestPullRequestIteration {
    $iterations = @(Get-PullRequestIterations)
    if ($iterations.Count -eq 0) {
        throw "PR $PrId did not return any iterations."
    }

    return $iterations |
        Sort-Object -Property { [int] (Get-ObjectPropertyValue -Value $_ -Name "id") } -Descending |
        Select-Object -First 1
}

function ConvertTo-PullRequestIterationChangesPage {
    param(
        [AllowNull()][object] $Response,
        [Parameter(Mandatory = $true)][string] $Source
    )

    if ($null -eq $Response) {
        throw "$Source did not return iteration changeEntries."
    }

    $changeEntriesProperty = $Response.PSObject.Properties["changeEntries"]
    if ($null -eq $changeEntriesProperty) {
        throw "$Source did not return iteration changeEntries."
    }
    $changeEntries = $changeEntriesProperty.Value

    $nextSkipValue = Get-ObjectPropertyValue -Value $Response -Name "nextSkip"
    if ($null -eq $nextSkipValue) {
        $nextSkip = 0
    }
    else {
        try {
            $nextSkip = [int] $nextSkipValue
        }
        catch {
            throw "$Source returned an invalid nextSkip value."
        }
        if ($nextSkip -lt 0) {
            throw "$Source returned a negative nextSkip value."
        }
    }

    return [pscustomobject][ordered]@{
        changeEntries = @(Get-ArrayValues $changeEntries)
        nextSkip = $nextSkip
    }
}

function Get-PullRequestIterationChanges {
    param(
        [Parameter(Mandatory = $true)][int] $IterationId,
        [int] $CompareTo = 0
    )

    $changes = @()
    $skip = 0
    $top = 2000

    do {
        try {
            $response = Invoke-GitRest `
                -Resource "pullRequestIterationChanges" `
                -ExtraRouteParameters @("iterationId=$IterationId") `
                -QueryParameters @("`$compareTo=$CompareTo", "`$skip=$skip", "`$top=$top")
            $page = ConvertTo-PullRequestIterationChangesPage -Response $response -Source "az devops invoke"
        }
        catch {
            Write-Verbose "az devops invoke iteration changes read failed, falling back to REST. $($_.Exception.Message)"
            $response = Invoke-AdoRestJson -Method "get" -Url (Get-PullRequestIterationChangesUrl -IterationId $IterationId -CompareTo $CompareTo -Top $top -Skip $skip)
            $page = ConvertTo-PullRequestIterationChangesPage -Response $response -Source "Azure DevOps REST"
        }
        $changes += @($page.changeEntries)

        $nextSkip = [int] $page.nextSkip
        $skip = $nextSkip
    } while ($nextSkip -gt 0)

    return @($changes)
}

function Get-ChangeEntryPaths {
    param([Parameter(Mandatory = $true)][object] $Change)

    $paths = @()
    $item = Get-ObjectPropertyValue -Value $Change -Name "item"
    if ($null -eq $item) {
        return $paths
    }

    if ($item -is [string]) {
        $paths += Get-NormalizedThreadFilePath -Path $item
        return $paths
    }

    foreach ($propertyName in @("path", "originalPath", "sourceServerItem")) {
        $pathValue = Get-ObjectPropertyValue -Value $item -Name $propertyName
        if (-not [string]::IsNullOrWhiteSpace([string] $pathValue)) {
            $paths += Get-NormalizedThreadFilePath -Path ([string] $pathValue)
        }
    }

    return @($paths | Select-Object -Unique)
}

function Find-PullRequestChangeForPath {
    param(
        [Parameter(Mandatory = $true)][object[]] $Changes,
        [Parameter(Mandatory = $true)][string] $Path
    )

    $normalizedPath = Get-NormalizedThreadFilePath -Path $Path
    foreach ($change in $Changes) {
        foreach ($candidatePath in @(Get-ChangeEntryPaths -Change $change)) {
            if ([string]::Equals($candidatePath, $normalizedPath, [System.StringComparison]::OrdinalIgnoreCase)) {
                return $change
            }
        }
    }

    throw "File '$normalizedPath' was not found in PR $PrId iteration changes. Refusing to create an inline comment without a verified changeTrackingId."
}

function ConvertFrom-AdoDescriptorStorageKey {
    param([string] $Descriptor)

    if ([string]::IsNullOrWhiteSpace($Descriptor)) {
        return ""
    }

    $encoded = $Descriptor
    $dotIndex = $Descriptor.IndexOf(".")
    if ($dotIndex -ge 0 -and $dotIndex -lt ($Descriptor.Length - 1)) {
        $encoded = $Descriptor.Substring($dotIndex + 1)
    }

    $encoded = $encoded.Replace("-", "+").Replace("_", "/")
    switch ($encoded.Length % 4) {
        0 { }
        2 { $encoded = "$encoded==" }
        3 { $encoded = "$encoded=" }
        default { return "" }
    }

    try {
        return [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded))
    }
    catch {
        return ""
    }
}

function Select-IdentityText {
    param(
        [AllowNull()][object] $Identity,
        [Parameter(Mandatory = $true)][string[]] $Names
    )

    foreach ($name in $Names) {
        $value = Get-ObjectPropertyValue -Value $Identity -Name $name
        if (-not [string]::IsNullOrWhiteSpace([string] $value)) {
            return [string] $value
        }
    }

    return ""
}

function ConvertTo-AdoIdentitySummary {
    param(
        [AllowNull()][object] $Identity,
        [Parameter(Mandatory = $true)][string] $Source
    )

    if ($null -eq $Identity) {
        throw "$Source did not return an identity object."
    }

    $descriptor = Select-IdentityText -Identity $Identity -Names @("descriptor", "subjectDescriptor")
    $id = Select-IdentityText -Identity $Identity -Names @("id")
    if ([string]::IsNullOrWhiteSpace($id)) {
        $id = ConvertFrom-AdoDescriptorStorageKey -Descriptor $descriptor
    }

    $uniqueName = Select-IdentityText -Identity $Identity -Names @("uniqueName", "principalName", "mailAddress")
    $mailAddress = Select-IdentityText -Identity $Identity -Names @("mailAddress")
    $principalName = Select-IdentityText -Identity $Identity -Names @("principalName")
    $displayName = Select-IdentityText -Identity $Identity -Names @("displayName")

    if (
        [string]::IsNullOrWhiteSpace($id) -and
        [string]::IsNullOrWhiteSpace($descriptor) -and
        [string]::IsNullOrWhiteSpace($uniqueName) -and
        [string]::IsNullOrWhiteSpace($mailAddress) -and
        [string]::IsNullOrWhiteSpace($principalName)
    ) {
        throw "$Source did not return a usable identity."
    }

    return [pscustomobject][ordered]@{
        id = $id
        descriptor = $descriptor
        uniqueName = $uniqueName
        mailAddress = $mailAddress
        principalName = $principalName
        displayName = $displayName
    }
}

function Get-CurrentAdoUserIdentityFromReviewerId {
    if ([string]::IsNullOrWhiteSpace($ReviewerId)) {
        throw "ReviewerId was not supplied."
    }

    return [pscustomobject][ordered]@{
        id = [string] $ReviewerId
        descriptor = ""
        uniqueName = ""
        mailAddress = ""
        principalName = ""
        displayName = ""
    }
}

function Get-CurrentAdoUserIdentityFromAdoCliConnectionData {
    # Note: on some organizations and extension versions this fails with "--area is not
    # present in current organization". The identity chain falls through to other channels.
    $connectionData = Invoke-AdoCliRest `
        -Area "Location" `
        -Resource "ConnectionData" `
        -ApiVersion "7.1-preview"

    $authenticatedUser = Get-ObjectPropertyValue -Value $connectionData -Name "authenticatedUser"
    return ConvertTo-AdoIdentitySummary -Identity $authenticatedUser -Source "az devops invoke connectionData"
}

function Get-CurrentAdoUserIdentityFromAzAccount {
    # Last-resort identity: the Azure CLI signed-in account UPN. It carries no Azure DevOps
    # id, but the UPN is enough for self-review detection by uniqueName comparison.
    $account = Invoke-AzJson @("account", "show")
    $upn = [string] (Get-NestedPropertyValue -Value $account -Names @("user", "name"))
    if ([string]::IsNullOrWhiteSpace($upn)) {
        throw "az account show did not return a signed-in user name."
    }

    return [pscustomobject][ordered]@{
        id = ""
        descriptor = ""
        uniqueName = $upn
        mailAddress = $upn
        principalName = $upn
        displayName = ""
    }
}

function Get-CurrentAdoUserIdentity {
    $errors = @()

    try {
        return Get-CurrentAdoUserIdentityFromReviewerId
    }
    catch {
        $errors += "ReviewerId not supplied"
    }

    try {
        return Get-CurrentAdoUserIdentityFromAdoCliConnectionData
    }
    catch {
        $errors += "Azure DevOps CLI connectionData unavailable or unusable"
    }

    try {
        $connectionData = Invoke-AdoRestJson -Method "get" -Url (Get-ConnectionDataUrl)
        $authenticatedUser = Get-ObjectPropertyValue -Value $connectionData -Name "authenticatedUser"
        return ConvertTo-AdoIdentitySummary -Identity $authenticatedUser -Source "Azure DevOps connection data"
    }
    catch {
        $errors += "REST connectionData unavailable or unusable"
    }

    try {
        return Get-CurrentAdoUserIdentityFromAzAccount
    }
    catch {
        $errors += "az account show unavailable or missing a signed-in user"
    }

    throw "Azure DevOps current user identity could not be resolved. Re-run with -ReviewerId. Attempted: $($errors -join '; ')."
}

function Get-CurrentAdoUserId {
    $identity = Get-CurrentAdoUserIdentity
    $id = Get-ObjectPropertyValue -Value $identity -Name "id"
    if ([string]::IsNullOrWhiteSpace([string] $id)) {
        throw ("Azure DevOps current user identity resolved only a signed-in UPN, not an id. " +
            "Reviewer votes need the id. Re-run with -ReviewerId <current-user-id> after " +
            "verifying the identity from a trusted source (for example the PR reviewers list).")
    }

    return [string] $id
}

function Resolve-ReviewerId {
    if (-not [string]::IsNullOrWhiteSpace($ReviewerId)) {
        return $ReviewerId
    }

    try {
        return Get-CurrentAdoUserId
    }
    catch {
        throw "ReviewerId was not supplied and the current Azure DevOps user id could not be resolved. Re-run with -ReviewerId."
    }
}

function Add-PullRequestInlineComment {
    Require-RepoMutationApproval
    Require-PositiveInt $PrId "PrId"
    Require-Value $FilePath "FilePath"
    Require-PositiveInt $Line "Line"
    if ($Offset -lt 0) {
        throw "Offset must be zero or greater."
    }
    if ($CompareToIteration -lt 0) {
        throw "CompareToIteration must be zero or greater."
    }

    $pullRequest = Get-PullRequest
    Assert-NotPullRequestCreatorForReviewPublication -PullRequest $pullRequest -ActionName "publish review findings as PR comments"

    $commentText = Get-CommentText
    Require-Value $commentText "Comment or CommentPath"

    $resolvedEndLine = $Line
    if ($EndLine -gt 0) {
        $resolvedEndLine = $EndLine
    }
    if ($resolvedEndLine -lt $Line) {
        throw "EndLine must be greater than or equal to Line."
    }

    $normalizedFilePath = Get-NormalizedThreadFilePath -Path $FilePath
    $latestIteration = Get-LatestPullRequestIteration
    $latestIterationId = [int] (Get-ObjectPropertyValue -Value $latestIteration -Name "id")
    $changes = @(Get-PullRequestIterationChanges -IterationId $latestIterationId -CompareTo $CompareToIteration)
    $change = Find-PullRequestChangeForPath -Changes $changes -Path $normalizedFilePath
    $changeTrackingId = Get-ObjectPropertyValue -Value $change -Name "changeTrackingId"
    if ($null -eq $changeTrackingId -or [int] $changeTrackingId -le 0) {
        throw "PR $PrId change for '$normalizedFilePath' did not include a valid changeTrackingId."
    }

    $firstComparingIteration = $latestIterationId
    if ($CompareToIteration -gt 0) {
        $firstComparingIteration = $CompareToIteration
    }
    if ($firstComparingIteration -gt $latestIterationId) {
        throw "CompareToIteration $firstComparingIteration is newer than latest PR iteration $latestIterationId."
    }

    $startPosition = @{
        line = $Line
        offset = $Offset
    }
    $endPosition = @{
        line = $resolvedEndLine
        offset = $Offset
    }
    $threadContext = @{
        filePath = $normalizedFilePath
        leftFileStart = $null
        leftFileEnd = $null
        rightFileStart = $null
        rightFileEnd = $null
    }
    if ($Side -eq "right") {
        $threadContext.rightFileStart = $startPosition
        $threadContext.rightFileEnd = $endPosition
    }
    else {
        $threadContext.leftFileStart = $startPosition
        $threadContext.leftFileEnd = $endPosition
    }

    $payload = @{
        comments = @(
            @{
                parentCommentId = 0
                content = $commentText
                commentType = 1
            }
        )
        status = 1
        threadContext = $threadContext
        pullRequestThreadContext = @{
            changeTrackingId = [int] $changeTrackingId
            iterationContext = @{
                firstComparingIteration = $firstComparingIteration
                secondComparingIteration = $latestIterationId
            }
        }
    }

    $tempFile = Join-Path ([System.IO.Path]::GetTempPath()) ("ado-pr-inline-{0}.json" -f ([System.Guid]::NewGuid()))
    try {
        Write-JsonNoBom -Path $tempFile -Value $payload
        if ($PSCmdlet.ShouldProcess("PR $PrId $($normalizedFilePath):$Line", "Add inline pull request comment")) {
            $postedThread = Invoke-GitRest "pullRequestThreads" "POST" $tempFile
            if ($Raw) { $postedThread } else { Select-PostedThreadSummary -Thread $postedThread }
        }
    }
    finally {
        if (Test-Path -LiteralPath $tempFile) {
            Remove-Item -LiteralPath $tempFile -Force -WhatIf:$false
        }
    }
}

function Set-PullRequestReviewerVote {
    param([Parameter(Mandatory = $true)][string] $VoteName)

    Require-RepoMutationApproval
    Require-PositiveInt $PrId "PrId"
    $pullRequest = Get-PullRequest
    if ($VoteName -ne "reset") {
        Assert-NotPullRequestCreatorForReviewPublication -PullRequest $pullRequest -ActionName "cast reviewer votes"
    }
    $isDraft = Get-ObjectPropertyValue -Value $pullRequest -Name "isDraft"
    if ($VoteName -ne "reset" -and $true -eq $isDraft) {
        throw "PR $PrId is a draft. Azure DevOps does not accept reviewer votes on draft pull requests. Ask before publishing the PR, then rerun the reviewer vote."
    }

    $resolvedReviewerId = Resolve-ReviewerId
    $voteValue = Get-ReviewerVoteValue -VoteName $VoteName
    $payload = @{
        id = $resolvedReviewerId
        vote = $voteValue
    }

    $tempFile = Join-Path ([System.IO.Path]::GetTempPath()) ("ado-pr-reviewer-{0}.json" -f ([System.Guid]::NewGuid()))
    try {
        Write-JsonNoBom -Path $tempFile -Value $payload
        if ($PSCmdlet.ShouldProcess("PR $PrId reviewer $resolvedReviewerId", "Set reviewer vote to $VoteName")) {
            Invoke-GitRest "pullRequestReviewers" "PUT" $tempFile @("reviewerId=$resolvedReviewerId")
        }
    }
    finally {
        if (Test-Path -LiteralPath $tempFile) {
            Remove-Item -LiteralPath $tempFile -Force -WhatIf:$false
        }
    }
}
