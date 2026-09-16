# Quality Gate Standard

Document two responsibilities: focused local evidence and full PR verification. Record the
actual commands, working directories and required CI checks. A green local subset is not a
green repository gate; creating a PR can be the prerequisite for obtaining the CI evidence.

## Gate Responsibility Split

Locally run changed-file format/lint and the smallest meaningful behavior tests or guards.
Broad type checks, full suites, builds and aggregate gates belong to PR Verification.

- Run a full local gate only on an explicit user request. Shared tooling, lockfiles, missing
  scoped commands or unavailable CI do not grant that permission automatically.
- `local-focused` documents focused local proof. `ci-first` adds an expected full PR pipeline.
  Both retain existing required project checks and user acceptance/merge boundaries.
- Record the selected policy through authorized adoption under [configuration.md](configuration.md),
  reconciling existing target instructions. A field does not prove migration or disable required CI.
- Preserve green evidence while its inputs remain unchanged. After failure, reproduce and
  rerun only the failing check or smallest relevant case; expand only for a concrete changed risk.
- New behavior needs meaningful test evidence. Documentation-only work needs document checks,
  not invented application tests or repeated unchanged examples.
- Full CI results remain required wherever the project requires them. Never suppress a failing
  check, lower a threshold, or treat absent/skipped verification as PASS.

## Path-To-Scope Map

Map changed paths to focused local evidence and CI coverage. A scope name alone does not make
an aggregate command cheap; inspect what an existing script actually runs. Example:

| Changed paths | Focused local evidence | Full PR coverage |
|---|---|---|
| API/worker behavior | Changed-file checks and relevant behavior/adapter cases. | Required types, suites, integration and build checks. |
| Web behavior | Changed-file checks and affected interaction tests. | Required web types, tests and build. |
| Shared tooling/lockfiles | Small relevant regression or smoke test. | Required affected-project/full repository checks. |
| Markdown only | Changed-document text, links and relevant metadata. | Full documentation/navigation/metadata gate. |

Use the branch diff and any current task edits to select evidence. If the map is missing,
document a small mapping from existing commands/CI; do not fall back to a full local run.

## Recommended Gate Script Interface

Reuse project-native tools and the selected [platform profile](platform-profiles.md). A script
is optional; do not build a new runner merely to wrap existing commands. Expose explicit local
selection separately from the aggregate command. For this standards repository:

```bash
# Local: explicit existing text files, not the whole repository.
node scripts/validate.mjs --files docs/standards/architecture.md
# CI (or an explicitly requested full local run):
node scripts/validate.mjs --all
```

A focused command must say what it covers and omits. It must not print a whole-repository
success claim. Deletions, incoming links, global reachability and wider integration may require
CI evidence even when selected-file checks pass. Choosing local scope is not disabling CI.

## Required Gate Areas

| Area | Required when |
|---|---|
| Format or auto-fix | A formatter exists for the stack. |
| Lint | Code or docs linting exists. |
| Type check | The stack supports static types. |
| Unit tests | Business logic or reusable code changes. |
| Integration tests | Behavior depends on database, API, filesystem, queue, auth, or network adapters. |
| Build | The project produces a deployable artifact. |

These remain coverage responsibilities; they are not instructions to run every category locally.
Place broad categories in CI, with a small relevant local check when it materially helps the
change. Real adapter correctness needs evidence against the actual production technology.

## Defaults By Stack

Full CI defaults for Next.js (replace with actual project commands):

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Full CI defaults for Python/FastAPI:

```bash
ruff check .
mypy .  # or pyright
pytest
```

Monorepo:

```bash
# Local: affected files / smallest relevant behavior test
<documented focused command>
# CI: required project and shared coverage
<documented full verification command>
```

Replace defaults with repository-specific commands when scripts already exist.

## Missing Gate Or CI

Use available focused checks and name the missing coverage, affected acceptance criteria and
next action. Missing CI does not authorize a full local gate. Continue independent work, but
do not claim required verification complete. A required-check exception needs explicit user
agreement and a record; do not silently convert failure/unavailability into success.

If no documented local commands exist, propose the smallest useful ones from existing tools.
Implement them only within authorized scope or agree a documented exception. Do not present an
ad-hoc check as the official complete gate.

## Evidence Validity

Inspect the actual result, not only the process exit code or a green-looking filename. For a
claimed test pass, establish the tested revision/inputs, selected scope, fresh run/report,
executed case count and failures/skips from the existing tool's trustworthy output. Missing or
stale reports, zero executed cases and all-skipped runs are not passed tests, even if the
process exits zero. Distinguish an intentionally inapplicable test category from a passed suite.
Documentation-only changes do not need invented application tests.

Use native summaries/logs or existing reports; JUnit is not mandatory. If a tool cannot supply
the needed evidence, state the specific coverage gap. Add a small adapter only for a demonstrated
need within authorized scope, not a new runner or universal report schema. Keep code tests,
controlled agent scenarios, integration simulations and live/provider-enforced operations
separate; fixture success cannot prove remote authorization, concurrency or platform behavior.

Retain green evidence while its relevant inputs remain unchanged. Review starting is not
invalidation. After a fix, identify which checks or review coverage were affected and rerun only
those locally. A new commit still needs the project's required current-revision CI; a previous
report must not be relabeled with the new head. Tests and review may cover different revisions
only with an explicit, verified account of the unchanged scope and separately checked delta.

## CI Evidence And Failure Recovery

Apply [evidence validity](#evidence-validity) and record source head, actually tested revision,
run/check link, outcome and coverage. PR workflows
may test a merge revision different from the source head; report both rather than calling them
the same SHA. Before relying on CI, verify it still covers the current change.

Read the summary first, then relevant failing-step output. Reproduce the smallest useful case,
fix it, and keep unrelated green local evidence. A new push lets CI rerun its required full
checks; do not mirror that full run locally. Pending, cancelled, skipped and absent are distinct
from passed. Preserve required check identities and report branch-policy limitations honestly.

## Navigation

- [Documentation index](../INDEX.md)
- [Change protocol](change-protocol.md)
- [Stack profiles](stack-profiles.md)
