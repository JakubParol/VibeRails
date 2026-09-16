# AGENTS.md - <Project Name>

This file is the root instruction file for AI agents working in this project.

## Required Reading

Follow `agent-workflow.md` from the owning standards path, resolved through `docs/INDEX.md`.
It is the single context router, including parent/child instructions and task-specific reading.
List only additional project requirements here: `<none unless needed>`.

## Adopted Configuration

When selected, `.viberails/adoption.json` owns explicit configuration and instruction pins.
Follow `configuration.md` and the canonical router; do not duplicate its values here.
Absent configuration preserves the project's existing policy. Unknown/partial choices require
reconciliation, not defaulting. Record only project-specific differences below.

## Project Context

Describe the project purpose, main applications, services, and bounded contexts.

## Stack Profile

Select one and keep it aligned with `README.md` and `docs/INDEX.md`:

- Next.js frontend only
- Next.js full stack
- Next.js + Python FastAPI
- Python CLI
- Python worker
- shared package
- infrastructure
- Dapr or distributed app
- mixed monorepo: use `.viberails/adoption.json` `target.projectProfiles[]` for per-root profiles
- documented exception: <profile>

## Architecture Rules

- Architecture variant: use selected configuration or the existing explicit decision when unselected.
- Follow the owning `architecture.md`; record only local boundaries or exceptions here.
- Local architecture decisions: `<links or none>`.

## Change Protocol

Agents must follow `change-protocol.md` from the owning standards path for branch setup,
commits, push, PR, and review loops. Do not restate those rules here; this section only
records project-specific deltas:

- Base branch: `<main unless documented otherwise>`
- Branch naming: `<repository convention, if any>`
- Commit convention: `<repository convention, if any>`
- Other deviations from the change protocol: `<none by default>`
- Preferred agent handoff: `<local result | draft PR | project-specific workflow>`.
- Handoff owner and required evidence: `<existing team policy or task-specific agreement>`.

These preferences are not new manifest fields or write permission. Resolve actual task authority
and handoff through the change protocol; a preferred endpoint does not authorize reaching it.

## Local Documentation Rule

Follow `documentation.md` for structure and `agent-workflow.md` for selecting local context.
Documentation bundle: use selected configuration, preserving the existing policy when unselected.
Do not delete useful existing docs to fit a lighter bundle. Local documentation differences:
`<none unless needed>`.

## Quality Gate

Follow the owning `quality-gate.md` for local/CI responsibility and evidence. Keep only this
project's actual commands, paths, required CI checks and explicit exceptions below.

Path-to-scope map (keep aligned with CI change detection):

| Path prefix | Scope | Working directory | Focused local command | Platform | Required CI check |
|---|---|---|---|---|---|
| `<services/api/**>` | `<api>` | `<services/api>` | `<scoped command>` | `<posix|powershell|both>` | `<ci check>` |
| `<apps/web/**>` | `<web>` | `<apps/web>` | `<scoped command>` | `<posix|powershell|both>` | `<ci check>` |
| `<shared tooling, lockfiles>` | shared | `<repo root>` | `<small relevant regression>` | `<posix|powershell|both>` | `<full required coverage>` |

## Safety Rules

Follow the protected-work and authorization rules in the owning `change-protocol.md`.
Project-specific hazards or additional protections: `<none or links>`.

## Reporting

Follow `change-protocol.md#final-report` from the owning standards path. Add only local handoff
requirements here: `<recipient, needed evidence, or none>`.
