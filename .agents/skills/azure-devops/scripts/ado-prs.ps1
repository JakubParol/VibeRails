[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet("Context", "Doctor", "ListActive", "Show", "SelfReviewStatus", "WorkItems", "Commits", "Threads", "Reviewers", "Policies", "Iterations", "IterationChanges", "CreateDraft", "UpdateDescription", "SetDraft", "Publish", "LinkWorkItems", "AddThreadComment", "AddInlineComment", "SetReviewerVote", "Approve", "Complete", "Abandon")]
    [string] $Action = "ListActive",

    [string] $Org = "",
    [string] $Project = "",
    [string] $Repository = "",

    [int] $PrId,
    [string] $SourceBranch,
    [string] $TargetBranch = "main",
    [string] $Title,
    [string] $Description,
    [string] $DescriptionPath,
    [int[]] $WorkItemId = @(),
    [string] $Comment,
    [string] $CommentPath,
    [string] $FilePath,
    [int] $Line,
    [int] $EndLine,
    [int] $Offset = 1,
    [ValidateSet("right", "left")]
    [string] $Side = "right",
    [int] $CompareToIteration = 0,
    [string] $ReviewerId,
    [ValidateSet("reset", "approve", "approve-with-suggestions", "wait-for-author", "reject")]
    [string] $Vote = "approve",

    [switch] $AllowRepoMutation,
    [switch] $ConfirmComplete,
    [switch] $DeleteSourceBranch,
    [switch] $Squash,
    [switch] $Raw
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $PSCommandPath
. (Join-Path $scriptDirectory "ado-common.ps1")
. (Join-Path $scriptDirectory "ado-prs-common.ps1")
. (Join-Path $scriptDirectory "ado-prs-api.ps1")
. (Join-Path $scriptDirectory "ado-prs-self-review.ps1")

$Org = Resolve-AdoOrg -Org $Org
$Project = Resolve-AdoProject -Project $Project
$Repository = Resolve-AdoRepository -Repository $Repository

