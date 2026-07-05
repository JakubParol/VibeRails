# Agent Skills

Repository-local Codex skills live here so they can be reviewed, versioned, and copied with the
standards pack.

## Skills

| Skill | Purpose |
|---|---|
| [azure-devops-elitmind](azure-devops-elitmind/SKILL.md) | Work with ElitMind Azure Boards work items, Azure Repos pull requests, comments, cleanup tracking, and reusable Azure DevOps failure fixes. |
| [code-review-elitmind](code-review-elitmind/SKILL.md) | Run structured ElitMind code reviews for local branches and Azure DevOps PRs with optional independent review agents and specialist routing. |
| [e2e-work-item-elitmind](e2e-work-item-elitmind/SKILL.md) | Run an Azure Boards work item from `[E2E]` prompt through implementation, guard rails, and Code Review state. |

## Rules

- Keep each skill self-contained with a required `SKILL.md`.
- Put repeatable commands in `scripts/`.
- Put detailed, task-specific reference material in `references/`.
- Do not place secrets, personal access tokens, generated credentials, or raw customer data in
  skill files.
- Keep company-wide defaults in skills and repository-specific decisions in the adopting
  repository's local docs.

## Navigation

- Up: [../README.md](../README.md)
