# AGENTS.md - <Project Name>

This file is the root instruction file for AI agents working in this project.

## Required Reading

For every task, read in this order:

1. parent repository `AGENTS.md`, `README.md`, and `docs/INDEX.md` when this project lives
   inside a monorepo
2. this project `README.md`
3. this project `docs/INDEX.md`
4. shared standards from the repository root `docs/standards/`, or local copied standards when
   this project is standalone
5. `change-protocol.md` from that standards path
6. `quality-gate.md` from that standards path
7. stack-specific standards for touched files
8. nearest folder-level `README.md` or `AGENTS.md`

## Project Context

Describe the project purpose, main applications, services, and bounded contexts.

## Stack Profile

Select one and keep it aligned with `README.md` and `docs/INDEX.md`:

- Next.js frontend only
- Next.js full stack
- Next.js + Python FastAPI
- documented exception: <profile>

## Architecture Rules

- Follow Clean Architecture and separation of concerns.
- Dependencies point inward.
- Domain code must not depend on frameworks or infrastructure.
- Application code depends on ports, not concrete adapters.
- Infrastructure implements ports and owns IO.
- Keep modules grouped by feature or bounded context.

## Change Protocol

Agents must follow the change protocol for branch setup, commits, push, PR, and review loops.

Default rules:

- Check git status before switching branches, pulling, stashing, or committing.
- Protect unrelated user changes.
- Start from the documented base branch, defaulting to `main` when not specified.
- Pull the latest base branch before creating the task branch.
- Commit after each coherent logical step when verification for that step has passed or the
  limitation is documented.
- Do not push or open a PR without explicit user approval, unless the user requested an
  end-to-end PR flow at the start.
- After local work is done, ask whether the user wants to inspect first or wants the agent to
  push and open a PR.
- After opening a PR, request independent review with available review tools, skills, or
  sub-agents, fix valid findings, and repeat until clean or five review cycles have run.
- After five review cycles, escalate to the user with remaining findings and a recommended
  next step.
- End every interaction with either the next action being taken or a concrete question with
  suggested next steps.

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

Run from the relevant project root before reporting completion. Use `quality-gate.md` and the
selected stack profile as defaults, then replace placeholders with real repository commands.

```bash
# format or auto-fix

# lint

# type check

# test

# build
```

If these commands do not exist, stop and report a blocker unless this file documents an
approved replacement.

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
