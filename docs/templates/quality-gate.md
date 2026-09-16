# Quality Gate

Run from: `<project-root>`

## Focused Local Checks

Run changed-file format/lint and the smallest meaningful behavior checks before handoff.
Replace these with real project commands and explicit file/test selection:

```bash
<changed-file-format-lint-command>
<smallest-relevant-behavior-check>
```

## PR Verification

Canonical full command: `<full-verification-command>`.
Workflow/check identity: `<required-check-name>`.
Working directory and runtime: `<directory-and-runtime>`.

Full CI coverage, where applicable:

```bash
# complete format/lint checks

# broad type checks

# required suites and real-adapter tests

# build deployable artifacts
```

## Path-To-Scope Map

| Changed path | Scope | Focused local commands | Working directory | Platform | Required CI check | Local required before PR |
|---|---|---|---|---|---|---|
| `<path-prefix-or-glob>` | `<scope>` | `<focused-command>` | `<working-directory>` | `<selected-platform>` | `<ci-check>` | yes |

## Required Before PR

- Applicable focused local checks pass, or a required-check exception is explicitly agreed.
- Documentation is updated when behavior, setup, architecture, or local rules changed.
- The PR identifies missing/pending CI and known limitations rather than claiming full success.

## Before Acceptance Or Merge

Apply the owning `quality-gate.md#evidence-validity` rules to required CI/test results for the
current source and tested revision. Keep the run/check link, executed/failed/skipped evidence,
outcome and a short failure summary. A pending, skipped, cancelled or absent check is not PASS.
Zero executed tests, stale reports and all-skipped runs are not test passes. Required checks
still need evidence or an explicitly agreed exception. Record the actual draft-PR CI path and
required publishing/handoff action; never infer it from the existence of a draft PR.

A full local gate requires an explicit user request, even for shared changes or unavailable
CI. After failure, rerun only the affected local check; reuse unchanged green evidence. CI runs
its required complete coverage after publication. Do not quietly downgrade a failed gate.

## Navigation

- Documentation index: `INDEX.md`
