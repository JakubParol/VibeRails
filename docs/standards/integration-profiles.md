# Integration Profiles Standard

Integration profiles describe how an adopting repository records external workflow choices.
They declare intended choices, not proof of live access or permission. Guided adoption helps
configure and check selected connections, unless access is explicitly deferred. It may complete
documentation with valid required values and a recorded access gap, never a false connection
claim. Provider writes still require both task authority and actual account permissions.

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

## MCP Connection Setup

Read when guided adoption selects Azure DevOps/Jira, or an approved connection needs setup.
[Guided Setup](adoption.md#guided-setup) owns questions and the user's approval. This section
owns execution; it is not another questionnaire or a VibeRails connection manager.

1. **Discover.** Inspect the current client's actual connection/tool inventory and the relevant
   non-secret settings. Reuse a suitable connection rather than creating one per repository.
   Do not infer readiness from a file, installed plugin or server name. Confirm the selected
   organization/project or Jira site/project; sharing credentials does not imply shared targets.
2. **Choose a supported route.** Verify the installed client, server edition/version and current
   official setup guide below. Keep an approved working route. For a new connection prefer the
   official hosted MCP when supported; a vendor-provided local stdio MCP requires its own approved
   prerequisites. On-premises editions are not automatically supported by cloud endpoints.
   Do not invent an endpoint from a project URL or build a proxy, provider CLI/REST fallback or
   wrapper. The client's MCP management commands configure MCP; they are not a provider bypass.
3. **Preview scope.** Identify the specific connection/config entry to add or adjust, project
   versus user scope, required login and any tool installation. Use the approved narrow scope;
   do not assume a CLI registration is project-local. Preserve other servers, security settings,
   credentials and skill installations. Never disable sandbox/trust checks to make setup work.
4. **Configure after approval.** Use supported client settings, its official connector/plugin UI,
   or its MCP management command if available. If the runtime cannot perform the change, provide
   the exact verified next UI action or command with known non-secret coordinates filled in.
   Do not claim it was executed. A restart or extra client capability may be necessary.
5. **Authenticate safely.** Start the supported OAuth/browser flow when approved and leave sign-in
   and consent to the user. Local servers may use their own documented interactive authentication
   instead of client-managed OAuth. Never request tokens, cookies or login codes in chat. Keep
   secret values in client credential storage or protected environment/secrets outside Git; only
   variable names and non-secret setup instructions belong in repository docs. Do not dump existing
   config, environment or private identity responses into logs to diagnose access.
6. **Verify through MCP.** After login/reload rediscover active operations and perform a small
   read of the selected project/repository. Check the response and coordinates; an empty listing,
   tool advertisement or installed server is not by itself proof of intended-resource access.
   Discover only relevant issue types or other workflow data with bounded fields/pagination.
   Do not create a ticket/comment/PR, change state or broaden permissions merely as a smoke test.
7. **Record and resume.** Use existing auth instructions and adoption readiness/open questions for
   client/server identity, configuration scope, selected resource, performed read, result and next
   action. Keep schema/coordinates in their current manifest owners, not copied into a second
   config record. Missing login, tool support or access blocks only dependent work. Reuse prior
   answers after restart and follow the bounded recovery rules below; never substitute a wrapper.

### Official Setup References

Checked 2026-09-17. Recheck the selected vendor guide at use: endpoints, server tools and client
configuration can change. A link below is setup reference material, not authorization to execute
all its examples, replace a working connection or install another runtime.

| Selected component | Reference and distinction |
|---|---|
| Codex MCP client | [Official MCP guide](https://developers.openai.com/codex/mcp/): supported UI/CLI setup, project/user configuration and OAuth. Match the actual client rather than copying another client's JSON. |
| Azure DevOps MCP | [Microsoft MCP project](https://github.com/microsoft/azure-devops-mcp) links hosted setup and the [local/client guide](https://github.com/microsoft/azure-devops-mcp/blob/main/docs/GETTINGSTARTED.md). Use the selected server's auth and tool contract; local and hosted tools need not match. |
| Jira MCP | [Atlassian setup guide](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/) supplies the current MCP endpoint and client sign-in path. Jira site/project coordinates select data; they are not that endpoint. |

For a Codex CLI already available, inspect supported commands with `codex mcp --help` and
configured names with `codex mcp list`, without echoing sensitive configuration. After approving
the actual settings scope, a supported HTTP registration uses
`codex mcp add <connection-name> --url <verified-mcp-endpoint>`; OAuth-capable servers can use
`codex mcp login <connection-name>`. Resolve placeholders from the guide and approved selection,
never run them literally. In a UI-only client guide the equivalent supported settings/sign-in
steps instead of installing a CLI. Project-scoped `.codex/config.toml` is used only when supported
and trusted; global `~/.codex/config.toml` affects other projects and needs that explicit scope.

Configured, authenticated, intended-resource read verified, and operation permitted are different
facts. A successful read does not prove write access or concurrency guarantees. A deferred
connection retains its selected provider and a next action; unknown required contract values
leave setup partial. Do not persist a permanently true "connected" flag or relabel missing checks.

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
