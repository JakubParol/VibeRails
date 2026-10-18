# Agent Workflow Standard

This is the canonical context router. Project instructions, templates and skills point here and
add only local or operation-specific rules. A link is a route, not an instruction to read it.

## Context Loading Order

1. Read every applicable `AGENTS.md` from the repository root down to the target paths. A nearer
   file adds to its parents; it does not cancel them.
2. Use the owning `docs/INDEX.md` to find standards and local documents. In a monorepo use the
   child root's index and its parent links.
3. Pick rules from the table below. Read the whole relevant section, not only its heading.
   Reuse unchanged context you already loaded.
4. Check README/AGENTS along the target path and across every boundary the change crosses:
   public contracts, shared types, infrastructure and commands. If required context is missing,
   report the affected decision and continue only with independent work.

| Task | Read |
|---|---|
| Any change | [KIS](kis.md), the [change protocol](change-protocol.md) sections for the operation, and the verification row. |
| Documentation | The target document, local constraints and [documentation](documentation.md). |
| Code or tests | [Coding](coding.md), [architecture](architecture.md), local boundaries and the affected stack standard. |
| Verification | The project's actual commands and the [quality gate](quality-gate.md). |
| Rendered web UI | [Web UI](web-ui.md), plus [frontend](frontend.md) for React/Next.js. |
| Review | The review skill or mode, the changed paths and the rules that govern them, and [KIS review](kis.md#kis-review). |
| Provider or skill | Its entrypoint, references whose "Read when" matches the operation, and [integration profiles](integration-profiles.md). |
| Adoption or refresh | The VibeRails source at the pinned ref (see below). |

Do not load inactive stacks, unused providers, old reports or all skill references by default.

## Adopted Choices And Pins

When `.viberails/adoption.json` exists, its `configuration` section holds the selected policies.
No `configuration` means the project keeps its existing (legacy) policy.

| Field | Values | Owner |
|---|---|---|
| `architecture` | `minimal`, `layered` | [architecture](architecture.md#two-variants) |
| `documentation` | `essential`, `standard` | [documentation](documentation.md#documentation-bundles) |
| `verification` | `local-focused`, `ci-first` | [quality gate](quality-gate.md#gate-responsibility-split) |
| `workflow` | `local`, `pull-request` | [change protocol](change-protocol.md#authorization-and-delivery) |
| `review` | `adaptive`, `independent` | [change protocol](change-protocol.md#review-loop) |
| `modelRouting` | `inherit` | [delegation](#delegation-and-runtime-routing) |

- An unknown or partial value blocks that choice, not independent work. Never fill it in from a
  preset. The manifest is data, not commands to run.
- Decisions without a manifest field live in the project's `AGENTS.md`: Git actions, review
  timing, delegation, models, test cadence and the KIS decision model.
- `promptBaseline` pins the hashes of maintained instruction files. Changing a pinned instruction
  needs a reviewed pin refresh; code-only work never repins.
- Adoption, refresh and pin procedures live in the VibeRails source recorded in
  `viberails.sourceRemote` and `viberails.sourceRef`. Read them there when the task needs them.

## Delegation And Runtime Routing

- Delegate bounded work when project policy allows it and it helps. Give the task, owned paths,
  applicable decisions, known evidence and the expected result, not the full history.
- Choose model and effort within the allowed policy and the runtime's real dispatch options.
  Prose does not switch a model; `modelRouting: inherit` keeps the runtime default. If a route is
  unavailable, use an allowed alternative that keeps required independence, or report the gap.
- Before retrying or escalating, rule out missing context, unclear scope or a broken tool.
- Record the requested model and effort, outcome and evidence in the task record. Observed
  settings and usage stay unknown unless exposed. Check delegated output before accepting it.

Project and folder `AGENTS.md` files hold local differences only, not copies of shared rules.

## Navigation

- [Documentation index](../INDEX.md)
- [KIS](kis.md)
- [Change protocol](change-protocol.md)
- [Quality gate](quality-gate.md)
