# Review Agent Authorization

Use this reference before spawning independent review agents.

## Agent Authorization

Before spawning independent review agents, read repository policy from root `AGENTS.md`,
`.agents/README.md`, or another local instruction file. A repository may explicitly
pre-authorize independent read-only review agents for review work.

If policy is missing, ask the user whether independent read-only agents are allowed for this
review. If the user wants the answer saved for future work, update a canonical repository
instruction file only after approval. Do not silently create personal or hidden policy files.

Default read-only review-agent authorization does not authorize fixes, commits, pushes, PR
creation, PR completion, merges, reviewer votes, or parallel write workers. In Azure DevOps PR
mode, posting inline findings and casting the reviewer vote are authorized only when the review
request and repository policy allow normal PR review output and the authenticated Azure DevOps
user did not create the PR.

The default agent set, when agents are authorized, is:

- Agent 1 - Diff Content Review;
- Agent 2 - Standards and Infrastructure Review;
- area specialists from [area-routing.md](area-routing.md) when changed paths require them.

If agents cannot be spawned, state the blocker or explicit exception before final reporting. If
the user explicitly opts out of agents, report that intentional exception. Do not treat the same
roles run locally as satisfying a required independent review-agent pass.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Local branch mode: [local-branch-mode.md](local-branch-mode.md)
- PR mode: [pr-mode.md](pr-mode.md)
- Skills index: [../../README.md](../../README.md)
