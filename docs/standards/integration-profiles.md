# Integration Profiles Standard

Integration profiles describe how an adopting repository records external workflow choices.
They are documentation contracts first. They do not require live service access during
adoption, and they do not authorize agents to perform writes unless the target repository and
user instruction allow those writes.

## Automation Coverage

A profile guides agents through the connected provider MCP. Azure DevOps and Jira use MCP
only; VibeRails does not ship command wrappers for them or fall back to CLI/raw REST. Available
operations and permissions must be discovered in the current client, not assumed from a profile.

| Profile combination | Current automation status |
|---|---|
| Azure Boards + Azure Repos | Optional skills use connected Azure DevOps MCP operations for work items and PRs. Missing operations remain explicit capability gaps. |
| Azure Boards + GitHub | Azure Boards uses MCP; GitHub uses its independently selected code-host path, with local-diff review supported. |
| Jira + GitHub | Jira uses connected MCP operations; GitHub PR delivery/review remains a separate code-host choice. |
| Jira + Azure Repos | Tracker and code-host operations use their respective MCP connections and permissions. |
| No tracker | A user brief and existing local task/branch/PR evidence are sufficient; no tracker setup is required. |

If the required Azure DevOps/Jira MCP operation is missing, identify the blocked action and
continue independent work. Do not install a wrapper or substitute a CLI/raw-API write. Preserve
existing manifest shapes; record the capability/authority gap in existing task or adoption notes.

## Selection Rules

- Select profiles from target repository evidence or user confirmation.
- Do not infer profiles from the VibeRails source repository.
- Record `none` when a target repository deliberately has no provider for an area.
- Record auth setup without secrets.
- Record uncertainty in `docs/viberails-adoption.md` and `.viberails/adoption.json`.

## Operation Readiness And Recovery

Read when selecting an integration operation or diagnosing a failed/ambiguous call. The
[task lifecycle and authority](change-protocol.md#authorization-and-delivery) are independent
of tracker, code host and transport. For Azure DevOps and Jira, use only their connected MCP
operations. Other providers retain their explicitly selected transport. Do not assume all MCP
connections expose the same operations, revision protection or authenticated identity.

| Observed problem | Check before choosing a next action |
|---|---|
| Environment/checkout | Correct repository, worktree, branch, shell/runtime and safe local state. |
| Configuration | Explicit selected provider, coordinates and operation inputs; do not guess identities. |
| Tool unavailable | Actual runtime tool/client inventory, not a link or a previously installed name. |
| Connection/startup failure | Whether the chosen client can establish a connection; distinguish it from denied access. |
| Authorization failure | Current task authority and actual account permissions; neither tool access nor a flag grants consent. |
| Operation unsupported | Required operation and revision/CI capabilities in this client; an available provider does not imply them. |

Keep errors, successful empty reads and successful no-content writes distinct. Inspect exit/
status/error evidence; never turn a failed query into "nothing exists". Reuse safe read results
while their inputs remain valid. Retry only for a concrete recoverable cause, with a small bound
chosen before retrying (normally one retry unless the provider/task specifies another). Stop
repeating the same failure and report the unresolved cause instead of trying unapproved clients.

After an ambiguous write, inspect authoritative remote state using the operation's existing
identity, revision, source/target or permitted marker before deciding whether to retry. A write
may have succeeded or partly succeeded. Found effects must be reused/reconciled, not duplicated;
unknown outcome stays unknown. An incomplete, stale or incorrectly scoped empty listing does
not establish absence. Retry a write only when absence or an idempotent retry is established
and the original operation/transport remains authorized.

For shared updates use provider revision/version preconditions when offered. If the chosen
MCP operation cannot express them, report the protected-update capability gap. Do not bypass
the MCP-only profile with a command or raw API request. On a conflict, reread and reconcile
before another guarded write. Readback confirms state; it does not prevent a lost update.
Do not invent unsupported conditional headers or atomicity for operations without such support.
Provider sections/references own exact API/tool details, caveats and workarounds.

With `workTracking: none`, use the user brief and existing local task/branch/PR record; no tracker
mutation is needed. With no code host, stop at the authorized local endpoint. A missing capability
blocks the dependent action, not unrelated implementation. Do not build a custom server, universal
adapter or orchestration engine to conceal a missing supported operation.

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
- read-only MCP operation for checking access to the intended project
- write approval rule for creating or commenting on work items
- self-improve dedupe query command or WIQL template
- self-improve create/comment MCP operations or target-local documentation link

Do not guess organization, project, area path, iteration, or work item type.

### Jira Work Tracking

Record:

- Jira base URL or cloud site identifier
- project key
- default issue types for Story, Task, Bug, and self-improve ticket
- labels/components used for VibeRails adoption and self-improvement
- query used to find existing self-improve issues
- read-only MCP operation for checking access to the intended project
- write approval rule for creating or commenting on issues
- self-improve create/comment MCP operations or target-local documentation link

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
version of VibeRails, work tracking profiles are Azure Boards, Jira, `unsupported-provider`,
or `none`.

If the target repository uses GitHub for code hosting and Jira, Azure Boards, or another real
tracker, record both profiles separately. Use `unsupported-provider` for a real tracker that
VibeRails does not model yet. GitHub PR review publishing is not a default VibeRails skill
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
- read-only MCP access/identity check for the intended repository
- allowed PR write operations, if any

Do not reuse Azure Boards settings as Azure Repos settings unless the target repository records
that they are the same project.

## Auth Documentation

Each selected profile must point to target-local auth instructions. The instructions should
cover:

- required MCP connection for Azure DevOps/Jira, or the selected client for other profiles
- read-only access check
- observed operation permissions when writes are authorized
- connection prerequisites without credentials
- where tokens must be stored outside git
- what error means "not authenticated"

Never commit token values, cookies, generated credential files, raw user profiles, or private
identity payloads.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Self-improve loop](self-improve-loop.md)
