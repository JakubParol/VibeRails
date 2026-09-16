# Change Protocol Standard

AI agents must follow this protocol when they make changes in a repository. The goal is to keep
work reviewable, current with the base branch, documented, verified, and closed with either a
completed action or a clear next-step question.

## Priority And Overrides

The user's latest explicit instruction can override this protocol for the current task.
However, agents must not follow an override that would:

- discard, overwrite, or hide unrelated user work
- bypass required quality gates without reporting the limitation
- weaken lint, test, type, security, or import-boundary rules
- publish secrets or private data
- make destructive git changes without explicit approval

When instructions conflict, state the conflict and ask a focused question before continuing.

End completed work with the result. If work remains, state the next action or the decision
needed; do not manufacture a question or another status report merely to close a message.

## Task Lifecycle

Use one task scope and proof path regardless of tracker, code host or transport:

| Phase | Required result |
|---|---|
| Understand | Requested outcome, acceptance criteria, owning paths and authorized delivery boundary. A ticket/link supplies context, not permission by itself. |
| Prepare | Safe checkout, applicable local rules, actual required capabilities and the smallest useful verification path. |
| Implement | Scoped changes and meaningful evidence, preserving unrelated work. |
| Review and verify | Required review coverage and valid evidence for the changed revision; disclose dependent work still blocked. |
| Handoff | Actual local/PR/tracker state and remaining owner actions, using the checks below. Agent completion is not feature acceptance or merge. |

With no tracker, the user brief and the existing task/branch/PR record are enough. Do not create
an external issue, new board or mandatory task-file format. Record durable scope/evidence only
where a recipient or resume requires it. Provider profiles map this lifecycle to native states
and operations; a native `Done` label does not replace the project's acceptance requirements.

## Authorization And Delivery

Resolve authority from the actual task and applicable instructions, separately from capability.
Configuration/profile allow-lists limit available actions but do not grant write permission.
A clear named workflow request may cover several actions; carry that authorization forward
without asking again for each routine step. A bare link or available tool authorizes no mutation.

| Action | Boundary |
|---|---|
| Implementation/local commits | Stay within the agreed repository/task and its commit policy. This alone does not authorize remote writes. |
| Push | Requires covered remote/branch scope; do not include unrelated changes. |
| Create draft PR | Requires PR delivery authority, including the needed push. Creating a draft does not authorize publication or merge. |
| Publish/mark ready, comments or votes | Require the selected workflow's explicit operation authority; do not infer it from PR existence or tool access. |
| Merge/complete | Requires explicit merge authorization plus current acceptance/review/verification evidence. |

For example, "implement and open a draft PR" covers the necessary implementation, push and
draft creation, not marking it ready or merging. An explicit advance instruction to merge after
specified acceptance and verification criteria is merge authority for that scope; verify those
criteria and the current head before acting. It does not authorize unrelated changes, bypassed
checks or a later stage. Do not ask again for unchanged authority already granted.
An explicitly selected team variant may stop
at draft PR with a human responsible for publication and merge. This is optional, not the
universal workflow. Use existing task/repository settings; add no new manifest fields or future
configuration activation merely to select the delivery endpoint.

## Start Of Work

Before changing files, agents must:

1. Understand the task well enough to name a branch and define the first scope of work.
2. If the task is unclear, ask a focused clarification question and explain that the answer is
   needed to name the branch or avoid changing the wrong behavior.
3. Check the current git branch and working tree status.
4. Identify the base branch.
5. Read the required project documentation.
6. Create or switch to the task branch only when it is safe to do so.

Default base branch selection:

| Priority | Base branch source |
|---|---|
| 1 | User-specified branch |
| 2 | Project documentation or repository conventions |
| 3 | Remote default branch |
| 4 | `main` |
| 5 | `master` or `develop` |

If the repository has no git metadata, report that the branch, commit, push, and PR parts of
this protocol cannot run, then continue only if the requested work can still be handled safely.

## Dirty Working Tree

Agents must inspect the working tree before switching branches, pulling, rebasing, stashing, or
committing.

If there are uncommitted changes that the agent did not create in the current task:

- do not discard them
- do not overwrite them
- do not stash them without explicit approval
- do not commit them into the task branch unless the user explicitly asks

If these changes prevent safe progress, ask how to proceed. Otherwise continue independent
authorized work without moving or mixing them. Options when a decision is needed include:

- continue on the current branch
- commit the existing work first
- stash the existing work
- stop until the working tree is clean

If the uncommitted changes were created by the agent during the current task, the agent may
stage and commit only the files that belong to the current logical step.

## Branch Setup

When the working tree is safe:

1. Switch to the base branch.
2. Pull the latest changes from the configured remote.
3. Create a task branch.

Use the repository's branch naming convention when one exists. Otherwise use:

```text
<type>/<short-scope>
```

Examples:

- `docs/change-protocol`
- `feat/auth-session`
- `fix/api-validation`
- `chore/update-quality-gate`

If the task is too vague to choose a branch name, ask the user to clarify the intended outcome.

## Required Reading

Follow the context loading order in [agent-workflow.md](agent-workflow.md). It is the single
canonical reading list; do not maintain a separate one here.

During work, agents must read local documentation for each area before changing that area. Do
not read the entire repository by default. Load context in the smallest useful chunks.

## Planning

Agents must make a plan before substantial work. A plan should include:

- the intended scope
- the first files or folders to inspect
- implementation steps
- verification steps
- documentation updates
- commit points when the task is large enough

Keep the plan updated as work changes. If a step becomes invalid, revise the plan instead of
quietly drifting.

