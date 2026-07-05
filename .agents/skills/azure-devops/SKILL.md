---
name: azure-devops
description: Work with Azure DevOps Boards and Azure Repos workflows across adopting repositories. Use when Codex needs to read, create, update, comment on, link, transition, or clean up Azure Boards work items; inspect or update Azure Repos pull requests; link work items to PRs; write PR descriptions or comments; prepare PR completion or merge steps; troubleshoot Azure DevOps CLI and REST API usage; or capture resolved Azure DevOps failures as durable skill, reference, or wrapper improvements.
---

# Azure DevOps

## Overview

Use this skill for backlog and PR work in Azure DevOps. Prefer Azure CLI commands for
common read-only operations, use the bundled wrappers for writes and known CLI gaps, and keep
every created test artifact traceable.

No Azure DevOps organization is hardcoded. Pass `-Org`, set `AZURE_DEVOPS_ORG`, or run from an
Azure Repos checkout whose `origin` or `upstream` remote contains the organization. Project and
repository are resolved the same way through explicit parameters, `AZURE_DEVOPS_PROJECT`,
`AZURE_DEVOPS_REPOSITORY`, or the Azure Repos remote.

Load only the reference that matches the current operation:

| Operation | Load |
|---|---|
| First-use configuration, context resolution, API versions, or failure learning | [references/context-and-learning.md](references/context-and-learning.md) |
| Work items, backlog slicing, rich text, comments, links, or cleanup | [references/boards.md](references/boards.md) |
| Pull requests, PR descriptions, inline review comments, or reviewer votes | [references/prs.md](references/prs.md) |
| Any failing or hanging Azure DevOps call | [references/troubleshooting.md](references/troubleshooting.md) |

Read actions return compact summaries by default; add `-Raw` only when a field is missing from
the summary. When any Azure DevOps call fails or times out, read
[references/troubleshooting.md](references/troubleshooting.md) before experimenting with
alternative commands.

## Guardrails

- Default to read-only discovery before writing anything.
- Ask for explicit user approval before creating branches, commits, pushes, PRs, PR completion,
  work item deletion, destructive cleanup, or status changes that affect real backlog flow.
- Never log or commit tokens, credentials, authorization headers, raw customer data, raw OCR
  text, prompts, raw personal data, PII, identity objects, or other secrets.
- Use a unique marker tag for temporary artifacts, for example
  `codex-skill-test-YYYYMMDD-short-scope`.
- Track every created Azure DevOps artifact by ID, URL, marker, and cleanup command.
- Use literal project filters in WIQL: `System.TeamProject = '<project>'`. Do not rely on
  `@project` when cleanup precision matters.
- Do not persist first-use answers in repository files unless the user explicitly approves the
  target file. Prefer environment variables, shell profile entries, or Azure DevOps CLI
  defaults for local-only configuration.
- Do not guess REST API versions or Azure CLI behavior from memory. Use explicit
  documentation-backed versions, prefer stable `7.1` endpoints when available, and use precise
  preview revisions when Microsoft documents them for that resource.

## Failure Learning Loop

