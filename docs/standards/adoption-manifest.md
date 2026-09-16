# Adoption Manifest Standard

Each target repository adopted from VibeRails must keep a machine-readable manifest at
`.viberails/adoption.json`. The manifest records where the adopted standards came from, which
profiles were selected, which files were copied, and where agents should report reusable
tooling failures.

The manifest is not a secret store. It must never contain tokens, cookies, personal access
tokens, raw API responses, or private identity payloads.

## Required Fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Manifest schema version. Start with `1`. |
| `adoptedAt` | ISO 8601 timestamp for the adoption or last adoption refresh. |
| `viberails.sourcePath` | Local path used during adoption when available. |
| `viberails.sourceRemote` | Remote URL for the VibeRails source when available. |
| `viberails.sourceRef` | Commit, tag, or branch used for adoption. Prefer immutable commit hash. |
| `viberails.packVersion` | Pack version recorded from VibeRails `CHANGELOG.md`. |
| `target.repositoryRoot` | Target repository root path at adoption time. |
| `target.remote` | Target repository remote when available. |
| `target.defaultBranch` | Default branch used for adoption and PR target decisions. |
| `target.prTargetBranch` | Branch that adoption and follow-up PRs should target. Usually the default branch. |
| `target.prPolicy` | Draft PR default and allowed PR write operations for the selected code host. |
| `target.branchNaming` | Branch naming convention for agent changes. |
| `target.qualityGate` | Existing command references and path-to-scope map; execution responsibility is defined by the target's quality-gate documentation. |
| `target.projectProfiles` | Per-root stack profiles for the repository root and standalone apps, services, workers, packages, or infrastructure areas. |
| `profiles.agentRuntime` | `codex`. |
| `profiles.stack` | Selected stack profile or explicit exception. |
| `profiles.workTracking` | Selected work tracking profile or `none`. |
| `profiles.codeHosting` | Selected code hosting profile or `none`. |
| `profiles.scriptPlatform` | `powershell`, `posix-shell`, or `both`. |
| `integrations` | Provider-specific work tracking and code hosting coordinates for the selected profiles. |
| `agentSkills` | Codex skill-linking decision: none, user-scope, or vendored pinned copy. |
| `auth` | Non-secret read/write auth documents or commands for selected integrations. |
| `selfImprove` | Ticket sink and dedupe rules for reusable agent/tooling failures. |
| `copiedFiles` | Standards and templates copied into the target repository. |
| `exceptions` | Intentional deviations from VibeRails defaults. |
| `openQuestions` | Decisions that still need a human answer. |

## Field Shapes

Use stable object shapes so automation can audit adoption without parsing prose.

`target.qualityGate.pathToScopeMap` items:

| Field | Purpose |
|---|---|
| `paths` | Glob-like path prefixes or file patterns covered by this gate entry. |
| `scope` | Human-readable scope such as `frontend`, `backend`, `infra`, or `docs`. |
| `commands` | Documented commands for matching paths; inspect actual scope before executing locally. |
| `workingDirectory` | Directory where commands run. |
| `requiredBeforePr` | `true` when these are required focused local commands before PR creation. `false` does not disable CI requirements. |

Keep the v1 field shapes. `canonicalCommand` remains the aggregate/full command reference;
it is not an instruction to execute the full gate locally. Target docs distinguish focused
local commands from CI commands and required statuses. Do not silently relabel an existing
aggregate command as focused, flip flags, or migrate adopted manifests; reconcile actual
behavior under an authorized adoption refresh. Automated configuration migration remains step 8.

`copiedFiles` items:

| Field | Purpose |
|---|---|
| `sourcePath` | VibeRails source file path. |
| `targetPath` | Target repository file path. |
| `sourceRef` | VibeRails commit, tag, or branch used for this copy. |
| `mode` | `created`, `merged`, `refreshed`, or `skipped`. |
| `scope` | Adoption scope affected by the file. |
| `reason` | Short reason for copying, merging, refreshing, or skipping. |

`target.projectProfiles` items:

