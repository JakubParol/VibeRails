---
name: e2e-work-item
description: Run an autonomous end-to-end implementation from an Azure Boards work item. Use when the user invokes an [E2E] prompt with an Azure Boards work item URL or ID, asks to run a slash goal from a Task or User Story, resumes an E2E work-item run, or wants Codex to assign the work item, move it to In Progress, create or reuse a branch, create coarse Codex-sized child Tasks for User Stories, implement the scope with commits per plan step, run final guard rails, and move the work item to Code Review.
---

# E2E Work Item

## Overview

Use this skill for one agent-owned implementation run driven by one Azure Boards work item. The
run exits only with a precise blocker or with all implementation commits complete, required
guard rails green, and the work item moved to `Code Review`.

This is an agent skill, not a rigid script. Resume from the actual state of the work item,
branch, commits, and working tree. Do not replay completed steps or overwrite unrelated work.

For any real E2E run, read
[references/runbook.md](references/runbook.md) after this file. The runbook is the canonical
workflow for start audit, work item state, child Tasks, implementation commits, guard rails,
finish state, and reports.

## Companion Skills

Before Azure DevOps reads or writes, load and follow
[`azure-devops`](../azure-devops/SKILL.md). Use its wrappers for work item
writes and comments.

Use `code-review` only when the user explicitly asks for a review pass or the current
repository policy requires it before Code Review.

## Trigger Parsing

Accept these inputs:

- `[E2E]-<Azure Boards work item URL>`
- `[E2E]-<work item ID>`
- natural language that clearly asks to run or resume an E2E work-item implementation.

Extract the work item ID, organization, and project from the URL when possible. If the ID or
project cannot be resolved from the prompt, Azure DevOps defaults, environment variables, or
the current Azure Repos remote, stop with a blocker.

When invoked from a slash goal, treat the goal as: implement the work item and move it to
`Code Review`. Do not mark the goal complete before that state is verified.

## Approved Scope

The `[E2E]` invocation is explicit approval for these writes only:

- assign the requested work item to the authenticated Azure DevOps user;
- move the requested work item to `In Progress`;
- create and link coarse child `Task` work items when the requested item is a `User Story`;
- assign those child Tasks;
- move child Tasks through `In Progress` and `Done`;
- move the requested work item to `Code Review` after final guard rails pass.

Ask before any other Azure Boards mutation, destructive action, PR operation, push, merge, or
release action.

## Core Workflow

Follow [references/runbook.md](references/runbook.md) in this order:

1. [Start Audit](references/runbook.md#start-audit)
2. [Work Item Ownership And State](references/runbook.md#work-item-ownership-and-state)
3. [Minimal Context Loading](references/runbook.md#minimal-context-loading)
4. [Branch Setup](references/runbook.md#branch-setup)
5. [Planning](references/runbook.md#planning)
6. [User Story Child Tasks](references/runbook.md#user-story-child-tasks)
7. [Implementation Loop](references/runbook.md#implementation-loop)
8. [Final Guard Rails](references/runbook.md#final-guard-rails)
9. [Finish](references/runbook.md#finish)
10. [Blocker Report](references/runbook.md#blocker-report) or
    [Final Report](references/runbook.md#final-report)

## Non-Negotiable Invariants

- Read repository-mandated context before changing Azure Boards or Git state.
- Stop before mutation when the start audit finds a blocker.
- Do not skip documented quality gates to save time or tokens.
- Do not create child Tasks for a requested `Task`.
- Do not create additional child Tasks when a `User Story` already has children; adapt to the
  existing child Tasks or stop with a blocker.
- Do not move a requested `Task` to `Done` unless the user explicitly requests a different
  Task-state policy.
- Do not push, open a PR, complete a PR, merge, or change PR metadata unless the user
  explicitly asked for that or repository instructions already authorize it.
- Do not mark a slash goal complete until the requested work item is verified in `Code Review`.

## Failure Learning

When an E2E run uncovers a reusable improvement to this skill (runbook gap, state-flow pitfall,
planning rule) with a verified fix, append a structured entry to [LEARNINGS.md](LEARNINGS.md)
using the format documented there. These files reach sessions through a user-scope junction,
so entries land in the standards repository working tree. Author durable patches only with
user approval on a standards-repository branch. Project-specific process facts go to the
adopting repository docs instead.

## References

- [references/runbook.md](references/runbook.md) - canonical E2E work item implementation
  workflow.
- [references/user-story-child-tasks.md](references/user-story-child-tasks.md) - child Task
  sizing, creation, and state flow; load only for User Story runs.
- [LEARNINGS.md](LEARNINGS.md) - mid-task learnings inbox; consolidated into durable updates
  in the standards repository.
- [../azure-devops/SKILL.md](../azure-devops/SKILL.md) - Azure Boards and
  Azure Repos wrappers and safety rules.
- [../code-review/SKILL.md](../code-review/SKILL.md) - review workflow when
  explicitly requested or locally required.

## Navigation

- Skills index: [../README.md](../README.md)
- Repository docs: [../../../docs/INDEX.md](../../../docs/INDEX.md)
