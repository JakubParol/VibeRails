# Refactor Status

Checkpoint date: 2026-09-16. This is the sole live documentation register. Reconcile it with
Git/PR evidence before acting; an actual merge may be newer than the published snapshot.

## Current Checkpoint

- Active stage: 00 - prepare the controlled plan.
- Branch: `codex/refactor-plan`; PR target: `main`.
- Preparation PR: [#2 - controlled refactor plan](https://github.com/JakubParol/VibeRails/pull/2), published as a draft.
- Next action: wait for user acceptance of the prepared plan and an explicit merge decision.
  Reviews and focused documentation checks are complete; no implementation stage may start yet.
- Blocker: none identified. Acceptance and merge are intentionally not granted yet.
- Implementation stages 01-14 have not begun. The startup prompt alone does not authorize them.

## Stage Register

| ID | Stage | State | Record |
|---|---|---|---|
| 00 | Controlled plan and startup | Awaiting acceptance | [Preparation card](steps/00-plan-preparation.md) |
| 01 | Audit and baseline | Planned | Create on stage entry. |
| 02 | Core and configuration | Planned | Create on stage entry. |
| 03 | Architecture variants | Planned | Create on stage entry. |
| 04 | Local/CI verification | Planned | Create on stage entry. |
| 05 | Documentation and context | Planned | Create on stage entry. |
| 06 | Workflow and integrations | Planned | Create on stage entry. |
| 07 | Astra, prompts and model evaluation | Planned | [Deferred sources](../astra-refactor-reading-list.md) |
| 08 | Adoption and migration | Planned | Create on stage entry. |
| 09 | Pilot and comparison | Planned | Create on stage entry. |
| 10 | Central session reporting | Planned | Create on stage entry. |
| 11 | Self-feedback and knowledge freshness | Planned | Create on stage entry. |
| 12 | Azure Pipelines / GitHub Actions CI/CD | Planned | Create on stage entry. |
| 13 | Optional kanban | Planned | Build or explicitly skip after discussion. |
| 14 | Additional languages/frameworks | Planned | Select from real needs on stage entry. |

## Resume Reminder

Confirm the preparation PR's actual status before choosing the next action. If merged,
reconcile stage 00, create the stage 01 branch from the accepted base, persist the closeout
checkpoint there, and introduce the audit in short Polish prose. Wait for scope agreement.
If not merged, continue only preparation/acceptance work actually authorized.

## Navigation

- [Plan and operating rules](../refactor-plan.md)
- [Record structure](README.md)
- [Startup prompt](start.md)
- [Documentation index](../INDEX.md)
