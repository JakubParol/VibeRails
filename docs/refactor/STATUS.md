# Refactor Status

Checkpoint date: 2026-09-17. This is the sole live documentation register. Reconcile it with
Git/PR evidence before acting; an actual merge may be newer than the published snapshot.

## Current Checkpoint

- Audit corrections were merged in [PR #18](https://github.com/JakubParol/VibeRails/pull/18);
  guided onboarding in [PR #19](https://github.com/JakubParol/VibeRails/pull/19).
- Web UI standards merged in [PR #20](https://github.com/JakubParol/VibeRails/pull/20),
  main `988d2279be6963a5f848039d8714921383c768fb`, version 0.5.0.
  [Agreement, research and verification](web-ui-standards.md) remain historical evidence.
- Plain-question onboarding 0.5.1 merged in [PR #21](https://github.com/JakubParol/VibeRails/pull/21),
  main `c91ceb758d3587f904f7037349adb70f06ee9e61`.
- Current delivery: `onboarding-evidence-1`, branch `codex/onboarding-explicit-decisions`,
  candidate 0.5.2. The user authorized the diagnosed correction, branch, PR and merge after
  verification. [Agreement, failure and acceptance](plain-onboarding.md#decision-evidence-correction).
- Generic simplicity rules must not select the architecture variant. The correction requires
  sourced decisions and visible coverage of all 21 topics before final approval, preserving
  valid known choices and conditional skips/deferrals. Implementation and verification are
  in progress; bounded conversation trials and independent review remain pending.
- Closing records belong in this delivery before final-head CI. Require current-head checks
  and expected-head merge protection; confirm remote main before calling delivery complete.
- No adopter, UI package, application, private client setting, schema, provider transport or
  later stage changed. 00-07 remain Done; 08/09 remain Verification for their original missing
  model/independent-handoff trials. Static scenario review is not a fresh user conversation.
- Next action: complete focused checks, controlled conversation evidence and independent review;
  publish this correction, verify final-head CI, merge and read back main. Do not adopt another
  repository or start stage 10.
- Preserve frozen comparisons. Document CI and semantic review do not certify appearance,
  accessibility conformance or performance. Do not add a post-merge checkpoint PR.

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
