# E2E Work Item Runbook

Canonical workflow for `e2e-work-item-elitmind` runs.

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

1. Read repository root `AGENTS.md` first, then every Required Reading it names for the current
   repository. At minimum, when present, read `README.md`, `docs/INDEX.md`,
   `docs/standards/agent-workflow.md`, `docs/standards/change-protocol.md`, and
   `docs/standards/quality-gate.md`. Do not skip repository-mandated Required Reading to save
   tokens; save tokens by loading stack, domain, and source docs only when they are needed.
2. Load `azure-devops-elitmind` and resolve ADO context.
3. Read the work item and comments:

   ```powershell
   .\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action Show -Id <id> -Project <project>
   .\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action Comments -Id <id> -Project <project>
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
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 `
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

Load context progressively. Do not read the whole repository.

1. Use the work item title, description, acceptance criteria, comments, relations, and existing
   linked branches or PRs to infer candidate areas.
2. Search before opening files:

   ```powershell
   rg --files
   rg -n "<domain term or symbol>"
   ```

3. Read nearest relevant `README.md` or `AGENTS.md` files for candidate paths.
4. Read stack standards only for areas you will edit:
   - backend/API: `docs/standards/coding.md`, `docs/standards/architecture.md`,
     `docs/standards/backend.md`, `docs/standards/backend-testing.md`
   - frontend: `docs/standards/coding.md`, `docs/standards/architecture.md`,
     `docs/standards/frontend.md`
   - docs: `docs/standards/documentation.md`
   - agent assets: `.agents/README.md`, `.agents/skills/README.md`, and the relevant sibling
     skill docs
5. Before each implementation step, read only the local docs and source files needed for that
   step.

If the work item points to an area but the required local docs are missing, decide whether the
root standards are enough. Stop only when the repository's own rules make the missing docs a
blocker.

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

After all implementation plan items are committed, run the scoped quality gate. The local gate
proves the changed scope; the PR pipeline proves the whole repository.

1. Read the documented quality gate commands and the path-to-scope map from repository docs.
2. Determine the changed scopes from the branch diff:

   ```powershell
   git diff --name-only "<base-ref>...HEAD"
   ```

3. Run the documented gate once for each changed scope only, for example
   `.\scripts\lint.ps1 -Service api`. Do not run the full repository gate by default.
4. Run the full repository gate only when the change is cross-cutting (shared tooling,
   lockfiles, shared packages, or the gate script itself), when the repository documents no
   scoped commands, or when the user explicitly asks for it.
5. Fix failures in focused commits.
6. Rerun the affected scoped gates after every fix cycle.
7. Continue until green or until five guard-rail fix cycles have failed to reach green.

If a final guard-rail failure belongs to a child Task already marked `Done`, move that Task
back to `In Progress` before applying the fix, then move it to `Done` again after the fix
commit and focused check.

If no documented quality gate exists, stop with a blocker. Do not invent an unofficial gate and
call the work complete.

## Finish

Only finish successfully when all of these are true:

- all work item acceptance criteria are implemented or explicitly out of scope by work item
  text;
- all task changes are committed;
- for User Story runs, every child Task used by this run is verified in `Done`;
- required guard rails are green;
- `git status --short --branch` shows no accidental unrelated changes;
- the work item is moved to `Code Review` and verified there.

Move the work item with the Azure DevOps wrapper:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 `
  -Action Update `
  -Id <id> `
  -Project "<project>" `
  -State "Code Review" `
  -AllowWrite
```

Do not push, open a PR, complete a PR, merge, or change PR metadata unless the user explicitly
asked for that or the current repository instructions already authorize it.

## Blocker Report

When blocked, stop the run and report:

- work item ID and current state;
- child Task IDs and states when the requested work item is a User Story;
- branch and last commit, if any;
- what was already changed locally or in Azure Boards;
- the exact blocker;
- the smallest next decision or missing input needed;
- verification already run and verification not run.

Do not keep looping after the same blocker repeats. The run must end with either a precise
blocker report or the work item verified in `Code Review`.

## Final Report

Successful final reports must include:

- work item ID and final state;
- child Task IDs and final states when the requested work item is a User Story;
- branch name;
- commits made per plan item;
- required guard rails run and result;
- files or areas changed;
- intentional exceptions, if any;
- push or PR status when explicitly requested.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Azure DevOps skill: [../../azure-devops-elitmind/SKILL.md](../../azure-devops-elitmind/SKILL.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
