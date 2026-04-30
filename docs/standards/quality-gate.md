# Quality Gate Standard

Every project must document exact commands that prove a change is ready to submit. Agents must
run the documented gate before reporting implementation complete.

## Required Gate Areas

| Area | Required when |
|---|---|
| Format or auto-fix | A formatter exists for the stack. |
| Lint | Code or docs linting exists. |
| Type check | The stack supports static types. |
| Unit tests | Business logic or reusable code changes. |
| Integration tests | Behavior depends on database, API, filesystem, queue, auth, or network adapters. |
| Build | The project produces a deployable artifact. |

## Defaults By Stack

Next.js:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Python FastAPI:

```bash
ruff check .
mypy .  # or pyright
pytest
```

Monorepo:

```bash
# root gate
<root quality command>

# changed project gate
<project quality command>
```

Replace defaults with repository-specific commands when scripts already exist.

## Missing Gate

If no quality gate exists, agents must:

1. report the blocker
2. propose the smallest useful gate for the stack
3. ask whether to add the missing scripts or continue with a documented exception

Do not invent an unofficial verification path and present it as the project gate.

## Navigation

- [Documentation index](../INDEX.md)
- [Change protocol](change-protocol.md)
- [Stack profiles](stack-profiles.md)
