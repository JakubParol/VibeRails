# Adoption Manifest Standard

Every adopted repository keeps `.viberails/adoption.json`: where the standards came from, the
selected profiles and policies, the files copied and where reusable tooling failures go. It is
not a secret store: never put tokens, cookies, raw API responses or identity payloads in it.
Start from the [template](../templates/viberails-adoption.json); its placeholders are not defaults.

## Required Fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Numeric `1`. Unknown versions are rejected. |
| `adoptedAt` | ISO 8601 time of the adoption or last actual refresh. |
| `viberails` | `sourcePath`, sanitized `sourceRemote`, `sourceRef` (immutable commit) and `packVersion` from the changelog. |
| `target` | `repositoryRoot`, sanitized `remote`, `defaultBranch`, `prTargetBranch`, `prPolicy`, `branchNaming`, `qualityGate`, `projectProfiles`. |
| `profiles` | `agentRuntime` (`codex`), `stack`, `workTracking`, `codeHosting`, `scriptPlatform`. |
| `integrations` | Provider coordinates for the selected tracker and code host. |
| `agentSkills` | Skill distribution: `none`, `user-scope` or `vendored`. |
| `auth` | Non-secret read/write auth instructions per selected integration, or `none`. |
| `selfImprove` | Reporting sink, dedupe and write policy. |
| `copiedFiles` | Files actually created, merged, refreshed or skipped, each with its source ref. |
| `configuration` | Optional version-1 choices from [configuration](configuration.md); absence means legacy. |
| `promptBaseline` | Required with `configuration`; instruction pins below. |
| `exceptions`, `openQuestions` | Deliberate deviations and unresolved decisions (arrays). |

Sanitize every remote: no userinfo, query string or fragment. Use `null` when a safe value cannot
be recorded.

## Field Shapes

| Item | Fields |
|---|---|
| `target.qualityGate` | `canonicalCommand` (the aggregate command reference, not a local instruction) and a non-empty `pathToScopeMap`. |
| `pathToScopeMap[]` | `paths` and `commands` (non-empty string arrays; data, never executed by tooling), `scope`, `workingDirectory`, `requiredBeforePr` (boolean; `false` never disables CI). |
| `projectProfiles[]` | `paths`, `documentationRoot` (has the root trio), `profile`, `standards` (bare names mean `docs/standards/<name>`), `qualityGateScope` (a defined map scope), `exception`. A root entry with `documentationRoot: "."` is required. |
| `prPolicy` | `draftByDefault` (boolean), `allowedWriteOperations` (`create-pr`, `edit-description`, `comment`, or only `none`; `none` when there is no code host), `reviewPublishing` (`local-only`, `provider-comments`, `target-local-profile`), `notes`. |
| `copiedFiles[]` | `sourcePath`, `targetPath`, `sourceRef`, `mode` (`created`, `merged`, `refreshed`, `skipped`), `scope`, `reason`. |
| `integrations.workTracking` | `profile` (equals `profiles.workTracking`) plus `azureDevOps` (organization, project, item types, area, iteration policy, labels, read check, write approval), `jira` (base URL, project key, issue types, component, labels, read check, write approval), `unsupportedProvider` (name, evidence, manual policy) or `noneReason`. |
| `integrations.codeHosting` | `profile` plus `github` (owner, repository, branches, naming, draft default, auth check, allowed writes matching `prPolicy`), `azureRepos` (organization, project, repository and the same policy fields), `unsupportedProvider` or `noneReason`. |
| `agentSkills` | `mode`, `selectedSkills` (empty only for `none`), `sourcePath`, `sourceRef` (immutable unless `none`), `targetPath` (for `vendored`), `duplicateNamePolicy`, `decisionReason`. |

