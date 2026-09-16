# Azure Boards User Story Child Tasks

Read this reference only after [Azure Boards Work Item Binding](azure-devops-work-items.md) is
selected and the requested Azure Boards item is a User Story. Do not load it for a requested Task,
a Jira issue, another tracker, or a no-tracker brief.

Apply these rules after the implementation plan exists and before the first code edit. The
companion Azure reference owns operation capability, shared-write protection, retry, and
readback; this reference owns child-task sizing and lifecycle mapping.

## Contents

- [Sizing Rules](#sizing-rules)
- [Existing Child Tasks](#existing-child-tasks)
- [Creating Child Tasks](#creating-child-tasks)
- [Child Task State Flow](#child-task-state-flow)
- [Navigation](#navigation)

## Sizing Rules

Codex-sized child Tasks are intentionally coarse. Do not create one task per endpoint, method,
component, test case, or commit. Prefer one child Task per standalone project or major
workstream:

| User Story scope | Child Tasks |
|---|---|
| API only | one API Task |
| Web only | one Web Task |
| API and Web | two Tasks: API and Web |
| API, Web, and worker | three Tasks: API, Web, Worker |
| Docs-only | one Docs Task |

Include implementation, tests, docs, and focused checks for the same project in the same child
Task. Add a separate Task only when the work requires a clearly different documentation root,
stack, or deployment surface.

## Existing Child Tasks

Inspect existing child Tasks first. If any exist, adapt to them and do not create new Tasks:

1. Read each child Task's title, description, state, assignee, relevant comments, and parent
   relation.
2. Build the implementation plan separately from the child Task list.
3. Map every plan item to an existing child Task, even when the existing breakdown is more
   granular than the preferred sizing.
4. Do not create, delete, split, rename, or rewrite existing child Tasks.
5. If existing child Tasks do not cover a User Story workstream, stop for a task decision rather
   than creating another Task.
6. If a child Task is Done, verify whether its scope is already complete. Return it to active
   state only when the current authorized fix must change that scope.

## Creating Child Tasks

When a User Story has no child Tasks, create only the coarse Tasks required by the approved
workstream grouping. Inherit area and iteration only after the selected profile confirms their
available values.

Work-item creation is non-idempotent. Use an authorized Azure DevOps MCP operation with a
task-specific fingerprint or marker. Before creating any child, confirm that required creation
fields and the parent relation can be supplied through available, authorized MCP operations,
including required revision protection. Read the parent and its revision first. If the required
relation operation is unavailable, block before creation rather than create an orphan.
When the child needs rich text, acceptance criteria, or
another post-create field, choose an MCP operation that supports required create fields directly,
or a path that observes the created revision before a guarded follow-up MCP update. Do not default
to a compound MCP create that writes rich text after creation without that guard. If no safe MCP
path exists, block the dependent child creation. Read back the created item's area, iteration,
state, assignee, title, and scoped description through MCP. After the safe relation update, read
back its parent relation. If creation is ambiguous, query the authoritative remote state through
MCP first, continue from exactly one matching item, stop for multiple or uncertain matches, and
retry creation at most once only after absence is proved.

Linking the child changes shared parent state. Use an already authorized revision-capable Azure
DevOps MCP relation update that protects the immediately observed parent revision. Do not link
when the selected MCP operation lacks that precondition. Re-read the parent revision immediately
before a separate link write. If an otherwise supported operation fails after creation, report
the actual child identity and incomplete relation, reconcile remote state before retrying, and
name the authorized cleanup or manual next action. Do not create another child or delete the
existing one without the required authority.

## Child Task State Flow

Before work on a mapped child Task, assign it to the authenticated user and move it to In
Progress through an authorized revision-capable Azure DevOps MCP update. Read back the saved
assignee and state through MCP. If a target process does not expose the required active or final
state, inspect its MCP metadata and stop instead of guessing a substitute.

Move a child Task to Done only when all mapped plan items are committed and focused evidence for
that workstream passes. Use the same safe MCP update and read back the final state. If a later
fix changes a completed workstream, return the child Task to In Progress through a safe
authorized MCP transition, make and verify the fix, then verify Done again.

## Navigation

- [Source-pack Azure Boards Work Item Binding](azure-devops-work-items.md)
- [Source-pack E2E task runbook](runbook.md)
- [Source-pack skills index](../../README.md)
