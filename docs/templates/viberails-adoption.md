# VibeRails Adoption

This repository adopted VibeRails standards from:

| Field | Value |
|---|---|
| Source path | `<local path or n/a>` |
| Source remote | `<remote URL or n/a>` |
| Source ref | `<commit, tag, or branch>` |
| Pack version | `<version>` |
| Adopted at | `<date/time>` |

## Target Repository

| Field | Value |
|---|---|
| Repository root | `<target repository root>` |
| Remote | `<target remote URL or n/a>` |
| Default/base branch | `<branch>` |
| Branch naming | `<rule>` |
| PR target | `<branch or n/a>` |

## Profiles

| Area | Selected profile | Notes |
|---|---|---|
| Agent runtime | `codex` | Codex is the supported runtime for this adoption. |
| Stack | `<profile>` | `<notes>` |
| Work tracking | `<azure-devops-work-tracking|jira-work-tracking|none>` | `<notes>` |
| Code hosting | `<github-code-hosting|azure-repos-code-hosting|none>` | `<notes>` |
| Script platform | `<powershell|posix-shell|both>` | `<notes>` |

## Auth

| Area | Read check | Write check | Secret storage |
|---|---|---|---|
| Work tracking | `<command or doc link>` | `<command or doc link>` | Outside git. |
| Code hosting | `<command or doc link>` | `<command or doc link>` | Outside git. |

Do not commit tokens, cookies, generated credentials, raw user profiles, or private identity
payloads.

## Quality Gate

| Scope/path | Command | Notes |
|---|---|---|
| `<path or scope>` | `<command>` | `<notes>` |

Canonical local command: `<command>`.

## Self-Improve Ticket Sink

Reusable agent/tooling failures are reported here:

| Field | Value |
|---|---|
| Enabled | `<true|false>` |
| Tracker | `<azure-devops|jira|none>` |
| Sink coordinates | `<organization/project, Jira site/project key, or n/a>` |
| Issue type | `<issue type or n/a>` |
| Labels/tags | `viberails-self-improve`, `<provider/tool labels>` |
| Dedupe query template | `<query or n/a>` |
| Match rule | Exact fingerprint first; fallback by provider, command family, and error class only when configured. |
| Comment policy | Add sanitized evidence to an existing matching ticket before creating a new one. |
| Comment template | Include timestamp, repository, fingerprint, platform, provider/tool, command family, sanitized symptom, attempted command, workaround, and safety confirmation. |
| Missing auth behavior | Prepare the sanitized ticket body locally and report the blocked self-improve write. |

If auth or write approval is missing, agents prepare the ticket body locally and report the
blocker instead of silently skipping the learning.

## Copied Standards

| File | Source | Notes |
|---|---|---|
| `<target path>` | `<source path>` | `<notes>` |

## Exceptions

| Exception | Reason | Owner |
|---|---|---|
| `<exception>` | `<reason>` | `<owner>` |

## Open Questions

| Question | Needed before |
|---|---|
| `<question>` | `<task or date>` |

## Navigation

- Documentation index after copy: `docs/INDEX.md`