When an Azure DevOps operation fails and the task uncovers a reusable fix, treat the resolution
as a candidate skill improvement. Use
[context-and-learning.md#failure-learning-update-pattern](references/context-and-learning.md#failure-learning-update-pattern)
as the canonical checklist for evidence, sanitization, target selection, and reporting.

Core gates:

1. Verify the fix before documenting it.
2. Do not update this skill for one-off auth problems, transient outages, local machine state,
   project-specific process fields, or unverified workarounds. Report those as local findings.
3. This skill is distributed through a user-scope junction, so these files are the standards
   repository working tree even when the session runs in another repository. Mid-task, append
   a structured entry to [LEARNINGS.md](LEARNINGS.md) instead of authoring the full patch.
   Author durable patches to `SKILL.md`, `references/`, or `scripts/` only with user approval,
   on a dedicated standards-repository branch, never mixed into the product repository task.
4. After a skill update, run the standards repository quality gate with
   `node scripts/validate.mjs`. If PowerShell scripts changed and PowerShell is available, also
   run `.\scripts\validate.ps1` for parse checks; if a live Azure DevOps write was needed for
   validation, use a marker tag and report cleanup commands.

## First Use

1. Confirm local configuration and channel health:

   ```powershell
   .\.agents\skills\azure-devops\scripts\ado-work-items.ps1 -Action Context
   .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Context
   .\.agents\skills\azure-devops\scripts\ado-work-items.ps1 -Action Doctor
   .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Doctor
   ```

   `Doctor` reports each transport channel as ok or fail with the next step. A failed REST
   bearer channel is degraded but not fatal; the wrappers prefer the CLI channels.

2. If `Context` cannot resolve the organization, project, or repository, ask the user for:

   - Azure DevOps organization URL;
   - Azure DevOps project name;
   - repository name when PR work is needed;
   - default branch when it is not `main`.

3. Use one of these non-secret configuration paths:

   ```powershell
   $env:AZURE_DEVOPS_ORG = "https://dev.azure.com/<organization>"
   $env:AZURE_DEVOPS_PROJECT = "<project>"
   $env:AZURE_DEVOPS_REPOSITORY = "<repository>"
   ```

   or pass `-Org`, `-Project`, and `-Repository` on each wrapper call. If the user wants a
   durable project default, `az devops configure --defaults organization=<org> project=<project>`
   is acceptable local machine state, not repository state.

## Boards Workflow

Use Azure CLI first for read-only work. Use `scripts/ado-work-items.ps1` for writes so rich
text, comments, hierarchy links, project checks, and cleanup follow the same guardrails. Read
[boards.md](references/boards.md) before work item writes, backlog slicing, rich text updates,
comments, links, or cleanup.

Wrapper actions for work items:

- `Context`, `Metadata`, `QueryByMarker`, `Show`, `Comments`
- `CreateEpic`, `CreateFeature`, `CreateStory`, `CreateTask`
- `Update`
- `LinkChild`
- `AddComment`, `UpdateComment`, `DeleteComment`
- `Delete`

## PR Workflow

Use read-only PR commands before making changes. Read [prs.md](references/prs.md) before PR
writes, inline review comments, reviewer votes, or PR metadata changes.

Before creating or completing a PR, follow the repository change protocol:

1. Inspect `git status --short --branch`.
2. Protect unrelated user work.
3. Create or reuse an approved focused branch.
4. Commit only files belonging to the task.
5. Run the documented quality gate.
6. Ask before push, PR creation, PR completion, or merge unless the user already explicitly
   requested that operation.

Before publishing review findings or casting approve in a review workflow, check whether the
authenticated Azure DevOps user created the PR:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action SelfReviewStatus -PrId <pr-id> -Project <project> -Repository <repository>
```

If `isSelfReview` is `true`, report findings or a clean review locally. Do not publish review
findings as PR comments and do not cast reviewer votes on self-created PRs. The wrapper also
blocks `AddInlineComment`, `Approve`, and non-reset `SetReviewerVote` in that case.

## References

- [references/context-and-learning.md](references/context-and-learning.md) - context resolution,
  API versions, and durable failure-learning updates.
- [references/boards.md](references/boards.md) - Azure Boards work items, backlog slicing, rich
  text, comments, links, and cleanup.
- [references/prs.md](references/prs.md) - Azure Repos pull request commands, comments, and
  reviewer votes.
- [references/troubleshooting.md](references/troubleshooting.md) - symptom to next-step table
  for failing or hanging Azure DevOps calls.
- [LEARNINGS.md](LEARNINGS.md) - mid-task learnings inbox; consolidated into durable updates
  in the standards repository.
- [scripts/ado-work-items.ps1](scripts/ado-work-items.ps1) - public work item CLI dispatcher.
- [scripts/ado-prs.ps1](scripts/ado-prs.ps1) - safer wrappers for PR inspect/update/comment/link
  operations, including self-review detection.
- [scripts/ado-common.ps1](scripts/ado-common.ps1) - shared plumbing: hang-proof az calls,
  HTML detection, context resolution, doctor checks.
- [scripts/ado-work-items-common.ps1](scripts/ado-work-items-common.ps1) and
  [scripts/ado-work-items-api.ps1](scripts/ado-work-items-api.ps1) - dot-sourced helper files
  for work item create/read/update/link/comment/delete operations.
- [scripts/ado-prs-common.ps1](scripts/ado-prs-common.ps1) and
  [scripts/ado-prs-api.ps1](scripts/ado-prs-api.ps1) - dot-sourced helpers used by
  `ado-prs.ps1`.
- [scripts/ado-prs-self-review.ps1](scripts/ado-prs-self-review.ps1) - dot-sourced helper for
  PR creator detection and self-review publishing guards.

## Navigation

- Skills index: [../README.md](../README.md)
- Troubleshooting: [references/troubleshooting.md](references/troubleshooting.md)
- Repository docs: [../../../docs/INDEX.md](../../../docs/INDEX.md)
