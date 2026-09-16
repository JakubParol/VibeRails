# <Project Name>

Short description of what this project does and who uses it.

## Structure

```text
.
|-- AGENTS.md
|-- README.md
|-- docs/
|   `-- INDEX.md
|-- apps/
|   |-- web/
|   |   |-- README.md
|   |   |-- AGENTS.md
|   |   `-- docs/
|   |       `-- INDEX.md
|   `-- mobile/
|       |-- README.md
|       |-- AGENTS.md
|       `-- docs/
|           `-- INDEX.md
|-- services/
|   |-- api/
|   |   |-- README.md
|   |   |-- AGENTS.md
|   |   `-- docs/
|   |       `-- INDEX.md
|   `-- worker/
|       |-- README.md
|       |-- AGENTS.md
|       `-- docs/
|           `-- INDEX.md
`-- packages/
```

Adjust the tree to match the project. Keep only real folders. In a monorepo, every standalone
app, service, worker, mobile app, or package gets its own `README.md`, `AGENTS.md`, and
`docs/INDEX.md`.

## Getting Started

```bash
# install dependencies

# run locally

# run tests
```

## Architecture

Summarize the main applications, services, packages, and bounded contexts.

## Stack Profile

Select one:

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

Reference the canonical standards:

| Context | Standards path |
|---|---|
| Standalone repository | `docs/standards/` |
| Monorepo child project | `<relative-path-to-repo>/docs/standards/` |

Use `agent-workflow.md` from the owning standards path to select context for the task.
`docs/INDEX.md` lists available standards; availability is not mandatory reading. Link only
project-specific setup/architecture facts here instead of repeating shared rules.

## Documentation

- `AGENTS.md` - AI agent rules and required reading.
- `docs/INDEX.md` - project documentation index.
- child project `docs/INDEX.md` files - local documentation for each app, service, worker,
  mobile app, or standalone package in a monorepo.

## Quality Gate

Link the target's quality-gate document for commands, working directories, required CI checks
and coverage limits. Keep actual quick-start commands here only when they help a reader run the
project; shared verification policy belongs in `quality-gate.md`.
