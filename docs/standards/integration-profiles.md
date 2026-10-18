# Integration Profiles Standard

The selected tracker and code host are recorded in the manifest (`profiles`, `integrations` and
`auth`). A profile states an intended choice; it does not prove access or permission. Connection
setup during adoption is described in the VibeRails source
(`docs/standards/adoption.md`, MCP Connection Setup).

## Profiles

| Area | Values |
|---|---|
| Work tracking | `azure-devops-work-tracking`, `jira-work-tracking`, `unsupported-provider`, `none` |
| Code hosting | `github-code-hosting`, `azure-repos-code-hosting`, `unsupported-provider`, `none` |

- Tracker and code host are independent. Never infer one from the other or from the VibeRails
  repository.
- `unsupported-provider` is a real provider without a VibeRails profile. `none` means the project
  deliberately has no provider. Missing credentials are not `none`.
- Without a tracker, the user brief and the branch or PR record are enough. Without a code host,
  stop at the authorized local endpoint.

## Provider Rules

- **Azure DevOps and Jira:** connected MCP operations only. No CLI, raw REST or wrapper. A missing
  operation is a capability gap that blocks only the dependent action.
- **GitHub:** the selected read connection or an authenticated `gh`. PR review stays local-diff
  unless the project defines review publishing.
- Do not reuse Azure Boards settings for Azure Repos unless the project records them as the same
  project. Never guess organizations, projects, area or iteration paths, item types,
  transitions or people.
- Record per provider: coordinates, the read check, the write approval policy and, for code hosts,
  draft default and allowed PR writes. Field shapes are in the manifest.

## Operation Readiness And Recovery

Classify a problem before acting: environment or checkout, configuration, tool unavailable,
connection startup, authorization, or unsupported operation.

- Discover the operations the current client really exposes; connections differ.
- Keep errors, successful empty reads and successful no-content writes distinct. A failed query
  does not mean "nothing exists".
- Retry only a concrete recoverable cause, normally once.
- After an ambiguous write, read authoritative remote state (identity, revision, source/target
  or marker) before any retry. Reuse what you find; retry only when absence is established.
- Use revision or version preconditions for shared updates when offered. If the operation lacks
  them, report the protected-update gap. Readback confirms state; it does not prevent a lost
  update.
- Configured, authenticated, resource read verified and write permitted are four different facts.

## Auth

Each selected profile points to target-local, non-secret instructions: the required connection,
a read-only check, a write check when writes are authorized, where tokens live outside Git and
what "not authenticated" looks like. Never commit tokens, cookies, credential files, raw user
profiles or identity payloads.

## Navigation

- [Documentation index](../INDEX.md)
- [Change protocol](change-protocol.md)
- [Self-improve loop](self-improve-loop.md)