## When To Ask

Agents should make ordinary implementation decisions from existing code, project standards, and
local patterns.

Ask when the following decisions or actions are unresolved or not already authorized:

- product behavior not specified by the user or docs
- public API contracts
- data migrations or destructive data changes
- security-sensitive behavior
- architecture boundary changes
- dependency additions with meaningful cost or risk
- branch, commit, push, or PR actions that the user has not authorized

Questions should be specific and should include the recommended option when one exists.

## Implementation

Agents must:

- work in small, coherent increments
- preserve unrelated user changes
- keep edits within the requested scope
- update tests when behavior changes
- update documentation when setup, behavior, architecture, or folder rules change
- avoid suppressions that hide failing lint, tests, types, or boundary checks
- report blockers instead of inventing undocumented workflows

## Commit Protocol

Unless the user explicitly asks not to commit, agents must commit after each logical step when:

- the change is coherent and reviewable
- only files belonging to that step are staged
- relevant documentation and tests are updated
- the appropriate focused verification passed, or the verification limitation is explicitly
  documented

Do not mix unrelated work in one commit. Do not commit user-owned changes unless the user
explicitly asks.

Use the repository's commit convention when one exists. Otherwise use short imperative commit
messages such as:

```text
docs: add change protocol standard
fix: validate api request payload
feat: add session refresh flow
```

If the user explicitly asks not to commit, keep the working tree changes uncommitted and report
that exception.

## End Of Task

Before reporting that implementation is done, agents must:

1. Run the documented focused local checks, following [quality-gate.md](quality-gate.md).
   The full repository run belongs to CI; before PR creation its result may still be pending.
2. Confirm all task changes are committed, unless the user asked for uncommitted changes.
3. Confirm the working tree does not contain accidental unrelated changes.
4. Summarize what changed and what verification ran.

Continue through the already-authorized delivery endpoint from
[Authorization And Delivery](#authorization-and-delivery). If only local work is authorized,
report the local result; ask about a further operation only when it is needed to finish the
requested outcome. Do not invent a mandatory push/PR question for every completed local task.

## Push And Pull Request

When the user authorizes a push or PR, agents must:

1. Confirm all task changes are committed.
2. Sync with the base branch according to repository rules.
3. Re-run affected local checks after sync if their inputs changed; obtain required CI evidence
   for the resulting revision after publication rather than reusing a stale run.
4. Push the task branch.
5. Open a PR with a clear title, summary, verification notes, and any known limitations.

If the platform tools for opening a PR are unavailable, push the branch if authorized and give
the user the exact branch name and PR creation details.

## Review Loop

Choose review depth and staffing from changed scope, risk and the project's independence
requirements. Reuse valid review completed before PR creation; opening a PR or starting review
does not require a new fleet or invalidate green checks. If required independent review is
unavailable, report the missing coverage; static analysis alone is not independent review.
A project may explicitly select static-only review. Otherwise a reviewer may run a necessary,
authorized focused check, following [evidence validity](quality-gate.md#evidence-validity).

For each review cycle:

1. Read the review findings.
2. Fix valid issues.
3. Commit fixes.
4. Re-run the affected local check/case and obtain required current-revision CI evidence.
5. Review the affected fix/delta and any newly exposed risk. Preserve unaffected coverage; do
   not repeat an unchanged full review merely because another cycle started.

Stop the loop only when there are no actionable findings, or when the same task has gone
through five review cycles. After five cycles, escalate to the user with:

- remaining findings
- what was already tried
- the recommended next step

## Handoff And Acceptance

Before handoff, verify repository identity, source/target branches, actual PR state and current
head. Record the commit reviewed, covered paths/changes and current test/CI evidence using
[quality-gate.md](quality-gate.md#evidence-validity). An older reviewed SHA is not a review of a
new head: inspect the delta and obtain the missing review, without discarding unaffected work.
Do not treat successful tests as a substitute for review or acceptance.

For draft PR delivery, inspect the provider's actual CI trigger/run path. If required CI does
not run on drafts, record the missing coverage and the authorized next owner/action; do not
mark ready or change branch policies merely to obtain green checks. Agent-task completion at
an agreed local/draft endpoint may be a valid handoff, while feature acceptance/merge remains
pending. A required handoff check cannot be silently waived to fit that endpoint.

Before an authorized merge, recheck the approved head and required evidence. Use provider
revision/expected-head protection when supported; a stale head or newly changed scope returns
the affected work to review/acceptance. Report provider limitations without claiming a readback
is an atomic concurrency guard. Confirm the actual merged state before calling it merged.

## Final Report

Give the recipient what they need to accept the result, act on a blocker or resume work:

- Outcome and material changed scope, with the relevant file/commit/branch/PR reference.
- Meaningful verification and its limits. For CI, identify source/tested revision and run link,
  or the actual pending/unavailable state. Name required evidence still missing and why.
- Remaining blocker, exception or user decision and the next action, when work is incomplete.

Use a short paragraph for a small correction. Add structure only when it helps compare findings
or make a decision; omit empty sections and lists of unrelated checks that were never required.
Store detailed decisions/evidence in the task's existing record when review, handoff or recovery
needs them. Link to that record rather than copying per-agent outputs, every cycle or the entire
commit history into chat. Do not create a report without an identified consumer or requirement.

A skill or local workflow may add necessary provider/acceptance facts, not repeat this checklist.
These reporting rules do not relax verification, delivery, authorization or merge requirements.

## Navigation

- [Documentation index](../INDEX.md)
- [Agent workflow](agent-workflow.md)
