# Stage 01 - Audit And Baseline

## Proposed Goal

Identify where current VibeRails consumes unnecessary context or work, and establish a small,
honest baseline for later comparisons. Produce evidence and priorities before redesigning it.

## Scope Proposal

Scope revision: `audit-1`. Not yet approved for execution.

- Inspect this repository's standards, templates, skills and relevant tooling for duplication,
  conflicting instructions, unconditional architecture/process requirements, repeated checks,
  and unnecessary agent or reporting work.
- Confirm the real verification path and CI state. Inspect scripts/configuration as needed;
  do not run aggregate gates, application builds or PowerShell.
- Describe the minimum required context for representative small-change, feature and review
  tasks, identifying project assumptions and distinguishing existing behavior from targets.
- Record available measurements and their limits. Document/word counts are context-size proxies,
  not actual billed tokens. Missing session/model/usage data stays unknown; no invented savings.
- Prioritize findings as remove, consolidate, configure, preserve or defer, mapping them to
  existing plan stages. Recommend a small set of repeatable pilot scenarios for later agreement.

Out of scope: implementing framework changes; adopting into other repositories; editing runtime
or provider configuration; opening external trackers; Astra source analysis or model benchmarking;
building telemetry/CI/kanban; running paid experiment batches.

## Proposed Acceptance Criteria

- A compact audit report has concrete file/line evidence for material findings and separates
  confirmed current behavior from recommendations and unverified assumptions.
- Priorities address expected benefit, effort and simplicity without cataloguing niche cases.
- A baseline states exactly what was measured, how, and what remains unavailable; representative
  scenarios can be reused without depending on an imagined central telemetry service.
- CI availability and local verification limitations are recorded accurately, with no missing
  check reported as passed.
- Parent checks agent claims; the report receives a focused review and documentation checks,
  then user acceptance and an explicitly authorized PR merge before stage Done.

## Agreement And Authorization

- Entry date: 2026-09-16. The resume instruction authorizes state reconstruction, a new stage
  branch, checkpointing and discussion under the approved operating loop.
- The owner merged the overall preparation plan; this does not approve stage 01 execution.
- No approval of `audit-1` is recorded yet. Do not dispatch audit agents or start the audit
  until the user agrees. Record the agreement here before work.

## Proposed Delegation

Use a small number of bounded agents only after agreement. A lighter model can inventory
repetition/context; a stronger model can examine interacting workflow and verification rules.
Parent records actual model/effort, scope and reason when dispatching, checks evidence, and
owns prioritization and integration. No agents have been assigned to this stage yet.

## Verification And Delivery

Branch: `codex/refactor-01-audit`, based on accepted main
`e19acf6af12976caef7a2053485a4fc39b95738e`. No stage PR or audit results exist yet.
The initial documentation checkpoint closes stage 00 and records this proposal; it is not
an audit implementation result. Current state and next action belong in [STATUS](../STATUS.md).

## Navigation

- [Current state](../STATUS.md)
- [Record structure](../README.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
