function Get-WorkItem {
    param([int] $WorkItemId)

    return Invoke-AzJson (Add-OrgArgs @("boards", "work-item", "show", "--id", ([string] $WorkItemId), "--expand", "relations"))
}

function Get-WorkItemIdFromRelationUrl {
    param([AllowNull()][string] $Url)

    if ([string]::IsNullOrWhiteSpace($Url)) {
        return $null
    }

    $match = [regex]::Match($Url, "/(\d+)$")
    if ($match.Success) {
        return [int] $match.Groups[1].Value
    }

    return $null
}

function Select-WorkItemSummary {
    param([AllowNull()][object] $WorkItem)

    if ($null -eq $WorkItem) {
        return $null
    }

    $fields = Get-ObjectPropertyValue -Value $WorkItem -Name "fields"

    $assignedTo = Get-ObjectPropertyValue -Value $fields -Name "System.AssignedTo"
    $assignedSummary = $null
    if ($null -ne $assignedTo) {
        if ($assignedTo -is [string]) {
            $assignedSummary = $assignedTo
        }
        else {
            $assignedSummary = [ordered]@{
                displayName = Get-ObjectPropertyValue -Value $assignedTo -Name "displayName"
                uniqueName = Get-ObjectPropertyValue -Value $assignedTo -Name "uniqueName"
            }
        }
    }

    $parentId = $null
    $childIds = @()
    foreach ($relation in @(Get-ArrayValues (Get-ObjectPropertyValue -Value $WorkItem -Name "relations"))) {
        $relationType = [string] (Get-ObjectPropertyValue -Value $relation -Name "rel")
        $relatedId = Get-WorkItemIdFromRelationUrl -Url ([string] (Get-ObjectPropertyValue -Value $relation -Name "url"))
        if ($null -eq $relatedId) {
            continue
        }
        if ($relationType -eq "System.LinkTypes.Hierarchy-Reverse") {
            $parentId = $relatedId
        }
        elseif ($relationType -eq "System.LinkTypes.Hierarchy-Forward") {
            $childIds += $relatedId
        }
    }

    return [ordered]@{
        id = Get-ObjectPropertyValue -Value $WorkItem -Name "id"
        workItemType = Get-ObjectPropertyValue -Value $fields -Name "System.WorkItemType"
        title = Get-ObjectPropertyValue -Value $fields -Name "System.Title"
        state = Get-ObjectPropertyValue -Value $fields -Name "System.State"
        teamProject = Get-ObjectPropertyValue -Value $fields -Name "System.TeamProject"
        areaPath = Get-ObjectPropertyValue -Value $fields -Name "System.AreaPath"
        iterationPath = Get-ObjectPropertyValue -Value $fields -Name "System.IterationPath"
        assignedTo = $assignedSummary
        tags = Get-ObjectPropertyValue -Value $fields -Name "System.Tags"
        priority = Get-ObjectPropertyValue -Value $fields -Name "Microsoft.VSTS.Common.Priority"
        storyPoints = Get-ObjectPropertyValue -Value $fields -Name "Microsoft.VSTS.Scheduling.StoryPoints"
        remainingWork = Get-ObjectPropertyValue -Value $fields -Name "Microsoft.VSTS.Scheduling.RemainingWork"
        commentCount = Get-ObjectPropertyValue -Value $fields -Name "System.CommentCount"
        description = Get-ObjectPropertyValue -Value $fields -Name "System.Description"
        acceptanceCriteria = Get-ObjectPropertyValue -Value $fields -Name "Microsoft.VSTS.Common.AcceptanceCriteria"
        parentId = $parentId
        childIds = @($childIds)
        url = Get-ObjectPropertyValue -Value $WorkItem -Name "url"
    }
}

function Select-WorkItemQueryRows {
    param([AllowNull()][object] $QueryResult)

    $rows = @()
    foreach ($item in @(Get-ArrayValues $QueryResult)) {
        $fields = Get-ObjectPropertyValue -Value $item -Name "fields"
        $rows += [ordered]@{
            id = Get-ObjectPropertyValue -Value $fields -Name "System.Id"
            workItemType = Get-ObjectPropertyValue -Value $fields -Name "System.WorkItemType"
            title = Get-ObjectPropertyValue -Value $fields -Name "System.Title"
            state = Get-ObjectPropertyValue -Value $fields -Name "System.State"
            tags = Get-ObjectPropertyValue -Value $fields -Name "System.Tags"
        }
    }

    return @($rows)
}

