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
| `target.repositoryRoot` | Target repository root path at adoption time. |
| `target.remote` | Target repository remote when available. |
| `target.defaultBranch` | Default branch used for adoption and PR target decisions. |
| `target.branchNaming` | Branch naming convention for agent changes. |
| `target.qualityGate` | Target-local quality gate commands and path-to-scope map. |
| `profiles.agentRuntime` | `codex`. |
| `profiles.stack` | Selected stack profile or explicit exception. |
| `profiles.workTracking` | Selected work tracking profile or `none`. |
| `profiles.codeHosting` | Selected code hosting profile or `none`. |
| `profiles.scriptPlatform` | `powershell`, `posix-shell`, or `both`. |
| `selfImprove` | Ticket sink and dedupe rules for reusable agent/tooling failures. |
| `copiedFiles` | Standards and templates copied into the target repository. |
| `exceptions` | Intentional deviations from VibeRails defaults. |
| `openQuestions` | Decisions that still need a human answer. |

## Self-Improve Manifest Section

The `selfImprove` section tells agents where to record reusable failures such as Azure DevOps,
Git, GitHub CLI, or Jira syntax and auth mistakes.

Required fields:

| Field | Purpose |
|---|---|
| `enabled` | `true` when a ticket sink is configured. |
| `tracker` | `azure-devops`, `jira`, or `none`. |
| `sink` | Provider-specific tracker coordinates and create/comment command references. |
| `labels` | Base labels/tags used for all self-improve tickets. |
| `providerLabels` | Provider/tool labels such as `azure-devops`, `jira`, `git`, or `gh`. |
| `dedupe` | Query template, exact-match rule, status scope, and manual fallback. |
| `commentTemplate` | Required fields for comments on existing tickets. |
| `auth` | Read/write auth checks, env var names, connector names, and missing-auth behavior. |
| `writeApprovalPolicy` | Whether agents may create/comment after user approval or must only prepare local bodies. |

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

If the repository stores these details in another target-local document, the manifest may link
to that document, but the link must be specific enough for an agent to run dedupe before
creating a duplicate.

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
