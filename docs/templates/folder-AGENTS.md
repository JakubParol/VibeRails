# AGENTS.md - <Folder Name>

This file defines local rules for agents editing this folder.

## Purpose

Describe what this folder owns and what it does not own.

## Required Reading

Before editing this folder, read:

1. project root `AGENTS.md`
2. project root `docs/INDEX.md`
3. change protocol from the owning standards path
4. relevant standards from the owning standards path
5. nearest app, service, worker, mobile app, or package `AGENTS.md`, if this folder is inside
   a monorepo child project
6. nearest app, service, worker, mobile app, or package `docs/INDEX.md`, if present
7. this folder's `README.md`, if present
8. this file

The owning standards path is usually `docs/standards/` in a standalone repository and
`<relative-path-to-repo>/docs/standards/` in a monorepo child project.

## Boundaries

- Owns:
  - <owned responsibility>
- Does not own:
  - <out-of-scope responsibility>
- May import:
  - <allowed dependency>
- Must not import:
  - <forbidden dependency>

## Testing

Document the fastest useful tests for this folder and any required integration tests.

```bash
# focused tests
```

## Local Rules

- Add rules that are specific to this folder.
- Do not repeat global standards unless the local rule is stricter.

## Navigation

- Parent README: `../README.md`
