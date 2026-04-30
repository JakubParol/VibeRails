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
- documented exception: <profile>

Reference the canonical standards:

| Context | Standards path |
|---|---|
| Standalone repository | `docs/standards/` |
| Monorepo child project | `<relative-path-to-repo>/docs/standards/` |

Required standards:

- `change-protocol.md`
- `quality-gate.md`
- `stack-profiles.md`
- `architecture.md`
- `coding.md`
- stack-specific standards for this project

## Documentation

- `AGENTS.md` - AI agent rules and required reading.
- `docs/INDEX.md` - project documentation index.
- child project `docs/INDEX.md` files - local documentation for each app, service, worker,
  mobile app, or standalone package in a monorepo.

## Quality Gate

Document the exact commands agents and humans must run before submitting code. Use
`quality-gate.md` and the selected stack profile as defaults, then replace placeholders with
real repository commands.

```bash
# format or auto-fix

# lint

# type check

# test

# build
```
