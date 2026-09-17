# Refactor Status

Checkpoint date: 2026-09-17. This is the sole live documentation register. Reconcile it with
Git/PR evidence before acting; an actual merge may be newer than the published snapshot.

## Current Checkpoint

- A-01 through A-04 were corrected in merged [PR #18](https://github.com/JakubParol/VibeRails/pull/18)
  at `6960a2d806178ed4ad78fe16c35f2482b0e1966a` (0.4.3). Its recorded CI/retry limits remain intact.
- Active delivery: README-led guided adoption, scope `guided-onboarding-1`, branch
  `codex/guided-adoption-onboarding`; [agreement and verification](guided-onboarding.md).
  The user approved changes, one PR and merge after verification; solo self-review is explicit.
- Implementation is in progress. Keep setup questions/approval in the adoption standard and
  MCP setup in integration profiles, with a short copyable README entry. No client/adopter
  settings, provider writes, runtime, manifest schema or later stage is part of this delivery.
- Before its scoped automatic merge, commit closing records locally on the same branch,
  publish, check every required job for that final head and use expected-head protection.
  An open PR or prepared closeout is not proof of merge. The PR owns exact delivery SHAs/results.
- All 00-09 artifact deliveries are merged; 00-07 remain Done, 08/09 remain Verification.
  This onboarding correction does not complete actual cross-model trials or independent handoff.
- Next action: complete only this delivery's checks/closeout/merge and report the README entry.
  Stop before stage 10 or changes to another repository. Preserve frozen comparisons and do
  not create an extra checkpoint PR or replace missing runtime evidence with structural PASS.

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

## Resume Reminder

Read the follow-up and actual corrective PR/CI before acting. Preserve the merged artifacts
and completed 00-07 history. Do not interpret their green structural checks as multi-model,
team, provider or full-platform proof. The original 08/09 acceptance gaps remain explicit;
apply the [post-09 decision gate](../refactor-plan.md#decision-after-step-09) before later stages.

## Navigation

- [Plan and operating rules](../refactor-plan.md)
- [Record structure](README.md)
- [Startup prompt](start.md)
- [Documentation index](../INDEX.md)
