# VibeRails Adoption

This repository adopted VibeRails standards from:

| Field | Value |
|---|---|
| Source path | `<local path or null>` |
| Source remote | `<sanitized remote URL or null>` |
| Source ref | `<commit, tag, or branch>` |
| Pack version | `<version>` |
| Adopted at | `<date/time>` |

## Preflight Evidence

| Evidence | Summary |
|---|---|
| Repository root | `<command and result summary>` |
| Branch and dirty state | `<command and result summary>` |
| Sanitized remotes | `<command and result summary>` |
| Default branch | `<command and result summary>` |
| Stack indicators | `<command and result summary>` |
| Existing docs | `<command and result summary>` |
| CI and gates | `<command and result summary>` |

## Target Repository

| Field | Value |
|---|---|
| Repository root | `<target repository root>` |
| Remote | `<sanitized target remote URL or null>` |
| Default/base branch | `<branch>` |
| Branch naming | `<rule>` |
| PR target | `<branch or none>` |

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

## Integrations

| Area | Profile | Coordinates | Auth check | Write approval |
|---|---|---|---|---|
| Work tracking | `<azure-devops-work-tracking|jira-work-tracking|unsupported-provider|none>` | `<Azure DevOps org/project, Jira site/project key, unsupported provider name, or none reason>` | `<read check or none>` | `<write approval policy or none>` |
| Code hosting | `<github-code-hosting|azure-repos-code-hosting|unsupported-provider|none>` | `<GitHub owner/repo, Azure Repos org/project/repo, unsupported provider name, or none reason>` | `<auth check or none>` | `<allowed PR write operations or none>` |

| Provider | Required routing details |
|---|---|
| Azure DevOps work tracking | `<organization URL, project, Story/Task/Bug/self-improve work item types, area path or none, iteration policy, labels>` |
| Jira work tracking | `<base URL, project key, Story/Task/Bug/self-improve issue types, component or none, labels>` |
| GitHub code hosting | `<owner, repository, default branch, PR target branch, branch naming, draft default, allowed write operations>` |
| Azure Repos code hosting | `<organization URL, project, repository, default branch, PR target branch, branch naming, draft default, allowed write operations>` |

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

## Codex Skills

| Field | Value |
|---|---|
| Mode | `<none|user-scope|vendored>` |
| Selected skills | `<skill names or none>` |
| Source path | `<skills source path or null>` |
| Source ref | `<commit, tag, branch, or null>` |
| Target path | `<vendored target path or null>` |
| Duplicate-name policy | `Never keep the same skill name in both Codex user scope and target repository scope.` |
| Decision reason | `<why skills are not used, installed at user scope, or vendored>` |

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
| Sink coordinates | `<organization/project, Jira site/project key, or none>` |
| Issue type | `<issue type or none>` |
| Labels/tags | `viberails-self-improve`, `<provider/tool labels>` |
| Dedupe query template | `<query or none>` |
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

- [Documentation index](INDEX.md)
