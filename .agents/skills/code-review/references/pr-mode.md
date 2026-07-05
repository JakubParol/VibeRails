# Azure DevOps PR Review Mode

Use this reference when the user provides an Azure DevOps PR URL.

## Contents

- [Purpose](#purpose)
- [Discovery](#discovery)
- [Review Scope](#review-scope)
- [Pass Count](#pass-count)
- [Write Behavior](#write-behavior)
- [PR Comment Posting](#pr-comment-posting)
- [PR Fix Subflow](#pr-fix-subflow)
- [PR Mode Output](#pr-mode-output)
- [Navigation](#navigation)

## Purpose

- review the PR as a reviewer;
- focus on PR diff and changed files;
- produce concise findings and publish them as inline PR comments when authorized and when the
  authenticated Azure DevOps user did not create the PR;
- cast an approve vote when no actionable findings remain and publishing is authorized;
- if the authenticated Azure DevOps user created the PR, complete the review locally without PR
  comments, summary substitutes, or reviewer votes;
- in approved review-and-fix mode, fix, verify, and rerun focused review until clean, blocked,
  or the loop limit is reached.

## Discovery

1. Load root repository context and this skill.
2. Load
   [`../../azure-devops/SKILL.md`](../../azure-devops/SKILL.md)
   before Azure DevOps read/write operations.
3. Parse the PR URL. Resolve Azure DevOps organization, project, repository, and PR ID from the
   URL when possible. Otherwise pass `-Project` and `-Repository` explicitly to the wrapper.
4. Read PR metadata:

   ```powershell
   .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Show -PrId <id> -Project <project> -Repository <repository>
   ```

5. Record repository ID/name, source branch, target branch, latest source commit, target commit,
   PR iteration, changed files, work items, existing active threads, PR status, and whether the
   authenticated Azure DevOps user created the PR:

   ```powershell
   .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action SelfReviewStatus -PrId <id> -Project <project> -Repository <repository>
   ```

   If connection data cannot resolve the current Azure DevOps identity, fail closed and re-run
   with `-ReviewerId <current-user-id>` only after the identity is verified from a trusted
   source.

   If `isSelfReview` is `true`, set PR publishing mode to local-only before review starts.

6. Normalize PR refs from `refs/heads/<name>` to `<name>`, then fetch or verify the source and
   target refs before local diff review. Prefer explicit destination refspecs so
   remote-tracking refs used by the diff are current:

   ```powershell
   git fetch origin +refs/heads/<target>:refs/remotes/origin/<target> +refs/heads/<source>:refs/remotes/origin/<source>
   git rev-parse origin/<source>
   git rev-parse origin/<target>
   git diff --name-only origin/<target>...origin/<source>
   git diff --unified=80 origin/<target>...origin/<source> -- <path>
   ```

   Verify both fetched commits against PR metadata before reviewing.

7. If local refs cannot be fetched safely, use Azure DevOps Git REST for PR changes/iterations
   and state that the review used API change metadata instead of local branch checkout.
8. Read PR iterations and latest iteration changes before publishing inline comments:

   ```powershell
   .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Iterations -PrId <id> -Project <project> -Repository <repository>
   .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action IterationChanges -PrId <id> -Project <project> -Repository <repository>
   ```

9. Build line mapping from a unified diff against the verified source/target commits:
   - each hunk header gives old and new starting lines;
   - `+` lines map to new-side source lines;
   - `-` lines map to old-side target lines;
   - context lines advance both counters;
   - do not map comments to deleted/unchanged lines unless Azure DevOps old-side context is
     verified.
10. Validate each inline anchor:
    - the file appears in latest iteration changes;
    - the mapped line still exists in the fetched source commit;
    - the finding evidence is on a changed line or directly caused by a changed line;
    - the mapped source and target commits match the latest PR metadata.
11. If direct Azure DevOps REST is unreliable, keep using the `azure-devops` wrapper
    instead of manually bypassing the flow; the wrapper has an internal Azure DevOps CLI
    fallback for review-critical PR reads and writes. If anchor validation still cannot be
    completed, fail closed: report the blocker and do not publish a summary substitute unless
    the user explicitly approves that exception.
12. Avoid duplicating existing unresolved comments unless a new detail materially changes the
    recommendation.

## Review Scope

- Comment only on code changed in the PR.
- Use surrounding context to understand behavior, but do not file findings on unrelated old
  code.
- When a finding spans several files, anchor the comment to the changed file that introduced
  the risk. If no changed-line anchor can be defended, report the blocker instead of posting a
  summary substitute.

## Pass Count

- Default to one full pass.
- Run a second pass when the first pass produced fixes, conflicting findings, unclear severity,
  or broad cross-area changes.
- Run additional passes only when the user asks or when an approved review-and-fix loop is still
  within the five-cycle limit.

## Write Behavior

- If `SelfReviewStatus.isSelfReview` is `true`, do not publish finding comments, do not publish
  summary substitutes for findings, and do not cast reviewer votes.
- If review publishing is not authorized by the user or repository policy, keep findings local.
- If publishing is authorized and `SelfReviewStatus.isSelfReview` is `false`, publish valid
  findings as inline comments after triage.
- If publishing is authorized and no actionable findings remain, cast an approve vote when
  `SelfReviewStatus.isSelfReview` is `false`.
- Ask before making fixes, pushing commits, updating PR metadata, resolving existing threads,
  completing, or merging the PR.

## PR Comment Posting

The supported publishing path for review findings is inline comments through the
`azure-devops` wrapper:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 `
  -Action AddInlineComment `
  -PrId <id> `
  -Project "<project>" `
  -Repository "<repository>" `
  -FilePath "<repo-relative-path>" `
  -Line <new-side-line> `
  -CommentPath <comment-file> `
  -AllowRepoMutation
```

Use `-CommentPath` for Polish or multiline comments. The wrapper resolves the latest PR
iteration, reads iteration changes with `$compareTo=0`, matches the file to
`changeTrackingId`, and posts a thread with `threadContext` and `pullRequestThreadContext`.

Required anchor data before posting:

- repository-relative file path in the latest PR changes;
- new-side line number for current-source findings, or explicit old-side anchoring only when
  the deleted-line context is verified;
- `changeTrackingId` from the latest iteration changes;
- source and target commits verified against current PR metadata.

If any inline requirement is missing or uncertain, do not substitute a summary thread for a
finding. Report the blocker and ask whether to post a summary exception or rerun after the
anchor can be verified. Summary thread comments remain available for non-finding operational
notes only.

For approved non-finding operational notes, or an explicit user-approved summary exception, use
the wrapper thread-comment action documented in
[`azure-devops`](../../azure-devops/references/prs.md#reliable-pr-commands).

When the review is clean and publishing is authorized, cast the reviewer vote:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 `
  -Action Approve `
  -PrId <id> `
  -Project "<project>" `
  -Repository "<repository>" `
  -AllowRepoMutation
```

If the PR is still a draft, Azure DevOps does not accept reviewer votes. Report the clean review
result and ask whether to publish the PR before casting `approve`.

When `SelfReviewStatus.isSelfReview` is `true`, do not ask to publish findings or approve. The
review result remains local even when the prompt included a PR URL.

## PR Fix Subflow

Use only after explicit user approval to fix a PR:

1. Inspect `git status --short --branch`.
2. Confirm the working tree can safely switch or continue.
3. Check out the PR source branch without overwriting unrelated work.
4. Reconfirm the latest PR source commit to avoid fixing a stale branch.
5. Spawn read-only review agents when required or authorized.
6. Aggregate findings and select approved, in-scope fixes.
7. Apply approved fixes sequentially through the orchestrator or one worker at a time.
8. Run focused quality gates for the touched areas.
9. Reread the PR diff/status and rerun focused review on changed files.
10. Repeat the fix, gate, and focused-review cycle until no actionable findings remain and
    focused gates pass, a blocker requires user input, or five cycles complete.
11. Commit only fix files when commits are authorized.
12. Push only when explicitly approved.

## PR Mode Output

PR mode reports must include:

- PR URL and reviewed source/target branches;
- self-review status and whether PR publishing was enabled or skipped;
- agent-separated findings;
- inline comments posted, including PR thread IDs when available, or intentionally skipped;
- approve vote cast when no actionable findings remain, or intentionally skipped;
- verification checked locally or from PR status;
- blockers or requested user decisions.

## Navigation

- Agent authorization: [agent-authorization.md](agent-authorization.md)
- Local branch mode: [local-branch-mode.md](local-branch-mode.md)
- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
