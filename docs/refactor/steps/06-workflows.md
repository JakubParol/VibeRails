# Stage 06 - Workflows, Skills And Integrations

## Agreement And Scope

Scope revision: `workflows-2`, amended on 2026-09-16. The user accepted plan revision 1.1
and its separate review, authorized stage 06 implementation and neutral denylist cleanup,
bounded delegates, independent review, focused local checks, CI, commits, push and one PR.
This is scope agreement, not approval to merge or start stage 07.

The user then explicitly required Azure DevOps and Jira through MCP and removal of the Azure
DevOps command wrappers. This supersedes the earlier wrapper-maintenance direction. Remove
the wrapper scripts and active CLI/REST instructions; missing MCP operations are reported as
capability gaps, not replaced with an automatic command/API fallback. Git/GitHub operations
for this repository remain authorized as before.

**IF A SIMPLE SOLUTION IS ENOUGH, KEEP IT SIMPLE.**

- First, a separate cleanup commit removes source-specific denylist content, preserves its
  matching mechanism and local-path checks, documents the empty default and adds only missing
  synthetic regression coverage. Never copy removed values into new artifacts or messages.
- Implement the provider-neutral task lifecycle, no-tracker path, operation-specific authority,
  optional draft handoff, current-revision evidence and completion/acceptance distinction.
- Apply canonical context routing inside skills with conditional references and separate rules,
  supporting knowledge and history. Preserve optional use without full VibeRails adoption.
- Implement MCP capability selection for Azure DevOps/Jira, bounded retries, readback after
  ambiguous writes and exposed revision protection; report actual MCP limitations.
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
| Capabilities, failure classes, retry/concurrency | integration-profiles.md | Selected MCP provider profiles and direct skill references. |
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

| Assignment | Requested model / effort | Scope and reason |
|---|---|---|
| Review skill behavior | GPT-5.6 Terra / max | Own code-review Markdown entry/references: adaptive staffing, authority, targeted checks and current evidence. |
| E2E skill lifecycle | GPT-5.6 Terra / max | Own e2e-work-item Markdown entry/references: common flow plus conditional provider/no-tracker paths. |
| Provider safety/capability guidance | GPT-5.6 Sol / high | Azure DevOps MCP guidance and capability limits; wrapper-maintenance work stopped after scope correction. |
| Common standards and integration | Parent | Own rule owners, direct templates, experiments, privacy scans and shared Git/PR. |
| Controlled behavior trial | GPT-5.6 Luna / max | Inspect synthetic MCP outcomes, stale/zero evidence and a local no-tracker task; one bounded permitted dispatch. |
| Independent integrated review | GPT-5.6 Sol / high | Review new workflow/authority logic, MCP-only integration, cleanup regressions and acceptance coverage. |

No worker may run PowerShell, a full local gate, live external writes or Git/PR mutations.
Eight Azure DevOps wrapper scripts are removed under the amended scope. Static inspection
performed before removal is not runtime/platform verification. No replacement wrapper is added.

Integration checkpoint: provider and E2E delegates replaced active Azure command/API guidance
with MCP operation/capability selection, and retained the no-tracker path. Parent aligned the
common owners, native fallback, templates, platform guidance and discovery descriptions.
The active-guidance scan found no `ado-*`/Azure command invocations. The shared runtime exposes
Jira MCP tool metadata; no Azure DevOps MCP tool is exposed in this session. Neither account
access nor provider-side write permissions were exercised. Historical 00-05 records remain intact.
Focused validation passed for 34 existing/new changed files and all three affected skills.
No full local gate or PowerShell was run. Controlled behavior trials and independent review
of the integrated result are still required before publication.

Trial baseline: `c093aa507d339764b8e61f1bc7d2bbd5f9304eb2`. Synthetic MCP transcripts are separate
from any live connection. A tiny Python standard-library task tests the no-tracker local path.
Native Node zero-selection output was captured with non-isolated execution: exit zero with
zero executed tests; default process isolation instead reports a passing file container, which
is not evidence that the named behavior cases ran. No unchanged behavior suite was repeated.

## Controlled Behavior Results

