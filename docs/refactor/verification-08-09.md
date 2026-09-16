# Stages 08-09 Verification Follow-up

## Authority And Scope

On 2026-09-16 the user requested `To kontynuuj i dokoncz wszystko poprawnie` after
receiving the limits of the merged 08/09 deliveries. Continue those stages, preserve the
previous solo-execution and scoped automatic-merge authorization, and stop before 10 or
any change to another repository. This is corrective work, not a new numbered stage.

Base: `853a7bc299009baf9e899980e89e49907d0f8c97`.
Branch: `codex/refactor-08-09-verification`.

Review actual adoption/pin behavior, reproduce and repair concrete defects with focused
regressions, obtain explicit platform evidence where available, and reconcile completion
with the original acceptance criteria. Do not replace real model runs or independent
handoff with more author-coded examples. Preserve original baselines and historical results.
No model-runtime installation, new billing authorization, credential collection, provider
writes, or other-repository changes are included. Required missing evidence remains open.

## Reproduced Defects And Fixes

All probes used the unchanged `853a7bc` code on temporary synthetic targets first. No external
system or adopted repository was modified.

| Boundary | Before correction | Corrective behavior |
|---|---|---|
| Explicit standard outside `docs/standards` | `policy/security.md` was validated as existing but omitted from pins; changing it still produced audit exit 0. | Every configured standard path joins the maintained inventory; drift fails until reviewed repinning. |
| Selected vendored skill | A manifest could name an absent SKILL.md and still pass with a consistent human receipt. | Each distinct selected name must resolve to a real target-local SKILL.md. |
| Vendored symlink or path-like selection | Entrypoint/reference symlinks disappeared from enumeration; duplicate selections were not rejected by snapshot. | Reject missing entrypoints, unsafe/duplicate names and symlinked vendored content; no fake successful snapshot. |

The new eight-case regression file first produced 3 passes and 5 failures against the unmodified
code. After the narrow fix it produced 8 passes, zero skipped/cancelled. Positive cases retain
valid vendored refresh, read-only receipts, deletion errors and target paths containing spaces.
The existing auditor/bundle is reused; there is no new loader, migration engine or provider client.
The fixed source is 0.4.2; frozen 0.4.0/0.4.1 comparisons are not rewritten to incorporate fixes.

## Verification Ownership

Local: Node 22.16.0/POSIX, the new eight-case file, syntax/whitespace checks and changed-file
validation. This is current-agent execution of a real bug-fix task, not a fresh-context LLM A/B
trial. No independent worker or model-cost observation is claimed.

CI: preserve `Repository checks` and add the new cases to its adoption command. Windows/macOS
jobs run the same current-source adoption, refresh and boundary cases using Node 24 and Bash.
All must pass on the final head. The delivery PR owns exact run/job, source/tested SHA, actual
case counts, failures and corrections; configured matrix entries alone are not evidence.
This covers the optional Node audit, filesystem/path behavior, native Python cases and Git
examples on those runners, not PowerShell execution, live MCP, every shell or production code.

The current checkout was reconstructed from a read-only pinned archive. Its Git tree and
commit object matched the base exactly. A temporary source-transfer workflow exists only in
branch history and is removed from the final diff. Local commits and remote GitHub publication
must retain byte/mode-identical trees and normal ancestry; no credentials are exported.

## Platform Failure And Correction

The first three-platform PR run `35125710938` passed Linux and Windows. macOS executed
24 adoption cases: 11 passed and 13 failed. Its navigation audit compared physical link paths
with a logical repository root, so a system parent alias made valid local links appear external.
This is a product defect, not a skipped platform or a test to weaken. A ninth focused regression
reproduced the same failure locally through an aliased parent directory. Canonicalizing both
sides of the boundary comparison makes that case pass while a genuinely external link still
fails. Existing instruction symlink rejection remains unchanged. Final-head CI must verify the
correction on all three runners; the PR retains both the failure and final results.

## Original Acceptance Still To Exercise

