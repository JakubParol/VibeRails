# Stage 02 - Small Core And Configuration

## Goal

Define the smallest useful configuration contract that lets a user start simply and select
additional rigor deliberately. Establish what is always required and what can be selected,
without implementing every future module in this stage.

## Agreed Scope

Scope revision: `configuration-1`, approved on 2026-09-16.

- Separate a small invariant core from configurable architecture, verification, documentation,
  workflow/integrations, and model-routing choices. Keep these dimensions independent.
- Start with two candidate presets, light and standard, as convenient initial selections;
  allow a few explicit overrides rather than a large mandatory questionnaire.
- Design one authoritative operational configuration, reusing existing adoption structures
  where useful and clearly distinguishing current choices from historical adoption evidence.
  Do not create overlapping configuration files or silently replace existing project decisions.
- Describe agent-guided adoption: explain consequential choices to the user, write the selected
  settings, and show their effect. Users should not need to hand-author a large manifest.
- Define basic precedence and the relation between selected settings, available capabilities
  and later migration work. A declared profile is not evidence its behavior is implemented.
- Provide concise examples for a small Python project and a larger Next.js/FastAPI project,
  covering different tracker/platform needs without prescribing one provider.

Agreed output: a canonical configuration/core design and small concrete examples, with
compatibility notes for the existing adoption manifest. Detailed field names, file layout and
any validation needed for the contract will be resolved within the agreed design work before
editing its consumers. No general configuration engine or universal task runner is proposed.

Out of scope: full architecture variants (step 3), changed gate execution (4), broad document
rewrites (5), tracker/runtime implementations (6), model-specific presets or Astra source
analysis (7), automatic adoption migrations (8), telemetry/CI/CD/kanban and new language support.

## Acceptance Criteria

- A reader can identify the always-on minimum and the independently selectable dimensions.
- Both examples resolve to a clear set of choices; a small project does not need unused
  integrations or heavyweight scaffolding merely to adopt the pack.
- The design preserves minimum Clean Architecture, meaningful evidence, user-work protection
  and acceptance/merge boundaries.
- Operational choices have one source of truth, a clear relationship to the existing manifest,
  and no claim that a configuration change automatically refactors existing code.
- Follow-up stages have clear ownership of currently unavailable behavior. The design is
  reviewed for contradictions and unnecessary complexity before user acceptance.

## Agreement And Authorization

- Entry date: 2026-09-16. User confirmed audit merge with `Zmergowane. Dalej`.
- The operating loop authorizes branch creation, closeout checkpointing and discussion.
- Parent presented the two-preset, independent-dimensions configuration scope; the user replied
  `ok` on 2026-09-16. This approves `configuration-1` for design, examples, focused verification,
  independent review, commits and a stage PR. Runtime/consumer implementation remains excluded.
- Result acceptance and explicit merge authorization are still required at closeout.

## Delegation

| Assignment | Requested model / effort | Reason | Boundary |
|---|---|---|---|
| Minimal configuration contract | GPT-5.6 Terra / high | Compare simple shapes and presets across independent dimensions | Read-only design advice, no code/runtime implementation or external research. |
| Adoption compatibility and single-source review | GPT-5.6 Sol / high | Existing manifest mixes current policy and historical evidence | Read-only assessment of ownership/migration traps and honest stage boundary. |
| Synthesis, examples and focused verification | Parent | Keep one coherent design and simple deliverables | Own edits, validate examples and claims, preserve all stage gates. |

Requested settings are not observed runtime settings or measured usage. Record outcomes and
any escalation after the work; no cost ranking is inferred.

## Delivery And Verification

Branch: `codex/refactor-02-configuration`, created from accepted main
`0e1e5509adeb1dbaa42da8c8bf55ce07b433c8f1`. No stage PR yet.
This initial checkpoint closes stage 01 and records a proposal, not a completed configuration
design. Current state and next action belong in [STATUS](../STATUS.md).

## Navigation

- [Current state](../STATUS.md)
- [Record structure](../README.md)
- [Audit findings](../audit-01.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
