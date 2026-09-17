# Plain-Question Onboarding Delivery

Internal delivery record, not an adopter template. Live state is in [STATUS](STATUS.md).

## Agreement And Plan

Scope `plain-onboarding-1`, 2026-09-17. The user authorized completion of the 21-question
onboarding, branch, commit, push, PR and merge after verification. Subsequent instructions
require English questions, answer choices and instructions in this repository, with the
conversation following the user's language. The entry is the existing copyable README prompt.
This authorizes no real adopter installation, private client change or later refactor stage.

Base: `988d2279be6963a5f848039d8714921383c768fb` (0.5.0).
Resume branch: `codex/onboarding-plain-questions`; its remote matched main and the local tree
was clean at entry. No open PR existed. Git network access works in this delivery.

Plan: connect README -> shared prompt -> adoption -> canonical catalog/rules; reconcile decision
owners and skills; check conditional conversation scenarios, focused documents and actual-copy
adoption; review, then commit/publish closing records on the same branch before final-head CI
and the authorized merge. Read back main and stop. Candidate pack: 0.5.1.

## Implemented Contract

- One English [catalog](../standards/onboarding-questions.md) preserves the approved 21 question
  meanings, options, examples and recommendations. [Rules](../standards/onboarding.md) separately
  own translation, actual waits, applicability, follow-ups, counts and storage.
- Known/skipped/deferred questions are not counted as asked. The visible denominator is the
  exact current plan, explicitly conditional; every extension/reduction is announced.
- Future-task Git actions, adoption Git actions and final approval stay distinct, as do review
  timing/staffing, implementation delegation, model policy and optional skills.
- Manifest v1 remains unchanged. Additional choices live in explicit target workflow/runtime
  rules, linked from the existing adoption record. Unsupported provenance/capabilities remain
  visible; no fabricated equivalent enum, model route or skill source ref.
- Test cadence is reconciled across the quality gate, change protocol, E2E runbook and child
  task state rules. Early commits save progress; verification-dependent completion waits for
  evidence. Required CI and small repair/safeguard checks remain.
- Summary-only improvements are a complete decision, separate from ordinary tracker writes.
  UI deferral preserves quality standards and returns to design before the first screen.

No wizard, configuration engine, CI change or new application tests were added. The existing
actual-copy fixture now includes both new standards so their local links and pins are checked.

## Semantic Scenario Review

These are explicit static walkthroughs and arithmetic checks, not executed user conversations
or a parser proving agent compliance. IDs below are catalog IDs; follow-ups are real questions
and count as occurrences. Unlisted topics are known or inapplicable in each synthetic scenario.

