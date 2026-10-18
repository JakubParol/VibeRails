# Core Slimming, Onboarding And KIS Delivery

Internal delivery record, not an adopter template. Live state is in [STATUS](STATUS.md).

## Decision And Agreement

Post-09 decision, 2026-10-18: the user chose to correct the core first, with three priorities:
"1. Odchudzanie 2. Onboarding 3. Z VibeRails ma wynikac ze agenci maja uzywac KIS". Onboarding
selects the KIS decision model. After the plan, the user answered its open decisions: "Jev
domyslnie, 3 tak, 4 usun" (Jev is the default recommendation; adoption-only documents stay in
the source pack; remove `scripts/validate.ps1`).

Scope `core-slim-1`, candidate 0.6.0. Branch `claude/core-slim-onboarding-kis` from main
`45ce4050cae91ba3ae8f732b22353f19440fbb5b` (PR #22, main CI run 35243586214 green). The agreed
plan authorizes implementation, bounded delegates, focused checks, commits, push and one PR.
Acceptance and merge remain separate. Stage 10 is not authorized; 08/09 stay in Verification.

## Scope

- **KIS:** a short canonical [kis.md](../standards/kis.md) copied to every repo: the rule,
  how it applies, KIS review and an optional decision model (`jev` default,
  `microsoft-decision-1`, `none`). The choice lives in the target `AGENTS.md`; no manifest
  schema change.
- **Slimming:** split runtime rules from the adoption procedure. Adoption-only documents
  (adoption, onboarding, question catalog, manifest reference, configuration contract) stay in
  the pinned source and are read from it during adoption or refresh. Rewrite the runtime set in
  short positive rules; state shared limits once. Merge `documentation-audit.md` into
  `adoption.md` and `platform-profiles.md` into `quality-gate.md`. Remove `validate.ps1`.
- **Onboarding:** 21 topics become 11 plus conditional follow-ups. UI direction moves to its
  owner and is settled before the first screen. A new question selects the KIS decision model.
  Keep one question at a time, a real wait, honest n/X and the explicit-decision rule from 0.5.2.
- **Preserved:** manifest v1 schema, the optional audit and pins, MCP-only provider access,
  authorization and evidence boundaries, historical refactor records.

## Acceptance

Measured with the [baseline 01 method](baseline-01.md#method-and-limits) (whitespace units).

| Measure | Before | Target |
|---|---:|---:|
| Standards copied to every repo | 21987 | <= 7000 |
| Scenario D (common three + documentation) | 6492 | <= 2500 |
| Questions in a typical fresh adoption (host detected, no tracker) | about 14 | <= 10 |

Also required: an independent review finds no lost safeguard; adoption regressions pass; one
controlled onboarding conversation on a synthetic target; current-head CI green; user acceptance
and an explicit merge decision.

## Inputs

- KIS usage in the user's own repositories (read-only): a simplicity check in ordinary review, a
  separate KIS reviewer for substantial deltas with an open simplicity question, reuse of
  findings, and `typesafe-jev` for narrow typed judgments with a content-check helper; results
  are advisory. The user-scope `kis-review` and `typesafe-jev` skill files are on the user's
  machine and not readable from this cloud session.
- Decision models, checked 2026-10-18. Jev: `POST https://api.typesafe.ai/v1/systemone`,
  `TYPESAFE_API_KEY`, stable `jev-1.13.0`, official skill `typesafe-ai/skills`.
  Microsoft-Decision-1: Azure Foundry `/providers/microsoft/v1/systemone`, Entra ID or API key,
  announced 2026-10-09 with conflicting GA/Preview labels. Both use `noul`, `choice` and `score`.
  Sources: [Jev models](https://docs.typesafe.ai/models), [TypeSafe API](https://docs.typesafe.ai/api),
  [Microsoft-Decision-1](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-microsoft-decision).
  Vendor performance claims are not verified here.

## Delegation

| Task | Requested model | Reason | Outcome |
|---|---|---|---|
| Decision-model web research | Sonnet | Bounded fact gathering | Facts above; availability conflicts recorded. |
| Slim seven stack standards | Sonnet | Bounded rewrite of disjoint files | Pending. |
| Independent safeguard review | Opus | Consequential cross-document review | Pending. |

Requested models are not observed usage.

## Navigation

- [Current state](STATUS.md)
- [Plan](../refactor-plan.md#decision-after-step-09)
- [Documentation index](../INDEX.md)
