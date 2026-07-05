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

## Context Budget Rule

Agents must use documentation indexes as routing maps, not as a reason to load every linked
file. Load the smallest set of documents that can prove the next decision:

- Always read required parent instructions and the standards that directly govern the change.
- Prefer `rg`, file lists, tables of contents, and headings before opening long documents.
- For multi-area work, load one area's local context at a time, then expand only when paths or
  dependencies cross a documented boundary.
- When a standard points to stack-specific rules, read only the stack rules for touched files.
- When a skill has `references/`, read the entrypoint first and then only the referenced file
  that matches the current operation.
- If a task needs a broader audit, state that broader scope explicitly before widening reads.

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

## Editing

Behavioral rules for branch setup, planning, when to ask, implementation, commits, push, PR,
and review loops live in [change-protocol.md](change-protocol.md). This document only owns
context loading and verification routing. Two rules worth repeating because they gate context
loading:

- Identify the smallest scope that satisfies the request before reading widely.
- Check whether project-specific instructions override template defaults.

## Verification

For code changes, follow [quality-gate.md](quality-gate.md): run the documented gate for the
changed scopes only, using the repository's path-to-scope map. The local gate proves the
changed scope; CI proves the whole repository. During implementation, prefer cheap focused
checks over full runs.

If the documented quality gate is missing, stop and report the blocker instead of inventing
an unofficial verification path.

## Reporting

Follow the final report requirements in
[change-protocol.md#final-report](change-protocol.md#final-report). Do not claim work is
complete unless verification was actually run or the limitation is clearly reported.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Change protocol](change-protocol.md)
- [Documentation standard](documentation.md)
- [Quality gate](quality-gate.md)
- [Coding standard](coding.md)
