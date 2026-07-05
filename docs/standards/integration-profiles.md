# Integration Profiles Standard

Integration profiles describe how an adopting repository records external workflow choices.
They are documentation contracts first. They do not require live service access during
adoption, and they do not authorize agents to perform writes unless the target repository and
user instruction allow those writes.

## Automation Coverage

Supported profile means VibeRails can record the decision and guide agents through the
provider safely. It does not always mean VibeRails ships a complete automation wrapper.

| Profile combination | Current automation status |
|---|---|
| Azure Boards + Azure Repos | Optional Codex skills include PowerShell Azure DevOps wrappers for work items and PR review. |
| Azure Boards + GitHub | Azure Boards skill support is available; GitHub PR review defaults to local-diff review. |
| Jira + GitHub | Documentation and manifest contract are supported; Jira ticket writes and GitHub inline review publishing require target-local connector or wrapper decisions. |
| Jira + Azure Repos | Documentation and manifest contract are supported; Jira ticket writes require target-local connector or wrapper decisions. |

If a selected provider has no bundled wrapper for the requested write, record the target-local
connector, CLI command, or explicit manual-only policy in `.viberails/adoption.json`.

## Selection Rules

- Select profiles from target repository evidence or user confirmation.
- Do not infer profiles from the VibeRails source repository.
- Record `none` when a target repository deliberately has no provider for an area.
- Record auth setup without secrets.
- Record uncertainty in `docs/viberails-adoption.md` and `.viberails/adoption.json`.

## Work Tracking Profiles

| Profile | Use when |
|---|---|
| `azure-devops-work-tracking` | Work is planned in Azure Boards. |
| `jira-work-tracking` | Work is planned in Jira. |
| `unsupported-provider` | A real tracker exists but VibeRails has no first-class profile for it yet. |
| `none` | The repository intentionally does not use a work tracker. |

### Azure DevOps Work Tracking

Record:

- organization URL
- project name
- default work item types for Story, Task, Bug, and self-improve ticket
- area path and iteration policy when relevant
- labels/tags used for VibeRails adoption and self-improvement
- read command for checking auth and project access
- write approval rule for creating or commenting on work items
- self-improve dedupe query command or WIQL template
- self-improve create and comment command, wrapper, or target-local doc link

Do not guess organization, project, area path, iteration, or work item type.

### Jira Work Tracking

Record:

- Jira base URL or cloud site identifier
- project key
- default issue types for Story, Task, Bug, and self-improve ticket
- labels/components used for VibeRails adoption and self-improvement
- query used to find existing self-improve issues
- read command for checking auth and project access
- write approval rule for creating or commenting on issues
- self-improve create and comment command, connector, or target-local doc link

Do not guess project key, board, sprint, issue type, component, or transition names.

## Code Hosting Profiles

| Profile | Use when |
|---|---|
| `github-code-hosting` | Git remotes and PRs are hosted in GitHub. |
| `azure-repos-code-hosting` | Git remotes and PRs are hosted in Azure Repos. |
| `unsupported-provider` | A real code host exists but VibeRails has no first-class profile for it yet. |
| `none` | The repository intentionally has no remote or PR host. |

### GitHub Code Hosting

Record:

- repository owner and name
- default branch
- branch naming convention
- PR target branch
- whether draft PRs are default
- auth check command, usually `gh auth status`
- allowed `gh` write operations, if any

Do not assume GitHub Issues is the work tracker unless the target repository says so. For this
version of VibeRails, work tracking profiles are Azure Boards, Jira, or `none`.

If the target repository uses GitHub for code hosting and Jira or Azure Boards for tracking,
record both profiles separately. GitHub PR review publishing is not a default VibeRails skill
workflow yet; local-diff review is supported.

### Azure Repos Code Hosting

Record:

- organization URL
- project name
- repository name
- default branch
- branch naming convention
- PR target branch
- whether draft PRs are default
- auth check command for `az devops` or the repository's chosen wrapper
- allowed PR write operations, if any

Do not reuse Azure Boards settings as Azure Repos settings unless the target repository records
that they are the same project.

## Auth Documentation

Each selected profile must point to target-local auth instructions. The instructions should
cover:

- required CLI or connector
- read-only auth check
- write auth check when writes are allowed
- expected environment variables by name only
- where tokens must be stored outside git
- what error means "not authenticated"

Never commit token values, cookies, generated credential files, raw user profiles, or private
identity payloads.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Self-improve loop](self-improve-loop.md)