| Requirement | Evidence currently available | Evidence still required |
|---|---|---|
| 08 shared prompts across LLMs | Preserved old/new sources, hashes, ten author-reviewed situations and script compatibility. | Actual task traces under at least two permitted model identities for both pinned prompt versions, with the same checks. |
| 08 model/effort routing | Documentary candidates and explicit inherit fallback. | Actual supported model/effort pairs and attributable results; unavailable settings/usage remain unknown, not zero. |
| 09 task-level pilot | Six deterministic artifact/refresh/clone scenarios plus current-source regressions. | Real agent implementation and correction on small and multi-root tasks, with failures/retries and human actions retained. |
| 09 handoff | A clean local clone reproduces scripted checks. | A separate participant/session continues from repository records without this conversation; identify whether that participant is human or an agent. |

These gaps remain in Verification. Neither earlier automatic-merge authority nor this corrective
merge waives them. The user-approved solo exception concerns execution/review, not a claim that
multiple LLMs or developers ran. Missing measurements are not a negative or positive result.

## Bounded Runtime Handoff

Use an already authorized runtime/account; installation, billing or another repository requires
its own covered authority. Do not invent credentials, use a retired inference endpoint or turn
an account-access failure into a benchmark result. This session exposes no independent model
execution tool and has no installed Codex CLI; connected provider discovery did not supply one.
No model runtime was installed and no paid inference was initiated.

1. Pin two instruction variants: frozen 0.4.0 and the agreed corrected candidate. Keep the same
   current audit/test tooling in both arms so a tool fix is not attributed to prompt wording.
   Record the exact instruction component hashes and tooling revision separately.
2. Select two actually accessible models and one supported effort per model from the agreed
   pool. Start fresh sessions in isolated copies of identical task inputs; do not supply this
   conversation, answer patches or the fixture's `app.fix()` function. Counterbalance which
   prompt version runs first. The experiment owner retains expected outcomes outside agent input.
3. Use three bounded tasks: a small implementation with a negative validation case; a multi-root
   implementation respecting an existing local boundary; and a refresh containing one local
   conflict. Define acceptance before the run. Reuse real project checks or independent held-out
   assertions, not the model's summary. Two models x two variants x three tasks gives 12 task
   attempts before any repeated runs; record failures as well as successes.
4. Retain sanitized task instructions, source/result commits, requested and observed model/effort,
   runtime version, actual tool actions, test outcomes, retries, elapsed task time, measured usage
   when exposed and human interventions. Do not report guessed prices or omitted failures.
5. Give one successful handoff to a different session/participant with repository records only.
   Ask it to identify remaining work, reproduce the named checks and perform one scoped change.
   Verify its output; a clone and scripted rerun alone do not meet this criterion.
6. Compare correctness and scope compliance first. Do not infer population-wide superiority
   from this small sample. A second effort is a separate experiment; retain inherited routing
   rather than promote unmeasured recommendations. Record remaining model/access/CI gaps.

For the negative review/activation cases, retain these expected outcomes: a lookup-only brief
must not start E2E; an ambiguous MCP write requires readback before retry; missing MCP capability
has no CLI/REST fallback; stale review or zero/all-skipped tests are not PASS; advance scoped
merge authority is retained only after actual current evidence. Test cases are evaluator criteria,
not additional instructions supplied to the candidate to reveal the expected answer.

## Delivery Boundary

The user's continued instruction covers this corrective implementation and its scoped delivery.
Before merge, commit this evidence and the honest Verification checkpoint on the same branch,
verify every current-head required job and merge with expected-head protection. The PR records
final source/tested/merge identities. Leave 08/09 in Verification while their experiments remain
unperformed, report the remaining dependency and stop before 10. No post-merge checkpoint chain
or unrelated repository change is needed.

## Audit Correction Agreement

Scope `audit-fixes-1`, authorized on 2026-09-16 by the user instruction
`Popraw wszystko jednym pr, zmerguj i napisz co dalej`. Fix A-01 through A-04 from the
00-09 audit in one PR on `codex/refactor-audit-00-09-fixes`, based on merged PR #17
`ffb80cb224b924aaea0d5baa3d02b53d03459e0b`. This covers implementation, focused tests,
solo review, commits, push and merge after current-head CI. No extra acceptance question
is needed; no independent reviewer or model execution is claimed.

