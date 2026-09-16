# Stage 05 - Documentation And Context

## Goal And Agreed Scope

Scope revision: `context-1`, approved by the user's stage 05 instruction on 2026-09-16.
Make it simpler for an agent to find and retain the information needed for a concrete task.
Word-count reduction alone is not acceptance evidence.

- Keep one canonical context-selection policy in `docs/standards/agent-workflow.md`.
  Other instructions link to it and retain only operation/project-specific differences.
- Define `essential` and `standard` documentation bundles, preserving useful project knowledge,
  navigation, local constraints and the configuration activation boundary from stage 02.
- Remove repeated rules and mandatory report sections without a consumer or decision.
  Preserve actual acceptance evidence, blockers, user decisions, required provider results,
  protected-work checks and the internal refactor checkpoint contract.
- Inventory relevant prompt components and how they compose, without model-specific tuning,
  changing runtime model selection, a loader engine or a prompt-versioning platform.
- Demonstrate the effect on a concrete one-instruction correction: inspect the actual route,
  complete the right edit and focused check, and retain useful evidence with less irrelevant
  reading/reporting. Use a small isolated task fixture and record limitations honestly.

Out of scope: workflow/provider/routing redesign (06), the 15 deferred Astra sources and
model-specific optimization (07), automated adoption/migration (08), full model/cost pilots
(09), telemetry/feedback services, reusable CI/CD and new stacks. Do not weaken architecture,
verification, authorization or user acceptance/merge boundaries.

## Acceptance Criteria

- Root, template and directly affected skill entry points refer to the same router; relevant
  parent/child instructions remain discoverable and no reading loop requires the whole pack.
- `essential` versus `standard` has concrete documentation responsibilities and a clear manual
  selection/legacy boundary; no existing adoptee is silently migrated or stripped of knowledge.
- Final reporting is proportional to its recipient and decision; required evidence remains
  accessible without repeating an entire phase history or every delegate report.
- A before/after task exercise produces the correct instruction change, retains local rules
  and focused verification, and shows the observed reading/reporting difference. Report actual
  inputs and outputs, not hypothetical token savings or a claimed representative benchmark.
- Focused documentation/skill checks and independent review pass; actual current-head PR CI
  runs before acceptance. Done still requires user acceptance and explicitly authorized merge.

## Agreement And Delivery Boundary

The user supplied this stage scope directly: one canonical context owner, defined bundles,
removal of duplicated rules/unconsumed reporting, and observable effect on a concrete task.
This authorizes scoped implementation, task exercise, agents, focused checks, commits and a PR.
It does not authorize stage 05 merge or future-stage implementation.

Branch: `codex/refactor-05-context`, from accepted main
`e9cc17dbe0f5f5ef1bca4d29500f435f2feaf4a6`. PR #7 is confirmed merged; R1 is closed and its
source/merge trees match. The main check also passed. No previous audit is repeated.

## Delegation

| Assignment | Requested model / effort | Reason and ownership |
|---|---|---|
| Context route and bundle design advice | GPT-5.6 Terra / max | Reconcile entry points and preserve local/legacy boundaries; read-only bounded proposal. |
| Reporting duplication advice | GPT-5.6 Luna / max | Identify exact repeated report fields and their real consumers; read-only proposal, no workflow mutation. |
| Canonical integration and concrete task exercise | Parent | Own shared edits, evidence, Git/PR and scope boundaries; dispatch a narrow exercise/review after preparation. |

Record actual outcomes and any follow-up below. Requested settings are not observed usage;
token totals remain unknown unless runtime evidence becomes available.

## Verification And Delivery

Implementation and task exercise follow this agreed checkpoint. Record concrete artifacts,
review disposition and source/tested SHA evidence here; live lifecycle belongs only in
[STATUS](../STATUS.md).

## Navigation

- [Current status](../STATUS.md)
- [Refactor plan](../../refactor-plan.md)
- [Context router](../../standards/agent-workflow.md)
- [Documentation standard](../../standards/documentation.md)
- [Documentation index](../../INDEX.md)
