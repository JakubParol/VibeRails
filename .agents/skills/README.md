# Agent Skills

Repository-local Codex skills live here so they can be reviewed and versioned with the
standards pack. They are optional agent assets, not part of core adoption, and are not copied
into target repositories by default.

## Skills

| Skill | Purpose |
|---|---|
| [azure-devops](azure-devops/SKILL.md) | Work with Azure Boards work items, Azure Repos pull requests, comments, cleanup tracking, and reusable Azure DevOps failure fixes. |
| [code-review](code-review/SKILL.md) | Run structured code reviews for local branches and pull requests with optional independent review agents and specialist routing. |
| [e2e-work-item](e2e-work-item/SKILL.md) | Run an Azure Boards work item from `[E2E]` prompt through implementation, guard rails, and Code Review state. |

## Rules

- Keep each skill self-contained with a required `SKILL.md`.
- Put repeatable commands in `scripts/`.
- Put detailed, task-specific reference material in `references/`.
- Do not place secrets, personal access tokens, generated credentials, or raw customer data in
  skill files.
- Keep reusable defaults in skills and repository-specific decisions in the adopting
  repository's local docs.
- Install skills at the Codex user scope only when the user wants these workflows available
  outside the VibeRails checkout. Vendor a pinned copy only on explicit repository decision.

## Navigation

- Up: [../README.md](../README.md)