function Get-ClassificationNodePaths {
    param([AllowNull()][object] $Node)

    $paths = @()
    foreach ($item in @(Get-ArrayValues $Node)) {
        if ($null -eq $item) {
            continue
        }
        $path = [string] (Get-ObjectPropertyValue -Value $item -Name "path")
        if ([string]::IsNullOrWhiteSpace($path)) {
            $path = [string] (Get-ObjectPropertyValue -Value $item -Name "name")
        }
        if (-not [string]::IsNullOrWhiteSpace($path)) {
            $paths += $path
        }
        $children = Get-ObjectPropertyValue -Value $item -Name "children"
        if ($null -ne $children) {
            $paths += @(Get-ClassificationNodePaths -Node $children)
        }
    }

    return @($paths)
}

function Get-WorkItemField {
    param(
        [object] $WorkItem,
        [string] $FieldName
    )

    $property = $WorkItem.fields.PSObject.Properties[$FieldName]
    if ($null -eq $property) {
        return $null
    }

    return [string] $property.Value
}

function Get-WorkItemTeamProject {
    param([int] $WorkItemId)

    $workItem = Invoke-AzJson (Add-OrgArgs @("boards", "work-item", "show", "--id", ([string] $WorkItemId)))
    if ($null -eq $workItem -or $null -eq $workItem.fields) {
        throw "Could not read work item $WorkItemId before a project-scoped write."
    }

    $teamProject = $workItem.fields.'System.TeamProject'
    if ([string]::IsNullOrWhiteSpace($teamProject)) {
        throw "Work item $WorkItemId did not return System.TeamProject before a project-scoped write."
    }

    return [string] $teamProject
}

function Assert-WorkItemInProject {
    param(
        [int] $WorkItemId,
        [string] $Name
    )

    $teamProject = Get-WorkItemTeamProject $WorkItemId
    if ($teamProject -ne $Project) {
        throw "$Name $WorkItemId belongs to project '$teamProject', expected '$Project'. Refusing to write."
    }
}

function Assert-WorkItemsInProject {
    param(
        [int[]] $WorkItemIds,
        [string] $Name
    )

    foreach ($workItemId in $WorkItemIds) {
        Assert-WorkItemInProject -WorkItemId $workItemId -Name $Name
    }
}

function Get-VerifiedWorkItem {
    param(
        [int] $WorkItemId,
        [string] $Name
    )

    $workItem = Get-WorkItem -WorkItemId $WorkItemId
    $teamProject = Get-WorkItemField -WorkItem $workItem -FieldName "System.TeamProject"
    if ($teamProject -ne $Project) {
        throw "$Name $WorkItemId belongs to project '$teamProject', expected '$Project'. Refusing to write."
    }

    return $workItem
}

function Test-SupportsValueArea {
    param([string] $WorkItemType)

    return @("Epic", "Feature", "User Story") -contains $WorkItemType
}

function Test-SupportsAcceptanceCriteria {
    param([string] $WorkItemType)

    return $WorkItemType -eq "User Story"
}

function Assert-NoRichTextInFieldArguments {
    foreach ($fieldArgument in $Field) {
        if (
            $fieldArgument -like "System.Description=*" -or
            $fieldArgument -like "Microsoft.VSTS.Common.AcceptanceCriteria=*"
        ) {
            throw "Do not pass Description or AcceptanceCriteria through -Field. Use -Description/-DescriptionPath and -AcceptanceCriteria/-AcceptanceCriteriaPath so the script can verify rich text."
        }
    }
}

function Assert-RichTextSaved {
    param(
        [object] $WorkItem,
        [string] $FieldName,
        [string] $ExpectedValue,
        [string] $DisplayName
    )

    $expected = ConvertTo-AdoRichTextArgument $ExpectedValue
    if ([string]::IsNullOrWhiteSpace($expected)) {
        return
    }

    $saved = Get-WorkItemField -WorkItem $WorkItem -FieldName $FieldName
    if ([string]::IsNullOrWhiteSpace($saved)) {
        throw "$DisplayName was not saved on work item $($WorkItem.id)."
    }

    if ($expected.Length -ge 80) {
        $minimumLength = [Math]::Floor($expected.Length * 0.60)
        if ($saved.Length -lt $minimumLength) {
            throw "$DisplayName looks truncated on work item $($WorkItem.id): saved length $($saved.Length), expected at least $minimumLength."
        }
    }
}