| Field | Purpose |
|---|---|
| `paths` | Path prefixes owned by this project, service, worker, package, or infrastructure area. |
| `documentationRoot` | Directory containing that area's `README.md`, `AGENTS.md`, and `docs/INDEX.md`. |
| `profile` | Stack profile or documented exception for this area. |
| `standards` | Standards that apply to this area. |
| `qualityGateScope` | Scope name used in `target.qualityGate.pathToScopeMap`. |
| `exception` | Exception details or `null` when a standard profile fits. |

`target.prPolicy` fields:

| Field | Purpose |
|---|---|
| `draftByDefault` | `true` when adoption and follow-up PRs should be drafts by default. |
| `allowedWriteOperations` | PR writes agents may perform after user approval, such as `create-pr`, `edit-description`, `comment`, or `none`. |
| `reviewPublishing` | `local-only`, `provider-comments`, or `target-local-profile`. |
| `notes` | Short explanation of provider-specific limits or manual steps. |

`integrations.workTracking` fields:

| Field | Purpose |
|---|---|
| `profile` | Must match `profiles.workTracking`. |
| `azureDevOps` | Azure Boards organization, project, work item types, area path, iteration policy, labels, auth check, and write approval policy. |
| `jira` | Jira base URL, project key, issue types, component, labels, auth check, and write approval policy. |
| `unsupportedProvider` | Provider name, evidence, and manual policy when `profiles.workTracking` is `unsupported-provider`. |
| `noneReason` | Required when `profiles.workTracking` is `none`. |

`integrations.codeHosting` fields:

| Field | Purpose |
|---|---|
| `profile` | Must match `profiles.codeHosting`. |
| `github` | Owner, repository, branch policy, auth check, and allowed PR write operations for GitHub. |
| `azureRepos` | Organization URL, project, repository, branch policy, auth check, and allowed PR write operations for Azure Repos. |
| `unsupportedProvider` | Provider name, evidence, and manual policy when `profiles.codeHosting` is `unsupported-provider`. |
| `noneReason` | Required when `profiles.codeHosting` is `none`. |

`agentSkills` fields:

| Field | Purpose |
|---|---|
| `mode` | `none`, `user-scope`, or `vendored`. |
| `selectedSkills` | Skill names installed or vendored for this target; empty only when `mode` is `none`. |
| `sourcePath` | VibeRails skill source path or `null`. |
| `sourceRef` | Commit, tag, or branch for selected skills; required unless `mode` is `none`. |
| `targetPath` | Vendored target path; required when `mode` is `vendored`. |
| `duplicateNamePolicy` | Rule that prevents the same skill name from existing in both user and repository scope. |
| `decisionReason` | Why this repository uses no skills, user-scope skills, or vendored skills. |

## Profile Values

Use these values unless an adopting repository documents an explicit extension:

| Field | Allowed values |
|---|---|
| `profiles.stack` | `nextjs-frontend-only`, `nextjs-full-stack`, `nextjs-python-fastapi`, `python-cli`, `python-worker`, `shared-package`, `infrastructure`, `dapr-distributed-app`, `mixed`, `documented-exception` |
| `profiles.workTracking` | `azure-devops-work-tracking`, `jira-work-tracking`, `unsupported-provider`, `none` |
| `profiles.codeHosting` | `github-code-hosting`, `azure-repos-code-hosting`, `unsupported-provider`, `none` |
| `profiles.scriptPlatform` | `powershell`, `posix-shell`, `both` |
| `selfImprove.tracker` | `azure-devops`, `jira`, `custom-ticket-sink`, `local-file-sink`, `none` |
| `target.projectProfiles[].profile` | `nextjs-frontend-only`, `nextjs-full-stack`, `nextjs-python-fastapi`, `python-cli`, `python-worker`, `shared-package`, `infrastructure`, `dapr-distributed-app`, `documented-exception` |

Use `unsupported-provider` when a real provider exists but VibeRails does not yet define a
first-class profile for it. Use `none` only when the target repository intentionally has no
provider for that area.

Use `profiles.stack: mixed` when `target.projectProfiles[]` carries the concrete stack profile
for each standalone area.

