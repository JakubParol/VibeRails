# Local Branch Review Mode

Use this reference when the user does not provide a PR URL.

## Contents

- [Purpose](#purpose)
- [Discovery](#discovery)
- [Review Scope](#review-scope)
- [Read-Only Review Loop](#read-only-review-loop)
- [Review-And-Fix Loop](#review-and-fix-loop)
- [Local Mode Output](#local-mode-output)
- [Navigation](#navigation)

## Purpose

- review the current branch before PR creation;
- include committed branch diff plus staged, unstaged, and relevant untracked files;
- stay read-only by default;
- fix valid findings only when the user explicitly asks for review-and-fix or approves proposed
  fixes;
- rerun review and verification in review-and-fix mode until clean, blocked, or the loop limit
  is reached.

## Discovery

```powershell
git status --short --branch
git branch --show-current
git symbolic-ref refs/remotes/origin/HEAD
$baseInput = "<resolved-base-branch-or-ref>"
$baseBranch = $baseInput `
  -replace "^refs/remotes/origin/", "" `
  -replace "^refs/heads/", "" `
  -replace "^origin/", ""
$baseRef = "origin/$baseBranch"
git merge-base HEAD $baseRef
git diff --name-only "$baseRef...HEAD"
git diff --name-only
git diff --cached --name-only
git ls-files --others --exclude-standard
```

Do not print raw remote URLs during discovery; they can contain credential-bearing values on
developer machines.

Resolve `$baseInput` before diffing, using this priority:

1. user-specified base branch;
2. PR target branch or branch metadata when present;
3. upstream or remote default branch, for example `git symbolic-ref refs/remotes/origin/HEAD`;
4. repository default from root `AGENTS.md`;
5. fallback `main`, then `master` or `develop` only if needed.

Normalize user-supplied or discovered refs before assigning `$baseRef`: strip
`refs/remotes/origin/`, `refs/heads/`, and `origin/` prefixes into `$baseBranch`, then set
`$baseRef = "origin/$baseBranch"`. Do not fetch, pull, switch branches, stash, or rebase
without respecting dirty-worktree rules.

## Review Scope

- Include files changed on the current branch relative to base.
- Include staged and unstaged files only when they belong to the user's current review request.
- Treat untracked files as in scope only when their path and content clearly belong to the
  branch under review. Otherwise mention them as excluded.

## Read-Only Review Loop

1. Resolve agent authorization with [agent-authorization.md](agent-authorization.md).
2. Spawn read-only review agents when authorized. If agents are unavailable or blocked by tool
   policy, report the blocker and ask whether to wait or retry.
3. Aggregate findings.
4. Present agent-separated findings, orchestrator triage, and expected quality gates.
5. Run gates only if the user requested verification as part of the read-only review.
6. Ask whether to fix, ignore, discuss, or stop.

## Review-And-Fix Loop

1. Check `git status --short --branch` before each fix cycle.
2. Spawn read-only review agents when required or authorized.
3. Aggregate findings and triage duplicates before fixing.
4. Fix approved, in-scope issues sequentially through the orchestrator or one worker at a time.
5. Run focused verification for the touched areas.
6. Rerun focused review on changed files and repeat.
7. Stop only when no actionable findings remain and focused gates pass, a blocker requires user
   input, or five cycles complete.

Review agents may run in parallel because they are read-only. Fix workers are not parallel in
this skill; the orchestrator edits sequentially or uses one worker at a time.

Ask before fixing:

- public API contracts;
- security-sensitive behavior;
- architecture boundary changes;
- data migrations or destructive operations;
- dependency additions;
- changes outside the reviewed branch scope;
- findings where the correct product behavior is ambiguous.

## Local Mode Output

Local mode final reports must include:

- changed files or areas;
- fixes made;
- commits made, if any;
- verification run;
- verification not run and why;
- remaining blockers or user decisions.

## Navigation

- Agent authorization: [agent-authorization.md](agent-authorization.md)
- PR mode: [pr-mode.md](pr-mode.md)
- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
