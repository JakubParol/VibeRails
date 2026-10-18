# Change Protocol Standard

How agents take a task from request to handoff. Apply [KIS](kis.md) throughout.

## Priority And Overrides

The user's latest explicit instruction can override this protocol for the current task, but
never to discard or hide unrelated work, bypass required checks without reporting it, weaken
lint/test/type/security/boundary rules, publish secrets or private data, or make destructive Git
changes without explicit approval. When instructions conflict, ask one focused question.

## Task Lifecycle

| Phase | Result |
|---|---|
| Understand | Outcome, acceptance criteria, owned paths and authorized endpoint. A ticket or link is context, not permission. |
| Prepare | Safe checkout, local rules, real capabilities, smallest useful verification. |
| Implement | Scoped changes with evidence; unrelated work preserved. |
| Review and verify | Required review and valid evidence for the changed revision. |
| Handoff | Actual local/PR/tracker state and remaining owner actions. Done is not accepted or merged. |

Without a tracker, the user brief and the branch or PR are the record; add no task files.

## Authorization And Delivery

Authority comes from the task and the project's recorded Git policy, never from tools, links or
profiles. A clear request covers the actions it names: "implement and open a draft PR" includes
commits and push, not marking ready or merging. Do not ask again for authority already given.

| Action | Needs |
|---|---|
| Commit | The agreed task and the commit policy. |
| Push | A covered remote and branch. |
| Draft PR | PR authority, including its push. |
| Mark ready, comment, vote | Explicit authority for that operation. |
| Merge | Explicit merge authority plus current acceptance, review and CI evidence for the current head. |

`configuration.workflow` sets the default endpoint: `local`, or `pull-request` (a PR, never an
automatic merge). Advance authority such as "merge after the checks pass" holds for its scope;
verify the criteria and head first. A team may stop at a draft PR and leave merge to a human.

## Start Of Work

1. Understand the task well enough to name a branch; otherwise ask.
2. Check the branch and working tree. Base: user choice, project docs, remote default, `main`.
3. Load context through the [agent workflow](agent-workflow.md).
4. Switch to a task branch only when safe; use the repository convention or `<type>/<scope>`.

Never discard, overwrite, stash or commit changes you did not make without approval. If they
block progress, ask whether to continue, commit them, stash them or stop.

Plan substantial work briefly (scope, steps, verification, docs) and revise it when it changes.
Ask, with a recommendation, before unresolved product behavior, public API contracts, data
migrations, security-sensitive behavior, architecture boundary changes, costly dependencies or
unauthorized Git actions.

## Implementation And Commits

- Work in small increments inside scope. Update tests with behavior and docs with setup,
  architecture or folder-rule changes. Never hide failures with suppressions.
- Follow the selected Git policy, including "no commits"; otherwise commit after each logical
  step. Stage only that step's files, never unrelated or user-owned changes. Use the repository's
  message convention or a short imperative message.
- Commit after passing focused checks, or as a progress checkpoint under after-story
  [test cadence](quality-gate.md#agent-test-cadence); then run the final tests before the final
  commit and push. No PR or merge per child task.
- Before reporting done: focused checks pass, task changes are committed, nothing unrelated is
  included. Push, rerun checks affected by a base sync and open a PR only as authorized.

## Review Loop

Review timing (automatic or on request) and staffing (agent decides, or at least one additional
agent) are separate project decisions; solo coding does not cancel required staffing.
`configuration.review: independent` requires independent review, and self-review never counts
as independent. Every review includes the [KIS check](kis.md#kis-review). Reuse valid review.

Each cycle: fix valid findings, rerun the affected check, commit and push per policy, get current
CI and review the delta. Stop when nothing actionable remains or after five cycles, then escalate
with the remaining findings and a recommendation.

## Handoff And Acceptance

Before handoff, verify the branches, PR state, current head and the revision your review and
evidence cover ([evidence validity](quality-gate.md#evidence-validity)). Review of an older commit
does not cover a new head. For draft PRs, check whether required CI runs on drafts and record any
gap. Before an authorized merge, recheck head and evidence, use expected-head protection when
offered, and confirm the merged state.

## Final Report

Lead with the outcome and its reference (commit, branch or PR). Then verification and its limits,
including CI source/tested revision or its pending state and any missing required evidence. Then
blockers and the next action. Keep details in the task record. Never report missing evidence as
completion.

## Navigation

- [Documentation index](../INDEX.md)
- [Agent workflow](agent-workflow.md)
- [Quality gate](quality-gate.md)
