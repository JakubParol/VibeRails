# Core And Configuration Contract

Design revision: 1, prepared in refactor step 02. **Design contract, not an active runtime or
adoption feature.** The planning update does not activate new manifest fields or validators.
Do not add the section below to target repositories until the owning stages implement its
semantics and step 07 provides explicit adoption/version handling under plan revision 1.4.

## Core That Presets Cannot Disable

**IF A SIMPLE SOLUTION IS ENOUGH, KEEP IT SIMPLE.**

- Use the smallest design that meets the agreed need. Add complexity for evidence-backed
  requirements; do not prebuild niche cases or a general configuration/workflow engine.
- Preserve minimum Clean Architecture: presentation cannot call ORM/persistence directly;
  keep application behavior and IO responsibilities separate. See the [architecture variants](architecture.md#two-variants).
- Support changed behavior with meaningful evidence. Preserve required project checks, identify
  the verified revision, and never treat missing checks or unavailable capabilities as PASS.
- Protect unrelated work and secrets. Configuration cannot grant account access, authorize
  external writes, supply user acceptance or permit a merge. Respect existing task authorization
  without asking again for routine work it already covers.
- Keep one authority per setting and load only relevant context. Report unknown or unsupported
  choices rather than silently selecting another behavior.

## One Operational Record

Extend the existing `.viberails/adoption.json` with one optional, small `configuration` section.
Do not introduce a competing `config.json`, duplicated provider selection or separate settings
registry. The existing manifest already owns current choices as well as adoption evidence.
Git records changes; a second history database is unnecessary.

| Owner in the manifest | Information owned |
|---|---|
| New `configuration` | Cross-cutting policy choices below; preset origin, not provider coordinates. |
| Existing `profiles` | Agent runtime, stack, tracker, code host and script platform selection. |
| Existing `integrations`, `auth` | Provider coordinates and non-secret access instructions. |
| Existing `target` | Branch/PR policy, project roots, real commands and path-to-scope mapping. |
| Existing `agentSkills`, `selfImprove` | Skill distribution and configured learning sink. Later stages extend only when needed. |
| Existing `viberails`, `adoptedAt`, `copiedFiles` | What was adopted, when, from which source, and the files actually copied/refreshed. |
| Existing `exceptions`, `openQuestions` | Deliberate deviations and unresolved decisions. |

`docs/viberails-adoption.md` remains a human-readable view and decision explanation, not a
second source of operational settings. Preserve existing values during adoption; do not label
current v1 profiles/auth/commands as merely historical receipts.

## Minimal Section

These are the complete fields for the first design revision. All selections are materialized;
there is no preset inheritance, deep-merge language or per-feature rule engine.

| Field | Values | Meaning and later owner |
|---|---|---|
| `version` | `1` | Version of this section's contract, separate from the existing manifest schema version. |
| `initializedFrom` | `light`, `standard` | Records the starting preset. It does not compute active settings. |
| `architecture` | `minimal`, `layered` | Smallest sufficient Clean Architecture or expanded explicit boundaries; both retain the core. [Variant rules](architecture.md#two-variants) define the distinction. |
| `verification` | `local-focused`, `ci-first` | Small relevant local checks; `ci-first` also expects full PR verification. Neither disables existing required CI or authorizes broad local gates. Detailed policy: step 4. |
| `documentation` | `essential`, `standard` | Minimum useful coverage or explicit module/boundary documentation; see [documentation bundles](documentation.md#documentation-bundles). Neither is a per-task reading list. |
| `workflow` | `local`, `pull-request` | Default delivery endpoint for authorized work. PR mode prepares a PR, not an automatic merge. Execution: step 6. |
| `review` | `adaptive`, `independent` | Scope review according to risk; `independent` additionally requires independent review. No fixed reviewer count. Execution: step 6. |
| `modelRouting` | `inherit` | Preserve the runtime/client's model selection. Stage 06 governs explicit task/runtime routes; 07 can adopt this inherited baseline without waiting for model/routing evaluation in 08. |

Trackers, code hosts and platforms remain independent existing choices. A preset does not
silently select Jira, GitHub, PowerShell or a model. Simultaneous tracker routing is designed
in step 6; do not invent a v1 manifest enum to represent it now. Per-root architecture overrides,
CI-provider records and configured role/model policies are deliberately deferred to their
owning stages rather than represented by placeholder flags.

The initial planned configured-model catalog remains the GPT-5.6 family (including Sol, Terra
and Luna) plus GPT-6 Astra. Exact IDs, supported efforts and measured route recommendations
are verified in step 08. They are not prerequisites for stage 07's general prompt baseline.
Reusable prompt content stays model-neutral; runtime/routing settings select models and effort.
This design does not advertise evaluated routes or additional clients as active capabilities.

## Two Presets, Then Explicit Choices

| Setting | light | standard |
|---|---|---|
| `architecture` | `minimal` | `layered` |
| `verification` | `local-focused` | `ci-first` |
| `documentation` | `essential` | `standard` |
| `workflow` | `local` | `pull-request` |
| `review` | `adaptive` | `independent` |
| `modelRouting` | `inherit` | `inherit` |

Presets initialize the six selected fields once. Store their resolved values, including any
agreed adjustments. `initializedFrom` is provenance; editing it alone changes no behavior.
Reapplying a preset is an explicit configuration change with a visible diff, preserving target
constraints and current authorization. Later preset changes do not silently rewrite projects.

A small project can combine `minimal` architecture with `ci-first` verification and independent
review. A larger project may retain `local-focused` work while preserving all its already-required
CI. Presets are conveniences, not bundled quality levels. Keep the initial two until real use
demonstrates a missing case.

## Resolution And Readiness

At design level, apply explicit authorized task instructions first, then the complete stored
choices, within higher-priority rules and actual runtime capabilities. Presets participate only
in initialization, not as a fallback at execution. Temporary task overrides need a short task
record when material; they do not silently rewrite project configuration.

- An absent `configuration` means **legacy/unselected**, not implicit light or standard.
- Once selected, incomplete/unknown fields or an unsupported `version` cannot be silently
  defaulted. Report the affected unsupported selection before attempting to apply it.
- `pull-request` requires an identified code host and usable PR path; `ci-first` requires a
  usable full-verification path. Missing access/CI is a readiness gap, not automatic downgrade
  or a reason to block unrelated work. Agree any required exception explicitly.
- Capability is observed at the time of use, not stored as a permanently true flag. A setting
  declares intent; it does not prove a connector, runner, architecture migration or model exists.
- Preserve required project checks and constraints even if a lighter preset is requested.
  Report conflicts rather than weakening a guard to make the preset fit.

Do not implement a resolver or elaborate validation engine in step 02. The examples exercise
these decisions; later consumers must implement the same contract before claiming support.

## Compatibility And Activation Boundary

Keep root `schemaVersion: 1` and the current manifest template unchanged in this step. The
legacy audit checks that `schemaVersion` exists, but does not validate its value and does not
reject unknown extra fields. Therefore neither a v2 marker nor a successful legacy audit would
prove support for this section. See [the existing audit](../templates/adoption-audit.mjs).

Only explicit migration in step 07 may materialize these choices in an adopted repository,
after the required semantics in steps 03-06 and strict version/capability handling are available.
Stage 07 also supplies minimal Git-backed version pins for the model-neutral prompt baseline;
`modelRouting: inherit` and existing authorized task/runtime routes do not depend on stage 08.
The later refinement/evaluation stage versions improvements and recommendations separately;
it must not silently replace an adopter's prompt pin or model selection.
Existing adoptees continue using their existing policy until authorized migration. Do not run
two overlapping configurations or change existing fields merely to match one example.

Changing architecture/configuration selects a target; it does not refactor code. Adoption must
record remaining migration work and verify it before claiming compliance. Existing provenance
and copied-file evidence change only when the corresponding adoption/refactor work is performed.

## Agent-Guided Selection

Inspect the target's existing conventions, offer the closer preset and explain consequential
differences. Confirm only choices that remain material or uncertain; preserve already-authorized
decisions. Record the resolved fields and show the user a short effective summary plus any
readiness or migration gaps. Do not make the user fill an exhaustive manifest questionnaire.

The [two worked examples](../refactor/configuration-examples.md) are design excerpts, not
copy-ready manifests. Their effective values are explicit and existing manifest owners are reused.

## Navigation

- [Documentation index](../INDEX.md)
- [Existing adoption manifest contract](adoption-manifest.md)
- [Refactor step 02](../refactor/steps/02-configuration.md)
- [Worked examples](../refactor/configuration-examples.md)