Remote URL fields such as `viberails.sourceRemote` and `target.remote` must be sanitized before
commit. Record remotes without username, password, token userinfo, query strings, or fragments;
use `null` when a safe remote cannot be recorded.

## Self-Improve Manifest Section

The `selfImprove` section tells agents where to record reusable failures such as Azure DevOps,
Git, GitHub CLI, or Jira syntax and auth mistakes.

Required fields:

| Field | Purpose |
|---|---|
| `enabled` | `true` when a ticket sink is configured. |
| `tracker` | `azure-devops`, `jira`, `custom-ticket-sink`, `local-file-sink`, or `none`. |
| `sink` | Provider-specific coordinates and operation references; Azure DevOps/Jira use MCP only. |
| `labels` | Base labels/tags used for all self-improve tickets. |
| `providerLabels` | Provider/tool labels such as `azure-devops`, `jira`, `git`, or `gh`. |
| `dedupe` | Query template, exact-match rule, status scope, and manual fallback. |
| `commentTemplate` | Required fields for comments on existing tickets. |
| `auth` | Read/write auth checks, env var names, connector names, and missing-auth behavior. |
| `writeApprovalPolicy` | Whether agents may create/comment after user approval or must only prepare local bodies. |
| `alternateClients` | Already-authorized same-provider client references; Azure DevOps/Jira entries may name MCP connections only, never command wrappers or raw API clients. |
| `disabledReason` | Required when `enabled` is `false` unless an open question records the missing decision. |

If the self-improve sink is not configured during adoption, set `enabled` to `false` and add an
open question that names the missing decision. Agents must not run tracker reads or writes
until the sink and dedupe rule are configured.

## Provider Sink Shape

Keep the existing v1 field names and types. For Azure DevOps/Jira, `queryCommand`, `createCommand`
and `commentCommand` are legacy-named fields containing references to connected MCP operations
or the target documentation that identifies them. They are not shell commands to execute.
Resolve the required operation against current MCP metadata and task authority before use.
An old command/wrapper value is an unsupported legacy binding: report the affected operation
and needed authorized refresh rather than executing it or silently migrating the manifest.

The existing adoption audit checks required fields and nonempty values, not live MCP capability,
authentication or permission. A passing structural audit cannot validate a legacy command as an
allowed transport. Check capabilities before using a binding or claiming operational readiness;
unavailable evidence may remain an explicit adoption gap. Add no new schema/format here.

For Azure DevOps, record at least:

- organization URL
- project name
- work item type
- area path or explicit `null`
- iteration policy
- MCP query-operation reference and required query input
- MCP create-operation reference
- MCP comment-operation reference

For Jira, record at least:

- base URL or cloud site
- project key
- issue type
- component or explicit `null`
- MCP search-operation reference and required JQL input
- MCP create-operation reference
- MCP comment-operation reference

For a custom ticket sink, record at least:

- sink name and owner
- read/search command or connector reference
- create command or connector reference
- comment command or connector reference
- auth checks and missing-auth behavior
- exact fingerprint dedupe rule

For a local file sink, record at least:

- target file path
- append or replace policy
- dedupe rule
- review owner

If the repository stores these details in another target-local document, the manifest may link
to that document, but the link must be specific enough for an agent to run dedupe before
creating a duplicate.

## Open Question Taxonomy

Each `openQuestions` item should include:

| Field | Purpose |
|---|---|
| `category` | `provider`, `auth`, `quality-gate`, `documentation`, `stack-exception`, `self-improve`, or `workflow`. |
| `question` | Human-readable decision needed. |
| `impact` | What adoption or automation cannot safely do until the decision is made. |
| `neededBefore` | Milestone such as `first PR`, `self-improve write`, or `CI adoption`. |
| `owner` | Person, team, or `unknown`. |

## Update Rules

- Update the manifest whenever adoption profiles, copied standards, or self-improve routing
  change.
- Prefer adding a new exception over silently weakening a standard.
- Keep paths and URLs useful, but do not block adoption when a local path is machine-specific.
- Record auth setup as instructions, not credentials.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Self-improve loop](self-improve-loop.md)
