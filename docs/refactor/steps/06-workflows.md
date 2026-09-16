# Stage 06 - Workflows, Skills And Integrations

## Agreement And Scope

Scope revision: `workflows-1`, approved on 2026-09-16. The user accepted plan revision 1.1
and its separate review, authorized stage 06 implementation and neutral denylist cleanup,
bounded delegates, independent review, focused local checks, CI, commits, push and one PR.
This is scope agreement, not approval to merge or start stage 07.

**IF A SIMPLE SOLUTION IS ENOUGH, KEEP IT SIMPLE.**

- First, a separate cleanup commit removes source-specific denylist content, preserves its
  matching mechanism and local-path checks, documents the empty default and adds only missing
  synthetic regression coverage. Never copy removed values into new artifacts or messages.
- Implement the provider-neutral task lifecycle, no-tracker path, operation-specific authority,
  optional draft handoff, current-revision evidence and completion/acceptance distinction.
- Apply canonical context routing inside skills with conditional references and separate rules,
  supporting knowledge and history. Preserve optional use without full VibeRails adoption.
- Implement capability-aware integration selection, bounded retries, readback after ambiguous
  writes and provider revision protection where available; identify actual wrapper limitations.
- Make review staffing proportional, retain valid evidence and require real current test
  execution/coverage before claiming PASS. Preserve focused local versus full CI ownership.
- Apply explicit allowed dispatch routes using actual runtime capabilities; record requested
  versus observed model/effort, unavailable routes, permitted fallback and escalation reasons.
  No recommendation catalog, new manifest fields or future configuration activation.

No history rewrite, external experimental writes, account/branch-protection changes, installs,
PowerShell execution, new runner/adapter/orchestration engine, stage 07 research, stage 08
migration, full pilot, telemetry, kanban or new stack support is authorized.

## Rule Owners And Direct Consumers

| Responsibility | Canonical owner | Direct consumers to reconcile |
|---|---|---|
| Task lifecycle, authority and handoff | change-protocol.md | Project templates, E2E and review skills/modes, provider PR guidance. |
| Context and dispatch | agent-workflow.md | Skill entrypoints/references and bounded delegate packets. |
| Capabilities, failure classes, retry/concurrency | integration-profiles.md | Selected provider profiles and Azure DevOps references/wrappers where needed. |
| Real verification evidence and reuse | quality-gate.md | Review/E2E runbooks, output guidance, project quality template. |
| Review selection and mode behavior | code-review skill and its owning references | Local/GitHub/Azure modes and parent task orchestration. |
| Optional pattern matching | Existing Node and PowerShell validators | Denylist file, script documentation and small Node fixture tests. |

Use existing owners rather than a competing rule file. Preserve provider/transport boundaries
and useful local/native-project rules. Model evaluation remains 07; activation/migration 08.

## Environment And Acceptance Evidence

Accepted base: `78132cd9f2c8d5c80e949371e22dec546417d9ad`, confirmed merged PR #10 with passing
CI. Branch: `codex/refactor-06-workflows`. No prior stage 06 work or active writer was found.
Available: local POSIX shell, Node, Git/GitHub operations for this repository and bounded agent
dispatch. PowerShell is static-inspection-only. No live tracker/account writes are authorized.

Required evidence, with its type and limits recorded separately:

- Node regressions for empty/comment-only denylist, synthetic matching and retained local-path
  detection; scan all current tracked files with original patterns held only in process memory,
  including validator exclusions. Report counts/paths only. No historical erasure claim.
- Controlled agent trials: ambiguous write -> remote readback without a duplicate; stale
  reviewed SHA -> missing current review; zero/stale/skipped test result -> no false PASS;
  missing integration operation -> explicit limitation without unauthorized write fallback.
- A simple no-tracker path and available/unavailable dispatch handling. Actual successful
  dispatch does not prove the requested model was observed; unavailable observations stay unknown.
- Code changes, if needed, require meaningful regression evidence. Instruction trials must test
  agent choices, not literal wording. Fixtures/mocks are not live integration or provider-enforced
  permission proof. Existing repo PR/CI supplies real code-host handoff evidence only.
- Independent review, focused changed-file checks and actual current-head CI. User acceptance
  and explicit merge plus confirmed merge are still required for Done.

## Delegation And Delivery

Initial cleanup: 13 original patterns produced 15 occurrences in the denylist alone. After
removal, a case-insensitive scan of all tracked and new task files, with no validator exclusions,
found zero matches. Original values were held only in the scanning process; none was printed,
copied or used as fixture data. History and deletion diffs remain unchanged history.
The separate cleanup commit preserves both validator implementations and adds two regressions.
Three relevant Node tests passed: existing synthetic matching, empty/comment-only lists and
local-path detection with an empty list. Focused file checks and whitespace checks passed.
Both readers ignore blank/comment lines by inspection; PowerShell was not executed.

Parent owns all shared Git/PR and coordination records. Assign bounded paths and explicit
model/effort after the initial cleanup; record outcomes and any escalation here. Never delegate
inspection/output of removed denylist values. Measured model usage is unavailable unless observed.

Default: one stage PR, cleanup first in its own commit, then coherent responsibility commits.
No additional checkpoint PR chain. The final PR/check record owns source/tested SHA evidence.
Current lifecycle and next action belong only in [STATUS](../STATUS.md).

## Navigation

- [Current status](../STATUS.md)
- [Plan scope](../../refactor-plan.md#step-06-workflows-skills-and-integrations)
- [Change protocol](../../standards/change-protocol.md)
- [Integration profiles](../../standards/integration-profiles.md)
- [Documentation index](../../INDEX.md)
