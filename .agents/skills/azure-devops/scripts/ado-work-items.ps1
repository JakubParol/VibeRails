[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet(
        "Context",
        "Doctor",
        "Metadata",
        "QueryByMarker",
        "Show",
        "Comments",
        "CreateEpic",
        "CreateFeature",
        "CreateStory",
        "CreateTask",
        "Update",
        "LinkChild",
        "AddComment",
        "UpdateComment",
        "DeleteComment",
        "Delete"
    )]
    [string] $Action = "Metadata",

    [string] $Org = "",
    [string] $Project = "",

    [int] $Id,
    [int] $ParentId,
    [int[]] $ChildId = @(),
    [int] $CommentId,

    [string] $Title,
    [string] $Description,
    [string] $DescriptionPath,
    [string] $Discussion,
    [string] $Comment,
    [string] $CommentPath,
    [string] $State,
    [string] $Marker,
    [string] $Tags,
    [string] $AcceptanceCriteria,
    [string] $AcceptanceCriteriaPath,
    [decimal] $StoryPoints,
    [decimal] $RemainingWork,
    [int] $Priority = 2,
    [string] $Area,
    [string] $Iteration,
    [string[]] $Field = @(),

    [switch] $AllowWrite,
    [switch] $ConfirmDelete,
    [switch] $Destroy,
    [switch] $Raw
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$storyPointsProvided = $PSBoundParameters.ContainsKey("StoryPoints")
$remainingWorkProvided = $PSBoundParameters.ContainsKey("RemainingWork")
$priorityProvided = $PSBoundParameters.ContainsKey("Priority")

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $scriptDirectory "ado-common.ps1")
. (Join-Path $scriptDirectory "ado-work-items-common.ps1")
. (Join-Path $scriptDirectory "ado-work-items-api.ps1")

$Org = Resolve-AdoOrg -Org $Org
$Project = Resolve-AdoProject -Project $Project

