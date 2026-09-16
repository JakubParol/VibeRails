# AGENTS.md - <Project Name>

This file is the root instruction file for AI agents working in this project.

## Required Reading

For every task, read in this order:

1. parent repository `AGENTS.md`, `README.md`, and `docs/INDEX.md` when this project lives
   inside a monorepo
2. this project `README.md`
3. this project `docs/INDEX.md`
4. `agent-workflow.md`, `change-protocol.md`, and `quality-gate.md` from the owning standards
   path
5. task-specific standards from that path, selected through `docs/INDEX.md`
6. stack-specific standards only for touched files
7. nearest folder-level `README.md` or `AGENTS.md`

Use indexes as routing maps. Do not load every standard or every local document unless the task
is explicitly a broad audit.

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

- Architecture variant: `<explicit project decision: minimal or layered; preserve legacy policy when unselected>`.
- Follow the owning `architecture.md` for selection and shared boundaries. Record an explicit
  standalone-area exception only when needed; do not infer a variant from repository size.
- Follow Clean Architecture and separation of concerns.
- Dependencies point inward.
- Domain code must not depend on frameworks or infrastructure.
- Application code depends on ports, not concrete adapters.
- Infrastructure implements ports and owns IO.
- Keep modules grouped by feature or bounded context.
- Minimal may use functions, colocated pure rules and narrow callable/Protocol ports; layered
  uses explicit layers where meaningful. Do not scaffold empty roles or bypass application ports.

## Change Protocol

Agents must follow `change-protocol.md` from the owning standards path for branch setup,
commits, push, PR, and review loops. Do not restate those rules here; this section only
records project-specific deltas:

- Base branch: `<main unless documented otherwise>`
- Branch naming: `<repository convention, if any>`
- Commit convention: `<repository convention, if any>`
- Other deviations from the change protocol: `<none by default>`

## Local Documentation Rule

Before editing a folder, look for local context in this order:

1. `AGENTS.md` in the target folder
2. `README.md` in the target folder
3. parent folder `AGENTS.md`
4. parent folder `README.md`
5. this project `docs/INDEX.md`

Every standalone app, service, worker, mobile app, or package in a monorepo must have its own
`README.md`, `AGENTS.md`, and `docs/INDEX.md`.

Every significant non-root folder must have a `README.md`. Add `AGENTS.md` when local agent
rules or dependency boundaries differ from the parent. Do not add `docs/` under ordinary
feature or module folders.

## Quality Gate

Follow `quality-gate.md`: locally run changed-file format/lint and the smallest meaningful
behavior checks. Broad types, full suites, builds and aggregate gates belong to PR CI. A full
local run requires an explicit user request, including for cross-cutting work or unavailable CI.
Preserve required checks and reuse green evidence while its inputs remain valid.

Path-to-scope map (keep aligned with CI change detection):

| Path prefix | Scope | Working directory | Focused local command | Platform | Required CI check |
|---|---|---|---|---|---|
| `<services/api/**>` | `<api>` | `<services/api>` | `<scoped command>` | `<posix|powershell|both>` | `<ci check>` |
| `<apps/web/**>` | `<web>` | `<apps/web>` | `<scoped command>` | `<posix|powershell|both>` | `<ci check>` |
| `<shared tooling, lockfiles>` | shared | `<repo root>` | `<small relevant regression>` | `<posix|powershell|both>` | `<full required coverage>` |

```bash
# changed-file checks and the smallest relevant behavior case

# full command belongs to CI; local execution only on explicit request
```

If commands or CI are unavailable, report missing coverage and the next action. Continue
independent work, but never report missing/pending verification as PASS or automatically expand
to a full local run. Record any required-check exception explicitly.

## Safety Rules

- Do not revert unrelated user changes.
- Do not weaken lint, type, test, or import-boundary rules.
- Do not add suppression comments to bypass quality gates.
- Do not change public API contracts without updating docs and tests.
- Report blockers instead of inventing undocumented workflows.

## Reporting

Final responses must include:

- changed files
- verification run
- verification not run and why
- blockers or follow-up work