Preserve unrelated user-scope skills during install/removal, validate concrete gate-map
values and referenced scopes, compare the human configuration table by field and value,
and require a rationale for a documented stack exception. Add failing regressions before
fixes; retain positive, legacy/unselected and read-only cases. Update existing rule owners,
templates and direct consumers only. PowerShell installer changes are statically reviewed,
not executed under this task. No provider wrapper, schema version, administrative setting,
model service, new-repository mutation or stage 10 work is authorized.

Local source is transferred through a temporary read-only branch workflow because Git DNS
is unavailable. Its base commit/tree must match Git; the transfer workflow is removed from
the delivered tree. Closing evidence is committed locally and published in the same PR before
final-head CI and protected merge. Correction delivery does not close the outstanding 08/09
runtime criteria. Final source/tested/merge identities belong in the PR record.

### Audit Correction Evidence

The original ten audit probes were rerun against exact base `ffb80cb`: seven undesirable
outcomes reproduce A-01 through A-04, with three expected controls. The new 21 focused tests
first produced 4 passes and 17 failures against unchanged product code. After correction all
21 passed, zero skipped/cancelled: 13 record-consistency cases and 8 POSIX installer cases.
The changed fixture report renders the existing human-template table with explicit version;
it is not a second configuration or an automatic migration tool.

- A-01: foreign, broken and other-checkout links remain untouched with a conflict result.
  Valid owned links remain idempotent; only owned removal succeeds. Source bytes remain intact.
- A-02: empty maps, invalid string-list entries and undefined project scopes fail. Valid globs
  and multiple scopes pass without executing command strings.
- A-03: configuration rows are matched by key/value. Missing, duplicate, wrong, commented or
  fenced rows fail; unrelated matching words cannot conceal a difference. Legacy absence passes.
- A-04: a documented exception needs a concrete rationale string. Regular profiles may retain
  null; empty values and absence labels cannot masquerade as a justified exception.

Local Node/POSIX tests, shell syntax, selected MJS syntax, whitespace and 17-file focused
validation passed. One direct-consumer actual-standard-copy adoption case passed with its
native Python checks. No full local gate or unrelated unchanged suite was rerun. The two new
files are added to existing CI coverage. Implementation run `35131848103` on source
`b229e3284365193ff948b88db35149225bcaf621`, tested merge
`252833d52059d79b67946ee960758aa024263f50`, passed all three jobs. Actual logs confirm 38/38
adoption cases on Linux/Windows/macOS and 8/8 POSIX installer cases on Linux/macOS, with zero
failed/skipped/cancelled tests. Linux also passed 12 validator cases, 6 frozen pilot cases,
full documentation/skill validation and both architecture examples. The Windows POSIX step
is deliberately inapplicable, not a PowerShell test. Installer test roots were canonicalized
before publication for system parent aliases; all eight targeted cases passed locally again.

Solo semantic/diff review checks preservation, invalid records, receipt interpretation and
the unchanged provider boundaries. The PowerShell installer has the same fail-closed ownership
policy by static review only; no `.ps1` execution is claimed. GitHub administration remains
unchanged. This fixes the four audited defects, not the still-open runtime experiments.

### Audit Correction Closeout

The user-authorized one-PR correction is [PR #18](https://github.com/JakubParol/VibeRails/pull/18).
All four findings have reproductions, fixes and positive/negative regression evidence. This
closing record and STATUS are edited/committed locally before publication, followed by CI on
the actual closing head and expected-head merge. A successful earlier implementation run is
not relabeled as final-head evidence. Final source/tested/merge identities stay in that PR.
Once its merge and remote main are verified, this correction delivery is complete; it does
not close the unperformed 08/09 model and handoff criteria. No additional checkpoint PR,
release tag, administration change or work on stage 10 follows automatically.

## Navigation

- [Plan](../refactor-plan.md)
- [Stage 08](steps/08-prompts.md)
- [Stage 09](steps/09-pilot.md)
- [Documentation index](../INDEX.md)
