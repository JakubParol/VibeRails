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
| `schemaVersion` | Supported manifest schema version: numeric `1`. Unknown versions are rejected. |
| `adoptedAt` | ISO 8601 timestamp for the adoption or last adoption refresh. |
| `viberails.sourcePath` | Local path used during adoption when available. |
| `viberails.sourceRemote` | Remote URL for the VibeRails source when available. |
| `viberails.sourceRef` | Commit, tag, or branch used for adoption. Prefer immutable commit hash. |
| `viberails.packVersion` | Pack version recorded from VibeRails `CHANGELOG.md`. |
| `target.repositoryRoot` | Target repository root path at adoption time. |
| `target.remote` | Target repository remote when available. |
| `target.defaultBranch` | Default branch used during adoption and PR target decisions. |
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
| `copiedFiles` | Standards and templates actually created, merged, refreshed or intentionally skipped; immutable source refs for the selected configuration. |
| `configuration` | Optional complete version-1 choices from [configuration.md](configuration.md); absent preserves legacy policy, not an implicit preset. |
| `promptBaseline` | Required with selected configuration; versioned, read-only fingerprints of maintained instructions below. |
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

The map must contain at least one entry. `paths` and `commands` are non-empty arrays of
concrete strings; patterns are data, not paths to execute or files that must already exist.
Each project profile's `qualityGateScope` must name a defined map scope. Several entries may
share a scope. Structural validation does not execute commands or prove their coverage.

Keep the v1 field shapes. `canonicalCommand` remains the aggregate/full command reference;
it is not an instruction to execute the full gate locally. Target docs distinguish focused
local commands from CI commands and required statuses. Do not silently relabel an existing
aggregate command as focused, flip flags, or migrate adopted manifests; reconcile actual
behavior under an authorized adoption refresh. Configuration changes follow the explicit [refresh procedure](adoption.md#existing-project-refresh).

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
| `standards` | Existing target-relative standard files; a bare filename denotes `docs/standards/<name>` at the repository root. |
| `qualityGateScope` | Scope name used in `target.qualityGate.pathToScopeMap`. |
| `exception` | Concrete rationale string when `profile` is `documented-exception`; otherwise `null` is allowed. |

An exception must explain why a standard profile does not fit. Empty values, objects and
absence labels such as `none` are not a rationale. Preserve the applicable rules, commands
and owner requirements from [stack profiles](stack-profiles.md); the audit checks presence
and shape, not the quality of the architectural justification.

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
| `sourceRef` | Immutable source commit for selected configuration; legacy unselected records may retain tags/branches. Required unless `mode` is `none`. |
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

## Human Configuration Mirror

For selected configuration, keep exactly one `Configuration And Instruction Baseline` section
in `docs/viberails-adoption.md`, using the two-column table in the
[human template](../templates/viberails-adoption.md#configuration-and-instruction-baseline).
Each configuration key, including `version`, has exactly one matching value row. Backticks
around a key/value are optional. Missing, duplicate or mismatched rows fail the optional audit;
words elsewhere, comments and fenced examples do not satisfy the mirror. This is a view of the
manifest, not a second configuration. Legacy/unselected adoption needs no new table.

Earlier selected receipts may need their existing table completed during an authorized refresh.
Review the manifest against local decisions first, then correct the receipt; the read-only audit
never rewrites it, changes settings or regenerates pins. The check does not interpret arbitrary
prose as configuration or prove instruction-following behavior.

## Prompt Baseline

`promptBaseline` is an instruction receipt in the existing manifest, not a second operational
configuration or a runtime prompt loader. Version 1 contains only these fields:

| Field | Meaning |
|---|---|
| `version` | Numeric `1`; unsupported versions and unknown fields are rejected. |
| `components` | Nonempty array of the instruction records below. |
| `unobserved` | Nonempty descriptions of unobserved layers, such as runtime/system instructions and dynamic task/code/tool context. No raw payloads. |

Each component contains exactly `id`, `path`, `version`, `sha256`:

- `path` is a target-relative regular file, with forward slashes and no traversal or symlinks.
- `sha256` is the SHA-256 of the actual adopted bytes, including local edits. It is not proof
  that the bytes equal a pristine upstream file or that the instructions were followed.
- For a file in `copiedFiles`, `id` is `viberails:<sourcePath>@<targetPath>` and `version` is that
  record's immutable 40-character Git source commit. Local adaptation does not change provenance;
  the actual digest distinguishes it. Keep one current copy record per target path.
- For a project-owned file without a copy record, `id` is `project:<path>` and `version` is
  `sha256:<digest>`. This identifies uncommitted adopted bytes without inventing a tested Git SHA.

A path-based identity stays stable while its path/mapping stays stable; a deliberate rename is
an explicit identity change reviewed in the same adoption diff. No separate prompt-ID registry
is needed. Partial refreshes retain unchanged per-file source refs; the latest source examined
must not be assigned to files that were never refreshed.

The maintained inventory includes each recorded project's root trio, local README/AGENTS,
explicitly configured standard paths even outside `docs/standards`, standards under documentation
roots, copied Markdown except the human adoption receipt, and local vendored skill Markdown/metadata.
Every selected vendored skill must have a regular `<targetPath>/<name>/SKILL.md`; missing
entrypoints, duplicate/path-like names and symlinks inside the vendored tree fail validation
instead of disappearing from the snapshot. It excludes generated/dependency folders. The human receipt is excluded
to avoid self-referential hashes; it is still audited for placeholders and manifest mirrors.
Additional task-specific context is not claimed as captured. User-scope skill contents remain
outside this local audit; retain their immutable `agentSkills.sourceRef`, use a pinned source
checkout, and disclose external content as unobserved rather than claiming symlink pinning.

Run the optional, read-only [fingerprint helper](../templates/adoption-pins.mjs) after reviewing
adoption changes. It emits a candidate object, never writes files, updates pins automatically,
executes recorded commands or calls providers:

```bash
node <source>/docs/templates/adoption-pins.mjs snapshot <target>
```

Review the candidate and explicitly record it as `promptBaseline`. A later digest mismatch
requires inspecting the changed instructions; never regenerate pins just to make a failing audit
green. The optional audit checks schema, identity, completeness and current bytes, not historical
source availability or real runtime composition. Source refs are verified against Git at adoption.
Keep content model-neutral and model/effort choices in the existing task/runtime policy.

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
