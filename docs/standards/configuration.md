# Core And Configuration Contract

Contract version: 1. Agent-guided adoption can now record these explicit choices with the
compatible adoption audit. This is a small instruction contract, not a runtime configuration
service. Existing projects keep their current policy until an authorized adoption or refresh.
A valid selection describes the intended policy; it does not prove code migration or access.

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
| `configuration` | Cross-cutting policy choices below; preset origin, not provider coordinates. |
| Existing `profiles` | Agent runtime, stack, tracker, code host and script platform selection. |
| Existing `integrations`, `auth` | Provider coordinates and non-secret access instructions. |
| Existing `target` | Branch/PR policy, project roots, real commands and path-to-scope mapping. |
| Existing `agentSkills`, `selfImprove` | Skill distribution and configured learning sink. Later stages extend only when needed. |
| Existing `viberails`, `adoptedAt`, `copiedFiles` | What was adopted, when, from which source, and the files actually copied/refreshed. |
| Existing `exceptions`, `openQuestions` | Deliberate deviations and unresolved decisions. |

`docs/viberails-adoption.md` remains a human-readable view and decision explanation, not a
second source of operational settings. Preserve existing values during adoption; do not label
current v1 profiles/auth/commands as merely historical receipts.

The v1 fields do not express every onboarding answer. Keep those additional decisions as
explicit target workflow/runtime rules in `AGENTS.md` or its existing linked policy, using
the [decision mapping](onboarding.md#decision-storage-without-false-equivalences). The human
record links that owner. This is a project instruction, not another settings registry; never
encode test cadence as `verification`, automatic review as `review`, or merge as `workflow`.

## Minimal Section

These are the complete fields for the first design revision. All selections are materialized;
there is no preset inheritance, deep-merge language or per-feature rule engine.

| Field | Values | Meaning and later owner |
|---|---|---|
| `version` | `1` | Version of this section's contract, separate from the existing manifest schema version. |
| `initializedFrom` | `light`, `standard` | Records the starting preset. It does not compute active settings. |
| `architecture` | `minimal`, `layered` | Smallest sufficient Clean Architecture or expanded explicit boundaries; both retain the core. [Variant rules](architecture.md#two-variants) define the distinction. |
| `verification` | `local-focused`, `ci-first` | Small relevant local checks; `ci-first` also expects full PR verification. Neither disables existing required CI or authorizes broad local gates. See [quality-gate.md](quality-gate.md). |
| `documentation` | `essential`, `standard` | Minimum useful coverage or explicit module/boundary documentation; see [documentation bundles](documentation.md#documentation-bundles). Neither is a per-task reading list. |
| `workflow` | `local`, `pull-request` | Default delivery endpoint for authorized work. PR mode prepares a PR, not an automatic merge. See [change-protocol.md](change-protocol.md). |
| `review` | `adaptive`, `independent` | Scope review according to risk; `independent` additionally requires independent review. No fixed reviewer count. See [change-protocol.md](change-protocol.md). |
| `modelRouting` | `inherit` | Preserve the runtime/client's model selection. Explicit task/runtime routes remain separate; adoption does not require tuned model recommendations. |

Trackers, code hosts and platforms remain independent existing choices. A preset does not
silently select Jira, GitHub, PowerShell or a model. Simultaneous tracker ownership remains
explicit project policy; do not invent a new manifest enum to represent it. Per-root architecture overrides,
CI-provider records and configured role/model policies are deliberately deferred to their
owning stages rather than represented by placeholder flags.

Reusable prompt content stays model-neutral; runtime/routing settings select models and effort.
Model evaluation is independent from adopting this baseline. No named model, reasoning level,
new client or unobserved dispatch capability is selected by this configuration.

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

Apply explicit authorized task instructions first, then the complete stored
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

The optional [audit](../templates/adoption-audit.mjs) checks exact supported versions, complete
values and unknown configuration keys. Its [small contract helper](../templates/adoption-state.mjs)
can initialize a preset with explicit per-field overrides; ordinary reads never reapply presets.
It executes no project command and performs no external operation. Agents interpret the validated
choices through their owning architecture, documentation, workflow, review and verification rules.
If the audit is unavailable, validate the same contract with existing tools and disclose the gap;
never infer a missing or unsupported value. Do not introduce another settings registry.

## Compatibility And Activation Boundary

Root `schemaVersion` stays numeric `1`; configuration and prompt-baseline contracts each use
version `1`. The compatible audit rejects unsupported versions, incomplete/unknown choices and
stale instruction pins. An older audit that ignores new fields cannot validate this contract.
No `configuration` means legacy/unselected, never an implicit preset; `null` is not absence.

During authorized adoption, merge the complete selected configuration into the existing manifest,
reconcile local instructions, and record [instruction pins](adoption-manifest.md#prompt-baseline).
Do not install a runtime loader or overwrite unrelated profile, auth, command or skill choices.
Temporary task overrides stay in the task record. `modelRouting: inherit` does not prevent already
authorized task/runtime selection and does not authorize a model switch itself.

Refresh version pins only after reviewing the actual changes. Preserve unchanged records and
project-owned decisions; do not treat repinning as fixing a conflict. Remaining code migration,
missing capability or required CI belongs in the existing open questions and adoption report.
A structurally valid manifest is not completed behavioral compliance. See the
[refresh procedure](adoption.md#existing-project-refresh).

Changing architecture/configuration selects a target; it does not refactor code. Adoption must
record remaining migration work and verify it before claiming compliance. Existing provenance
and copied-file evidence change only when the corresponding adoption/refactor work is performed.

## Agent-Guided Selection

[Guided Setup](adoption.md#guided-setup) routes to the [onboarding catalog](onboarding-questions.md)
and [conversation rules](onboarding.md). Inspect local conventions, ask unresolved choices one
at a time, and translate faithfully into the user's language. Explain practical consequences, not enum names.
For example, "small explicit boundaries" maps to `minimal`; "prepare changes through PRs" maps
to `pull-request`. The existing tables above remain the field/value authority.

Show all effective settings in one short proposal, including deviations from the preset, and
confirm unresolved material choices before writing. Materialize the complete approved values;
`initializedFrom` does not recompute them. Keep existing choices during refresh. Never infer a
tracker or permission from a preset, the source hosting provider or an installed client.

`modelRouting: inherit` does not answer the catalog's separate model/effort question. Preserve
known authorized routes; otherwise resolve that policy when additional agents may be used,
then record it in the target's runtime rules within actual capabilities and higher-priority
constraints. Do not add another manifest value to stand for a route that v1 cannot express.
Show required CI or independent-review gaps before accepting a setup as ready. Report pending
integration access through existing auth/open-question/readiness records, not a new configuration
flag. Do not convert "connect later" into "no tracker" or erase a required setting to pass audit.

The [two worked examples](../refactor/configuration-examples.md) are design excerpts, not
copy-ready manifests. Their effective values are explicit and existing manifest owners are reused.

## Navigation

- [Documentation index](../INDEX.md)
- [Existing adoption manifest contract](adoption-manifest.md)
- [Refactor step 02](../refactor/steps/02-configuration.md)
- [Worked examples](../refactor/configuration-examples.md)
