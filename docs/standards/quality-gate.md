# Quality Gate Standard

Two responsibilities: focused local evidence and full PR verification in CI. Record the actual
commands, working directories and required CI checks.

## Gate Responsibility Split

- Locally: changed-file format/lint and the smallest meaningful behavior tests or guards.
- CI owns broad type checks, full suites, builds and aggregate gates, including integration
  tests against real adapters. Full CI command defaults per stack are in
  [stack profiles](stack-profiles.md).
- A full local gate needs an explicit user request. Shared tooling, lockfiles, missing scoped
  commands or missing CI do not grant it.
- `local-focused` means focused local proof; `ci-first` also expects a full PR pipeline. Both keep
  every existing required check.
- After a failure, fix it and rerun only the failing check or smallest case.
- New behavior needs meaningful tests; documentation-only changes need document checks.
- Never suppress a failing check, lower a threshold or count absent, skipped, pending or
  cancelled checks as passed.

## Agent Test Cadence

When `AGENTS.md` selects a cadence:

- **After all tasks in a User Story:** write tests with each change; after the last task run the
  focused evidence for the whole change, fix and recheck, then make the final commit and push.
  Earlier commits only save progress.
- **Before each task's commit and push:** run that task's focused evidence first.

Both keep defect-reproduction checks, required hooks and CI. Unselected projects keep their
existing cadence.

## Path-To-Scope Map

Map changed paths to focused local evidence and CI coverage from existing commands. Inspect what
a script really runs; a scope name does not make it cheap.

| Changed paths | Focused local evidence | CI |
|---|---|---|
| API or worker | Relevant behavior or adapter cases. | Types, suites, integration, build. |
| Web | Affected interactions, [visual acceptance](web-ui.md#visual-acceptance). | Tests, build, browser checks. |
| Shared tooling | A small regression or smoke test. | Affected projects or all. |
| Markdown only | Changed-document text and links. | Full documentation gate. |

A focused command states what it covers and omits, never a whole-repository success.

## Commands And Platforms

Record `profiles.scriptPlatform` (`powershell`, `posix-shell` or `both`; with `both`, keep
commands equivalent or name the canonical one). Document canonical commands in README, AGENTS
and the quality-gate document, prefer repository scripts, and never require a shell the project
does not already use. An optional gate script offers focused selection separately from the full
run.

## Missing Gate Or CI

Run the available focused checks and name the missing coverage, affected criteria and next
action. Missing CI never authorizes a full local gate or a pass claim. A required-check exception
needs explicit user agreement and a record.

## Evidence Validity

A passed check needs the tested revision, its scope, a fresh run and the executed, failed and
skipped counts. Missing or stale reports, zero executed cases and all-skipped runs are not passes,
even with exit code 0. Fixtures do not prove live provider, permission or platform behavior.
Keep green evidence while its inputs are unchanged. A new commit needs current-revision CI; never
relabel an old result with a new head.

## CI Evidence And Failure Recovery

Record the source head, tested revision (PR CI often tests a merge commit), run link, outcome and
coverage. Read the failing step, reproduce the smallest case locally, fix and push; CI reruns the
full checks.

## Navigation

- [Documentation index](../INDEX.md)
- [Change protocol](change-protocol.md)
- [Stack profiles](stack-profiles.md)
