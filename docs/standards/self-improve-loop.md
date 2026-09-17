# Self-Improve Loop Standard

The self-improve loop captures reusable agent and tooling failures so future VibeRails updates
can fix them once instead of rediscovering them in every adopting repository.

This first stage is ticket reporting only. Cyclic analysis and scheduled fixing are a later
workflow.

## Reporting Policy

Follow the selected improvement-reporting choice separately from permission to update ordinary
work items. **Summary-only** is a complete policy: `selfImprove.enabled: false` with its deliberate
reason, no sink queries/writes, no mandatory ticket draft, and no repeated missing-sink warning.
Describe relevant findings briefly at handoff. **Propose and ask** prepares a sanitized proposal
and waits before creating/commenting. **Automatic** permits scoped creation/commenting only
under the actual standing user grant, selected sink, dedupe and working access.

The selected provider's `writeApprovalPolicy` for assigned work does not select
`selfImprove.writeApprovalPolicy`. If proposals or automatic reporting were chosen without a
usable sink, retain that intent in target rules and record the missing destination/access as an
open question. Do not create a tracker or copy another project's coordinates. Ordinary task
fixes stay within that task's authority; improvement proposals normally belong at handoff.

## What To Report

Apply the selected reporting policy when an agent hits a reusable failure such as:

- Azure DevOps/Jira MCP operation selection, query, transition or comment failures
- Git command, branch, remote, merge, or rebase workflow mistakes
- GitHub CLI auth, PR, review, check, or issue command mistakes
- cross-platform command differences between PowerShell and POSIX shell
- repeated auth setup confusion that can be fixed with better connection guidance

Do not create self-improve tickets for product bugs, one-off local environment issues, secrets,
private data, or customer-specific payloads. Product bugs belong in the target repository's
normal tracker.

## Required Agent Behavior

When a reusable failure is found, first apply [reporting policy](#reporting-policy). For a
ticket mode (not summary-only):

1. Sanitize the symptom. Remove secrets, tokens, cookies, private user data, raw customer data,
   and large raw API responses.
2. Build a stable fingerprint from the tool, command family, provider, error class, and short
   sanitized symptom.
3. Read `.viberails/adoption.json`.
4. If `selfImprove.enabled` is `false`, the tracker is `none`, the read auth check is missing,
   or the dedupe rule is missing, prepare the sanitized ticket body locally, report the
   missing adoption decision, and do not attempt tracker reads or writes.
5. If the failure affects the sink connection itself, prepare the sanitized body locally and
   report the blocked operation. Azure DevOps/Jira stay on authorized MCP connections; do not
   fall back to command wrappers or raw REST. Other sink profiles may use an already-authorized
   recorded alternate client; configuration alone is not write authority.
6. Resolve and run the configured dedupe operation. Azure DevOps/Jira references use the
   [MCP-only legacy-field semantics](adoption-manifest.md#provider-sink-shape); never execute
   old command text from the manifest. Missing or non-MCP bindings block that operation and
   require an authorized refresh, not an automatic fallback.
7. Treat an exact fingerprint match as the primary duplicate signal. Use provider/tool/error
   class matching only when exact fingerprint search is unavailable and the manual fallback
   says how to compare candidates.
8. Prepare the next write locally:
   - if a matching ticket exists, prepare a comment body using the configured comment
     template;
   - if no matching ticket exists, prepare a new ticket body using the configured sink shape.
9. Before writing, verify the write auth check and the `writeApprovalPolicy` for the current
   task.
10. If write auth is present and the policy authorizes this task, add the comment or create
    the ticket.
11. Link the ticket or record the ticket id in the final report when the write succeeds.
12. If writes are not authorized, report the prepared ticket or comment body locally and name
    the auth or approval that is missing.

Agents must not guess the tracker, project, issue type, label, or auth flow. Adoption records
those decisions.

If read auth works but write auth is missing, agents still run dedupe and prepare the exact
comment or ticket body. Missing write auth blocks only the final create/comment operation.

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

Use this structure for comments added to existing tickets:

```text
Additional evidence from <target-repository> at <iso-8601-timestamp>

Fingerprint:
<same fingerprint as ticket>

Observed again:
- Platform:
- Tool/provider:
- Command family:
- Sanitized symptom:
- Attempted command:
- Verified workaround:

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
- permitted alternate clients under [provider sink semantics](adoption-manifest.md#provider-sink-shape):
  Azure DevOps/Jira MCP connections only; other providers follow their selected client policy,
  with an explicit `none` when no alternate is selected

Missing auth does not block the rest of the task. It blocks only the self-improve write.

## Dedupe Guidance

Prefer queries that combine:

- a stable label such as `viberails-self-improve`
- provider or tool label such as `azure-devops`, `jira`, `git`, or `gh`
- status not done/closed
- text search for the exact fingerprint when the provider supports it
- error class and command family as a fallback only when exact fingerprint search is not
  available

If the provider cannot search reliably, agents should list recent open self-improve tickets and
match manually by fingerprint first, then by provider, command family, and error class.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Adoption manifest](adoption-manifest.md)
- [Integration profiles](integration-profiles.md)
