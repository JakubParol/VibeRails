---
name: e2e-work-item
description: Implement or resume an agreed task through its authorized handoff. Use for an end-to-end implementation request from a brief or tracker item, not a lookup, explanation, or planning-only request.
---

# E2E Task Implementation

Use one bounded task, starting from a brief, an existing local record or a selected tracker.
Read [the common runbook](references/runbook.md) for an actual implementation run. Preserve
completed work, unrelated edits and the task's authorized endpoint; a handoff is not automatically
feature acceptance, publication or merge.

## Context Router

| Selected situation | Additional context |
|---|---|
| Azure Boards item | [Boards binding](references/azure-devops-work-items.md) and required MCP operation metadata. |
| Azure User Story with a plan | [Child-task policy](references/user-story-child-tasks.md); preflight creation and relation capabilities. |
| Jira item | Target-owned Jira profile and needed MCP operation metadata. |
| No tracker | Common runbook only; do not create a tracker or task record merely for uniformity. |
| Required/requested review | [Review skill](../code-review/SKILL.md) and its selected mode. |
| Relevant recurring failure | [Historical learnings](LEARNINGS.md), verified against current state before reuse. |

Follow the target's own context router/index and local rule owners. Without an applicable owner,
use the runbook's [native fallback](references/runbook.md#native-fallback). Source-pack
[workflow](../../../docs/standards/agent-workflow.md) and
[lifecycle](../../../docs/standards/change-protocol.md#task-lifecycle) links are defaults, not
instructions to load the pack or override target customization. Load provider detail for the
operation or capability gap at hand, not because an unused account or link exists.

## Completion Boundary

Resolve implementation, commit, push, PR publication, tracker writes and merge authority from
the task and target policy. A clear workflow request can cover several actions; carry forward
that authority. A link, configured profile or available tool grants none by itself.
For a team draft endpoint, leave publication/merge to the named human. For an explicitly
authorized merge endpoint, verify current acceptance/review/CI evidence before performing it;
advance authority does not require asking again, but changed scope or head needs reconciliation.

Use the runbook's [evidence](references/runbook.md#verification-and-evidence) and
[handoff](references/runbook.md#handoff) criteria. Complete the authorized work and meaningful
checks, or report the exact blocked step and remaining owner action. Do not stop at a plan when
implementation is authorized, invent PASS, or repeat still-valid checks merely to fill a phase.

## Runtime Boundaries

Use only real dispatch capabilities and the target's allowed model/effort routes. Record
requested versus observed settings; unobserved settings and usage stay unknown. Missing dispatch
blocks required delegation, not independent authorized work. No model is selected by prose.

Azure DevOps and Jira use the selected MCP operations only. A missing operation stays a capability
gap; no wrapper, CLI, REST or alternate-payload workaround. Preserve target transition gates,
revision protection, safe retries and readback under the conditional binding. Do not add a
runner, manifest field, tracker or orchestration service to execute this skill.

## Navigation

- [Common runbook](references/runbook.md)
- [Skills index](../README.md)
- [Repository docs](../../../docs/INDEX.md)
