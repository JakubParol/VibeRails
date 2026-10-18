# Self-Improve Loop Standard

Report reusable agent and tooling failures so VibeRails can fix them once instead of every
project rediscovering them. This stage covers ticket reporting only.

## Reporting Policy

The project selects one policy during onboarding:

- **Summary only:** `selfImprove.enabled: false` with its reason. Describe findings briefly at
  handoff; no sink queries or writes and no missing-sink warnings.
- **Propose and ask:** prepare a sanitized proposal and create or comment only after approval.
- **Automatic:** create or comment within the standing grant, selected sink, dedupe rule and
  working access.

`selfImprove.writeApprovalPolicy` is separate from the tracker's write policy for ordinary work.
A ticket mode without a usable sink is an open question; never create a tracker for it.

## What To Report

Reusable failures: MCP operation, query, transition or comment problems; Git workflow mistakes;
`gh` auth, PR or check problems; PowerShell versus POSIX differences; recurring auth setup
confusion. Not product bugs (use the normal tracker), one-off local issues, secrets or private
data.

## Required Agent Behavior

For a ticket mode:

1. Sanitize the symptom: no secrets, tokens, cookies, personal or customer data, or large raw
   responses.
2. Build a fingerprint: `<tool>|<provider>|<command-family>|<error-class>|<sanitized-symptom>`.
3. Read `.viberails/adoption.json`. If reporting is disabled, the tracker is `none`, or the read
   check or dedupe rule is missing, prepare the body locally, report the missing decision and
   make no tracker calls.
4. Run the configured dedupe operation. For Azure DevOps and Jira, the legacy `*Command` fields
   hold MCP operation references; never execute command text. Match the exact fingerprint first;
   use the configured fallback only when exact search is unavailable.
5. Prepare a comment for a match, or a new ticket otherwise.
6. Write only when write auth works and `writeApprovalPolicy` allows it for this task, then link
   the ticket in the report. Otherwise report the prepared body and the missing auth or approval.

Missing auth blocks only the self-improve write, never the rest of the task. Never guess the
tracker, project, issue type, labels or auth flow.

## Ticket Shape

```text
Title: VibeRails self-improve: <tool/provider> <error-class>

Fingerprint: <tool>|<provider>|<command-family>|<error-class>|<sanitized-symptom>
Context: target repository, platform, profile, command family
Symptom: <short sanitized error or behavior>
Expected reusable improvement: <doc, profile, prompt, skill or standard to change>
Evidence: attempted command, non-secret error excerpt, verified workaround
Safety: secrets removed: yes; private payload removed: yes
```

A comment on an existing ticket repeats the fingerprint and adds the repository, timestamp,
platform, tool, sanitized symptom, attempted command, verified workaround and safety lines.

## Dedupe

Query by the `viberails-self-improve` label, the provider or tool label, open status and the
exact fingerprint text. When the provider cannot search reliably, list recent open self-improve
tickets and match by fingerprint first, then by provider, command family and error class.

## Navigation

- [Documentation index](../INDEX.md)
- [Integration profiles](integration-profiles.md)
