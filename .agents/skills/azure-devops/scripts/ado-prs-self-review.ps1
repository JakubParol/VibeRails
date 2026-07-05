function Get-PullRequestCreatorId {
    param([Parameter(Mandatory = $true)][object] $PullRequest)

    $createdBy = Get-ObjectPropertyValue -Value $PullRequest -Name "createdBy"
    $id = Get-ObjectPropertyValue -Value $createdBy -Name "id"
    if ([string]::IsNullOrWhiteSpace([string] $id)) {
        throw "PR $PrId did not return createdBy.id."
    }

    return [string] $id
}

function Test-IsCurrentUserPullRequestCreator {
    param([Parameter(Mandatory = $true)][object] $PullRequest)

    $creatorId = Get-PullRequestCreatorId -PullRequest $PullRequest
    $creator = Get-ObjectPropertyValue -Value $PullRequest -Name "createdBy"
    $creatorDescriptor = Get-ObjectPropertyValue -Value $creator -Name "descriptor"
    $creatorUniqueName = Get-ObjectPropertyValue -Value $creator -Name "uniqueName"
    $currentUser = Get-CurrentAdoUserIdentity
    $currentUserId = Get-ObjectPropertyValue -Value $currentUser -Name "id"
    $currentDescriptor = Get-ObjectPropertyValue -Value $currentUser -Name "descriptor"
    $currentNames = @(
        (Get-ObjectPropertyValue -Value $currentUser -Name "uniqueName"),
        (Get-ObjectPropertyValue -Value $currentUser -Name "principalName"),
        (Get-ObjectPropertyValue -Value $currentUser -Name "mailAddress")
    )

    if ([string]::Equals($creatorId, $currentUserId, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $true
    }
    if (
        -not [string]::IsNullOrWhiteSpace([string] $creatorDescriptor) -and
        [string]::Equals([string] $creatorDescriptor, [string] $currentDescriptor, [System.StringComparison]::OrdinalIgnoreCase)
    ) {
        return $true
    }
    foreach ($currentName in $currentNames) {
        if (
            -not [string]::IsNullOrWhiteSpace([string] $creatorUniqueName) -and
            [string]::Equals([string] $creatorUniqueName, [string] $currentName, [System.StringComparison]::OrdinalIgnoreCase)
        ) {
            return $true
        }
    }

    return $false
}

function Get-PullRequestSelfReviewStatus {
    Require-PositiveInt $PrId "PrId"

    $pullRequest = Get-PullRequest
    [ordered]@{
        pullRequestId = $PrId
        isSelfReview = [bool] (Test-IsCurrentUserPullRequestCreator -PullRequest $pullRequest)
    }
}

function Assert-NotPullRequestCreatorForReviewPublication {
    param(
        [Parameter(Mandatory = $true)][object] $PullRequest,
        [Parameter(Mandatory = $true)][string] $ActionName
    )

    if (Test-IsCurrentUserPullRequestCreator -PullRequest $PullRequest) {
        throw "PR $PrId was created by the authenticated Azure DevOps user. Do not $ActionName on self-created PRs; report review findings locally instead."
    }
}
