# Review Output

Use the target's reporting policy for the common handoff (`change-protocol.md#final-report` in
VibeRails projects). Without one, give the review outcome, evidence/limits and any needed next
decision; do not require a new target document. This reference adds review-specific evidence
and preserves provider publishing restrictions. Keep detailed
review/triage evidence in the existing task or review record; do not create a second report.
Never include secrets, credential-bearing URLs, private payloads or raw prompts in any output.

## Agent Sections

Preserve each delegate's independent result and attribution before triage. A compact role,
reviewed scope and outcome record is enough for clean results. Retain concrete findings and
conflicting evidence so the parent can check them; do not paste every agent packet into chat.
Use "No findings" only for a completed review with no actionable issue, and name coverage limits.

## Orchestrator Triage

The parent verifies findings, merges duplicates and records reasons for rejected or unresolved
ones. Preserve attribution in the existing review record. Present the recipient with one clear
finding per issue: severity, location, concrete risk and proposed correction. Include a rejected
finding in the final response only when its explanation affects the user's decision.

## Local Fix Report

Report the material fix and relevant verification/limitations under the canonical final-report
rule. Include the delivery reference when there is one and disclose uncommitted or incomplete
work when it matters. Do not invent application tests for a documentation-only correction.

## Review-And-Fix Loop Report

Keep enough existing checkpoint evidence to resume: cycle, accepted fixes, affected verification,
focused re-review result and unresolved findings. The final handoff needs the outcome and any
remaining decision, not a separate user-facing block for every cycle. Preserve the workflow's
five-cycle limit and say whether the loop is clean, blocked or stopped at that limit.

## PR Comment Publishing

For Azure DevOps PR mode, apply the existing authorization and `SelfReviewStatus` rules before
publishing triaged inline findings. Retain the reviewed source/target revision, current iteration,
file/line anchor, posted thread IDs and vote outcome in the existing review/PR record.
Publishing policy and wording stay in [severity-and-comments.md](severity-and-comments.md).
If an authorized finding cannot be anchored, report the blocker rather than posting a summary
substitute. Keep internal agent-source metadata out of PR comments.

When a vote is applicable and permitted, report whether it was actually cast; do not imply
approval from a local clean result. Fixes, pushes, PR metadata writes, thread resolution,
completion and merge still need their existing authorization. GitHub local-diff mode retains
its local-only publishing policy; this reference grants no new write authority.

## Self-Review Publishing

When the Azure DevOps authenticated user created the PR, preserve the prohibition on publishing
findings, substitute summaries and votes. State that publishing was skipped for self-review and
provide the local result. Do not repeat provider status for modes where it does not apply.

## Final Report Checklist

Alongside the canonical outcome/verification/blocker facts, include what the review recipient needs:

- Reviewed scope/revision and compact coverage: roles used, result and any missing required
  independent review or approved exception. Do not hide a missing review behind "No findings".
- Deduplicated actionable findings, material fixes and final loop outcome when applicable.
- PR URL, self-review/publishing status, posted comments/thread references and vote only for
  the provider operation actually performed. Link the existing evidence rather than copy it.

For a small clean local review, a short result with scope and limitations is sufficient. No
mandatory empty role, cycle, PR, vote or commit sections. Keep internal evidence accessible to
its actual consumer without requiring a new logging or reporting system.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