switch ($Action) {
    "Context" {
        [ordered]@{
            organization = $Org
            project = $Project
            repository = (Resolve-AdoRepository -Repository "" -Optional)
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
            "org=$Org project=$Project"
        } -NextStep "Pass -Org/-Project or set AZURE_DEVOPS_* environment variables."
        $checks += Invoke-DoctorCheck -Name "signed-in identity (az account)" -Check {
            $account = Invoke-AzJson @("account", "show")
            $accountUser = Get-ObjectPropertyValue -Value $account -Name "user"
            if ($null -eq (Get-ObjectPropertyValue -Value $accountUser -Name "name")) {
                throw "az account show did not return a signed-in user."
            }
            "signed-in user resolved"
        } -NextStep "Run az login (matching tenant)."
        $checks += Invoke-DoctorCheck -Name "invoke channel (wit read)" -Check {
            Invoke-AzJson (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "workItemTypes", "--route-parameters", "project=$Project", "--api-version", "7.1", "--query", "value[0].name")) | Out-Null
            "work item types readable"
        } -NextStep "Verify the project name and your permissions in $Org, or run az devops login."
        $failed = @($checks | Where-Object { $_.status -eq "fail" })
        [ordered]@{
            organization = $Org
            project = $Project
            healthy = ($failed.Count -eq 0)
            checks = @($checks)
        } | ConvertTo-Json -Depth 8
    }
    "Metadata" {
        $typeNames = @(Get-ArrayValues (Invoke-AzJson (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "workItemTypes", "--route-parameters", "project=$Project", "--api-version", "7.1", "--query", "value[].name"))))
        $typeRefs = @(Get-ArrayValues (Invoke-AzJson (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "workItemTypes", "--route-parameters", "project=$Project", "--api-version", "7.1", "--query", "value[].referenceName"))))
        $typeRows = for ($index = 0; $index -lt $typeNames.Count; $index += 1) {
            [ordered]@{ name = $typeNames[$index]; referenceName = $typeRefs[$index] }
        }
        $areas = Invoke-AzJson (Add-BoardsArgs @("boards", "area", "project", "list", "--depth", "5"))
        $iterations = Invoke-AzJson (Add-BoardsArgs @("boards", "iteration", "project", "list", "--depth", "5"))
        if ($Raw) {
            [ordered]@{
                organization = $Org
                project = $Project
                hierarchy = @("Epic", "Feature", "User Story", "Task")
                workItemTypes = @($typeRows)
                areas = $areas
                iterations = $iterations
            } | ConvertTo-Json -Depth 20
        }
        else {
            [ordered]@{
                organization = $Org
                project = $Project
                hierarchy = @("Epic", "Feature", "User Story", "Task")
                workItemTypes = @($typeRows)
                areaPaths = @(Get-ClassificationNodePaths -Node $areas)
                iterationPaths = @(Get-ClassificationNodePaths -Node $iterations)
            } | ConvertTo-Json -Depth 8
        }
    }
    "QueryByMarker" {
        Require-Value $Marker "Marker"
        $safeMarker = $Marker.Replace("'", "''")
        $wiql = "Select [System.Id], [System.Title], [System.TeamProject], [System.WorkItemType], [System.State], [System.Tags] From WorkItems Where [System.TeamProject] = '$Project' And [System.Tags] Contains '$safeMarker' Order By [System.Id]"
        $queryResult = Invoke-AzJson (Add-BoardsArgs @("boards", "query", "--wiql", $wiql))
        if ($Raw) {
            $queryResult
        }
        else {
            @(Select-WorkItemQueryRows -QueryResult $queryResult) | ConvertTo-Json -Depth 6
        }
    }
    "Show" {
        Require-PositiveInt $Id "Id"
        $workItem = Get-WorkItem -WorkItemId $Id
        if ($Raw) {
            $workItem
        }
        else {
            Select-WorkItemSummary -WorkItem $workItem | ConvertTo-Json -Depth 8
        }
    }
    "Comments" {
        Require-PositiveInt $Id "Id"
        Get-WorkItemComments -WorkItemId $Id
    }
    "CreateEpic" {
        $created = New-WorkItem "Epic"
        if ($Raw) { $created } else { Select-WorkItemSummary -WorkItem $created | ConvertTo-Json -Depth 8 }
    }
    "CreateFeature" {
        $created = New-WorkItem "Feature"
        if ($Raw) { $created } else { Select-WorkItemSummary -WorkItem $created | ConvertTo-Json -Depth 8 }
    }
    "CreateStory" {
        $created = New-WorkItem "User Story"
        if ($Raw) { $created } else { Select-WorkItemSummary -WorkItem $created | ConvertTo-Json -Depth 8 }
    }
    "CreateTask" {
        $created = New-WorkItem "Task"
        if ($Raw) { $created } else { Select-WorkItemSummary -WorkItem $created | ConvertTo-Json -Depth 8 }
    }
    "Update" {
        Require-WriteApproval
        Require-PositiveInt $Id "Id"
        Assert-NoRichTextInFieldArguments

        $workItem = Get-VerifiedWorkItem -WorkItemId $Id -Name "Id"
        $workItemType = Get-WorkItemField -WorkItem $workItem -FieldName "System.WorkItemType"
        $resolvedDescription = Read-TextInput -Value $Description -Path $DescriptionPath -Name "Description"
        $resolvedAcceptanceCriteria = Read-TextInput -Value $AcceptanceCriteria -Path $AcceptanceCriteriaPath -Name "AcceptanceCriteria"
        if (-not [string]::IsNullOrWhiteSpace($resolvedAcceptanceCriteria) -and -not (Test-SupportsAcceptanceCriteria $workItemType)) {
            throw "Acceptance criteria is only supported for User Story work items in this project. Work item $Id is '$workItemType'."
        }

        $arguments = Add-OrgArgs @("boards", "work-item", "update", "--id", ([string] $Id))
        $hasUpdates = $false
        if (-not [string]::IsNullOrWhiteSpace($Title)) {
            $arguments += @("--title", $Title)
            $hasUpdates = $true
        }
        if (-not [string]::IsNullOrWhiteSpace($Discussion)) {
            $arguments += @("--discussion", $Discussion)
            $hasUpdates = $true
        }
        if (-not [string]::IsNullOrWhiteSpace($State)) {
            $arguments += @("--state", $State)
            $hasUpdates = $true
        }
        if (-not [string]::IsNullOrWhiteSpace($Area)) {
            $arguments += @("--area", $Area)
            $hasUpdates = $true
        }
        if (-not [string]::IsNullOrWhiteSpace($Iteration)) {
            $arguments += @("--iteration", $Iteration)
            $hasUpdates = $true
        }

        $fieldUpdates = @(Get-TypedUpdateFields -WorkItemType $workItemType)
        $fieldUpdates += $Field
        if ($fieldUpdates.Count -gt 0) {
            $arguments += @("--fields") + $fieldUpdates
            $hasUpdates = $true
        }

        $hasRichTextUpdates = (
            -not [string]::IsNullOrWhiteSpace($resolvedDescription) -or
            -not [string]::IsNullOrWhiteSpace($resolvedAcceptanceCriteria)
        )
        if (-not $hasUpdates -and -not $hasRichTextUpdates) {
            throw "No update fields supplied."
        }

        if ($PSCmdlet.ShouldProcess("work item $Id", "Update Azure Boards work item")) {
            $updated = $null
            if ($hasUpdates) {
                $updated = Invoke-AzJson $arguments
            }
            if ($hasRichTextUpdates) {
                $updated = Set-WorkItemRichText -WorkItemId $Id -DescriptionValue $resolvedDescription -AcceptanceCriteriaValue $resolvedAcceptanceCriteria
            }

            if ($Raw) { $updated } else { Select-WorkItemSummary -WorkItem $updated | ConvertTo-Json -Depth 8 }
        }
    }
    "LinkChild" {
        Require-WriteApproval
        Require-PositiveInt $ParentId "ParentId"
        Require-PositiveIntArray $ChildId "ChildId"
        Assert-WorkItemInProject -WorkItemId $ParentId -Name "ParentId"
        Assert-WorkItemsInProject -WorkItemIds $ChildId -Name "ChildId"
        $targetIds = ($ChildId -join ",")
        if ($PSCmdlet.ShouldProcess("work item $ParentId", "Link child work item(s) $targetIds")) {
            Invoke-AzJson (Add-OrgArgs @("boards", "work-item", "relation", "add", "--id", ([string] $ParentId), "--relation-type", "child", "--target-id", $targetIds))
        }
    }
    "AddComment" {
        Require-WriteApproval
        Require-PositiveInt $Id "Id"
        Assert-WorkItemInProject -WorkItemId $Id -Name "Id"
        $text = Read-TextInput -Value $Comment -Path $CommentPath -Name "Comment"
        Require-Value $text "Comment"
        if ($PSCmdlet.ShouldProcess("work item $Id", "Add Azure Boards work item comment")) {
            Add-WorkItemComment -WorkItemId $Id -Text $text
        }
    }
    "UpdateComment" {
        Require-WriteApproval
        Require-PositiveInt $Id "Id"
        Require-PositiveInt $CommentId "CommentId"
        Assert-WorkItemInProject -WorkItemId $Id -Name "Id"
        $text = Read-TextInput -Value $Comment -Path $CommentPath -Name "Comment"
        Require-Value $text "Comment"
        if ($PSCmdlet.ShouldProcess("work item $Id comment $CommentId", "Update Azure Boards work item comment")) {
            Update-WorkItemComment -WorkItemId $Id -CommentId $CommentId -Text $text
        }
    }
    "DeleteComment" {
        Require-WriteApproval
        Require-PositiveInt $Id "Id"
        Require-PositiveInt $CommentId "CommentId"
        if (-not $ConfirmDelete) {
            throw "Comment deletion requires -ConfirmDelete."
        }
        Assert-WorkItemInProject -WorkItemId $Id -Name "Id"
        if ($PSCmdlet.ShouldProcess("work item $Id comment $CommentId", "Delete Azure Boards work item comment")) {
            Remove-WorkItemComment -WorkItemId $Id -CommentId $CommentId
        }
    }
    "Delete" {
        Require-WriteApproval
        Require-PositiveInt $Id "Id"
        if (-not $ConfirmDelete) {
            throw "Deletion requires -ConfirmDelete. Add -Destroy only for permanent deletion after explicit approval."
        }
        Assert-WorkItemInProject -WorkItemId $Id -Name "Id"
        $arguments = Add-BoardsArgs @("boards", "work-item", "delete", "--id", ([string] $Id), "--yes")
        if ($Destroy) {
            $arguments += "--destroy"
        }
        if ($PSCmdlet.ShouldProcess("work item $Id", "Delete Azure Boards work item")) {
            Invoke-AzNoOutput $arguments
            [ordered]@{
                id = $Id
                deleted = $true
                destroy = [bool] $Destroy
            }
        }
    }
}