function Set-WorkItemRichText {
    param(
        [int] $WorkItemId,
        [string] $DescriptionValue,
        [string] $AcceptanceCriteriaValue
    )

    $descriptionArgument = ConvertTo-AdoRichTextArgument $DescriptionValue
    $acceptanceCriteriaArgument = ConvertTo-AdoRichTextArgument $AcceptanceCriteriaValue
    if ([string]::IsNullOrWhiteSpace($descriptionArgument) -and [string]::IsNullOrWhiteSpace($acceptanceCriteriaArgument)) {
        return Get-WorkItem -WorkItemId $WorkItemId
    }

    $workItem = Get-WorkItem -WorkItemId $WorkItemId
    $workItemType = Get-WorkItemField -WorkItem $workItem -FieldName "System.WorkItemType"
    if (-not [string]::IsNullOrWhiteSpace($acceptanceCriteriaArgument) -and -not (Test-SupportsAcceptanceCriteria $workItemType)) {
        throw "Acceptance criteria is only supported for User Story work items in this project. Work item $WorkItemId is '$workItemType'."
    }

    $arguments = Add-OrgArgs @("boards", "work-item", "update", "--id", ([string] $WorkItemId))
    if (-not [string]::IsNullOrWhiteSpace($descriptionArgument)) {
        $arguments += @("--description", $descriptionArgument)
    }
    if (-not [string]::IsNullOrWhiteSpace($acceptanceCriteriaArgument)) {
        $arguments += @("--fields", "Microsoft.VSTS.Common.AcceptanceCriteria=$acceptanceCriteriaArgument")
    }

    Invoke-AzJson $arguments | Out-Null

    $updated = Get-WorkItem -WorkItemId $WorkItemId
    Assert-RichTextSaved -WorkItem $updated -FieldName "System.Description" -ExpectedValue $DescriptionValue -DisplayName "Description"
    Assert-RichTextSaved -WorkItem $updated -FieldName "Microsoft.VSTS.Common.AcceptanceCriteria" -ExpectedValue $AcceptanceCriteriaValue -DisplayName "Acceptance criteria"

    return $updated
}

function Get-TypedCreateFields {
    param([string] $WorkItemType)

    $fields = @()
    if (Test-SupportsValueArea $WorkItemType) {
        $fields += "Microsoft.VSTS.Common.ValueArea=Business"
    }
    if ($Priority -gt 0) {
        $fields += "Microsoft.VSTS.Common.Priority=$Priority"
    }

    $trackingTags = Get-TrackingTags
    if (-not [string]::IsNullOrWhiteSpace($trackingTags)) {
        $fields += "System.Tags=$trackingTags"
    }
    if ($storyPointsProvided) {
        if ($WorkItemType -ne "User Story") {
            throw "-StoryPoints is only supported for CreateStory and User Story updates."
        }
        $fields += "Microsoft.VSTS.Scheduling.StoryPoints=$StoryPoints"
    }
    if ($remainingWorkProvided) {
        if ($WorkItemType -ne "Task") {
            throw "-RemainingWork is only supported for CreateTask and Task updates."
        }
        $fields += "Microsoft.VSTS.Scheduling.RemainingWork=$RemainingWork"
    }

    return $fields
}

function Get-TypedUpdateFields {
    param([string] $WorkItemType)

    $fields = @()
    if ($priorityProvided) {
        $fields += "Microsoft.VSTS.Common.Priority=$Priority"
    }
    if ($storyPointsProvided) {
        if ($WorkItemType -ne "User Story") {
            throw "-StoryPoints is only supported for CreateStory and User Story updates."
        }
        $fields += "Microsoft.VSTS.Scheduling.StoryPoints=$StoryPoints"
    }
    if ($remainingWorkProvided) {
        if ($WorkItemType -ne "Task") {
            throw "-RemainingWork is only supported for CreateTask and Task updates."
        }
        $fields += "Microsoft.VSTS.Scheduling.RemainingWork=$RemainingWork"
    }

    return $fields
}

function Select-WorkItemCommentSummary {
    param([object] $Comment)

    $commentId = Get-ObjectPropertyValue -Value $Comment -Name "id"
    if ($null -eq $commentId) {
        $commentId = Get-ObjectPropertyValue -Value $Comment -Name "commentId"
    }

    [ordered]@{
        workItemId = Get-ObjectPropertyValue -Value $Comment -Name "workItemId"
        id = $commentId
        commentId = $commentId
        version = Get-ObjectPropertyValue -Value $Comment -Name "version"
        isDeleted = Get-ObjectPropertyValue -Value $Comment -Name "isDeleted"
        text = Get-ObjectPropertyValue -Value $Comment -Name "text"
        createdDate = Get-ObjectPropertyValue -Value $Comment -Name "createdDate"
        modifiedDate = Get-ObjectPropertyValue -Value $Comment -Name "modifiedDate"
    }
}

