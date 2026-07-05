# Self-Improve Loop Standard

The self-improve loop captures reusable agent and tooling failures so future VibeRails updates
can fix them once instead of rediscovering them in every adopting repository.

This first stage is ticket reporting only. Cyclic analysis and scheduled fixing are a later
workflow.

## What To Report

Create or update a self-improve ticket when an agent hits a reusable failure such as:

- Azure DevOps CLI, REST, query, transition, or comment syntax
- Jira query, transition, issue creation, or comment syntax
- Git command, branch, remote, merge, or rebase workflow mistakes
- GitHub CLI auth, PR, review, check, or issue command mistakes
- cross-platform command differences between PowerShell and POSIX shell
- repeated auth setup confusion that can be fixed with better docs or wrappers

Do not create self-improve tickets for product bugs, one-off local environment issues, secrets,
private data, or customer-specific payloads. Product bugs belong in the target repository's
normal tracker.

## Required Agent Behavior

When a reusable failure is found:

1. Sanitize the symptom. Remove secrets, tokens, cookies, private user data, raw customer data,
   and large raw API responses.
2. Build a stable fingerprint from the tool, command family, provider, error class, and short
   sanitized symptom.
3. Run the configured dedupe query from `.viberails/adoption.json`.
4. If a matching ticket exists, add a comment with the new evidence.
5. If no matching ticket exists, create a new ticket in the configured sink.
6. Link the ticket or record the ticket id in the final report when the user authorized the
   write.
7. If auth is missing or writes are not authorized, report the prepared ticket body locally and
   name the auth or approval that is missing.

Agents must not guess the tracker, project, issue type, label, or auth flow. Adoption records
those decisions.

## Ticket Shape

Use this structure for the title and body, adapted to the selected tracker:

```text
Title: VibeRails self-improve: <tool/provider> <error-class>

Fingerprint:
<tool>|<provider>|<command-family>|<error-class>|<sanitized-symptom>

Context:
- Target repository:
- Platform:
- Profile:
- Command family:

Symptom:
<short sanitized error or behavior>

Expected reusable improvement:
<doc, wrapper, profile, prompt, or standard that should change>

Evidence:
- command attempted:
- non-secret error excerpt:
- workaround verified:

Safety:
- secrets removed: yes
- private payload removed: yes
```

## Auth Contract

The target repository must document:

- read-only auth check for dedupe searches
- write auth check for create/comment operations
- environment variable names or connector names, without values
- what to do when auth is missing
- whether agents may create/comment automatically after user approval

Missing auth does not block the rest of the task. It blocks only the self-improve write.

## Dedupe Guidance

Prefer queries that combine:

- a stable label such as `viberails-self-improve`
- provider or tool label such as `azure-devops`, `jira`, `git`, or `gh`
- status not done/closed
- text search for the fingerprint or error class when the provider supports it

If the provider cannot search reliably, agents should list recent open self-improve tickets and
match manually by fingerprint.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Adoption manifest](adoption-manifest.md)
- [Integration profiles](integration-profiles.md)
