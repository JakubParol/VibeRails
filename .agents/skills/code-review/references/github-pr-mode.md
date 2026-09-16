# GitHub PR Local-Diff Review Mode

Use this reference when the user provides a GitHub PR URL. This mode is read-only by default
and keeps findings local. VibeRails does not yet define a GitHub inline-comment publishing
workflow.

## Discovery

1. Load root repository context and this skill.
2. Confirm the URL host is GitHub before using this reference.
3. Use the target's selected read-only GitHub connection or authenticated `gh` for actual PR
   metadata and diff. Local refs support local inspection but cannot establish current remote
   PR state. If remote reads are unavailable, report the limited boundary instead of requiring
   a CLI installation or inventing remote evidence.
4. Identify source branch, target branch, changed files, latest commits, and the exact source
   commit to record as `reviewedSHA`.
5. If local checkout is needed, safe and authorized, fetch exact source/target refs using
   already available tools. With an existing authenticated gh client, one example is:

   ```bash
   git fetch origin <target-branch>
   gh pr checkout <pr-number> --detach
   git diff --name-only origin/<target-branch>...HEAD
   ```

6. If checkout is unsafe because the working tree is dirty, do not stash or overwrite. Use
   the selected read-only connection or an available `gh pr diff`; ask for a clean worktree
   only when local inspection is actually necessary.

## Review Behavior

- Review changed lines only, using surrounding context only to understand the change.
- Before reporting, compare the reviewed source commit with the current PR source head. If they
  differ, refresh the changed scope and re-review it or report that the earlier review is stale.
- Keep findings local unless the current review request explicitly authorizes GitHub publishing
  and the target repository's GitHub profile allows it. A PR URL or profile alone is not write
  authority.
- When citing test evidence, bind it to the reviewed revision and actual executed cases; a
  zero-case, stale, skipped, cancelled, or absent report is not test PASS.
- Do not use Azure DevOps wrappers, Azure DevOps self-review checks, or Azure DevOps reviewer
  votes for GitHub PRs.
- Ask before branch changes, fixes, pushes or publication only when their required authority
  is absent. Preserve already-authorized operations and safe working-tree constraints.

## Output

Reports must include:

- PR URL and reviewed source/target refs;
- source commit actually reviewed and current source head at reporting time;
- whether review used local git diff, `gh pr diff`, or API metadata;
- triaged findings with compact review coverage per [output.md](output.md);
- verification or limitations;
- whether publishing was unavailable or intentionally skipped.

## Navigation

- Local branch mode: [local-branch-mode.md](local-branch-mode.md)
- Azure DevOps PR mode: [pr-mode.md](pr-mode.md)
- Skill: [../SKILL.md](../SKILL.md)
