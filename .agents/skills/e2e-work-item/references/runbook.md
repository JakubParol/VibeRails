# E2E Task Runbook

This is the common implementation runbook for the e2e-work-item skill. It applies the target's
task lifecycle without assuming a tracker, code host, CI provider, transport, or shell.
Resolve the target's lifecycle owner from its documentation index. The linked
[source-pack change protocol](../../../../docs/standards/change-protocol.md#task-lifecycle) is
default/reference material, not target authority; this runbook supplies task-level choices when
the target has no more specific owner.

## Contents

- [Task Source And Scope](#task-source-and-scope)
- [Start Audit](#start-audit)
- [Context And Plan](#context-and-plan)
- [Provider Readiness](#provider-readiness)
- [Authority](#authority)
- [Implementation Loop](#implementation-loop)
- [Verification And Evidence](#verification-and-evidence)
- [Handoff](#handoff)
- [Blocker And Final Reports](#blocker-and-final-reports)
- [Navigation](#navigation)

## Task Source And Scope

Start from one concrete source:

- a user brief with an outcome and acceptance conditions;
- an existing repository-local task record; or
- a selected tracker item whose profile provides the needed read operation.

A link or identifier is only enough to locate context. It is not permission to inspect a private
system, change code, transition a task, push, publish a PR, or merge.

For a no-tracker task, treat the user brief or existing local record as the task source. Capture
scope, acceptance conditions, and unresolved decisions in the existing plan or task record when
the target requires one. Do not create a hosted issue, a local board, or a new task document just
to make the workflow look uniform. There is no tracker state to transition at handoff.

For a tracked task, keep the task lifecycle common but load the selected profile only for the
operation required. Tracker state mapping, code-host PR actions, CI reads, and transport are
separate choices. A tracker transition must not imply a PR operation, and a PR must not imply a
tracker transition.

## Start Audit

Before any mutation, establish the current state needed for the next decision:

1. Identify the task source, current scope, acceptance conditions, and explicit authority.
2. Inspect the current repository branch and working tree. Preserve unrelated work.
3. Identify the applicable branch, change, review, and verification rules.
4. Resolve only the selected external profile, MCP connection, and operation metadata when a
   provider operation is required.
5. Identify blockers: ambiguous scope, missing acceptance conditions, unsafe local state,
   unavailable required context, unavailable required operation, or an authority gap.

Stop a dependent mutation when its prerequisite is absent. Continue separately authorized,
independent local work when its scope, safety, and handoff do not depend on the missing
operation.

## Context And Plan

Follow the target's context router. Read current instructions and source for candidate paths
before editing them, then make a short commit-shaped plan with expected files, focused evidence,
and unresolved decisions.

### Native Fallback

Read this fallback only when the target documentation index has no applicable context router.
Read, in order:

1. applicable repository and path-level AGENTS instructions;
2. the owning README or documentation index needed to identify local rules;
3. the task-path documentation, contracts, and interfaces needed for the planned change;
4. the actual focused quality commands and their limits; and
5. current repository state and provider state only when each affects the next action.

Stop loading context when it supports the next decision. Historical task reports, provider
examples, and previous branch records are reference knowledge, not current scope or authority.
Read them only to resolve a concrete uncertainty, then verify any time-sensitive fact against
current state.

For a delegated step, give the bounded scope, owned paths, relevant current decisions, and
available evidence. Select only an actual dispatch route permitted by the target policy and
runtime. Record requested model and reasoning settings separately from observed settings; an
unobservable setting remains unknown.

## Provider Readiness

Before an external read or write, resolve the selected target-owned integration profile through
its documentation index and inspect its current MCP connection and operation metadata. For Azure
DevOps and Jira, use MCP only. Do not fall back to a non-MCP path or a raw provider payload when
an MCP operation is absent. The linked
[source-pack integration profile reference](../../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery)
is a default when the target has no local profile, not authority for an external operation.

Classify a failure before trying another route: environment or checkout, configuration,
MCP connection startup, authorization, unsupported operation, or provider response. A successful
empty read can be a valid result; interpret it through the selected operation instead of treating
it as a transport failure. Do not retry permanent authorization, validation, not-found, process,
or stale-revision errors. Retry a transient read at most once when the provider profile permits
it. After an ambiguous create, update, comment, link, or transition, inspect remote state through
the available MCP read operation before any retry. Do not treat an error or an empty tool result
as proof that nothing happened.

Use a provider revision or version precondition for shared writes when the selected MCP operation
offers one. Readback verifies the saved outcome; it does not replace concurrency protection.
When no allowed revision-capable MCP operation exists, leave the shared state unchanged and report
the dependent operation as unavailable.

For Jira, use a transition, comment, or other operation only when the selected MCP connection
exposes it and the target-local profile authorizes it. If it does not, state the exact missing
MCP operation and prepare the allowed local handoff or manual step.

For Azure Boards, read [Azure Boards Work Item Binding](azure-devops-work-items.md). For any
other tracker, use its target-local binding. For a no-tracker task, skip external task-state
operations entirely.

## Authority

Read the target's authorization and delivery owner, resolved from its documentation index,
before the first operation that changes repository or provider state. The linked
[source-pack authority reference](../../../../docs/standards/change-protocol.md#authorization-and-delivery)
is a reusable fallback, not target permission.

A clear request can cover several operations, for example implementation, push, and PR creation,
when it names them. Do not ask again for an already authorized operation. Keep the following
boundaries explicit:

| Operation | Required authority |
|---|---|
| Implement scope | A clear request to make the described change. |
| Commit | The target protocol and agreed implementation workflow. |
| Push | A request that includes push. |
| Create a draft PR | PR delivery authority that includes the necessary push. |
| Publish or mark ready | A request that includes that PR action. |
| Merge | An explicit merge instruction after current evidence is read back. |
| Tracker write | A clear workflow request plus the selected profile's documented MCP operation and any target-local gate. |

A link, available tool, configured profile, or authenticated account grants none of these.

When an authorized task deliberately stops at draft handoff, keep the human action explicit:
source branch and head, review scope, evidence state, draft status if one was authorized, and
the publication or merge action still owned by the human.

## Implementation Loop

For each plan item:

1. Confirm the item still fits the task source and current authority.
2. Load only the local context needed for that item.
3. Implement the change and any meaningful focused test or documentation update.
4. Run focused local evidence when it materially reduces the changed risk.
5. Commit only the coherent task files when commits are part of the authorized workflow.
6. Update the selected tracker only through its conditional binding and only after its required
   evidence and safe write rules are satisfied.

Stop for an unresolved product decision, unsafe migration, unavailable protected dependency,
conflict with unrelated work, or missing authority. State the last safe commit or observed
state and the smallest decision needed.

## Verification And Evidence

Use the target's quality-gate evidence rules, resolved from its documentation index. The linked
[source-pack evidence reference](../../../../docs/standards/quality-gate.md#evidence-validity)
is a reusable fallback. Run changed-file format or lint checks and the smallest meaningful
behavior evidence locally. Full repository suites, builds, and aggregate gates belong to the
actual PR verification path unless the user explicitly requests a full local gate.

Keep evidence tied to the current source head and changed scope. A reviewed commit different
from the current source head is stale and requires an updated review. For CI, record the source
head, tested revision, actual run or check, outcome, and coverage. Do not call a draft PR green
until the actual draft CI path has been inspected; providers differ on whether required checks
run for drafts.

Pending, cancelled, skipped, absent, stale, or unrelated CI is not passing evidence. A successful
test process with zero executed cases, stale results, or missing required coverage is also not
passing evidence. Preserve valid unaffected evidence, and rerun only the focused check affected
by a fix unless a changed risk requires more.

## Handoff

Before reporting an implementation handoff, read back the actual state:

- source branch and current head;
- reviewed commit and whether it still equals the source head;
- changed scope and committed state;
- actual PR status when a PR exists or was authorized;
- local focused evidence;
- CI source/tested revision, outcome, and coverage;
- selected tracker state when a tracker was used; and
- remaining human action, acceptance decision, or merge authority.

Do not convert missing evidence into PASS. Task implementation completion, feature acceptance,
PR publication, and merge are distinct states. Merge only after explicit authorization and a
readback of the approved current state.

## Blocker And Final Reports

Use the target's existing reporting record. A blocker report names the current task, branch or
provider state, safe work already completed, evidence limits, exact blocked operation, and the
smallest needed decision. Do not keep retrying the same unsupported or unauthorized operation.

A final handoff report states the outcome, current revision, meaningful evidence and limits,
provider status when used, and the exact next human action. Link to existing task or commit
records instead of recreating a phase log.

## Navigation

- [Source-pack E2E skill guide](../SKILL.md)
- [Source-pack Azure Boards Work Item Binding](azure-devops-work-items.md)
- [Source-pack change protocol reference](../../../../docs/standards/change-protocol.md#task-lifecycle)
- [Source-pack agent workflow reference](../../../../docs/standards/agent-workflow.md#delegation-and-runtime-routing)
- [Source-pack integration profile reference](../../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery)
- [Source-pack quality-gate reference](../../../../docs/standards/quality-gate.md#evidence-validity)
