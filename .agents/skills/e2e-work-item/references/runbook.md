# E2E Work Item Runbook

Canonical workflow for `e2e-work-item` runs.

## Contents

- [Start Audit](#start-audit)
- [Work Item Ownership And State](#work-item-ownership-and-state)
- [Minimal Context Loading](#minimal-context-loading)
- [Branch Setup](#branch-setup)
- [Planning](#planning)
- [User Story Child Tasks](#user-story-child-tasks)
- [Implementation Loop](#implementation-loop)
- [Final Guard Rails](#final-guard-rails)
- [Finish](#finish)
- [Blocker Report](#blocker-report)
- [Final Report](#final-report)
- [Navigation](#navigation)

## Start Audit

Run a start audit before changing Azure Boards or Git state:

1. Follow the target's `agent-workflow.md` router when present. Otherwise use applicable AGENTS
   instructions and native docs/commands for the actual work-item paths; this optional skill
   does not require VibeRails adoption. Identify scope, protected work, authorization, branch
   setup and required handoff verification before mutation.
2. Load `azure-devops` and resolve ADO context.
3. Read the work item and comments:

   ```powershell
   .\.agents\skills\azure-devops\scripts\ado-work-items.ps1 -Action Show -Id <id> -Project <project>
   .\.agents\skills\azure-devops\scripts\ado-work-items.ps1 -Action Comments -Id <id> -Project <project>
   ```

   Record `System.WorkItemType`, `System.Title`, `System.State`, `System.AssignedTo`,
   `System.AreaPath`, `System.IterationPath`, `System.Description`, acceptance criteria when
   present, relations, and existing child Tasks.

4. Inspect local Git state:

   ```powershell
   git status --short --branch
   git branch --show-current
   git symbolic-ref refs/remotes/origin/HEAD
   ```

5. Identify blockers before mutation:
   - ADO authentication or context cannot be resolved.
   - The work item is unreadable, deleted, closed, or in a state that should not be reopened
     without user approval.
   - Work item description, acceptance criteria, comments, or relations do not define an
     implementable scope.
   - Required repository docs or documented quality gates are missing.
   - The working tree has unrelated user changes that would block branch setup or edits.
   - The target repository cannot identify a base branch.

If any blocker exists, report it and stop before assigning or moving the work item unless the
mutation already happened in a prior run.

## Work Item Ownership And State

After the start audit passes and before creating a new local branch:

1. Resolve the authenticated Azure DevOps user with the Azure DevOps CLI connection data. Use
   the user's `uniqueName` when available; otherwise use display name and verify the saved
   `System.AssignedTo` value after the update.
2. Assign the requested work item to the authenticated user unless it is already assigned to
   that user. If it is assigned to someone else, reassign and include the previous assignee in
   the final report.
3. Move the requested work item to `In Progress` unless it is already `In Progress`.
4. If the requested work item is already `Code Review`, verify whether this is a clean resume
   with all local work complete. If not, stop with a blocker instead of silently moving it
   backwards.

Use the wrapper for writes:

```powershell
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 `
  -Action Update `
  -Id <id> `
  -Project "<project>" `
  -Field "System.AssignedTo=<current-user>" `
  -State "In Progress" `
  -AllowWrite
```

Verify the work item after each write. If assignment or state transition fails, stop with a
blocker and report the current work item state.

## Minimal Context Loading

Use the context policy resolved in Start Audit for the candidate paths. This workflow adds the work
item title, description, acceptance criteria, comments, relations and existing linked work as
sources of scope. Search for the affected area, then read its local docs/source before editing.
Reuse verified decisions on resume. Missing context blocks the decision that depends on it;
the start-audit and state-transition requirements above remain unchanged.

## Branch Setup

For a new run:

1. Ensure the working tree is clean or contains only intentional resume changes.
2. Switch to the resolved base branch, usually `main`.
3. Pull the latest base branch with `git pull --ff-only`.
4. Create a focused branch. Follow repository convention; otherwise use:

   ```text
   codex/e2e-<work-item-id>-<short-slug>
   ```

For a resumed run:

- Continue on the existing task branch when it clearly belongs to the work item.
- Fetch the latest base branch, but do not rewrite history or discard local work.
- If the branch cannot be safely synchronized with the latest base because of conflicts,
  unrelated changes, or unclear ownership, stop with a blocker.

## Planning

Create an implementation plan before editing code. The plan must be based on the work item and
the minimal context loaded so far.

Each plan item must include:

- the concrete outcome;
- the files or areas expected to change;
- any local docs still needed before editing;
- a focused verification hint when cheap and useful;
- the intended commit message.

Keep the plan short and commit-shaped. Prefer three to seven coherent steps over a long task
list. If an existing partial implementation is present, mark completed steps and plan only the
remaining work.

## User Story Child Tasks

Branch behavior by `System.WorkItemType` after the implementation plan exists and before the
first code edit:

- `Task`: do not create child Tasks. Treat the requested Task as the active implementation
  work item and keep the normal finish behavior for the requested work item. Do not load the
  child-task reference.
- `User Story`: load [user-story-child-tasks.md](user-story-child-tasks.md) and follow it for
  sizing, existing-children handling, creation, linking, and state flow.
- Other work item types: stop with a blocker unless the user explicitly says how to handle the
  type.

## Implementation Loop

For each plan item:

1. Update the active plan item to `in_progress`.
2. For a `User Story`, ensure the mapped child Task is assigned to the authenticated user and
   is `In Progress`. For a requested `Task`, the requested work item was already assigned and
   moved to `In Progress` during the start phase.
3. Read only the required local docs and source files for that item.
4. Implement the item, including focused tests or docs when the behavior requires them.
5. Run only cheap, focused checks when they materially reduce risk. Do not run full lint,
   full test suites, full builds, or all guard rails after every step.
6. Commit only the files for that plan item.
7. For a `User Story`, if this was the last remaining plan item for the mapped child Task, move
   that child Task to `Done` and verify it. Do not move a requested `Task` to `Done` unless the
   user explicitly requested a different Task-state policy.
8. Update the plan item to `completed`.

If a step uncovers ambiguous product behavior, missing acceptance criteria, unsafe migrations,
external credentials, unavailable services, or conflicts with user-owned work, stop with a
blocker. Include the last successful commit and the exact next decision needed.

## Final Guard Rails

After implementation commits, run the documented focused local handoff checks. Full types,
suites, builds and aggregate gates belong to PR Verification. This does not waive a required
check; report its result at the point where it can actually run.

1. Read the documented quality gate commands and the path-to-scope map from repository docs.
2. Determine the changed scopes from the branch diff:

   ```bash
   git diff --name-only "<base-ref>...HEAD"
   ```

3. Run changed-file format/lint and the smallest meaningful behavior checks for the change,
   using actual target commands. A scope flag does not prove that a script is a focused check.
4. Run a full local gate only when the user explicitly requests it. Cross-cutting changes,
   missing scoped commands and unavailable CI do not automatically authorize one.
5. Fix failures in focused commits and rerun only the affected local check/case. Preserve
   unchanged green evidence; escalate scope only for a concrete changed risk.
6. After an authorized PR is available, read required CI results for its source/tested revision.
   Record the run link, outcome and relevant failure details. Missing/pending CI is not green.
7. Stop repeated unsuccessful fix attempts after the existing five-cycle limit and report the
   unresolved check. Do not repeat unrelated suites or lower verification requirements.

If a final guard-rail failure belongs to a child Task already marked `Done`, move that Task
back to `In Progress` before applying the fix, then move it to `Done` again after the fix
commit and focused check.

If commands or CI are missing, report the uncovered requirement and next action; continue
independent work. Agree any required-check exception explicitly. Do not invent a complete-gate
claim or automatically compensate with a full local run.

## Finish

Only finish successfully when all of these are true:

- all work item acceptance criteria are implemented or explicitly out of scope by work item
  text;
- all task changes are committed;
- for User Story runs, every child Task used by this run is verified in `Done`;
- required local handoff checks have passed, with CI state/coverage explicitly recorded;
- any CI result required by the target's handoff policy is available for the current revision;
- `git status --short --branch` shows no accidental unrelated changes;
- the work item is moved to `Code Review` and verified there.

When creating a PR is outside this invocation's authorization, record PR CI as pending rather
than publishing without consent or claiming complete verification. Preserve existing work-item
transition policy; Code Review handoff is not merge readiness or overall acceptance.

Move the work item with the Azure DevOps wrapper:

```powershell
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 `
  -Action Update `
  -Id <id> `
  -Project "<project>" `
  -State "Code Review" `
  -AllowWrite
```

Do not push, open a PR, complete a PR, merge, or change PR metadata unless the user explicitly
asked for that or the current repository instructions already authorize it.

## Blocker Report

Use the target's reporting policy and existing task record; without a documented policy, give
the outcome, evidence/limits and needed decision rather than requiring new documents. Preserve the
work item/current state, relevant child states, branch/last commit, local or tracker mutations,
verification limits and exact blocker with the smallest needed decision. The record supports
recovery; the user needs the blocker and next action, not the same packet at every phase.

Do not keep looping after the same blocker repeats. The run ends with a precise blocker or
the work item verified in `Code Review`; no state-transition or finish requirement is waived.

## Final Report

Follow the target's reporting policy (or the compact fallback above). Add the work-item link and verified final
state, relevant child outcomes and any required provider action/status. Keep the plan-to-commit
trace in the existing task/commit record; link it instead of copying every commit into the final
message. Include unresolved exceptions and requested push/PR status when applicable. Do not
create a second report solely to repeat the same evidence.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Azure DevOps skill: [../../azure-devops/SKILL.md](../../azure-devops/SKILL.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