| Scenario and current plan | Expected prompt sequence / reviewed boundary |
|---|---|
| Known answers; only `[20,21]` unresolved | `1/2` adoption Git, `2/2` final concrete summary approval. Earlier catalog IDs never appear as sent questions. |
| No tracker; start `[9,13,15,19,20,21]` | `1/6` tracker -> conversation-only; `2/6` skills. IDs 10-12 never enter the plan. ID 19 still resolves reporting, without creating a tracker. |
| Select Jira from that same plan; resource, access and writes unknown | `1/6` tracker; announce three additions -> `2/9` resource, `3/9` connection, `4/9` writes. Connect-later retains Jira and the write-policy question; no setup before approval. |
| No skills; start `[13,15,19,20,21]` | `1/5` skills -> none; `2/5` tests. No installation-scope question. Review/delegation decisions remain effective. |
| Add selected skills from that same plan | `1/5` skills; announce scope addition -> `2/6` scope. Already-installed selected skills need no reinstall or scope question; mere presence does not select them. |
| Compare skills; start `[13,19,20,21]` | `1/4` compare; show differences, announce follow-up -> `2/5` actual choice. If adding chosen skills, announce scope -> `3/6`; if none, next is reporting at `3/5`. No action while waiting. |
| Defer UI; start `[16,19,20,21]` | `1/4` appearance -> later; `2/4` reporting. IDs 17-18 are deferred, not asked; return before first screen. Existing device/accessibility constraints survive. |
| Settle UI now, then revise to later before the device question | After `1/4` appearance, planning devices/themes would extend X to 6. Before any next prompt, reconcile the changed answer and explain the deferral; next is `2/4` reporting. No phantom asked questions. |
| Revise no-tracker to Jira after questions 9 and 13 from the six-question plan | A is 2; remaining `[10,11,12,15,19,20,21]` has 7 occurrences. Announce additions -> `3/9` resource. Reuse answers, invalidate only dependent choices and outdated approval. |
| User volunteers tests and summary-only while answering skills in `[13,15,19,20,21]` | Only skills was sent (`1/5`). Announce removal of two now-known answers -> `2/3` adoption Git, `3/3` final approval. Recommendations alone could not remove them. |
| Adoption Git differs; start `[20,21]` | `1/2` adoption Git -> choose differently; announce five-action follow-up -> `2/3`, then final approval `3/3`. Future-task Git policy remains unchanged. |
| Final summary rejected at `3/3` | No edits. If the requested correction is unspecified, announce extension -> `4/5` correction question, then revised summary `5/5`. If the correction is already explicit, only renewed final approval is added (`4/4`). |
| Question card accepted by UI, no user answer | Keep the same question pending; do not send the next one, install anything, or count timeout as consent. `X/X` without an answer is not completion. |
| English bootstrap with a non-English user request; language changes mid-conversation | Translate question/options/recommendation/counter/summary; switch on the next response without resetting answers or sequence. English source files and technical identifiers stay unchanged. |
| Automatic review off; solo coding; required additional reviewer | Requested review still requires an additional agent; model policy still applies to that agent. No review-after-review and no claimed switch unavailable in the runtime. |
| After-story tests; two implemented tasks and progress pushes | Write tests with code; run final focused evidence across both tasks before final commit/push. Keep task verification pending until it passes; repair checks and mandatory safeguards may run earlier. CI remains required. |

## Verification And Limits

Focused validation passed for the initial 22 changed files (21 Markdown, two affected skills),
then for the seven added/modified review and closing-record documents. Together these cover
the 24-file delivery (23 Markdown and the existing test fixture list). The selected
actual-standard-copy regression passed again after the final rule changes: one test executed,
zero failures/skips, including the source and copied audit and native fixture checks.
`git diff --check` passed. These checks cover structure/adoption compatibility, not a conversation.

An independent read-only review was requested using `gpt-6-astra` at `xhigh` for cross-document
authorization/counter/cadence consistency. That route was chosen for the interacting contracts;
observed model/effort and usage are not exposed. It found a P2 conflict: the E2E loop could
commit its last/single item before deferred tests. The corrected loop explicitly holds that
commit until final checks. An adjacent push-only path now explicitly omits PR creation.
Independent delta review found no remaining actionable issue and checked all 16 scenario rows,
including their counter arithmetic. A review agent is not a fresh adopter session or the
original stage 08/09 model comparison and independent developer handoff.

The optional skill-creator Python validator could not start because PyYAML was absent in the
available Python environments. No dependency was installed. The repository's focused Node
validator did validate metadata for both affected skills; full skill/navigation checks remain
in CI. The unavailable Python check is not reported as a pass.

No live MCP connection, personal skill installation, private client setting change, UI screen
or real adopter was tested. Full repository validation remains in PR Verification. Stages
08/09 remain Verification for their original missing trials.

## Closeout And Fresh-Session Walkthrough

The user has authorized this scoped delivery and merge after checks. Commit this record and
STATUS in the same branch before publication/final-head CI. While its PR is open, merge is
pending; prepared closing records do not prove merge. Require current source/tested revision
evidence and expected-head protection. The PR/report owns final source/tested/merge SHAs; do
not create another commit merely to cite its own SHA.

For the next separately authorized fresh session, start from only a disposable or intended
target and the README prompt. Address the agent in a non-English language; check the first
question's translation/counter and that it actually waits. Choose no tracker, no skills and
deferred UI, then change one earlier answer and reject the first final summary. Check announced
count changes, preserved answers, corrected summary and no writes before actual approval.
After approval, inspect target policy fields/links, relevant skills and actual readiness.
This walkthrough has not been executed here. Stop after this delivery; no adoption or next stage.

## Navigation

- [Current state](STATUS.md)
- [Previous onboarding delivery](guided-onboarding.md)
- [README entry](../../README.md#start-here---adopt-viberails)
- [Documentation index](../INDEX.md)
