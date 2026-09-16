# Stage 04 - Local Checks And PR Verification

## Goal

Make verification proportional locally and complete where required in PR CI. Define the
contract clearly and establish a working verification path for VibeRails itself.

## Agreed Scope

Scope revision: `verification-1`, approved on 2026-09-16.

- Define `local-focused` and `ci-first`: changed-file format/lint and the smallest relevant
  behavior checks locally; broad type checks, suites and builds in CI. Neither mode disables
  existing required checks or authorizes full local gates without an explicit user request.
- Align the canonical gate standard and directly conflicting templates/runbook references.
  Keep general review/delegation redesign and broad reading cleanup in steps 5-6.
- Reuse the existing Node validator with a simple explicit focused path for changed documents
  and relevant skill metadata. Add only concrete regressions needed for its actual behavior;
  do not introduce a generic task runner or a parallel validation framework.
- Add a minimal GitHub Actions PR Verification workflow for this repository, using its existing
  full documentation/skill checks and focused tests for maintained examples/checker behavior.
  This is repo verification, not the reusable Azure/GitHub packages deferred to step 12.
- Keep verification evidence tied to source and tested revisions, with a short failure summary
  so agents inspect relevant output instead of repeatedly rerunning all checks locally.
- Define the no-CI/unavailable-CI path: preserve meaningful local evidence, report missing
  required coverage, and explicitly agree any exception; never silently escalate or claim PASS.
- Clarify test scope and infrastructure fidelity, including integration tests against the
  project's actual database technology. Preserve useful existing guards and distinguish unit
  doubles from infrastructure evidence; do not add a mandatory test matrix for hypothetical stacks.

Concrete command/interface details will be chosen during this scoped implementation. Prefer
small changes to existing tools. Current Actions workflow count is zero; legacy aggregate
validators exist, and the Node Markdown checker must be checked against actual fenced examples.

Out of scope: application changes, project migrations, deployment/CD, repository administration
or branch-protection changes without separate authorization, reusable CI/CD provider packages,
model/routing optimization, central telemetry, and the deferred Astra sources.

## Acceptance Criteria

- Documentation and direct workflow consumers agree on local versus CI responsibility.
- A focused local command checks its declared scope honestly; relevant broken input is detected
  without claiming a complete repository check. Existing full checks remain available for CI.
- Concrete validator changes have small behavioral regression tests; example behavior remains
  reproducible. No tests exist merely to assert instruction wording.
- The new PR workflow actually runs and its result is read back against the current revision,
  or a real external limitation is reported explicitly. Empty/missing checks never mean green.
- Missing CI, failed checks and stale evidence have clear next actions. Fixes rerun only affected
  local checks; required full verification runs in CI.
- Independent review, user acceptance and explicit merge close the stage; step 05 waits.

## Agreement And Authorization

- Entry date: 2026-09-16. User confirmed stage 03 merged and asked to continue.
- Branch/checkpoint preparation and discussion are authorized by the operating loop.
- Parent proposed small local checks, full PR verification and a real minimal GitHub Actions
  pipeline for this repository. User replied `ok` on 2026-09-16, approving verification-1.
- Authorized: scoped implementation, meaningful targeted tests, documentation, review, commits
  and a stage PR including the workflow. Branch-protection/admin changes and merge remain excluded.

## Delegation

| Assignment | Requested model / effort | Reason | Ownership |
|---|---|---|---|
| Focused validator and regression tests | GPT-5.6 Terra / max | CLI scope, filesystem inputs and Markdown parsing need careful behavior checks | Only scripts/validate.mjs and scripts/tests/validate.test.mjs; no Git/PR operations or full real-repo gate. |
| Verification-policy consistency | GPT-5.6 Sol / high | Reconcile directly conflicting standards/templates/skill references without broad redesign | Read-only advice; parent owns documentation edits. |
| CI, integration and verification | Parent | Keep one publication/evidence owner | Workflow, documents, code review, focused checks and live CI readback. |
| Independent validator/CI review | GPT-5.6 Sol / high | Review scope correctness and executable pipeline risks | Read-only scripts, regression tests and repository workflow; no full local gate. |
| Final policy review | GPT-5.6 Sol / high | Check the implemented local/CI and handoff contract | Reuse the policy advisor's context; read-only documentation/skill review. |

Requested model/effort is not measured usage. Record outcomes and any escalation after work.