The parent dispatched the trial through the available root agent tool with requested Luna/max.
Actual executing model/effort were not exposed. The trial agent had no child-dispatch tool and
correctly reported that limit instead of substituting a user-visible task creation operation.
The allowed-route choice was bounded by supplied task settings, not a model benchmark/catalog.

| Trial | Observed agent behavior | Evidence boundary |
|---|---|---|
| Ambiguous MCP create | Selected readback for the exact repository/source/target. After a supplied authoritative one-match response, reused draft 41; no second create or publication/merge selected. | Two-phase simulated MCP transcript; no live provider call or server authorization proof. |
| Stale reviewed SHA | Rejected the old review for a new validation-behavior revision and retained the missing-review handoff gap. | Synthetic revision data; no actual PR review claimed. |
| Zero/stale/all-skipped tests | Rejected all three as current test PASS, despite successful process exits. | Native zero-selection output plus synthetic stale/skipped report metadata. |
| Missing integration operation | Kept the required protected update blocked; no CLI/REST or alternate-client write fallback. | Simulated MCP capability inventory. |
| No tracker | Edited only the small Python label function/tests; trimmed valid input, rejected blank input and preserved existing behavior. Three stdlib unit tests passed. | Actual controlled local task and code-test execution; parent inspected changed function/assertions. No remote/Git write or adopter runtime claim. |
| Available/unavailable routing | Root dispatch succeeded. The trial rejected unsupported Luna/ultra, identified the explicitly allowed Luna/max fallback and reported missing nested dispatch honestly. | Actual root dispatch plus capability/choice observation; no nested dispatch attempted and actual model/effort remain unknown. |
| Legacy command binding | Rejected an opaque non-MCP query binding and missing Jira query capability; sent no command or alternate-client operation. | Focused simulated decision after the manifest-semantics correction. |
| Child relation preflight | With no parent input or protected relation operation, blocked before child creation. | Focused simulated decision after the orphan-prevention correction; no remote child was created. |

Review found an MCP/legacy-field contradiction and child creation before relation-capability
preflight. Parent corrected existing field semantics without changing JSON schema/audit code,
required preflight before child creation, and retained partial-failure reconciliation. A final
alternate-client checklist bullet was aligned with the same owner. Focused review and trials
confirmed the fixes. Sol/high also checked the controlled transcript, evidence boundaries and
routing limitation; no actionable findings remain. No live Azure DevOps/Jira behavior is claimed.

Default: one stage PR, cleanup first in its own commit, then coherent responsibility commits.
No additional checkpoint PR chain. The final PR/check record owns source/tested SHA evidence.
Current lifecycle and next action belong only in [STATUS](../STATUS.md).

Published draft: [PR #11](https://github.com/JakubParol/VibeRails/pull/11). The first CI run
found one orphan historical E2E learning file after reference cleanup. Its conditional history
link is restored; unchanged behavior evidence is retained.
[PR Verification run 35101921806](https://github.com/JakubParol/VibeRails/actions/runs/35101921806)
passed all steps for source `4cbb2445b59e8e8b5e67beb799f08c523f6369ad`, tested merge
`28617812f512f9be2dd86a7a68b1ea7a61b2a0ad`: 12/12 validator tests, full documentation/skill
validation and both architecture examples. Parent read back step outcomes and source/tested
revision evidence. The publication checkpoint is checked separately; resolve the final PR head
and its check before relying on the result. User acceptance and merge are not yet authorized.

Acceptance: inspect the deleted Azure wrapper paths, MCP-only integration/skill guidance and
the controlled-behavior table above. The denylist is intentionally empty by default; synthetic
matching and local-path checks remain. Real Azure/Jira access/permission/concurrency is not
proved by these fixtures. The current PR/check record owns final-head CI and exact revisions.

## Navigation

- [Current status](../STATUS.md)
- [Plan scope](../../refactor-plan.md#step-06-workflows-skills-and-integrations)
- [Change protocol](../../standards/change-protocol.md)
- [Integration profiles](../../standards/integration-profiles.md)
- [Documentation index](../../INDEX.md)