function New-WorkItem {
    param([ValidateSet("Epic", "Feature", "User Story", "Task")][string] $Type)

    Require-WriteApproval
    Require-Value $Title "Title"
    Assert-NoRichTextInFieldArguments

    $resolvedDescription = Read-TextInput -Value $Description -Path $DescriptionPath -Name "Description"
    $resolvedAcceptanceCriteria = Read-TextInput -Value $AcceptanceCriteria -Path $AcceptanceCriteriaPath -Name "AcceptanceCriteria"
    if (-not [string]::IsNullOrWhiteSpace($resolvedAcceptanceCriteria) -and -not (Test-SupportsAcceptanceCriteria $Type)) {
        throw "Acceptance criteria is only supported for User Story work items in this project."
    }

    $fields = @(Get-TypedCreateFields -WorkItemType $Type)
    $fields += $Field

    $arguments = Add-BoardsArgs @("boards", "work-item", "create", "--type", $Type, "--title", $Title)
    if (-not [string]::IsNullOrWhiteSpace($Discussion)) {
        $arguments += @("--discussion", $Discussion)
    }
    if (-not [string]::IsNullOrWhiteSpace($Area)) {
        $arguments += @("--area", $Area)
    }
    if (-not [string]::IsNullOrWhiteSpace($Iteration)) {
        $arguments += @("--iteration", $Iteration)
    }
    if ($fields.Count -gt 0) {
        $arguments += @("--fields") + $fields
    }

    if ($PSCmdlet.ShouldProcess("$Type '$Title'", "Create Azure Boards work item")) {
        $created = Invoke-AzJson $arguments
        if ($null -eq $created -or $created.id -le 0) {
            throw "Azure Boards did not return a created work item id."
        }

        Set-WorkItemRichText -WorkItemId ([int] $created.id) -DescriptionValue $resolvedDescription -AcceptanceCriteriaValue $resolvedAcceptanceCriteria
    }
}

# azure-devops CLI extension 1.0.3 rejects preview versions with a revision suffix: it strips
# "-preview" and fails on float("7.1.4"). The server resolves "7.1-preview" to the latest
# preview revision, so use the suffix-free form with az devops invoke.
$script:WorkItemCommentsApiVersion = "7.1-preview"

function Get-WorkItemComments {
    param([int] $WorkItemId)

    $response = Invoke-AzJson (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "comments", "--route-parameters", "project=$Project", "workItemId=$WorkItemId", "--api-version", $script:WorkItemCommentsApiVersion))
    if ($null -eq $response) {
        return [ordered]@{
            workItemId = $WorkItemId
            count = 0
            totalCount = 0
            comments = @()
        }
    }
    if ($response.PSObject.Properties.Name -contains "comments") {
        return [ordered]@{
            workItemId = $WorkItemId
            count = Get-ObjectPropertyValue -Value $response -Name "count"
            totalCount = Get-ObjectPropertyValue -Value $response -Name "totalCount"
            comments = @($response.comments | ForEach-Object { Select-WorkItemCommentSummary $_ })
        }
    }

    return $response
}

function Add-WorkItemComment {
    param(
        [int] $WorkItemId,
        [string] $Text
    )

    $response = Invoke-AzJsonWithBody -Arguments (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "comments", "--route-parameters", "project=$Project", "workItemId=$WorkItemId", "--http-method", "POST", "--api-version", $script:WorkItemCommentsApiVersion)) -Body @{ text = $Text }
    return Select-WorkItemCommentSummary $response
}

function Update-WorkItemComment {
    param(
        [int] $WorkItemId,
        [int] $CommentId,
        [string] $Text
    )

    $response = Invoke-AzJsonWithBody -Arguments (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "comments", "--route-parameters", "project=$Project", "workItemId=$WorkItemId", "commentId=$CommentId", "--http-method", "PATCH", "--api-version", $script:WorkItemCommentsApiVersion)) -Body @{ text = $Text }
    return Select-WorkItemCommentSummary $response
}

function Remove-WorkItemComment {
    param(
        [int] $WorkItemId,
        [int] $CommentId
    )

    $response = Invoke-AzJson (Add-InvokeArgs @("devops", "invoke", "--area", "wit", "--resource", "comments", "--route-parameters", "project=$Project", "workItemId=$WorkItemId", "commentId=$CommentId", "--http-method", "DELETE", "--api-version", $script:WorkItemCommentsApiVersion))
    if ($null -eq $response) {
        return [ordered]@{
            workItemId = $WorkItemId
            id = $CommentId
            commentId = $CommentId
            version = $null
            isDeleted = $true
            text = $null
            createdDate = $null
            modifiedDate = $null
        }
    }

    $summary = Select-WorkItemCommentSummary $response
    if ($null -eq $summary["isDeleted"]) {
        $summary["isDeleted"] = $true
    }

    return $summary
}
