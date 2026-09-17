---
name: code-review
description: Review a local diff or pull request for actionable defects. Use for code review or an explicit review-and-fix task; a PR link selects the mode, not publication or merge authority.
---

# Code Review

Review the changed scope with evidence-backed findings. Default to read-only work; implement
fixes only under review-and-fix authority. Match coverage and independence to risk and target
policy, not a fixed reviewer fleet.

Automatic review timing and review staffing are separate target decisions. An on-request
setting still uses the selected staffing when invoked; an explicit requirement for at least
one additional agent remains in force. Coding/testing solo mode does not disable additional
review agents. Performing this review does not schedule a second review of the same work.

## Select One Mode

| Review source | Read before reviewing | Publication boundary |
|---|---|---|
| Local branch | [Local mode](references/local-branch-mode.md) | Keep results local; protect unrelated edits. |
| GitHub PR | [GitHub mode](references/github-pr-mode.md) | Read-only metadata/diff; publishing needs an explicit target profile and task authority. |
| Azure DevOps PR | [Azure mode](references/pr-mode.md) | MCP only; publication also needs confirmed non-self-review identity and the required operation/anchor. |

An unsupported host requires a target profile or verified source/target refs before selecting
local mode. A URL routes the task; it does not authorize writes. Missing remote metadata limits
what can be claimed even when a local diff is readable. Azure identity/publication conditions
apply to Azure mode, not to GitHub or local review.

## Resolve Target Rules

Follow applicable root/path `AGENTS.md` and the target's context router/index. Read rules for
changed paths and affected boundaries; reuse unchanged context. In an adopted target, resolve
its local lifecycle, evidence and dispatch owners. Native repositories use their own equivalent
rules and do not need missing VibeRails files.

These source-pack defaults are references, not target permission or a replacement for local
customization: [lifecycle/authority](../../../docs/standards/change-protocol.md),
[evidence](../../../docs/standards/quality-gate.md#evidence-validity),
[dispatch](../../../docs/standards/agent-workflow.md#delegation-and-runtime-routing), and
[provider recovery](../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery).
Read their relevant sections only when no target owner supplies the needed rule.

## Workflow

1. Establish source/target refs, current reviewed SHA, changed paths and existing review/check
   evidence. Local inventory includes committed, staged, unstaged and relevant untracked changes;
   PR inventory contains only that PR's changes. Inspect working-tree state before any mutation.
2. Select necessary coverage with [area routing](references/area-routing.md). Before a dispatch
   or independence decision read [agent authorization](references/agent-authorization.md).
   Required independent review must be authorized and actually available; self-review does not
   replace it. An explicit task exception is reported, not disguised as independent coverage.
3. Inspect changed behavior and surrounding contracts. Findings concern changed lines; cite
   unchanged code only to explain the introduced defect. Run a needed, authorized focused check
   unless target policy is static-only. Full gates retain their target CI ownership.
4. Triage with [severity](references/severity-and-comments.md) and [output](references/output.md):
   deduplicate issues, verify evidence and retain independent attribution. Say "No findings"
   only after review, with material coverage limits. A green test is not a completed review.
5. In authorized review-and-fix work, fix actionable issues and check the affected delta. Reuse
   unaffected evidence; stop when clean, blocked, a decision is needed, or five cycles finish.
6. Before handoff or authorized publication, re-read the current head/state. An older SHA needs
   the missing delta review, not a relabeled result. Test PASS requires fresh, actually executed
   relevant cases; zero, stale, all-skipped or missing evidence is not PASS.
7. Follow only the selected mode's publishing rules. Without authority/capability, return local
   findings and the exact missing step. For Azure, unknown/matching actor identity prevents
   comments, substitute summaries and votes. Missing MCP never permits CLI, REST or wrappers.

Carry forward already granted authority. Review alone does not authorize fixes, push, PR edits,
thread resolution or merge. Protect unrelated work; never stash, discard or include it without
approval. Preserve quality and security checks. If blocked, identify the concrete rule or missing
capability rather than inventing an additional approval ceremony.

## Delegate Packet

When delegation is permitted, provide the mode, exact revision and owned paths, applicable local
rules, needed sanitized diff/context, allowed focused checks or static-only constraint, and
requested output: actionable findings with severity, path/line and concrete impact, or no findings.
Use supported model/effort settings under the target's routing policy and disclose unobserved
settings. Keep reviewers' conclusions independent until triage. Delegation grants no mutation
or publication authority beyond the actual task.

Protect secrets, credentials, identity data, customer/OCR payloads, private prompts, request
bodies and headers. Redact sensitive excerpts before reports or delegation. Authorized public
or synthetic instruction snippets may be reviewed; never substitute real private payloads.

## Conditional References

The selected mode supplies operational detail. [LEARNINGS.md](LEARNINGS.md) is historical
knowledge: read only for a directly relevant recurring gap, reverify it, and record improvements
only through an authorized learning workflow. History is not current permission.

For Azure operations, [the provider skill](../azure-devops/SKILL.md) is a source-pack reference
for actual connected MCP capabilities, never an alternate transport. GitHub does not use Azure
tools, identity checks or reviewer votes.

## Navigation

- [Skills index](../README.md)
- [Repository docs](../../../docs/INDEX.md)
