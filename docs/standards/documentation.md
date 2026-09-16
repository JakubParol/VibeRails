# Documentation Standard

Documentation is part of the project architecture. It gives humans and agents a fast path from
high-level context to the exact local rules needed for a change.

## Documentation Bundles

Bundles define maintained documentation coverage, not how much an agent reads per task.
Both use the same [context router](agent-workflow.md). Required local warnings, architecture,
authorization and verification rules remain applicable even for a one-line change.

| Responsibility | essential | standard |
|---|---|---|
| Repository and standalone project roots | README, AGENTS and docs/INDEX, kept concise. | The same roots; add cross-project maps when multiple areas need them. |
| Setup and verification | Real commands, prerequisites, ownership and known limitations in the root or nearest owning document. | The same facts, with linked operation/runbook detail for independently maintained workflows. |
| Architecture and contracts | Document non-obvious boundaries/decisions where needed; link canonical rules rather than copy them. | Explicit module/feature ownership and dependency/contract links for significant areas. |
| Significant folders | Parent/root coverage is enough when it names the folder and preserves all needed facts. Add a local README when the parent cannot explain its non-obvious role or workflow clearly. | A short local README for each significant feature, adapter or shared area; link outward for shared facts. |
| Local agent rules | Local AGENTS only for constraints that differ from the parent. | The same rule; no empty or repeated AGENTS files. |
| Extra ADRs, runbooks and reports | Only for a real decision, operation, handoff or required evidence. | The same value test; standard is not permission to generate empty documents or routine-success essays. |

Select a bundle explicitly in the owning project's existing instructions during authorized
documentation work. Preserve an unselected project's existing policy; the structure below
remains the legacy/standard default. A small project may choose standard and a large area may
choose essential if it retains the needed facts. Do not infer the choice from repository size.
Changing a label neither deletes documents nor proves a migration. Preserve useful existing
knowledge and navigation; reconcile any removal or relocation before claiming completion.
Authorized adoption can record the bundle in the manifest under the
[configuration contract](configuration.md#compatibility-and-activation-boundary). Reconcile
existing local instructions before recording it; unselected projects retain their existing policy.

## Documentation Roots

A documentation root is a folder that can be onboarded, run, deployed, tested, or copied as
one project. Every repository has a documentation root at the repository root. Monorepos also
have a documentation root for every standalone app, service, worker, mobile app, or package.

Example monorepo layout:

```text
repo-root/
|-- README.md
|-- AGENTS.md
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
`-- services/
    |-- api/
    |   |-- README.md
    |   |-- AGENTS.md
    |   `-- docs/
    |       `-- INDEX.md
    `-- worker/
        |-- README.md
        |-- AGENTS.md
        `-- docs/
            `-- INDEX.md
```

Every documentation root starts with:

```text
project-root/
|-- README.md
|-- AGENTS.md
`-- docs/
    `-- INDEX.md
```

Repository root `docs/` owns cross-project documentation and reusable standards. A child
project `docs/` owns project-specific documentation and links to shared standards instead of
duplicating them, unless that child project is meant to be copied out as a standalone project.

Do not create `docs/` folders in ordinary feature, module, or leaf folders. Use local
`README.md` and optional `AGENTS.md` there.

### README.md

Use for human-facing context:

- product or project purpose
- repository structure
- setup and run instructions
- architecture overview
- links to `AGENTS.md` and `docs/INDEX.md`

### AGENTS.md

Use for agent-facing rules:

- project context and scope
- required reading order
- project-specific constraints
- quality gates
- local documentation discovery rules
- parent repository context when this project lives inside a monorepo

### docs/INDEX.md

Use as the table of contents:

- list every document under `docs/`
- describe each document in one short sentence
- link back to this documentation root's `README.md` and `AGENTS.md`
- link up to the parent repository index when this is a child project in a monorepo
- keep links current when files move

## Required Documentation By Folder Type

| Folder type | Required documentation |
|---|---|
| Repository root | `README.md`, `AGENTS.md`, `docs/INDEX.md` |
| Standalone app, service, worker, mobile app, or package in a monorepo | `README.md`, `AGENTS.md`, `docs/INDEX.md` |
| Independently versioned or deployable shared library | `README.md`, `AGENTS.md`, `docs/INDEX.md` |
| Feature module, bounded context, adapter group, or shared internal library | Standard: local `README.md`. Essential: explicit parent coverage or a local README when needed. AGENTS only for local differences. |
| Leaf folder covered by parent documentation | No local file required |

When in doubt, treat runnable, deployable, independently testable, or independently copied code
as a documentation root.

## Folder Documentation

Document every significant folder using the selected bundle: a local README in standard, or
explicit parent coverage where sufficient in essential. A folder is significant when it contains:

- a bounded context, feature module, adapter group, or shared internal library
- domain rules that are not obvious from filenames
- setup, generation, migration, or deployment concerns
- local rules that differ from the parent folder

Default folder documentation:

```text
feature-or-module/
|-- README.md
|-- AGENTS.md        # only when local agent rules differ from the parent
|-- ...
```

Use `README.md` for stable human context. Add `AGENTS.md` when agents need local constraints,
required reading, allowed dependencies, testing rules, or known hazards.

Do not add `docs/` under these folders unless the folder is promoted to a documentation root.

## Hierarchy

Documentation flows top-down:

```text
Repository README / AGENTS
-> repository docs/INDEX.md
-> shared standards and cross-project architecture docs
-> app/service/package README / AGENTS
-> app/service/package docs/INDEX.md
-> project-specific design notes, ADRs, runbooks, or test docs
-> feature or module README / AGENTS
```

Agents should read the nearest relevant local document, not every document in the repository.

## Navigation Rules

- Every Markdown file must be reachable from an index, parent README, or parent AGENTS file.
- Every `docs/INDEX.md` links down to child documents.
- Repository `docs/INDEX.md` links to child project documentation roots in a monorepo.
- Child project `docs/INDEX.md` links to the parent repository index.
- Every document links up to its parent index or documentation root context.
- No orphaned Markdown files.
- Prefer relative links.

## Adoption Checklist

[Adoption](adoption.md) owns the copying/preservation workflow;
[documentation audit](documentation-audit.md) checks the selected coverage. Keep this standard
as the owner of documentation responsibilities, not another copy of the adoption procedure.

## When To Create More Docs

Create documentation when:

- a new documentation root is added, or an area needs facts not adequately covered by its parent
- a non-obvious architectural decision is made
- setup, deployment, migration, or testing requires specific steps
- agents need local rules to avoid repeated mistakes

Do not create documentation when it only repeats code or will go stale faster than it helps.
Update existing documents first.

## Doc Quality Rules

- Lead with what matters.
- Use short sections, tables, and checklists.
- Include concrete examples where they reduce ambiguity.
- Keep global standards stable and reusable.
- Put project-specific decisions in project docs, not in the shared template.
- Mark time-sensitive or version-sensitive docs with a date or version.

## Navigation

- [Documentation index](../INDEX.md)
- [Agent workflow](agent-workflow.md)
