# Scripts

This folder contains repository maintenance commands for VibeRails.

## Commands

| Script | Purpose |
|---|---|
| [validate.mjs](validate.mjs) | Node validator with explicit focused-file and full-repository modes. |
| [validation-markdown.mjs](validation-markdown.mjs) | Internal Markdown navigation checks shared by focused and full Node modes. |
| [validate.ps1](validate.ps1) | Legacy full PowerShell validator with `.ps1` syntax parsing; no focused mode or current Node-parser parity claim. |
| [install-skills.sh](install-skills.sh) | POSIX installer for optional skills at the Codex user scope (`$CODEX_HOME/skills` or `$HOME/.codex/skills`) as symlinks to this checkout. `--remove` deletes only the symlinks. |
| [install-skills.ps1](install-skills.ps1) | PowerShell installer for optional skills at the Codex user scope (`$env:CODEX_HOME\skills` or `$HOME\.codex\skills`) as Windows junctions or Unix symlinks. `-Remove` deletes only the links. |

## Local Verification

Use Node with explicit existing repository-relative file paths:

```bash
node scripts/validate.mjs --files README.md docs/INDEX.md
```

The command accepts Markdown, MJS, shell, PowerShell, JSON, YAML, `.gitattributes` and `LICENSE`
text files. It checks selected-file text hygiene and source leaks, outgoing Markdown links and
anchors, and metadata of affected skills. Link targets may be read to verify anchors; unrelated
documents are not scanned. Links/headings inside fenced code are not navigation, and complete
same-line inline code spans are excluded from link scanning. The checker covers the repository's
inline-link and heading conventions; it is not a complete CommonMark parser.

Focused mode reports its scope. It does not check incoming links, global reachability, orphan
documents or deleted paths. Pass surviving changed files after deletions and use CI for the
repository-wide result. Invalid/missing paths fail rather than silently running the full gate.

When validator behavior changes, run its small [regression suite](tests/validate.test.mjs):

```bash
node --test scripts/tests/validate.test.mjs
```

These tests create temporary miniature repositories, including fixtures for full-mode behavior;
they do not run the aggregate gate against this checkout. Documentation-only edits do not require
rerunning unchanged behavior tests.

## Adoption And Migration Checks

When adoption behavior changes, use the focused suite:

```bash
node --test scripts/tests/adoption.test.mjs scripts/tests/adoption-refresh.test.mjs
```

The [configuration/pin regressions](tests/adoption.test.mjs) and
[controlled adoption/update examples](tests/adoption-refresh.test.mjs) use
[synthetic target builders](tests/adoption-fixtures.mjs), real temporary files, native Python
stdlib tests and local Git. They never run commands taken from a manifest or contact providers.
They exercise structure, preservation and conflicts, not autonomous agent adherence, Windows
runtime behavior or real adopter integration. Existing validator coverage still belongs in CI.

The optional source-owned auditor lives in [docs/templates/adoption-audit.mjs](../docs/templates/adoption-audit.mjs)
with its [internal modules](../docs/templates/adoption-audit/README.md). Its read-only
[fingerprint helper](../docs/templates/adoption-pins.mjs) emits a candidate only; it does not
approve edits or repair stale pins automatically.

## Optional Denylist Scope

`source-leak-denylist.txt` is empty by default apart from an optional neutral comment.
The existing validator can match explicitly supplied literal patterns; an empty list cannot
detect particular project names or unknown names. Local-path checks and other validation
remain active. A green result is not evidence that all confidential information was detected.
Regression fixtures use only synthetic values. The PowerShell reader supports the same empty/
comment filtering by static inspection; this is not executed PowerShell or platform-parity proof.

## PR Verification

[Repository CI](../.github/README.md) runs the regression suite, full Node validation and the
maintained architecture examples. The full command is:

```bash
node scripts/validate.mjs --all
```

No arguments retain the full-mode compatibility behavior. Neither spelling is a local default;
local full gates require an explicit user request. Full validation adds all supported files,
all skill metadata and Markdown reachability/orphan checks. It is not a JavaScript linter or
proof that every referenced external service or example environment works.

Node is the canonical repository CI path. `validate.ps1` remains a legacy compatibility command;
its separate Markdown parser and PowerShell syntax checks are not covered by this workflow.
Never run `lint.ps1`; other PowerShell execution needs an explicit request. CI on Linux does
not prove Windows runtime behavior. Shared script consolidation remains a later adoption task.

## Controlled Pilot Reproduction

The stage 09 pilot is test tooling, not a new project runner. Export the pinned accepted
commits to two empty directories outside this checkout, then provide those paths:

```bash
git archive a60dca9638bf12cd84244aedcf5fc8d2a9734baa | tar -x -C /tmp/pilot-base
git archive d92f6fa34d1809997c2d9629d81ca382d00e9ff2 | tar -x -C /tmp/pilot-candidate
VIBERAILS_BASELINE_ROOT=/tmp/pilot-base VIBERAILS_CANDIDATE_ROOT=/tmp/pilot-candidate \
  node --test scripts/tests/pilot.test.mjs
```

Create the two empty directories first and fetch those commits when absent. The test refuses
missing snapshot inputs; it never silently compares the current checkout with itself. Node,
Python 3 and Git are required. Temporary synthetic targets and clones are removed afterward.
No provider calls, model execution or installation occurs. Test/check durations do not measure
agent task time or cost. See the [pilot report](../docs/refactor/pilot-09.md) for evidence limits.

## Rules

- Keep scripts deterministic and safe for read-only validation by default.
- Do not add commands that contact live services unless the script name and documentation make
  that behavior explicit.
- Keep generated credentials, tokens, and personal local paths out of scripts.

## Navigation

- [Repository README](../README.md)
- [Documentation index](../docs/INDEX.md)
