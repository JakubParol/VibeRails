# Azure Boards Work Item Binding

Read this reference only when the selected work-tracking profile is Azure DevOps and its current
MCP metadata exposes a needed Azure Boards operation. It binds the common
[E2E task runbook](runbook.md) to that MCP capability; it is not a route for Jira, another
tracker, or a no-tracker brief.

Resolve the target-owned profile and its local authority through the target documentation index.
Inspect the selected Azure DevOps MCP operation metadata for organization, project, work-item
type, available state names, fields, authentication, revision protection, and permitted
operations. Do not guess them from a URL, remote, previous task, or this reference.

## Azure Start Audit

Before a Board mutation, read the requested item, relevant comments, relations, and existing
child Tasks. Inspect process metadata when the planned operation depends on a type, field, state,
or relation. Record the item type, title, current state, assignee, area and iteration where
relevant, description, acceptance criteria, relations, and existing child Tasks.

Stop the dependent tracker step when Azure context or authorization is unavailable; the item is
unreadable, deleted, closed, or would need an unapproved reopening; its scope is not
implementable; the target has a strict transition gate that is not met; or the requested
revision-capable operation is unavailable. Continue separately authorized local implementation
only when its scope and safety do not depend on that tracker mutation.

## Azure Request Authority

The state names below describe lifecycle intent. Before a write, confirm the selected target
profile's actual mapping for In Progress, Done, and Code Review from current process metadata.
Do not guess a substitute state when the mapping is absent.

An explicit request to run or resume an Azure Boards E2E task, such as an E2E request naming a
specific Azure work item, authorizes these routine Board actions only when target-local rules do
not require a stricter gate:

- assign the requested item to the authenticated user;
- move the requested item to In Progress;
- for a User Story with no existing child Tasks, create and link the coarse child Tasks required
  by the approved implementation plan;
- assign active child Tasks, move them to In Progress, and move them to Done after their mapped
  work and focused evidence are complete;
- move the requested item to Code Review after the common handoff requirements and any
  target-local transition gate are satisfied.

A pasted item link, selected Azure profile, available tool, or authenticated connection alone
does not authorize any of those writes. This Board authorization also does not authorize
branch creation, commits, push, PR creation or publication, PR completion, merge, or release.
Those operations follow the common lifecycle and their own explicit authority.

If the requested item is already Code Review, verify that it is a clean resume before doing
local work. Do not silently move it backwards. For a requested Task, use that item as the active
implementation item, do not create child Tasks, and do not move it to Done unless the user
explicitly requests a different Task-state policy. For a User Story, load
[Azure Boards User Story Child Tasks](user-story-child-tasks.md) after the plan is ready. For
another work-item type, stop until the user or target profile supplies an explicit mapping.

## Safe Azure Writes

Use an actually available, authorized Azure DevOps MCP operation. For a shared existing work-item
field, state, rich-text field, or relation, including assignee changes and child links, first
resolve a revision-capable MCP update and use its immediately observed revision precondition. Do
not perform an update or link when the selected MCP operation cannot protect the revision. If no
authorized revision-capable MCP operation is available, leave the item unchanged and report the
dependent mutation as blocked.

When creation needs rich text, acceptance criteria, or another post-create mutation, do not
default to a compound MCP sequence that writes those fields after creation without a revision
precondition. Use an authorized MCP operation that supports the required create fields directly,
or observe the created revision and apply a guarded follow-up MCP update. If neither path is
available, block the dependent create rather than performing an unguarded compound write.

Read back every successful write. A created work item can partly succeed before an error, so
after an ambiguous result first query authoritative state by its marker or task fingerprint.
Continue from exactly one matching item, stop if the result is multiple or uncertain, and retry
creation at most once only after absence is proved. For a comment or PR thread, read the remote
record and continue only from one exact match; do not retry when it is multiple or uncertain.
An error is not evidence that no write occurred.

Readback confirms the saved result but does not replace a revision precondition when concurrent
updates are possible. Technical allow flags are execution gates after authority is granted; they
are not a second user-approval question. Keep provider-specific MCP operation limits in the
target's integration profile or MCP metadata rather than copying them into this generic binding.

## Azure Repos And CI Limits

Read Azure pull-request metadata only when Azure Repos is the selected code host and the selected
MCP connection exposes the needed authorized PR operation. Before a draft PR retry, read
authoritative PR state through MCP by its exact source and target refs. Continue from one matching
PR; do not create another when the result is present or uncertain.

Before an authorized PR completion or merge, read the live PR through MCP and compare its merge
source commit with the reviewed and tested source head. Required current CI evidence must be read
through an available MCP operation. Policies, MCP connection health, or draft state do not prove
a current run. If the available MCP completion operation cannot protect an expected source commit
and the target requires an atomic expected-head guard, leave completion to the authorized human
or report the capability as unsupported.

When the selected Azure DevOps MCP connection does not expose pipeline-run inspection, report CI
evidence as unavailable rather than improvising a non-MCP route, provider write, or PASS claim.

## Azure Work And Finish Mapping

Before implementation starts, assign the active requested item or mapped child Task and move it
to In Progress, then verify the saved state. For a User Story, complete a child Task only after
all mapped plan items are committed and focused evidence for that workstream passes. After-story
test cadence keeps earlier children pending verification while implementation continues; progress
commits are not tested completion. Close the covered children after final checks. If a later
fix changes a completed child Task, return it to In Progress through a safe authorized transition
before the fix, then verify Done again after the new evidence.

When an assignment changes an existing owner, record the previous assignee in the task handoff
record before applying the authorized safe update.

Move the requested item to Code Review only when its acceptance criteria are implemented or
explicitly out of scope by its text, task changes are committed, mapped child Tasks are verified
Done, focused local evidence passes, and current CI state and coverage are recorded. A required
CI result that is pending, skipped, absent, stale, or unrelated to the current revision is not
passing evidence.

If the target requires CI before Code Review, that state blocks the transition until the required
current-revision evidence is available. If the target permits Code Review with CI pending, record
the exact coverage gap and do not call the handoff verified, ready, accepted, or mergeable.

Code Review is an Azure handoff state. It is not feature acceptance, PR publication, PR
completion, or merge. If the target's transition policy requires a published PR and publication
is not authorized, prepare the allowed handoff and report that condition instead of changing the
Board state.

## Navigation

- [Source-pack E2E task runbook](runbook.md)
- [Source-pack Azure Boards User Story Child Tasks](user-story-child-tasks.md)
- [Source-pack integration profile reference](../../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery)
- [Source-pack change protocol reference](../../../../docs/standards/change-protocol.md#task-lifecycle)
