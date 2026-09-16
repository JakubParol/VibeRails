# Azure Boards Reference

Use this reference for Azure Boards work items, backlog slicing, rich text, comments, hierarchy
links, revision-safe updates, and cleanup through the connected Azure DevOps MCP integration.

## Contents

- [Boards Metadata](#boards-metadata)
- [Backlog Slicing For Codex](#backlog-slicing-for-codex)
- [Work Item Rich Text Safety](#work-item-rich-text-safety)
- [Safe Write Recovery](#safe-write-recovery)
- [Revision Protection](#revision-protection)
- [Reliable Board Commands](#reliable-board-commands)
- [Known Board Pitfalls](#known-board-pitfalls)
- [Cleanup Pattern](#cleanup-pattern)
- [Navigation](#navigation)

## Boards Metadata

Before writing in a new project, use MCP discovery/read operations to inspect:

- available work-item types and their required fields;
- area and iteration paths;
- valid states and transitions;
- supported rich-text and custom fields;
- hierarchy and relation types;
- revision/version fields and write preconditions exposed by the MCP tool.

Treat common Epic, Feature, User Story, Bug, Task, and Issue types as examples only. The project's
current process metadata decides what exists and which fields are valid.

## Backlog Slicing For Codex

A child task should be one coherent Codex job: a bounded context, a connected backend/API slice,
a frontend workflow, or another implementation step that can be completed and verified together.

Do not split create/list/update/deactivate/delete work into separate tasks when they touch the same
ownership boundary and verification. Split when work crosses owners, depends on unresolved product
decisions, needs separate authority, or cannot be completed and verified as one job.

Keep sizing guidance in the title, description, acceptance criteria, or comment when needed. Do
not add process-specific tags unless the target project explicitly uses them.

## Work Item Rich Text Safety

Inspect the selected MCP operation's schema for rich-text fields and content format. Prefer
putting Description and Acceptance Criteria in the initial create when the MCP operation supports
them. If they require a follow-up update, use the newly read item revision when the MCP write
exposes a revision precondition.

Read the created or updated item back and verify the intended fields. If content is missing,
truncated, or transformed incorrectly, make only an authorized revision-guarded correction.
When the MCP integration cannot preserve the content or required revision guard, report the
capability missing instead of switching to raw API or command-line input.

## Safe Write Recovery

| Operation | Read before write | Readback and ambiguous result |
|---|---|---|
| Create work item | Confirm process metadata and use a permitted unique marker for temporary artifacts. | Capture the MCP-returned id. After ambiguity, query by marker or exact fingerprint; continue from one match and do not repeat when present or uncertain. |
| Update fields, state, or rich text | Read the exact item and revision/version. | Verify every intended field. On conflict, reread and reconcile; never reuse a stale revision. |
| Link child or related item | Read both items, current relations, and any required revision. | Verify the relation once. After ambiguity, read relations before another attempt. |
| Add comment | Retain exact target and content; use a marker for temporary tests. | Capture comment identity. After ambiguity, read comments and continue from one exact match; stop on multiple or uncertain matches. |
| Update comment | Read the current comment and any version accepted by the write operation. | Verify the same comment identity and content. If no version precondition exists, do not claim concurrency protection. |
| Delete comment or item | Read the exact identity and confirm current authority. | Treat an MCP-documented successful no-content response as success, then verify deletion or recycle state when exposed. A timeout is not proof of deletion. |

Authentication, authorization, validation, missing-target, process-rule, and revision-conflict
errors require correction or reconciliation, not unchanged retry.

## Revision Protection

For shared work-item fields, states, rich text, and relations, inspect whether the connected MCP
read returns a revision/version and the matching write accepts it as a precondition.

- If both exist, use the immediately observed revision.
- If the write rejects a stale revision, reread and reconcile before a new authorized attempt.
- If the MCP write does not expose the required precondition, the protected mutation is
  unavailable through the selected integration.
- A successful readback proves observed state only; it does not prevent a lost update.

Do not construct a raw JSON patch, REST request, or CLI fallback to bypass a missing MCP
capability.

## Reliable Board Commands

There are no repository-provided Board commands. Use the connected Azure DevOps MCP operations
whose current metadata matches the required action.

Before a write, record the selected MCP operation, target organization/project, item identity,
authority, relevant revision, and intended fields. Afterward, record the returned identity and
focused readback. Treat an empty successful query as empty only when the tool itself succeeded.

## Known Board Pitfalls

- Process types, states, custom fields, and hierarchies vary by project; inspect metadata first.
- A general connection check does not prove create, update, transition, comment, link, or delete
  permission.
- Create and comment operations may not be idempotent. After an ambiguous result, read before any
  repeat.
- Readback without a revision precondition is not lost-update protection.
- Rich text can be normalized by the provider or integration; compare intended meaning and
  required structure, not an assumed transport representation.
- Comment versions are usable as preconditions only when the MCP write schema accepts them.
- A failed query is not an empty result.

## Cleanup Pattern

For authorized temporary work-item tests:

1. Use a unique neutral marker supported by the target process.
2. Capture every MCP-returned item, comment, and relation identity immediately.
3. Read the exact target before cleanup.
4. Use only the connected MCP deletion/archive operation already covered by task authority.
5. Read back the deletion or recycle state. If cleanup support is absent, report the remaining
   artifact and exact missing operation.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Context and learning: [context-and-learning.md](context-and-learning.md)
- Pull request reference: [prs.md](prs.md)
- Troubleshooting: [troubleshooting.md](troubleshooting.md)
- Skills index: [../../README.md](../../README.md)
