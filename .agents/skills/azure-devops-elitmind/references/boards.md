# Azure Boards Reference

Use this reference for Azure Boards work items, backlog slicing, rich text fields, comments,
hierarchy links, and cleanup.

## Contents

- [Boards Metadata](#boards-metadata)
- [Backlog Slicing For Codex](#backlog-slicing-for-codex)
- [Work Item Rich Text Safety](#work-item-rich-text-safety)
- [Reliable Board Commands](#reliable-board-commands)
- [Known Board Pitfalls](#known-board-pitfalls)
- [Cleanup Pattern](#cleanup-pattern)
- [Navigation](#navigation)

Wrapper read actions return compact summaries by default. Add `-Raw` only when a field is
missing from the summary.

## Boards Metadata

Always inspect process metadata before making writes in a new project:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action Metadata -Project <project>
az devops invoke --area wit --resource workItemTypes --route-parameters project=<project> --api-version 7.1 --org https://dev.azure.com/Elitmindvs -o json
```

Common Azure DevOps work item types:

| Type | Reference name |
|---|---|
| `Epic` | `Microsoft.VSTS.WorkItemTypes.Epic` |
| `Feature` | `Microsoft.VSTS.WorkItemTypes.Feature` |
| `User Story` | `Microsoft.VSTS.WorkItemTypes.UserStory` |
| `Bug` | `Microsoft.VSTS.WorkItemTypes.Bug` |
| `Task` | `Microsoft.VSTS.WorkItemTypes.Task` |
| `Issue` | `Microsoft.VSTS.WorkItemTypes.Issue` |

Common hierarchy for Agile-style projects:

```text
Epic -> Feature -> User Story -> Task
```

Treat this hierarchy as a default, not a guarantee. Confirm area paths, iteration paths,
states, required fields, and custom fields with `Metadata` before writing.

Useful optional fields:

| Purpose | Field | Common type support |
|---|---|---|
| Description | `System.Description` | Epic, Feature, User Story, Task, Bug |
| Tags | `System.Tags` | Most types |
| Priority | `Microsoft.VSTS.Common.Priority` | Most types |
| Story points | `Microsoft.VSTS.Scheduling.StoryPoints` | User Story, sometimes Bug |
| Acceptance criteria | `Microsoft.VSTS.Common.AcceptanceCriteria` | User Story |
| Remaining work | `Microsoft.VSTS.Scheduling.RemainingWork` | Task |

## Backlog Slicing For Codex

When slicing User Stories into implementation tasks for Codex, use larger coherent tasks than
classic software delivery would use. A task should be one practical Codex job: one bounded
context, one vertical backend/API slice, one frontend workflow, or one connected implementation
step with tests and documentation.

Do not create separate backend tasks for create/list/update/deactivate/delete operations when
they all touch the same router, schemas, application service, repository, tests, and docs. In
that case, prefer one CRUD/lifecycle task. Split only when the work crosses ownership
boundaries, depends on unresolved product decisions, needs separate approvals, or is too large
to finish and verify in one Codex job.

Never add a `codex-sized` Azure Boards tag. Keep Codex sizing guidance in the title,
description, acceptance criteria, or comments when needed, not in tags.

## Work Item Rich Text Safety

For work item `System.Description` and `Microsoft.VSTS.Common.AcceptanceCriteria`, do not pass
multiline strings directly to `az boards work-item create --description`, `az boards work-item
update --description`, or `--fields "Microsoft.VSTS.Common.AcceptanceCriteria=..."`.
On Windows/PowerShell and the Azure DevOps CLI extension, multiline rich text can be silently
truncated or dropped while the command still exits successfully.

When creating or updating real work items with non-trivial Description or Acceptance Criteria:

1. Write rich HTML to temporary files. Use inline text only for simple plain-text values.
2. Prefer `scripts/ado-work-items.ps1` with `-DescriptionPath` and
   `-AcceptanceCriteriaPath`; the wrapper normalizes rich text, writes it after creation when
   needed, and verifies the saved fields by reading the work item back.
3. After every write, read the work item and verify description, parent, iteration, state,
   owner, tags, comment count, and acceptance criteria when the item type supports it.
4. If verification shows an empty or suspiciously short field, fix it immediately and report
   the correction.

## Reliable Board Commands

Show a work item and relations:

```powershell
az boards work-item show --id <id> --expand relations --org https://dev.azure.com/Elitmindvs -o json
```

Create or update work items with non-trivial Description or Acceptance Criteria through the
wrapper, not raw multiline `az boards work-item create/update` arguments:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 `
  -Action CreateStory `
  -Project "<project>" `
  -Title "<title>" `
  -DescriptionPath "$env:TEMP\story-description.html" `
  -AcceptanceCriteriaPath "$env:TEMP\story-ac.html" `
  -Area "<area-path>" `
  -Iteration "<iteration-path>" `
  -Tags "codex-skill-test; <marker>" `
  -StoryPoints 5 `
  -AllowWrite
```

Verify rich text after every write:

```powershell
$wi = az boards work-item show --id <id> --org https://dev.azure.com/Elitmindvs -o json | ConvertFrom-Json
($wi.fields.'System.Description').Length
($wi.fields.'Microsoft.VSTS.Common.AcceptanceCriteria').Length
```

Read comments:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action Comments -Id <id> -Project <project>
az devops invoke --area wit --resource comments --route-parameters project=<project> workItemId=<id> --api-version 7.1-preview --org https://dev.azure.com/Elitmindvs -o json
```

Add, update, and delete comments through the wrapper. It returns identity-stripped comment
summaries without Azure DevOps identity objects from the raw REST response. The `text` field
still contains raw comment content; review and redact it before using it in reports, findings,
or skill-learning notes:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action AddComment -Id <id> -CommentPath "$env:TEMP\comment.md" -Project <project> -AllowWrite
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action UpdateComment -Id <id> -CommentId <comment-id> -CommentPath "$env:TEMP\comment-updated.md" -Project <project> -AllowWrite
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action DeleteComment -Id <id> -CommentId <comment-id> -Project <project> -ConfirmDelete -AllowWrite
```

Create parent-child relations from the parent:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action LinkChild -ParentId <parent-id> -ChildId <child-id> -Project <project> -AllowWrite
```

Query by test marker:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action QueryByMarker -Marker "<marker>" -Project <project>
```

## Known Board Pitfalls

- `az boards query` does not support `--top`; put limits into WIQL only if the server accepts
  them, or filter after JSON parsing.
- JMESPath queries against fields with dots can be awkward in PowerShell. Prefer
  `ConvertFrom-Json` and access fields as `$item.fields.'System.Title'`.
- `az boards query` returns flat results only; use `az boards work-item show --expand relations`
  for parent-child detail.
- Do not pass multiline work item `System.Description` or
  `Microsoft.VSTS.Common.AcceptanceCriteria` directly to raw `az boards work-item
  create/update`. The CLI can silently save only the first paragraph or drop Acceptance Criteria
  while returning success.
- Do not pass Description or Acceptance Criteria through the wrapper's generic `-Field`
  parameter. The wrapper intentionally rejects those fields so it can perform rich-text
  verification.
- Confirm whether `Microsoft.VSTS.Common.AcceptanceCriteria`,
  `Microsoft.VSTS.Scheduling.StoryPoints`, and `Microsoft.VSTS.Scheduling.RemainingWork` are
  supported by the target process before writing them.
- Work item comments are a preview REST resource. With `az devops invoke`, use the suffix-free
  `7.1-preview` version: azure-devops CLI extension 1.0.3 rejects revision suffixes such as
  `7.1-preview.4` with a float parse error. The server resolves `7.1-preview` to the latest
  preview revision.
- Windows PowerShell `Set-Content -Encoding UTF8` writes a BOM. When using `az devops invoke
  --in-file` for supported resources, write JSON with
  `[System.IO.File]::WriteAllText($path, $json, [System.Text.UTF8Encoding]::new($false))`.

## Cleanup Pattern

For temporary work item tests:

1. Add tags `codex-skill-test; <unique-marker>`.
2. Include the marker in every comment.
3. Report created IDs and URLs immediately.
4. Delete reversible artifacts with:

   ```powershell
   .\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action Delete -Id <id> -Project <project> -ConfirmDelete -AllowWrite
   ```

5. Use `-Destroy` only when the user explicitly requests permanent deletion.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Context and learning: [context-and-learning.md](context-and-learning.md)
- Pull request reference: [prs.md](prs.md)
- Troubleshooting: [troubleshooting.md](troubleshooting.md)
- Skills index: [../../README.md](../../README.md)
