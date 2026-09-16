# Review Agent Authorization

Use this reference before spawning independent review agents.

## Agent Authorization

Read the target repository's review policy from root `AGENTS.md`, `.agents/README.md`, or
another applicable local instruction before dispatching. Resolve target standards through the
target documentation index. When that index identifies local VibeRails standards, defer
lifecycle, authority, and handoff to them; a native repository keeps its own equivalent rules.

Determine first whether independent review is required by the user, repository policy, delivery
gate, or material scope/risk. If it is not required and local review is proportionate, perform
that review without asking the user to opt out of agents. If independence is required or would
materially improve confidence but has no standing authorization, ask only for permission to
dispatch the bounded reviewer(s).

Select the fewest useful review perspectives from the changed paths, risk, required
independence, and expected benefit. A small, low-risk change may need local review only; a
larger or cross-area change may need one independent general reviewer and/or a focused
specialist. Do not treat any named pair or specialist fleet as a default.

An explicit static-only project setting prevents reviewers from executing checks. Otherwise,
reviewers may run target-selected focused checks needed for the review unless target rules or
task scope expressly exclude execution. They do not implement or publish changes: delegation
alone never authorizes fixes, commits, pushes, PR creation or completion, merges, reviewer votes,
or parallel write workers. A linked profile, tool, or skill is not write authority. Preserve review-output writes already explicitly
authorized by the task and selected PR mode; do not ask again for the same authorized action.

If independent review was required or already agreed and agents are unavailable or declined,
report that limitation. A voluntary agent opt-out only needs recording when it replaces such a
required/committed independent pass; it does not make ordinary proportionate local review
unauthorized. Local self-review does not satisfy a policy that explicitly requires independent
review.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Local branch mode: [local-branch-mode.md](local-branch-mode.md)
- PR mode: [pr-mode.md](pr-mode.md)
- Skills index: [../../README.md](../../README.md)
