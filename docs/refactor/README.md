# Refactor Working Records

Internal VibeRails coordination records, not adoption templates. Parent owns updates; delegates
return compact evidence. Parent documentation covers this folder and `steps/`.

## Reading And Sources Of Truth

Read [the plan](../refactor-plan.md), [STATUS](STATUS.md), and the linked active card on resume.
STATUS alone records current lifecycle/next action. Cards preserve agreements and evidence.
Reconcile with actual Git/PR/CI before acting. Read other cards only for dependencies.

## States

`Planned -> Discussion -> In progress -> Verification -> Awaiting acceptance -> Awaiting merge -> Done`

A blocker is an additional fact, not completion. Implementation requires recorded scope agreement.
Acceptance and explicit merge authorization can be in one message; acceptance alone does not
authorize merge. An optional stage may be `Skipped by user` with a recorded decision.

## Stage Card Fields

Create `steps/NN-<scope>.md` on stage entry. Keep only useful fields:

- Goal, scope/exclusions, acceptance criteria, prerequisites and QA/acceptance scenario.
- Scope revision, approval date and short quote/reference, allowed actions.
- Decisions and changes with reasons; unresolved choices affecting the next work.
- Delegation: task, owner/paths, requested model/effort and reason, outcome, evidence, escalation.
- Verification: command/scenario, actual result, source SHA/artifact, limitations and review
  disposition. Keep final-head evidence in the PR/check record when a commit cannot cite its
  own SHA; resolve that link on resume.
- Branch/PR, user acceptance, explicit merge decision and observed merge result.
- Meaningful lessons and durable handoff facts. Current state/next action belong in STATUS.

Requested settings are not observed model or usage measurements. Omit unnecessary logs and
speculative edge cases. Do not duplicate chat transcripts.

## Records

- [00 - Plan preparation](steps/00-plan-preparation.md)
- [01 - Audit and baseline](steps/01-audit.md)
- [02 - Small core and configuration](steps/02-configuration.md)
- [Audit findings](audit-01.md) and [reproducible baseline](baseline-01.md)
- [Source comparison and candidate refinements](inspiration-review.md)
- [Startup prompt](start.md)

## Navigation

- [Current state](STATUS.md)
- [Refactor plan](../refactor-plan.md)
- [Documentation index](../INDEX.md)
