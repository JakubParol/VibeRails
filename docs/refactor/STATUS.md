# Refactor Status

Checkpoint date: 2026-10-18. This is the sole live register. Reconcile it with Git/PR evidence
before acting; an actual merge may be newer than this snapshot.

## Current Checkpoint

- 0.5.2 merged in [PR #22](https://github.com/JakubParol/VibeRails/pull/22), main
  `45ce4050cae91ba3ae8f732b22353f19440fbb5b`; main CI run 35243586214 passed.
- Post-09 decision (2026-10-18): correct the core first. Delivery `core-slim-1`: slimming,
  simpler onboarding and KIS. [Agreement, scope and acceptance](core-slim-kis.md).
- Branch `claude/core-slim-onboarding-kis`, candidate 0.6.0. Implementation in progress.
- Waiting on the user: contents of the user-scope `kis-review` and `typesafe-jev` skills, if
  VibeRails should generalize them. Other work does not depend on them.
- Next action: finish the agreed changes, measure, review, publish one PR and give the user an
  acceptance walkthrough. Merge only after acceptance and an explicit merge decision.
- 08/09 remain Verification for their original missing model and handoff trials. Do not start
  stage 10 or change another repository.

## Stage Register

| ID | Stage | State | Record |
|---|---|---|---|
| 00 | Controlled plan and startup | Done | [Preparation card](steps/00-plan-preparation.md) |
| 01 | Audit and baseline | Done | [Audit card](steps/01-audit.md) |
| 02 | Core and configuration | Done | [Configuration card](steps/02-configuration.md) |
| 03 | Architecture variants | Done | [Architecture card](steps/03-architecture.md) |
| 04 | Local/CI verification | Done | [Verification card](steps/04-verification.md) |
| 05 | Documentation and context | Done | [Context card](steps/05-context.md) |
| 06 | Workflow and integrations | Done | [Workflow card](steps/06-workflows.md) |
| 07 | Adoption and migration | Done | [Adoption card](steps/07-adoption.md) |
| 08 | Shared prompt refinement and model evaluation | Verification | [Prompt card](steps/08-prompts.md) |
| 09 | Pilot and comparison | Verification | [Pilot card](steps/09-pilot.md) |
| 10 | Central session reporting | Planned | Create on stage entry. |
| 11 | Self-feedback and knowledge freshness | Planned | Create on stage entry. |
| 12 | Azure Pipelines / GitHub Actions CI/CD | Planned | Create on stage entry. |
| 13 | Optional kanban | Planned | Build or explicitly skip after discussion. |
| 14 | Additional languages/frameworks | Planned | Select from real needs on stage entry. |

## Navigation

- [Plan and operating rules](../refactor-plan.md)
- [Record structure](README.md)
- [Startup prompt](start.md)
- [Documentation index](../INDEX.md)
