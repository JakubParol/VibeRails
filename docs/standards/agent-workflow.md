# Agent Workflow Standard

AI agents must work from general context to local context. The goal is to load enough
documentation to make correct changes without reading the whole repository by default.

## Context Loading Order

For every task:

1. Find the repository root and the nearest documentation root that owns the target files.
   A documentation root has `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
2. Read the repository root `AGENTS.md`.
3. Read the repository root `README.md` if project purpose, setup, or architecture is relevant.
4. Read the repository root `docs/INDEX.md`.
5. If the target is inside a child app, service, worker, mobile app, or package, read that
   documentation root's `AGENTS.md`, `README.md`, and `docs/INDEX.md`.
6. Read the general standard that matches the task from the repository root `docs/standards/`
   or from local copied standards in a standalone project:
   - standards adoption: `docs/standards/adoption.md`
   - all change work: `docs/standards/change-protocol.md`
   - documentation work: `docs/standards/documentation.md`
   - quality gates: `docs/standards/quality-gate.md`
   - architecture or module boundaries: `docs/standards/architecture.md`
   - code changes: `docs/standards/coding.md`
7. Read stack-specific standards for the files being changed.
8. Read the nearest folder-level `README.md` or `AGENTS.md`, starting from the target file's
   directory and walking upward until the owning documentation root.

## Folder Context Rule

Each documentation root must provide the full trio:

- `README.md`
- `AGENTS.md`
- `docs/INDEX.md`

Each significant folder inside a documentation root must give agents a local context file:

- `README.md` explains purpose, ownership, structure, and how humans use the folder.
- `AGENTS.md` explains rules agents must follow when editing that folder.

Leaf folders may omit local files only when the parent document clearly covers their purpose
and rules.

Do not create `docs/` folders in ordinary feature or module folders. Reserve `docs/` for the
repository root and standalone child project roots in monorepos.

## Before Editing

Agents must:

- Follow the change protocol for branch setup, commits, push, PR, and review loops.
- Identify the smallest scope that satisfies the request.
- Read the required standards for that scope.
- Inspect existing patterns before proposing or making changes.
- Check whether project-specific instructions override template defaults.
- Preserve user changes and unrelated work.
- State blockers when required quality gates or required context are missing.

## During Editing

Agents must:

- Keep changes focused on the requested outcome.
- Follow existing project style unless it conflicts with these standards.
- Prefer explicit boundaries, small modules, and dependency injection.
- Avoid hidden suppressions such as ignored lints, disabled tests, or weakened configs.
- Update documentation when behavior, setup, architecture, or folder rules change.

## Verification

For code changes, follow `docs/standards/quality-gate.md` and run the project's documented
quality gate from the relevant project root.
At minimum, projects should expose commands for:

- formatting or auto-fixing
- linting with zero warnings
- type checking where applicable
- unit tests
- integration tests when infrastructure behavior is affected

If the documented quality gate is missing, stop and report the blocker instead of inventing
an unofficial verification path.

## Reporting

Final reports should include:

- what changed
- where the important files are
- what verification was run
- what could not be verified
- any follow-up required from the user

Do not claim work is complete unless verification was actually run or the limitation is clearly
reported.

Every interaction should end with either a concrete next action or a focused question that
offers clear next-step options.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Change protocol](change-protocol.md)
- [Documentation standard](documentation.md)
- [Quality gate](quality-gate.md)
- [Coding standard](coding.md)
