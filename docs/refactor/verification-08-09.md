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

## Navigation

- [Plan](../refactor-plan.md)
- [Stage 08](steps/08-prompts.md)
- [Stage 09](steps/09-pilot.md)
- [Documentation index](../INDEX.md)
