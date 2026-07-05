# Quality Gate Standard

Every project must document exact commands that prove a change is ready to submit. Agents must
run the documented gate for the changed scopes before reporting implementation complete.

## Gate Responsibility Split

The local gate proves the changed scope. The CI pipeline proves the whole repository.

- Locally, run the documented gate only for the scopes the change touched, plus focused tests
  during implementation.
- Do not run the full repository gate locally by default when a PR pipeline enforces it.
  Full-suite runs on every task burn time and tokens without adding safety the pipeline does
  not already provide.
- Run the full local gate only when the change is cross-cutting (shared tooling, lockfiles,
  shared packages, or the gate script itself), when the repository has no scoped commands, or
  when the user explicitly asks for it.

## Path-To-Scope Map

Each repository must document how paths map to gate scopes, in the same shape its CI change
detection uses. Example:

| Path prefix | Scope | Gate command |
|---|---|---|
| `services/api/**` | `api` | `./scripts/quality-gate.sh --scope api` or `.\scripts\quality-gate.ps1 -Scope api` |
| `services/worker/**` | `worker` | `./scripts/quality-gate.sh --scope worker` or `.\scripts\quality-gate.ps1 -Scope worker` |
| `apps/web/**` | `web` | `./scripts/quality-gate.sh --scope web` or `.\scripts\quality-gate.ps1 -Scope web` |
| lockfiles, gate scripts, shared packages | shared | full repository gate |
| `*.md` only | docs | documentation and link audit |

Agents derive changed scopes from `git diff --name-only <base>...HEAD` and this map. When the
map is missing, propose one from the CI pipeline definition before falling back to full runs.

## Recommended Gate Script Interface

Repositories with a gate script should expose scope controls so agents and CI share one entry
point. Use the repository's selected platform profile from
[platform-profiles.md](platform-profiles.md).

Recommended POSIX shape:

```bash
./scripts/quality-gate.sh --scope <scope>
./scripts/quality-gate.sh --changed
./scripts/quality-gate.sh --scope <scope> --skip-tests
```

Recommended PowerShell shape:

```powershell
.\scripts\quality-gate.ps1 -Scope <scope>
.\scripts\quality-gate.ps1 -Changed
.\scripts\quality-gate.ps1 -Scope <scope> -SkipTests
```

Reduced local runs such as `--skip-tests`, `-SkipTests`, `--skip-build`, or `-SkipBuild` must
be intentional exceptions, never the default.

## Required Gate Areas

| Area | Required when |
|---|---|
| Format or auto-fix | A formatter exists for the stack. |
| Lint | Code or docs linting exists. |
| Type check | The stack supports static types. |
| Unit tests | Business logic or reusable code changes. |
| Integration tests | Behavior depends on database, API, filesystem, queue, auth, or network adapters. |
| Build | The project produces a deployable artifact. |

Within a changed scope, do not skip areas: a scoped run still covers format, lint, types, and
tests for that scope. Build runs when the scope produces a deployable artifact.

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
# scoped gate for one changed project
<project quality command>

# full gate - cross-cutting changes only
<root quality command>
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
