# Azure Repos Pull Request Reference

Use this reference for Azure Repos pull request reads, PR metadata writes, descriptions, review
comments, thread comments, and reviewer votes.

## Contents

- [Reliable PR Commands](#reliable-pr-commands)
- [Known PR Pitfalls](#known-pr-pitfalls)
- [Navigation](#navigation)

## Reliable PR Commands

Wrapper read actions return compact summaries by default. Add `-Raw` only when a field is
missing from the summary. The wrapper reads PR data through channels in this order: native
`az repos` commands first, `az devops invoke` second, bearer-token REST last. When a call
fails or hangs, read [troubleshooting.md](troubleshooting.md) before trying alternatives.

Read active PRs:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action ListActive -Project <project> -Repository <repository>
```

Read PR details:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Show -PrId <pr-id> -Project <project> -Repository <repository>
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action WorkItems -PrId <pr-id> -Project <project> -Repository <repository>
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Reviewers -PrId <pr-id> -Project <project> -Repository <repository>
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Policies -PrId <pr-id> -Project <project> -Repository <repository>
```

Read PR commits and threads:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Commits -PrId <pr-id> -Project <project> -Repository <repository>
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Threads -PrId <pr-id> -Project <project> -Repository <repository>
```

Create a draft PR only after branch, commit, push, and approval:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action CreateDraft -SourceBranch <branch> -TargetBranch main -Title "<title>" -DescriptionPath <markdown-file> -Project <project> -Repository <repository> -AllowRepoMutation
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action UpdateDescription -PrId <pr-id> -DescriptionPath <markdown-file> -Project <project> -Repository <repository> -AllowRepoMutation
```

Before publishing review findings or approving a review, check whether the authenticated Azure
DevOps user created the PR:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action SelfReviewStatus -PrId <pr-id> -Project <project> -Repository <repository>
```

If connection data cannot resolve the authenticated Azure DevOps user, pass
`-ReviewerId <current-user-id>` after verifying the current reviewer identity. Do not infer it
from Azure ARM account state.

Add PR review findings through inline comments in the wrapper, not by composing REST JSON
inline in a shell command. The wrapper resolves self-review metadata, iteration context,
inline comments, and reviewer votes through the CLI channels first and uses bearer-token REST
only as the last fallback:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 `
  -Action AddInlineComment `
  -PrId <pr-id> `
  -Project "<project>" `
  -Repository "<repository>" `
  -FilePath "<repo-relative-path>" `
  -Line <line> `
  -CommentPath <markdown-file> `
  -AllowRepoMutation
```

Use summary thread comments only for non-finding operational notes or an explicit
user-approved summary exception, never as the default publishing path for review findings:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 `
  -Action AddThreadComment `
  -PrId <pr-id> `
  -Project "<project>" `
  -Repository "<repository>" `
  -CommentPath <markdown-file> `
  -AllowRepoMutation
```

Set reviewer votes through the wrapper because `az repos pr reviewer` does not expose a
reliable update command in every environment:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Approve -PrId <pr-id> -Project <project> -Repository <repository> -AllowRepoMutation
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action SetReviewerVote -PrId <pr-id> -Vote reset -Project <project> -Repository <repository> -AllowRepoMutation
```

## Known PR Pitfalls

- PR comments are PR threads in the Git REST API, not an `az repos pr comment` CLI command.
- Inline PR comments require verified PR iteration context, including change tracking data for
  the current diff. Use `AddInlineComment`; it reads the latest iteration, resolves the file's
  `changeTrackingId`, and fails closed when the file is not present in iteration changes.
- Self-created PR reviews are local-only. Use `SelfReviewStatus` before review publishing;
  `AddInlineComment`, `Approve`, and non-reset `SetReviewerVote` fail closed when the
  authenticated Azure DevOps user created the PR.
- Avoid passing one multiline string to `az repos pr create/update --description` in PowerShell;
  it can store only the first line. Use `scripts/ado-prs.ps1`.
- Avoid hand-written PowerShell hash literals for Polish review comments. Apostrophes can break
  single-quoted strings before REST is called. Put multiline or Polish comments in a temporary
  Markdown file and pass `-CommentPath`.
- `az repos pr show` can misrender non-ASCII PR description text on Windows. Use
  `scripts/ado-prs.ps1 -Action Show` when checking whether a PR description was preserved
  correctly.
- Direct Azure DevOps REST can return a login page or incomplete PR metadata while the CLI
  channels still work. The wrapper detects HTML responses and reports the broken channel; that
  is not permission to publish review findings outside `ado-prs.ps1`. See
  [troubleshooting.md](troubleshooting.md).
- Azure DevOps rejects reviewer votes on draft PRs. Inline comments can still be tested on a
  draft, but `Approve` should fail fast until the PR is published with explicit approval.
- A branch, commit, push, PR create, PR complete, or merge is a repository operation and
  requires explicit user approval unless the user already requested it.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Context and learning: [context-and-learning.md](context-and-learning.md)
- Boards reference: [boards.md](boards.md)
- Troubleshooting: [troubleshooting.md](troubleshooting.md)
- Skills index: [../../README.md](../../README.md)
