# VibeRails Adoption

Human-readable mirror of `.viberails/adoption.json`. The manifest owns the values.

| Field | Value |
|---|---|
| Source remote | `<sanitized remote URL or null>` |
| Source ref | `<immutable commit>` |
| Pack version | `<version>` |
| Adopted at | `<date/time>` |

## Configuration And Instruction Baseline

One row per configuration field, including version. The audit compares these keyed rows with the
manifest. Remove the table only for a legacy/unselected adoption and say so.

| Field | Actual value |
|---|---|
| version | `1` |
| initializedFrom | `<light or standard>` |
| architecture | `<minimal or layered>` |
| verification | `<local-focused or ci-first>` |
| documentation | `<essential or standard>` |
| workflow | `<local or pull-request>` |
| review | `<adaptive or independent>` |
| modelRouting | `inherit` |

Instruction pins live in the manifest `promptBaseline`. Captured scope: `<summary>`.
Unobserved layers: `<runtime instructions, dynamic context, user-scope skills>`.

## Decisions And Approval

- Decisions without a manifest field: see the VibeRails Decisions and KIS sections in
  `<link to AGENTS.md>`. UI direction: `<design owner or "before the first screen">`.
- Approval: `<safe reference to the user's approval of the final summary>`; this adoption's Git
  actions: `<actions>`. Do not commit conversation transcripts.

## Migration And Readiness

| Scope | Verified evidence | Remaining work or gap | Owner / next action |
|---|---|---|---|
| `<documents, a skill, an integration, the KIS model, delivery>` | `<actual check and result or none>` | `<gap or none>` | `<owner/action or none>` |

A selected configuration is a target, not proof of migration. Structural audit, local checks,
live integrations and CI are separate evidence.

## Preflight Evidence

| Evidence | Summary |
|---|---|
| Root, branch and dirty state | `<result summary>` |
| Sanitized remotes and default branch | `<result summary>` |
| Stack, docs and CI | `<result summary>` |

## Target And Profiles

| Field | Value |
|---|---|
| Default/base branch, PR target | `<branch>`, `<branch or none>` |
| Branch naming | `<rule>` |
| PR policy | Draft `<true or false>`; writes `<create-pr, edit-description, comment, none>`; publishing `<local-only, provider-comments, target-local-profile>` |
| Agent runtime | `codex` |
| Stack | `<profile>` |
| Work tracking | `<profile>`: `<coordinates or none reason>`; read check `<check>`; writes `<policy>` |
| Code hosting | `<profile>`: `<coordinates or none reason>`; auth check `<check>` |
| Script platform | `<powershell, posix-shell or both>` |
| Codex skills | `<none, user-scope or vendored>`: `<names>`; ref `<commit or null>`; reason `<reason>` |

| Paths | Documentation root | Profile | Standards | Gate scope | Exception |
|---|---|---|---|---|---|
| `.` | `.` | `<profile>` | `<standards>` | `<scope>` | `<rationale or none>` |

Auth: `<where each read/write check is documented>`; secrets stay outside Git.

## Quality Gate

| Paths | Scope | Commands | Working directory | Required before PR |
|---|---|---|---|---|
| `<path or glob>` | `<scope>` | `<commands>` | `<directory>` | `<yes or no>` |

Canonical full command (CI): `<command>`.

## Self-Improve Ticket Sink

| Field | Value |
|---|---|
| Enabled, tracker | `<true or false>`, `<azure-devops, jira, custom-ticket-sink, local-file-sink, none>` |
| Sink and issue type | `<coordinates and type, or none>` |
| Labels | `viberails-self-improve`, `<provider/tool labels>` |
| Dedupe | `<query or none>`; exact fingerprint first |
| Write approval | `<policy>` |
| Disabled reason | `<reason when disabled, unless an open question records it>` |

Azure DevOps/Jira command fields hold MCP operation references
(`adoption-manifest.md#provider-sink-shape` in the source pack).

## Copied Standards And Preservation

| Target path | Source path | Source ref | Mode | Reason |
|---|---|---|---|---|
| `<target path>` | `<source path>` | `<commit>` | `<created, merged, refreshed, skipped>` | `<reason>` |

| File | Preserved sections | Changed sections | Conflicts or follow-up |
|---|---|---|---|
| `README.md` |  |  |  |
| `AGENTS.md` |  |  |  |
| `docs/INDEX.md` |  |  |  |

## Exceptions And Open Questions

| Kind | Item | Impact or reason | Owner | Needed before |
|---|---|---|---|---|
| `<exception or open question category>` | `<item>` | `<impact>` | `<owner>` | `<milestone>` |

## Navigation

- [Documentation index](INDEX.md)
