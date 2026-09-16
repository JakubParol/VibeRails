---
name: e2e-work-item
description: Run an authorized end-to-end implementation from a user brief, an existing task record, or a selected tracker. Use for an implementation run or resume through a verified handoff, not for a tracker lookup or planning-only request.
---

# E2E Task Implementation

Use this skill for one bounded implementation task from an agreed brief, an existing local task
record, or a selected tracker item. It coordinates the common task lifecycle while keeping the
tracker, code host, CI provider, and transport separate.

An implementation handoff can be complete while feature acceptance and merge remain pending.
Resume from current task, branch, working-tree, provider, and evidence state. Do not replay work
or overwrite unrelated changes.

## Read When

For an actual E2E implementation run, read [the common runbook](references/runbook.md).

Read additional material only for the selected situation:

| Situation | Read when |
|---|---|
| Azure Boards work item | The target selected Azure DevOps work tracking and its current MCP metadata exposes a needed Boards operation. Read [Azure Boards Work Item Binding](references/azure-devops-work-items.md). |
| Azure Boards User Story | The selected item is a User Story and the implementation plan is ready. Read [Azure Boards User Story Child Tasks](references/user-story-child-tasks.md). |
| Jira work item | The selected Jira MCP connection exposes an authorized operation needed for this task. Read the target-local profile and that operation's metadata. |
| No tracker | The task starts from a user brief or existing local task record. Stay in the common runbook; do not create a tracker or task record merely to run the task. |
| Review | The user requests a review or the target requires one before handoff. Read the [source-pack code-review reference](../code-review/SKILL.md). |
| Historical skill knowledge | A directly relevant recurring issue needs comparison with [LEARNINGS.md](LEARNINGS.md). Treat it as history, reverify it, and never infer current rules or write authority from it. |

Do not load a provider reference just because a link, tool, account, or optional skill exists.
Those are routing clues, not instruction or write authority.

## Context And Dispatch

Resolve the target's current context router from its own documentation index, then follow its
selected rules and read only the references required for the next decision. The source-pack
[VibeRails agent workflow reference](../../../docs/standards/agent-workflow.md) is a reusable
default, not target authority or a reason to load the whole source pack.

Read the native fallback in the runbook when the target documentation index does not resolve an
applicable context router. It is bounded to applicable AGENTS instructions, the owning README or
docs index, task-path context, relevant quality commands, and current repository state.

For delegation, use the target's canonical routing policy and actual runtime dispatch
capabilities. Request model and reasoning settings through the available dispatch mechanism;
record requested settings and observed settings separately. If runtime settings cannot be
observed, record them as unknown rather than inferring them from a catalog, inherited context, or
prompt text.

## Authority And Handoff

The target's own change protocol, resolved from its documentation index, owns implementation,
push, PR publication, and merge authority. The source-pack
[change protocol reference](../../../docs/standards/change-protocol.md#authorization-and-delivery)
is a reusable default, not target permission. A clear workflow request can authorize several
named operations. A task link, provider profile, available tool, or connection does not
authorize any operation by itself.

Keep these actions distinct:

- implementation changes follow the agreed task scope;
- push needs authorization to push;
- creating a draft PR needs delivery authority that covers its push, while publication needs
  its own PR operation authority;
- merge needs an explicit merge instruction after current handoff evidence is read back.

A team may choose a draft handoff: prepare the authorized branch, commits, evidence, and an
authorized draft PR when applicable, then stop for a human to publish or merge. Do not treat a
draft, a reviewed branch, or a tracker state as publication, acceptance, or merge.

Use the target's handoff and evidence rules. When a target has no local owner, use the runbook
fallback with the source-pack [handoff reference](../../../docs/standards/change-protocol.md#handoff-and-acceptance)
and [evidence reference](../../../docs/standards/quality-gate.md#evidence-validity).

## Boundaries

- Do not add a universal runner, adapter, tracker, manifest field, or orchestration service.
- For Azure DevOps and Jira, use only the selected provider's actual MCP operations and metadata.
  A missing MCP operation blocks its dependent step; do not route through a non-MCP path or a
  raw-provider-payload workaround.
- Keep provider-specific tools and state mappings in their conditional references.
- Preserve the target's stricter state-transition, branch, verification, and reporting rules.

## References

- [Common E2E runbook](references/runbook.md)
- [Azure Boards Work Item Binding](references/azure-devops-work-items.md)
- [Azure Boards User Story Child Tasks](references/user-story-child-tasks.md)
- [Source-pack change protocol reference](../../../docs/standards/change-protocol.md#task-lifecycle)
- [Source-pack agent workflow reference](../../../docs/standards/agent-workflow.md#delegation-and-runtime-routing)
- [Source-pack integration profile reference](../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery)
- [Source-pack quality-gate reference](../../../docs/standards/quality-gate.md#evidence-validity)

## Navigation

- [Source-pack skills index](../README.md)
- [Source-pack repository docs](../../../docs/INDEX.md)
