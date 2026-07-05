# VibeRails Adoption

This repository adopted VibeRails standards from:

| Field | Value |
|---|---|
| Source path | `<local path or n/a>` |
| Source remote | `<remote URL or n/a>` |
| Source ref | `<commit, tag, or branch>` |
| Pack version | `<version>` |
| Adopted at | `<date/time>` |

## Preflight Evidence

| Evidence | Summary |
|---|---|
| Repository root | `<command and result summary>` |
| Branch and dirty state | `<command and result summary>` |
| Remotes | `<command and result summary>` |
| Default branch | `<command and result summary>` |
| Stack indicators | `<command and result summary>` |
| Existing docs | `<command and result summary>` |
| CI and gates | `<command and result summary>` |

## Target Repository

| Field | Value |
|---|---|
| Repository root | `<target repository root>` |
| Remote | `<target remote URL or n/a>` |
| Default/base branch | `<branch>` |
| Branch naming | `<rule>` |
| PR target | `<branch or n/a>` |

## Pull Request Policy

| Field | Value |
|---|---|
| Draft by default | `<true|false>` |
| Allowed PR write operations | `<create-pr, edit-description, comment, none>` |
| Review publishing | `<local-only|provider-comments|target-local-profile>` |
| Notes | `<provider-specific limits or manual steps>` |

## Profiles

| Area | Selected profile | Notes |
|---|---|---|
| Agent runtime | `codex` | Codex is the supported runtime for this adoption. |
| Stack | `<primary profile or summary>` | See project profiles below. |
| Work tracking | `<azure-devops-work-tracking|jira-work-tracking|unsupported-provider|none>` | `<notes>` |
| Code hosting | `<github-code-hosting|azure-repos-code-hosting|unsupported-provider|none>` | `<notes>` |
| Script platform | `<powershell|posix-shell|both>` | `<notes>` |

## Project Profiles

| Paths | Documentation root | Profile | Standards | Quality gate scope | Exception |
|---|---|---|---|---|---|
| `.` | `.` | `<profile>` | `<standards>` | `<scope>` | `<exception or none>` |

## Auth

| Area | Read check | Write check | Secret storage |
|---|---|---|---|
| Work tracking | `<command or doc link>` | `<command or doc link>` | Outside git. |
| Code hosting | `<command or doc link>` | `<command or doc link>` | Outside git. |

Do not commit tokens, cookies, generated credentials, raw user profiles, or private identity
payloads.

## Quality Gate

| Paths | Scope | Commands | Working directory | Required before PR | Notes |
|---|---|---|---|---|---|
| `<path prefix or glob>` | `<scope>` | `<commands>` | `<working directory>` | `<yes|no>` | `<notes>` |

Canonical local command: `<command>`.

## Self-Improve Ticket Sink

Reusable agent/tooling failures are reported here:

| Field | Value |
|---|---|
| Enabled | `<true|false>` |
| Tracker | `<azure-devops|jira|custom-ticket-sink|local-file-sink|none>` |
| Sink coordinates | `<organization/project, Jira site/project key, or n/a>` |
| Issue type | `<issue type or n/a>` |
| Labels/tags | `viberails-self-improve`, `<provider/tool labels>` |
| Dedupe query template | `<query or n/a>` |
| Match rule | Exact fingerprint first; fallback by provider, command family, and error class only when configured. |
| Comment policy | Add sanitized evidence to an existing matching ticket before creating a new one. |
| Comment template | Include timestamp, repository, fingerprint, platform, provider/tool, command family, sanitized symptom, attempted command, workaround, and safety confirmation. |
| Missing auth behavior | Prepare the sanitized ticket body locally and report the blocked self-improve write. |
| Write approval policy | `<when agents may create or comment self-improve tickets>` |
| Alternate clients | `<same-provider fallback connectors or wrappers, or none>` |
| Disabled reason | `<required when enabled is false unless recorded as an open question>` |

If auth or write approval is missing, agents prepare the ticket body locally and report the
blocker instead of silently skipping the learning.

## Copied Standards

| Target path | Source path | Source ref | Mode | Scope | Reason |
|---|---|---|---|---|---|
| `<target path>` | `<source path>` | `<commit, tag, or branch>` | `<created|merged|refreshed|skipped>` | `<scope>` | `<reason>` |

## Preservation Report

| File | Preserved sections | Changed sections | Conflicts or follow-up |
|---|---|---|---|
| `README.md` |  |  |  |
| `AGENTS.md` |  |  |  |
| `docs/INDEX.md` |  |  |  |

## Exceptions

| Exception | Reason | Owner |
|---|---|---|
| `<exception>` | `<reason>` | `<owner>` |

## Open Questions

| Category | Question | Impact | Owner | Needed before |
|---|---|---|---|---|
| `<provider|auth|quality-gate|documentation|stack-exception|self-improve|workflow>` | `<question>` | `<blocked behavior>` | `<owner>` | `<task or date>` |

## Navigation

- Template source index: [Documentation index](../INDEX.md)
- After copying this template to `docs/viberails-adoption.md`, replace this bullet with a
  real Markdown link to the target repository documentation index.
