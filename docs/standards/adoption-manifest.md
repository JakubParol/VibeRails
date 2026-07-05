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
| `target.branchNaming` | Branch naming convention for agent changes. |
| `target.qualityGate` | Target-local quality gate commands and path-to-scope map. |
| `target.projectProfiles` | Per-root stack profiles for the repository root and standalone apps, services, workers, packages, or infrastructure areas. |
| `profiles.agentRuntime` | `codex`. |
| `profiles.stack` | Selected stack profile or explicit exception. |
| `profiles.workTracking` | Selected work tracking profile or `none`. |
| `profiles.codeHosting` | Selected code hosting profile or `none`. |
| `profiles.scriptPlatform` | `powershell`, `posix-shell`, or `both`. |
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
| `commands` | Commands required when matching paths change. |
| `workingDirectory` | Directory where commands run. |
| `requiredBeforePr` | `true` when the commands must pass before PR creation. |

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

## Profile Values

Use these values unless an adopting repository documents an explicit extension:

| Field | Allowed values |
|---|---|
| `profiles.stack` | `nextjs-frontend-only`, `nextjs-full-stack`, `nextjs-python-fastapi`, `mixed`, `documented-exception` |
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

## Self-Improve Manifest Section

The `selfImprove` section tells agents where to record reusable failures such as Azure DevOps,
Git, GitHub CLI, or Jira syntax and auth mistakes.

Required fields:

| Field | Purpose |
|---|---|
| `enabled` | `true` when a ticket sink is configured. |
| `tracker` | `azure-devops`, `jira`, `custom-ticket-sink`, `local-file-sink`, or `none`. |
| `sink` | Provider-specific tracker coordinates and create/comment command references. |
| `labels` | Base labels/tags used for all self-improve tickets. |
| `providerLabels` | Provider/tool labels such as `azure-devops`, `jira`, `git`, or `gh`. |
| `dedupe` | Query template, exact-match rule, status scope, and manual fallback. |
| `commentTemplate` | Required fields for comments on existing tickets. |
| `auth` | Read/write auth checks, env var names, connector names, and missing-auth behavior. |
| `writeApprovalPolicy` | Whether agents may create/comment after user approval or must only prepare local bodies. |
| `alternateClients` | Same-provider fallback connectors or wrappers for self-improve sink failures. |

If the self-improve sink is not configured during adoption, set `enabled` to `false` and add an
open question that names the missing decision. Agents must not run tracker reads or writes
until the sink and dedupe rule are configured.

## Provider Sink Shape

For Azure DevOps, record at least:

- organization URL
- project name
- work item type
- area path or explicit `null`
- iteration policy
- query command or WIQL link
- create command or wrapper reference
- comment command or wrapper reference

For Jira, record at least:

- base URL or cloud site
- project key
- issue type
- component or explicit `null`
- query command or JQL template
- create command or connector reference
- comment command or connector reference

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
