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

Required standards:

- `agent-workflow.md`
- `adoption.md`
- `adoption-manifest.md`
- `change-protocol.md`
- `documentation.md`
- `documentation-audit.md`
- `integration-profiles.md`
- `platform-profiles.md`
- `quality-gate.md`
- `self-improve-loop.md`
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

Document focused local commands separately from PR Verification. Use `quality-gate.md` and
stack CI defaults, replacing placeholders with real commands, working directories and check names.
Local work uses changed-file checks and the smallest relevant behavior test; broad types,
suites and builds belong to CI unless the user explicitly requests a full local run.

```bash
# focused local checks and affected behavior case

# full PR verification command / required check name
```

Report missing/pending CI honestly and preserve required checks. Record the verified revision
and run link; reuse valid evidence and rerun only affected local checks after a fix.
