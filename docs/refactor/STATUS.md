# Refactor Status

Checkpoint date: 2026-09-17. This is the sole live documentation register. Reconcile it with
Git/PR evidence before acting; an actual merge may be newer than the published snapshot.

## Current Checkpoint

- Audit corrections were merged in [PR #18](https://github.com/JakubParol/VibeRails/pull/18);
  guided onboarding in [PR #19](https://github.com/JakubParol/VibeRails/pull/19).
- Web UI standards merged in [PR #20](https://github.com/JakubParol/VibeRails/pull/20),
  main `988d2279be6963a5f848039d8714921383c768fb`, version 0.5.0.
  [Agreement, research and verification](web-ui-standards.md) remain historical evidence.
- Current delivery: `plain-onboarding-1`, branch `codex/onboarding-plain-questions`, candidate
  0.5.1. The user authorized the 21-question onboarding correction, commit, push, PR and merge
  after checks, then required English repository content and user-language conversation.
  [Scope, scenario checks, review and limits](plain-onboarding.md).
- The README prompt routes through the shared prompt and adoption to a canonical catalog and
  conversation rules. Decision mappings, test cadence and skills follow the same contract.
  Closing records are committed on this branch before publication and final-head CI.
- While the delivery PR is open, merge remains pending. Require current-head CI and expected-head
  protection; the PR/report owns final source/tested/merge identities. Confirm remote main before
  calling this documentation delivery complete. Do not add a post-merge checkpoint PR.
- No adopter, UI package, application, private client setting, schema, provider transport or
  later stage changed. 00-07 remain Done; 08/09 remain Verification for their original missing
  model/independent-handoff trials. Static scenario review is not a fresh user conversation.
- Independent review and its corrective delta are complete with no remaining findings; focused
  checks and the single actual-copy adoption case passed. Fresh-session behavior remains untested.
- Next action: publish this same delivery, verify final-head
  CI, complete its authorized merge and read back main. Once merged, report the README entry
  and the fresh-session walkthrough, then stop. Do not adopt another repository or start stage 10.
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
