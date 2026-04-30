# Change Protocol Standard

AI agents must follow this protocol when they make changes in a repository. The goal is to keep
work reviewable, current with the base branch, documented, verified, and closed with either a
completed action or a clear next-step question.

## Priority And Overrides

The user's latest explicit instruction can override this protocol for the current task.
However, agents must not follow an override that would:

- discard, overwrite, or hide unrelated user work
- bypass required quality gates without reporting the limitation
- weaken lint, test, type, security, or import-boundary rules
- publish secrets or private data
- make destructive git changes without explicit approval

When instructions conflict, state the conflict and ask a focused question before continuing.

Every interaction must end with either:

- the next action the agent is taking, or
- a concrete question with suggested next steps.

Do not leave the user with an open-ended "let me know" when the task is still unresolved.

## Start Of Work

Before changing files, agents must:

1. Understand the task well enough to name a branch and define the first scope of work.
2. If the task is unclear, ask a focused clarification question and explain that the answer is
   needed to name the branch or avoid changing the wrong behavior.
3. Check the current git branch and working tree status.
4. Identify the base branch.
5. Read the required project documentation.
6. Create or switch to the task branch only when it is safe to do so.

Default base branch selection:

| Priority | Base branch source |
|---|---|
| 1 | User-specified branch |
| 2 | Project documentation or repository conventions |
| 3 | Remote default branch |
| 4 | `main` |
| 5 | `master` or `develop` |

If the repository has no git metadata, report that the branch, commit, push, and PR parts of
this protocol cannot run, then continue only if the requested work can still be handled safely.

## Dirty Working Tree

Agents must inspect the working tree before switching branches, pulling, rebasing, stashing, or
committing.

If there are uncommitted changes that the agent did not create in the current task:

- do not discard them
- do not overwrite them
- do not stash them without explicit approval
- do not commit them into the task branch unless the user explicitly asks

Ask the user how to proceed. Valid options include:

- continue on the current branch
- commit the existing work first
- stash the existing work
- stop until the working tree is clean

If the uncommitted changes were created by the agent during the current task, the agent may
stage and commit only the files that belong to the current logical step.

## Branch Setup

When the working tree is safe:

1. Switch to the base branch.
2. Pull the latest changes from the configured remote.
3. Create a task branch.

Use the repository's branch naming convention when one exists. Otherwise use:

```text
<type>/<short-scope>
```

Examples:

- `docs/change-protocol`
- `feat/auth-session`
- `fix/api-validation`
- `chore/update-quality-gate`

If the task is too vague to choose a branch name, ask the user to clarify the intended outcome.

## Required Reading

Before implementation, agents must read:

1. root `AGENTS.md`
2. root `README.md`
3. root `docs/INDEX.md`
4. `docs/standards/agent-workflow.md`
5. this change protocol
6. standards relevant to the task
7. nearest documentation-root files in monorepos
8. nearest folder-level `README.md` or `AGENTS.md`

During work, agents must read local documentation for each area before changing that area. Do
not read the entire repository by default. Load context in the smallest useful chunks.

## Planning

Agents must make a plan before substantial work. A plan should include:

- the intended scope
- the first files or folders to inspect
- implementation steps
- verification steps
- documentation updates
- commit points when the task is large enough

Keep the plan updated as work changes. If a step becomes invalid, revise the plan instead of
quietly drifting.

## When To Ask

Agents should make ordinary implementation decisions from existing code, project standards, and
local patterns.

Agents must ask before deciding on:

- product behavior not specified by the user or docs
- public API contracts
- data migrations or destructive data changes
- security-sensitive behavior
- architecture boundary changes
- dependency additions with meaningful cost or risk
- branch, commit, push, or PR actions that the user has not authorized

Questions should be specific and should include the recommended option when one exists.

## Implementation

Agents must:

- work in small, coherent increments
- preserve unrelated user changes
- keep edits within the requested scope
- update tests when behavior changes
- update documentation when setup, behavior, architecture, or folder rules change
- avoid suppressions that hide failing lint, tests, types, or boundary checks
- report blockers instead of inventing undocumented workflows

## Commit Protocol

Unless the user explicitly asks not to commit, agents must commit after each logical step when:

- the change is coherent and reviewable
- only files belonging to that step are staged
- relevant documentation and tests are updated
- the appropriate focused verification passed, or the verification limitation is explicitly
  documented

Do not mix unrelated work in one commit. Do not commit user-owned changes unless the user
explicitly asks.

Use the repository's commit convention when one exists. Otherwise use short imperative commit
messages such as:

```text
docs: add change protocol standard
fix: validate api request payload
feat: add session refresh flow
```

If the user explicitly asks not to commit, keep the working tree changes uncommitted and report
that exception.

## End Of Task

Before reporting that implementation is done, agents must:

1. Run the documented quality gate from the relevant project root.
2. Confirm all task changes are committed, unless the user asked for uncommitted changes.
3. Confirm the working tree does not contain accidental unrelated changes.
4. Summarize what changed and what verification ran.

If the user already asked for a push or PR, continue to the push and PR steps. Otherwise, ask:

```text
The work is done locally. Do you want to inspect it first, or should I push the branch and open a PR?
```

Do not push or open a PR without explicit permission, unless the user's initial request already
asked for an end-to-end PR flow.

## Push And Pull Request

When the user authorizes a push or PR, agents must:

1. Confirm all task changes are committed.
2. Sync with the base branch according to repository rules.
3. Re-run required verification after sync if the code changed.
4. Push the task branch.
5. Open a PR with a clear title, summary, verification notes, and any known limitations.

If the platform tools for opening a PR are unavailable, push the branch if authorized and give
the user the exact branch name and PR creation details.

## Review Loop

After opening a PR, agents must request independent review using the best available mechanism.
Use review mechanisms in this priority order:

- review sub-agent when the environment supports sub-agents
- code review tool or review skill
- PR checks or static analysis

If sub-agents or review tools are unavailable, state the fallback and run the strongest local
review available.

For each review cycle:

1. Read the review findings.
2. Fix valid issues.
3. Commit fixes.
4. Re-run relevant verification.
5. Request review again.

Stop the loop only when there are no actionable findings, or when the same task has gone
through five review cycles. After five cycles, escalate to the user with:

- remaining findings
- what was already tried
- the recommended next step

## Final Report

Final reports must include:

- changed files or areas
- commits made
- verification run
- verification not run and why
- PR link or branch name when applicable
- unresolved blockers or follow-up questions

If work is not complete, the final message must ask a concrete question or propose the next
action.

## Navigation

- [Documentation index](../INDEX.md)
- [Agent workflow](agent-workflow.md)
