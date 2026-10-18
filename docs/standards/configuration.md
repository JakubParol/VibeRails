# Configuration Contract

Contract version 1. One optional `configuration` section in `.viberails/adoption.json` records
explicit policy choices. It is an instruction contract, not a runtime configuration service, and
it stays in the VibeRails source; adopted projects read field meanings from their copied
[agent workflow](agent-workflow.md#adopted-choices-and-pins).

## Fields

| Field | Values | Meaning and owner |
|---|---|---|
| `version` | `1` | Version of this section, separate from the manifest `schemaVersion`. |
| `initializedFrom` | `light`, `standard` | Starting preset; provenance only, it computes nothing. |
| `architecture` | `minimal`, `layered` | [Variant rules](architecture.md#two-variants). |
| `verification` | `local-focused`, `ci-first` | [Local/CI responsibility](quality-gate.md#gate-responsibility-split). |
| `documentation` | `essential`, `standard` | [Documentation bundles](documentation.md#documentation-bundles). |
| `workflow` | `local`, `pull-request` | Default delivery endpoint; a PR, never an automatic merge. [Change protocol](change-protocol.md#authorization-and-delivery). |
| `review` | `adaptive`, `independent` | Risk-sized review, or required independent review. [Review loop](change-protocol.md#review-loop). |
| `modelRouting` | `inherit` | Keep the runtime's model selection; explicit authorized routes stay possible. |

Trackers, code hosts, platforms, skills and the KIS decision model are separate choices recorded
elsewhere. No configuration value selects a provider, model or permission.

## Presets

| Setting | light | standard |
|---|---|---|
| `architecture` | `minimal` | `layered` |
| `verification` | `local-focused` | `ci-first` |
| `documentation` | `essential` | `standard` |
| `workflow` | `local` | `pull-request` |
| `review` | `adaptive` | `independent` |
| `modelRouting` | `inherit` | `inherit` |

A preset initializes the fields once; store every resolved value, including agreed changes. Any
combination is valid, for example `minimal` with `ci-first` and `independent`. Reapplying a
preset is an explicit change with a visible diff. Later preset revisions never rewrite projects.

## Rules

- No `configuration` means legacy/unselected: the project keeps its existing policy. `null` is not
  absence.
- Incomplete or unknown fields and unsupported versions fail; never fill them from a preset.
- `pull-request` needs a code host and a PR path; `ci-first` needs a full verification path.
  Missing access or CI is a readiness gap, not a silent downgrade.
- Explicit authorized task instructions come first, then the stored choices, within higher-priority
  rules and real runtime capabilities. Record material temporary overrides in the task record.
- Presets cannot disable [KIS](kis.md), the minimum architecture boundary, evidence rules,
  protection of unrelated work and secrets, or authorization limits.
- A selection is a target policy. It does not refactor code, prove migration or prove access;
  record remaining work in `openQuestions` and the adoption record.

## Tools And Versions

Manifest `schemaVersion`, `configuration.version` and `promptBaseline.version` are each numeric
`1`. The optional [audit](../templates/adoption-audit.mjs) rejects unsupported versions, unknown or
incomplete choices and stale instruction pins. Its [contract helper](../templates/adoption-state.mjs)
initializes a preset with explicit overrides and never reapplies presets on read. Both run no
project commands and make no external calls. Onboarding answers map to fields under the
[decision storage rules](onboarding.md#decision-storage). Worked
[examples](../refactor/configuration-examples.md) are design excerpts, not copy-ready manifests.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption manifest](adoption-manifest.md)
- [Adoption](adoption.md)
