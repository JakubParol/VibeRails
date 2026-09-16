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
| Independent contract review | GPT-5.6 Sol / high | Check cross-document ownership, examples and legacy compatibility without authoring the design | Read-only focused review; no broad gates or external research. |

Both advice assignments completed; parent resolved their different storage recommendations
as recorded below. Independent contract review reported No findings and separately confirmed
the example/preset consistency and focused document checks. No escalation was needed.
Requested settings are not observed runtime settings or measured usage; no cost ranking is inferred.

## Design Decisions And Artifacts

- [Canonical core/configuration design](../../standards/configuration.md) is a design contract,
  explicitly not active adoption behavior. [Examples](../configuration-examples.md) are resolved
  excerpts, not complete or copy-ready manifests.
- Parent chose one optional `configuration` namespace in existing `.viberails/adoption.json`.
  Terra proposed a separate config/current-choice file; Sol identified that v1 already owns
  current profiles, commands and auth. Reusing that authority avoids an overlapping migration
  and leaves provenance/history in their existing fields.
- Presets initialize fully explicit values; `initializedFrom` is provenance only. No inheritance
  DSL, new runner, duplicate provider settings, or per-dimension capability flags.
- Missing configuration remains legacy/unselected. The legacy audit ignores unknown fields
  and does not validate the root schemaVersion value, so a passing legacy audit is not proof
  of this contract's compatibility or activation. Migration/version handling stays in step 8.
- Light/standard choices are independent from tracker, platform and model selection. Model
  routing remains inherit pending steps 6-7; exact architecture/check bundles stay in 3-5.
- Existing templates, validators and adoption instructions are unchanged. Examples are checked
  for syntax and agreement with the design, not tested against a nonexistent resolver.

## Delivery And Verification

Branch: `codex/refactor-02-configuration`, created from accepted main
`0e1e5509adeb1dbaa42da8c8bf55ce07b433c8f1`.
Published draft: [PR #4](https://github.com/JakubParol/VibeRails/pull/4).
Reviewed design commit: `b1939f848cf8bb6b2caa76bc8ab6140925e40207`. Publication-only checkpoint
updates are checked separately; reconcile final-head evidence in the PR before resuming.
The initial checkpoint closed stage 01. Commit `2625c31` recorded approval of configuration-1.
Passed: focused Markdown links/anchors, ASCII/LF/whitespace and generic-text checks; parsing both
JSON excerpts; exact example agreement with the canonical preset table; reuse of existing
profile enums; `git diff --check`; and confirmation that legacy manifest/templates/audit,
adoption instructions, scripts and skills were unchanged. Independent review found no issues.

These are design/example checks, not runtime enforcement, migration or end-to-end adoption tests.
No full gate, build, PowerShell or external-source analysis was run. Final report revision and
PR check metadata will be recorded at publication. Current state belongs in [STATUS](../STATUS.md).

## Acceptance And Merge Evidence

User approved work on `configuration-1`; acceptance of the resulting design and an explicit
merge instruction remain pending. Do not mark Done or start step 03 before that gate closes.

## Navigation

- [Current state](../STATUS.md)
- [Record structure](../README.md)
- [Audit findings](../audit-01.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
