# Azure Repos Pull Request Reference

Use this reference for Azure Repos pull-request reads, metadata changes, work-item links, review
comments, reviewer votes, draft/publication state, and completion through the connected Azure
DevOps MCP integration.

## Contents

- [Reliable PR Commands](#reliable-pr-commands)
- [Safe Write Recovery](#safe-write-recovery)
- [Current Revision And Completion](#current-revision-and-completion)
- [Known PR Pitfalls](#known-pr-pitfalls)
- [Navigation](#navigation)

## Reliable PR Commands

There are no repository-provided PR commands. Inspect the connected Azure DevOps MCP tools and
use only the operation whose current metadata matches the requested action.

Before any PR write:

1. Read the repository and exact PR or source/target refs.
2. Confirm current task authority for creation, publication, comment/vote, abandonment, or
   completion.
3. Inspect whether the MCP operation exposes the identities, revision/source commit, permissions,
   and preconditions needed by target policy.
4. After the write, read back the exact PR fields or related resource that establish success.

Before creating a PR, query active PRs for the exact source and target. Before publishing review
findings or a reviewer vote, compare the authenticated MCP actor with the PR creator when both are
available. If self-review status cannot be established, keep review findings local.

## Safe Write Recovery

| Operation | Read before write | Readback and ambiguous result |
|---|---|---|
| Create draft PR | Query active PRs for exact source/target refs; retain the current source commit. | Capture the MCP-returned PR identity. After ambiguity, query the exact refs and continue from one match; do not create another PR when present or uncertain. |
| Update title, description, or draft state | Read PR identity, current value, state, and source commit. | Verify the intended field. Retry only when readback proves it was not applied and repetition is safe. |
| Link work items | Read current PR work-item links. | Verify each intended identity once; after ambiguity, add only confirmed missing links. |
| Add summary or inline review comment | Read existing threads and, for inline findings, current file/diff context exposed by MCP. | Capture thread/comment identity and verify content/location. After ambiguity, continue from one exact match and stop on uncertain matches. |
| Reviewer vote | Read authenticated actor, creator, reviewers, and draft state. | Verify the intended vote for the same actor. Do not publish a non-reset vote when self-review or draft restrictions apply. |
| Complete or abandon | Read status, source commit, approvals, policies, and required verification evidence. | Verify final status and merge metadata. After ambiguity, read before any repeat; a timeout is not proof that the action failed. |

MCP errors for authentication, authorization, validation, missing targets, policy rejection, or
stale state require correction or reconciliation, not unchanged retry.

## Current Revision And Completion

Immediately before approval publication or completion, use available MCP reads to compare the
current PR source commit with the commit actually reviewed and tested. Inspect current reviewers,
policy evaluations, and current-revision CI/run evidence required by target policy.

A connected MCP integration, a configured policy, draft status, or an older successful run does
not prove the current commit passed. When target policy requires an atomic expected-head
precondition, verify that the MCP completion operation exposes it. If it does not, report
completion as unavailable under that policy. A final read detects stale evidence but is not
atomic concurrency protection.

After completion, read the PR again and verify completed status plus the provider's resulting
merge commit/state. Do not claim merge from a successful request alone.

## Known PR Pitfalls

- PR comments are thread resources; use only the exact MCP operation and location schema exposed
  by the connected integration.
- Inline comments require current diff/file context. If MCP cannot resolve it, keep the finding
  local rather than posting a misplaced summary.
- A self-created PR may prohibit published review findings or votes under the selected workflow.
  Missing actor identity is not proof that publication is allowed.
- PR creation and comment publication may not be idempotent. Read exact refs or threads after an
  ambiguous response before any repeat.
- Policy listings and pipeline configuration are not current-revision CI results.
- Draft PR behavior varies by configured pipelines. Inspect actual current run evidence.
- Missing MCP operation or permission blocks the dependent action. Do not use CLI, direct REST,
  scripts, or raw payloads as fallback.
- Authority already granted for an operation should be carried forward; PR existence or tool
  availability does not grant additional authority.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Context and learning: [context-and-learning.md](context-and-learning.md)
- Boards reference: [boards.md](boards.md)
- Troubleshooting: [troubleshooting.md](troubleshooting.md)
- Skills index: [../../README.md](../../README.md)
