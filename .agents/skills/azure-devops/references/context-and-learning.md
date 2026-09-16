# Azure DevOps Context And Learning

Use this reference for Azure DevOps MCP context resolution, provider capability discovery, and
verified durable failure-learning updates.

## Contents

- [Context Resolution](#context-resolution)
- [API Version Discipline](#api-version-discipline)
- [MCP Operation Capabilities](#mcp-operation-capabilities)
- [Failure Learning Update Pattern](#failure-learning-update-pattern)
- [Navigation](#navigation)

## Context Resolution

Resolve Azure DevOps context in this order:

1. Explicit organization, project, repository, work-item, or PR coordinates in the authorized
   task.
2. Target-owned configuration located through the target repository's `docs/INDEX.md` or native
   instructions.
3. Discovery/read operations exposed by the connected Azure DevOps MCP integration.
4. User input when a required coordinate remains unknown.

Do not guess context from unrelated repositories, historical records, or identity data. Inspect
the MCP tool schema and authentication metadata before sending provider coordinates. Do not
persist organization, project, repository, account, or generated provider responses in repository
files unless that file and content are explicitly authorized.

## API Version Discipline

The connected MCP server owns its Azure DevOps API transport and version selection. Do not choose
REST versions, invoke raw endpoints, or switch to CLI commands from this skill.

If MCP tool metadata exposes a provider/API version, preserve it as supporting evidence for the
current call. A missing or unsupported operation remains a capability limitation; it is not a
reason to bypass the MCP integration.

## MCP Operation Capabilities

Discover current operations and input schemas from the connected Azure DevOps MCP metadata.
Exposed tools do not prove authentication or effective account permissions; establish those
through authorized read-only calls and integration feedback for the intended target.

| Required behavior | MCP capability check |
|---|---|
| Read or query | Exact operation, target coordinates, pagination, successful-empty semantics, and returned stable identities. |
| Create | Supported fields, provider identity in the result, and a read operation that can recover an ambiguous result. |
| Shared update or relation change | Readable revision/version plus a matching write precondition when protected concurrency is required. |
| Comment or review publication | Exact target identity, authenticated actor when needed, returned comment/thread identity, and readback. |
| PR completion | Current source commit, approvals/policies, current CI evidence, and any atomic expected-head precondition required by target policy. |
| Cleanup | Exact deletion/archive operation, authority, stable target identity, and observable final/recycle state. |

If any required capability is absent, report it and block the dependent action. Do not use raw
API calls, scripts, or another unselected client as a workaround.

## Failure Learning Update Pattern

Record a reusable skill correction only when all criteria are true:

| Check | Required evidence |
|---|---|
| Reproducible symptom | Failing MCP operation class and sanitized error or missing-capability evidence. |
| Root cause | Verified tool-schema, authorization, provider-state, formatting, pagination, or skill-guidance cause. |
| Verified fix | Successful MCP operation plus focused remote readback. |
| Reuse value | Applies across adopting projects or prevents a recurring unsafe action. |
| Safe content | No credentials, raw customer data, prompts, PII, identity objects, user names, email addresses, or private payloads. |

Update target:

| Finding type | Update |
|---|---|
| Authority, routing, or durable workflow rule | `../SKILL.md` only when this provider skill owns it; otherwise the target-owned standard. |
| Operation-specific capability, pitfall, or recovery | The relevant reference in this folder. |
| Project-specific process, area, iteration, branch, or repository rule | Target repository documentation. |
| Verified historical finding awaiting approved consolidation | Append to [../LEARNINGS.md](../LEARNINGS.md) only when explicitly authorized. |

Reverify historical entries against current MCP metadata and provider state. Do not document
unverified workarounds, one-off account failures, transient outages, or unavailable operations as
successful fixes.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Boards reference: [boards.md](boards.md)
- Pull request reference: [prs.md](prs.md)
- Troubleshooting: [troubleshooting.md](troubleshooting.md)
- Skills index: [../../README.md](../../README.md)