`profile: documented-exception` needs a concrete `exception` rationale; empty values and labels
such as `none` are rejected. Keep the v1 shapes; reconcile changed behavior only through an
authorized [refresh](adoption.md#existing-project-refresh).

## Profile Values

| Field | Values |
|---|---|
| `profiles.stack` | `nextjs-frontend-only`, `nextjs-full-stack`, `nextjs-python-fastapi`, `python-cli`, `python-worker`, `shared-package`, `infrastructure`, `dapr-distributed-app`, `mixed`, `documented-exception` |
| `projectProfiles[].profile` | The same list without `mixed`. |
| `profiles.workTracking` | `azure-devops-work-tracking`, `jira-work-tracking`, `unsupported-provider`, `none` |
| `profiles.codeHosting` | `github-code-hosting`, `azure-repos-code-hosting`, `unsupported-provider`, `none` |
| `profiles.scriptPlatform` | `powershell`, `posix-shell`, `both` |
| `selfImprove.tracker` | `azure-devops`, `jira`, `custom-ticket-sink`, `local-file-sink`, `none` |

Use `mixed` when `projectProfiles` carries each area's stack. `unsupported-provider` is a real
provider without a VibeRails profile; `none` means deliberately no provider.

## Self-Improve Section

Fields: `enabled`, `tracker`, `sink`, `labels`, `providerLabels`, `dedupe` (query template, match
fields, status scope, manual fallback), `commentTemplate`, `auth` (read/write checks, env var and
connector names, not-authenticated errors, missing-auth behavior), `writeApprovalPolicy`,
`alternateClients` (Azure DevOps/Jira: MCP connections only) and `disabledReason`.

Summary-only reporting is `enabled: false` with a `disabledReason`. Chosen ticket reporting
without a configured sink is `enabled: false` plus an open question naming the missing decision.
Agents make no tracker calls until the sink and dedupe rule exist. See the
[self-improve loop](self-improve-loop.md).

## Provider Sink Shape

For Azure DevOps and Jira, `queryCommand`, `createCommand` and `commentCommand` are legacy names
for references to connected MCP operations (or to the target document naming them). They are
never shell commands. An old command or wrapper value is an unsupported binding: report it and
request an authorized refresh instead of executing it. The audit checks only that the fields are
present and concrete, not live capability.

| Sink | Record at least |
|---|---|
| Azure DevOps | Organization URL, project, work item type, area path or `null`, iteration policy, MCP query (with its input), create and comment operations. |
| Jira | Base URL or site, project key, issue type, component or `null`, MCP search (with JQL), create and comment operations. |
| Custom ticket sink | Name and owner, read/create/comment references, auth checks, missing-auth behavior, exact-fingerprint dedupe. |
| Local file sink | File path, append or replace policy, dedupe rule, review owner. |

A specific target-local document may hold these details if the manifest links it.

## Human Configuration Mirror

With selected configuration, `docs/viberails-adoption.md` has exactly one `Configuration And
Instruction Baseline` section with a two-column table from the
[human template](../templates/viberails-adoption.md#configuration-and-instruction-baseline): one
row per configuration key, `version` included. Missing, duplicate or mismatched rows fail the
audit; text elsewhere, comments and fenced examples do not count. Legacy adoptions need no table.
The audit never rewrites the record.

## Prompt Baseline

`promptBaseline` is an instruction receipt, not a prompt loader. Version 1 has exactly:

- `version`: `1`.
- `components`: non-empty array of `{id, path, version, sha256}`. `path` is a target-relative
  regular file (forward slashes, no traversal or symlinks); `sha256` hashes the actual adopted
  bytes, local edits included. A copied file has `id` `viberails:<sourcePath>@<targetPath>` and
  `version` equal to its 40-character source commit. A project-owned file has `id`
  `project:<path>` and `version` `sha256:<digest>`.
- `unobserved`: non-empty descriptions of layers not captured, such as runtime/system
  instructions and dynamic task context.

The maintained inventory covers each project's root trio, local README and AGENTS files,
configured standards (even outside `docs/standards`), standards under documentation roots,
copied Markdown except the human receipt, and vendored skill Markdown and metadata. Every selected
vendored skill needs a regular `<targetPath>/<name>/SKILL.md`; missing entrypoints, duplicate or
path-like names and symlinks fail. User-scope skill contents stay outside the audit and are
listed as unobserved. Partial refreshes keep unchanged per-file source refs.

Create a candidate with the read-only [fingerprint helper](../templates/adoption-pins.mjs) after
reviewing changes, then record it explicitly:

```bash
node <source>/docs/templates/adoption-pins.mjs snapshot <target>
```

A later digest mismatch means "inspect the changed instructions", never "regenerate pins to pass".

## Open Questions

Each item has `category` (`provider`, `auth`, `quality-gate`, `documentation`, `stack-exception`,
`self-improve`, `workflow`), `question`, `impact`, `neededBefore` and `owner` (or `unknown`).

## Update Rules

Update the manifest when profiles, copied standards or self-improve routing change. Prefer a
recorded exception over silently weakening a standard. Record auth as instructions, never
credentials.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Configuration](configuration.md)
