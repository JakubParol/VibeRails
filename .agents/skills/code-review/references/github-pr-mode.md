# GitHub PR Local-Diff Review Mode

Use this reference when the user provides a GitHub PR URL. This mode is read-only by default
and keeps findings local. VibeRails does not yet define a GitHub inline-comment publishing
workflow.

## Discovery

1. Load root repository context and this skill.
2. Confirm the URL host is GitHub before using this reference.
3. Use `gh pr view` or local git refs for read-only metadata when `gh` is available and
   authenticated. If `gh` is unavailable, use local branch refs provided by the user.
4. Identify source branch, target branch, changed files, and latest commits.
5. Fetch the source and target refs explicitly when the repository remote permits it:

   ```bash
   git fetch origin <target-branch>
   gh pr checkout <pr-number> --detach
   git diff --name-only origin/<target-branch>...HEAD
   ```

6. If checkout is unsafe because the working tree is dirty, do not stash or overwrite. Review
   with `gh pr diff` or ask for a clean worktree.

## Review Behavior

- Review changed lines only, using surrounding context only to understand the change.
- Keep findings local unless a target repository GitHub publishing profile explicitly allows
  posting review comments.
- Do not use Azure DevOps wrappers, Azure DevOps self-review checks, or Azure DevOps reviewer
  votes for GitHub PRs.
- Ask before checking out branches, applying fixes, pushing commits, or posting comments.

## Output

Reports must include:

- PR URL and reviewed source/target refs;
- whether review used local git diff, `gh pr diff`, or API metadata;
- findings grouped by review agent;
- verification or limitations;
- whether publishing was unavailable or intentionally skipped.

## Navigation

- Local branch mode: [local-branch-mode.md](local-branch-mode.md)
- Azure DevOps PR mode: [pr-mode.md](pr-mode.md)
- Skill: [../SKILL.md](../SKILL.md)
