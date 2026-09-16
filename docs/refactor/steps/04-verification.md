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

Requested model/effort is not measured usage. Record outcomes and any escalation after work.

## Delivery And Verification

Branch: `codex/refactor-04-verification`, based on accepted main
`965bc3c0231d2a90c3c2d563ebc1987759130cf0`. No stage PR or verification-policy changes yet.
This checkpoint closes stage 03 and opens discussion. Current state is in [STATUS](../STATUS.md).

## Navigation

- [Current status](../STATUS.md)
- [Quality gate standard](../../standards/quality-gate.md)
- [Audit findings](../audit-01.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
