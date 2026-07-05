# User Story Child Tasks

Load this reference only when the requested work item is a `User Story`. Task runs never need
it. Apply these rules after the implementation plan exists and before the first code edit.

## Contents

- [Sizing Rules](#sizing-rules)
- [Existing Child Tasks](#existing-child-tasks)
- [Creating Child Tasks](#creating-child-tasks)
- [Child Task State Flow](#child-task-state-flow)
- [Navigation](#navigation)

## Sizing Rules

Codex-sized child Tasks are intentionally coarse. Do not create classic granular development
tasks such as one task per endpoint, method, component, test case, or commit. Prefer one Task
per standalone project or major workstream:

| User Story scope | Child Tasks |
|---|---|
| API only | one API Task |
| Web only | one Web Task |
| API and Web | two Tasks: API and Web |
| API, Web, and worker | three Tasks: API, Web, Worker |
| Docs-only | one Docs Task |

Include implementation, tests, docs, and focused checks for the same project in the same child
Task. Add a separate Task only when the work would force an agent to load a clearly different
documentation root, stack, or deployment surface.

## Existing Child Tasks

Inspect existing child Tasks first. If any exist, adapt to them and do not create new Tasks:

1. Read every child Task, including title, description, state, assignee, comments when useful,
   and parent relation.
2. Build the agent's own implementation plan separately from the child Task list.
3. Map each plan item to an existing child Task. Adapt to the team's planning breakdown even
   when it is more granular than ideal for Codex.
4. Do not create new Tasks, delete Tasks, split Tasks, rename Tasks, or rewrite their scope.
5. If the existing child Tasks do not cover part of the User Story scope, stop with a blocker
   that names the missing workstream and asks for a task decision instead of creating another
   Task.
6. If a child Task is already `Done`, verify whether that scope is already complete. Reopen it
   only when the current fix must change that scope.

## Creating Child Tasks

When a User Story has no child Tasks, create coarse child Tasks with the Azure DevOps wrapper,
inheriting the User Story area and iteration when available.

Create only the Tasks required by the Codex-sized workstream grouping:

```powershell
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 `
  -Action CreateTask `
  -Project "<project>" `
  -Title "<user-story-id>: <workstream> implementation" `
  -Description "<short codex-sized scope and acceptance coverage>" `
  -Area "<user-story-area-path>" `
  -Iteration "<user-story-iteration-path>" `
  -AllowWrite
```

Link each created Task as a child:

```powershell
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 `
  -Action LinkChild `
  -Project "<project>" `
  -ParentId <user-story-id> `
  -ChildId <task-id> `
  -AllowWrite
```

## Child Task State Flow

For every active child Task, assign it to the authenticated user before work starts, move it to
`In Progress`, and verify the saved state:

```powershell
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 `
  -Action Update `
  -Project "<project>" `
  -Id <task-id> `
  -Field "System.AssignedTo=<current-user>" `
  -State "In Progress" `
  -AllowWrite
```

When all plan items mapped to that child Task are committed and focused checks for that
workstream pass, move the child Task to `Done` and verify it:

```powershell
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 `
  -Action Update `
  -Project "<project>" `
  -Id <task-id> `
  -State "Done" `
  -AllowWrite
```

If `Done` is not a valid state in the project process, inspect metadata and stop with a blocker
instead of guessing another final state.

## Navigation

- Runbook: [runbook.md](runbook.md)
- Skill guide: [../SKILL.md](../SKILL.md)
- Azure DevOps skill: [../../azure-devops/SKILL.md](../../azure-devops/SKILL.md)
- Skills index: [../../README.md](../../README.md)
