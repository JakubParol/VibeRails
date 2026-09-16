# Stage 05 - Documentation And Context

## Goal And Agreed Scope

Scope revision: `context-2`, approved by the user's stage 05 instruction and baseline follow-up
on 2026-09-16.
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
- Compare before/after on all three existing baseline scenarios: D (existing documentation
  correction), B (existing FastAPI behavior change), R (local backend review). Inspect both
  context volume and correct rule selection/omissions using the existing counting method and
  scenario definitions. No arbitrary percentage goal or new measurement system.
- Demonstrate the concrete D instruction correction as well as selection decisions for B/R;
  preserve useful local rules, verification and outcome evidence. Clearly separate a context
  exercise from the full runtime/model pilots deferred to 09.

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
- A before/after comparison covers D/B/R, checks selected rules against task obligations and
  discloses omissions or unnecessary reads. The D exercise produces the correct instruction edit
  and focused verification. Report actual inputs/outputs and context counts, not hypothetical
  token savings or a claimed representative runtime benchmark. No arbitrary reduction target.
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
| Before/after D/B/R context exercise | GPT-5.6 Luna / max | Same requested settings and task packet on isolated before/after source copies; D makes a real doc correction, B/R check shared-rule selection only. |

Record actual outcomes and any follow-up below. Requested settings are not observed usage;
token totals remain unknown unless runtime evidence becomes available.

Advice accepted: Terra confirmed one task router plus documentation-coverage bundles, requiring
verification for every edit and expansion when a change crosses a contract/consumer boundary.
Luna separated the user handoff from existing internal/provider evidence; the preservation
record and real blocker facts remain useful. Parent aligned entry points and report consumers,
without changing reviewer staffing, cycle limits or provider write authority.

The before exercise (Luna/max, isolated accepted-base copy) corrected the seeded POSIX flag,
preserved the local PowerShell/coverage constraints and passed the focused doc check. B/R
selected the relevant backend/review rules and explicitly identified missing runtime/diff
inputs. Their outcomes are selection evidence, not backend implementation or a real PR review.

Independent review (Sol/high) identified three P2 consistency gaps: legacy local-README
requirements conflicting with essential coverage, a documentation reviewer row still requiring
the audit for routine edits, and optional skills assuming the target already has a VibeRails
router. Parent aligned the specific consumers and restored a compact native-context/reporting
fallback. Verification and scope limits remain unchanged; focused re-review is pending.

## Prompt Component Inventory And Composition

| Component | Context owner / when used |
|---|---|
| Client/system/task instructions | External to the pack; applicable authority is preserved, contents/usage are not inferred. |
| Root and ancestor/local AGENTS | Project constraints and local differences; never replaced by a compact delegate summary. |
| README and docs indexes | Facts and navigation; read the sections needed to locate/understand the target. |
| Shared standards | `agent-workflow.md` selects relevant rules; each standard owns its subject. |
| Task/stack instructions | Actual changed paths and crossed boundaries select architecture, coding and test obligations. |
| Optional skill entrypoint | Selected operation only; discovery metadata/activation remains unchanged in this stage. |
| Skill mode/reference | Operation-specific authority, technical details and evidence; do not preload other providers/modes. |
| Task/delivery record | Agreed scope, decisions, current evidence and recovery needs; reuse rather than copying all history. |
| Refactor-only plan/status/cards | Internal coordination, excluded from adopter baseline and the isolated context exercise. |

This inventory describes composition/ownership, not a runtime loader, version catalog or new
telemetry system. Model-specific content/version evaluation stays in 07.

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