Terra delivered explicit `--files` validation, unchanged full/no-argument compatibility, fenced
code handling and nine regression tests (9/9 passed in small temporary repositories). Parent
inspected the implementation before integration. Sol's policy advice was incorporated into
the directly affected standards, templates and skills. Independent code/CI and policy reviews
found two P2 issues: Markdown code handling could hide real broken links, and database-neutral
guidance still contained generic PostgreSQL fixture requirements. Parent accepted both findings;
Terra owns the small parser regression fix, and parent owns the documentation clarification.
The same worker also extracts Markdown navigation into one internal module to keep source
files within the existing 400-line limit; no runner or dependency is introduced. Review will
rechecked these changes. Terra returned 10/10 passing regression tests after the extraction/fix;
both source files are below 400 lines. Sol confirmed the database-policy finding is resolved.
The independent code reviewer confirmed all three link regressions are fixed, inspected the
extraction and reran only the affected suite (10/10). Both reviews have no remaining actionable
findings. No escalation or measured usage data is available.

## Implementation Decisions

- Keep one Node validator and its existing checks; `--files` does not perform a repository walk.
  It checks selected text/outgoing links and affected skill metadata, with explicit limits for
  deleted paths, incoming links and global reachability. No runner, dependency or active config
  resolver was added.
- Correct Markdown navigation checks to ignore fenced examples and inline code. This removes
  false links from the existing executable architecture examples without excluding real links.
- Keep `validate.ps1` unchanged as a legacy compatibility path, with no focused-mode/parser-parity
  claim. Do not execute PowerShell or expand script consolidation into this stage.
- Add this repo's read-only GitHub PR/main workflow with pinned action commits, Node 24,
  validator regressions, full Node validation and the existing architecture behavior recipe.
  Record source head separately from actual checkout SHA and preserve per-step outcomes.
- Keep manifest v1 shapes and existing adoption state. Document focused commands versus the
  aggregate command reference; no silent adopted-project migration or branch-policy mutation.

## Delivery And Verification

Branch: `codex/refactor-04-verification`, based on accepted main
`965bc3c0231d2a90c3c2d563ebc1987759130cf0`. Published as draft
[PR #6](https://github.com/JakubParol/VibeRails/pull/6).
Reviewed content commit: `85763c39f0261052d625425eab8ad40912ada16e`.
The first [PR Verification run](https://github.com/JakubParol/VibeRails/actions/runs/35084546761)
passed at `2026-09-16T10:21:49Z`: source `85763c39f0261052d625425eab8ad40912ada16e`, actual
tested merge revision `9c27cec0a0dd36aa1acb5d6c12e4aee98d023530`. API readback and relevant job
logs confirm the regression suite, full documentation/skill gate, architecture examples and
evidence summary all succeeded. This is CI evidence, not a local full-gate run. Publication
checkpoint edits are checked separately and trigger another CI run; the PR/check record must
confirm the final head. Current lifecycle state is in [STATUS](../STATUS.md).

Local evidence for this implementation:

- Validator regression suite: 10/10 passed on temporary miniature repositories, including
  selected-file isolation, real broken links/anchors, code-span regressions, input rejection,
  affected skill metadata and retained full-mode orphan behavior.
- Parent focused validator: passed for 27 explicit changed files, including 23 Markdown files
  and two affected skills. Global reachability and incoming-link coverage were not claimed.
- Workflow YAML parsed; its exact architecture-example step ran successfully for both variants.
  This proves the maintained standard-library examples, not HTTP/DB integration.
- Changed-file whitespace checks passed. No full real-repo local gate or PowerShell ran.
- GitHub readback before publication: `main` still equals the accepted base and is unprotected.
  The workflow does not configure required branch checks; user acceptance/merge review retains
  responsibility for checking the actual result. No repository administration was changed.

The final PR/check record owns exact source and tested revisions; a documentation commit cannot
cite itself. Reconcile those before reusing evidence or merging. User acceptance and explicit
merge remain pending; stage 05 is not authorized.

## Acceptance Walkthrough

Review the local/CI split in the [canonical standard](../../standards/quality-gate.md) and the
honest focused-mode coverage in [script instructions](../../../scripts/README.md). On PR #6,
open the latest `Repository checks` run: confirm its source matches the current PR head and
the summary records the actual tested revision with successful required steps. The changed
policy does not require full local gates or treat absent CI as success. Accept and authorize
merge only after this evidence is satisfactory.

## Navigation

- [Current status](../STATUS.md)
- [Quality gate standard](../../standards/quality-gate.md)
- [Audit findings](../audit-01.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