switch ($Action) {
    "Context" {
        [ordered]@{
            organization = $Org
            project = $Project
            repository = $Repository
            source = "Parameters, AZURE_DEVOPS_* environment variables, or current Azure Repos git remote"
        } | ConvertTo-Json -Depth 5
    }
    "Doctor" {
        $checks = @()
        $checks += Invoke-DoctorCheck -Name "az cli" -Check {
            $versionInfo = Invoke-AzJson @("version")
            "azure-cli $(Get-ObjectPropertyValue -Value $versionInfo -Name 'azure-cli')"
        } -NextStep "Install Azure CLI or fix PATH."
        $checks += Invoke-DoctorCheck -Name "devops extension" -Check {
            $extension = Invoke-AzJson @("extension", "show", "--name", "azure-devops")
            "azure-devops extension $(Get-ObjectPropertyValue -Value $extension -Name 'version')"
        } -NextStep "Run: az extension add --name azure-devops"
        $checks += Invoke-DoctorCheck -Name "context" -Check {
            "org=$Org project=$Project repository=$Repository"
        } -NextStep "Pass -Org/-Project/-Repository or set AZURE_DEVOPS_* environment variables."
        $checks += Invoke-DoctorCheck -Name "native repos channel" -Check {
            $repo = Invoke-AzJson (Add-ProjectArgs @("repos", "show", "--repository", $Repository))
            "repository readable: $(Get-ObjectPropertyValue -Value $repo -Name 'name')"
        } -NextStep "Verify repository name and permissions, or run az devops login for $Org."
        $checks += Invoke-DoctorCheck -Name "invoke channel (wit read)" -Check {
            Invoke-AzJson @("devops", "invoke", "--area", "wit", "--resource", "workItemTypes", "--route-parameters", "project=$Project", "--api-version", "7.1", "--query", "value[0].name", "--org", $Org) | Out-Null
            "work item types readable"
        } -NextStep "Verify the project name and your permissions in $Org, or run az devops login."
        $checks += Invoke-DoctorCheck -Name "identity resolution" -Check {
            $identity = Get-CurrentAdoUserIdentity
            $identityId = [string] (Get-ObjectPropertyValue -Value $identity -Name "id")
            if ([string]::IsNullOrWhiteSpace($identityId)) {
                "identity resolved by UPN only; reviewer votes will need -ReviewerId"
            }
            else {
                "identity resolved with id"
            }
        } -NextStep "Run az login (matching tenant); for reviewer votes pass -ReviewerId."
        $checks += Invoke-DoctorCheck -Name "REST bearer channel (connectionData)" -Check {
            $connectionData = Invoke-AdoRestJson -Method "get" -Url (Get-ConnectionDataUrl)
            if ($null -eq (Get-ObjectPropertyValue -Value $connectionData -Name "authenticatedUser")) {
                throw "REST connectionData did not return an authenticated user."
            }
            "authenticated user resolved"
        } -NextStep "Bearer/REST channel is broken (wrong tenant or conditional access). The wrapper prefers CLI channels, so this is not fatal; fix with az login --tenant <tenant> when needed."
        $failed = @($checks | Where-Object { $_.status -eq "fail" })
        [ordered]@{
            organization = $Org
            project = $Project
            repository = $Repository
            healthy = ($failed.Count -eq 0)
            checks = @($checks)
        } | ConvertTo-Json -Depth 8
    }
    "ListActive" {
        $pullRequests = Invoke-AzJson (Add-ProjectArgs @("repos", "pr", "list", "--repository", $Repository, "--status", "active"))
        if ($Raw) {
            $pullRequests
        }
        else {
            @(Select-PullRequestListRows -PullRequests $pullRequests) | ConvertTo-Json -Depth 6
        }
    }
    "Show" {
        $pullRequest = Get-PullRequest
        if ($Raw) {
            $pullRequest
        }
        else {
            Select-PullRequestSummary -PullRequest $pullRequest | ConvertTo-Json -Depth 8
        }
    }
    "SelfReviewStatus" {
        Get-PullRequestSelfReviewStatus
    }
    "WorkItems" {
        Require-PositiveInt $PrId "PrId"
        Invoke-AzJson (Add-CommonArgs @("repos", "pr", "work-item", "list", "--id", ([string] $PrId)))
    }
    "Commits" {
        Require-PositiveInt $PrId "PrId"
        Invoke-GitRest "pullRequestCommits"
    }
    "Threads" {
        Require-PositiveInt $PrId "PrId"
        $threads = Invoke-GitRest "pullRequestThreads"
        if ($Raw) {
            $threads
        }
        else {
            @(Select-PullRequestThreadSummaries -Threads $threads) | ConvertTo-Json -Depth 8
        }
    }
    "Reviewers" {
        Require-PositiveInt $PrId "PrId"
        Invoke-AzJson (Add-CommonArgs @("repos", "pr", "reviewer", "list", "--id", ([string] $PrId)))
    }
    "Policies" {
        Require-PositiveInt $PrId "PrId"
        Invoke-AzJson (Add-CommonArgs @("repos", "pr", "policy", "list", "--id", ([string] $PrId)))
    }
    "Iterations" {
        Require-PositiveInt $PrId "PrId"
        $iterations = Get-PullRequestIterations
        if ($Raw) {
            $iterations
        }
        else {
            @(Select-PullRequestIterationSummaries -Iterations $iterations) | ConvertTo-Json -Depth 6
        }
    }
    "IterationChanges" {
        Require-PositiveInt $PrId "PrId"
        $latestIteration = Get-LatestPullRequestIteration
        $latestIterationId = [int] (Get-ObjectPropertyValue -Value $latestIteration -Name "id")
        $changes = Get-PullRequestIterationChanges -IterationId $latestIterationId -CompareTo $CompareToIteration
        if ($Raw) {
            $changes
        }
        else {
            [ordered]@{
                iterationId = $latestIterationId
                changes = @(Select-IterationChangeRows -Changes $changes)
            } | ConvertTo-Json -Depth 6
        }
    }
    "CreateDraft" {
        Require-RepoMutationApproval
        Require-Value $SourceBranch "SourceBranch"
        Require-Value $Title "Title"
        $descriptionText = Get-DescriptionText
        if ($WorkItemId.Count -gt 0) {
            Require-PositiveIntArray $WorkItemId "WorkItemId"
        }
        if ($PSCmdlet.ShouldProcess("$SourceBranch -> $TargetBranch", "Create draft pull request")) {
            $payload = @{
                sourceRefName = Get-BranchRef $SourceBranch
                targetRefName = Get-BranchRef $TargetBranch
                title = $Title
                description = $descriptionText
                isDraft = $true
            }
            $createdPullRequest = Invoke-AdoRestJson -Method "post" -Url (Get-PullRequestsUrl) -Payload $payload
            if ($WorkItemId.Count -gt 0) {
                Add-PrWorkItems -PullRequestId $createdPullRequest.pullRequestId -Ids $WorkItemId | Out-Null
            }
            $createdPullRequest
        }
    }
    "UpdateDescription" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        $descriptionText = Get-DescriptionText
        Require-Value $descriptionText "Description or DescriptionPath"
        if ($PSCmdlet.ShouldProcess("PR $PrId", "Update pull request description")) {
            Invoke-AdoRestJson -Method "patch" -Url (Get-PullRequestsUrl -PullRequestId $PrId) -Payload @{ description = $descriptionText }
        }
    }
    "SetDraft" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        if ($PSCmdlet.ShouldProcess("PR $PrId", "Set pull request draft mode")) {
            Invoke-AdoRestJson -Method "patch" -Url (Get-PullRequestsUrl -PullRequestId $PrId) -Payload @{ isDraft = $true }
        }
    }
    "Publish" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        if ($PSCmdlet.ShouldProcess("PR $PrId", "Publish pull request")) {
            Invoke-AdoRestJson -Method "patch" -Url (Get-PullRequestsUrl -PullRequestId $PrId) -Payload @{ isDraft = $false }
        }
    }
    "LinkWorkItems" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        Require-PositiveIntArray $WorkItemId "WorkItemId"
        if ($PSCmdlet.ShouldProcess("PR $PrId", "Link work item(s) $($WorkItemId -join ',')")) {
            Add-PrWorkItems -PullRequestId $PrId -Ids $WorkItemId
        }
    }
    "AddThreadComment" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        $commentText = Get-CommentText
        Require-Value $commentText "Comment or CommentPath"
        $payload = @{
            comments = @(
                @{
                    parentCommentId = 0
                    content = $commentText
                    commentType = 1
                }
            )
            status = 1
        }
        $tempFile = Join-Path ([System.IO.Path]::GetTempPath()) ("ado-pr-thread-{0}.json" -f ([System.Guid]::NewGuid()))
        try {
            Write-JsonNoBom -Path $tempFile -Value $payload
            if ($PSCmdlet.ShouldProcess("PR $PrId", "Add pull request thread comment")) {
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
    "AddInlineComment" {
        Add-PullRequestInlineComment
    }
    "SetReviewerVote" {
        Set-PullRequestReviewerVote -VoteName $Vote
    }
    "Approve" {
        Set-PullRequestReviewerVote -VoteName "approve"
    }
    "Complete" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        if (-not $ConfirmComplete) {
            throw "Completing a PR requires -ConfirmComplete after explicit user approval."
        }
        $arguments = Add-CommonArgs @("repos", "pr", "update", "--id", ([string] $PrId), "--status", "completed")
        if ($DeleteSourceBranch) {
            $arguments += @("--delete-source-branch", "true")
        }
        if ($Squash) {
            $arguments += @("--squash", "true")
        }
        if ($PSCmdlet.ShouldProcess("PR $PrId", "Complete pull request")) {
            Invoke-AzJson $arguments
        }
    }
    "Abandon" {
        Require-RepoMutationApproval
        Require-PositiveInt $PrId "PrId"
        if ($PSCmdlet.ShouldProcess("PR $PrId", "Abandon pull request")) {
            Invoke-AzJson (Add-CommonArgs @("repos", "pr", "update", "--id", ([string] $PrId), "--status", "abandoned"))
        }
    }
}
