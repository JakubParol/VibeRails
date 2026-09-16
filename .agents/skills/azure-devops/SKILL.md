---
name: azure-devops
description: Inspect or change Azure Boards work items and Azure Repos pull requests through connected MCP. Use for a selected Azure DevOps operation or its failure; not for unrelated GitHub, Jira, or local work.
---

# Azure DevOps

## Overview

Use the connected Azure DevOps MCP integration for Azure Boards and Azure Repos operations.
Inspect its current tool metadata before selecting an operation: confirm the exact action,
required coordinates, authentication state, permissions, inputs, output shape, and any revision
precondition it exposes. A connected provider does not imply that every operation is available.

Do not fall back to Azure CLI, PowerShell wrappers, direct REST, or hand-built API payloads. When
the connected MCP integration lacks the required capability, report the limitation and block only
the dependent action.

Resolve target-owned workflow policy through the target repository's `docs/INDEX.md` or native
instructions. The VibeRails links below are source-pack reference defaults; they are target
authority only when the target explicitly adopts or links them.

| Context type | Read when | Source |
|---|---|---|
| Applicable instructions | Always read this entrypoint, then the reference for the selected Boards or Repos operation. | [Boards](references/boards.md) or [pull requests](references/prs.md). |
| Supporting knowledge | Connection, context, capability, authentication, or failure handling affects the next decision. | [Context and learning](references/context-and-learning.md) or [troubleshooting](references/troubleshooting.md). |
| Historical record | A current failure appears to repeat an earlier verified issue, or approved consolidation is in progress. | [LEARNINGS.md](LEARNINGS.md); treat entries as leads and reverify them. |

For delegated work, the source pack's default
[runtime routing rules](../../../docs/standards/agent-workflow.md#delegation-and-runtime-routing)
describe context packets and dispatch evidence.

## Guardrails

- Start with the MCP integration's read operations and metadata.
- Follow the target repository's authority contract. The source-pack references are the
  [task lifecycle](../../../docs/standards/change-protocol.md#task-lifecycle) and
  [authorization contract](../../../docs/standards/change-protocol.md#authorization-and-delivery).
  Carry forward authority already granted for the operation; tool availability does not grant it.
- Confirm the exact organization, project, repository, work item, PR, comment, and identity before
  a write. Never guess provider coordinates or people.
- Never log or commit credentials, authorization material, raw customer data, prompts, PII, or
  Azure DevOps identity objects.
- Use a unique marker for temporary test artifacts and retain every created artifact's MCP-returned
  identity plus the authorized cleanup action.
- Do not install, connect, or switch to another provider client merely because an MCP operation is
  unavailable.

## Operation Readiness And Recovery

Use the target repository's integration contract when present. The source-pack reference default
is [operation readiness and recovery](../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery).

For Azure DevOps MCP operations:

1. Inspect current MCP tool metadata and select the exact read or write operation. Verify required
   authentication and permission scopes from the integration's own metadata or error.
2. Read the target state and stable identity before writing. Distinguish a successful empty result
   from a tool, authorization, or provider error.
3. When the MCP write exposes a revision/version precondition, use the immediately observed value.
   If protected shared-state mutation is required and the MCP write cannot express the
   precondition, report that operation as unavailable. Readback is not a lost-update guard.
4. Execute an authorized write once. After a timeout or ambiguous response, read authoritative
   state using the provider identity, exact source/target, or permitted marker. Reuse or reconcile
   found effects; retry at most once only after absence is established and repetition is safe.
5. Read back the fields, links, comments, reviewers, source commit, status, or deletion state that
   prove the requested result.

## Failure Learning Loop

Treat a resolved MCP failure as a candidate skill improvement only when the cause and fix are
verified against current tool metadata and provider state. Use
[context-and-learning.md#failure-learning-update-pattern](references/context-and-learning.md#failure-learning-update-pattern).

Do not turn a one-off account permission, expired connection, transient outage, project-specific
field, or unavailable MCP operation into a generic workaround. Historical entries never override
the current integration schema or remote state.

## First Use

1. Inspect the connected Azure DevOps MCP tools and their schemas.
2. Confirm that the integration is authenticated and exposes the needed read operation.
3. Resolve organization, project, and repository through explicit task context, target repository
   configuration, or an MCP discovery operation.
4. If context, authentication, permission, or operation support is missing, report the exact
   missing capability. Do not configure a CLI or direct API fallback.

## Boards Workflow

Read [boards.md](references/boards.md) before work-item creation, update, linking, comments,
transitions, or cleanup.

Use only operations exposed by the connected MCP integration. Before each write, inspect process
metadata and the target item. Shared item updates and relation changes require revision protection
when the MCP supports it; if the required precondition is unavailable, block that dependent
mutation. After create or comment ambiguity, find the result by MCP-returned identity, permitted
marker, or exact target state before any repeat.

## PR Workflow

Read [prs.md](references/prs.md) before PR creation or mutation, review publication, voting, or
completion.

Before creating a PR, inspect active PRs for the exact source and target. Before publishing review
findings or a vote, compare the authenticated MCP identity with the PR creator when the integration
exposes both; if identity cannot be established, keep the review local. Before completion, verify
the current source commit, approvals, policies, and current-revision CI evidence through available
MCP reads. If a required read or atomic completion precondition is missing, report the limitation.

The source-pack defaults for proof and completion are
[evidence validity](../../../docs/standards/quality-gate.md#evidence-validity) and
[handoff and acceptance](../../../docs/standards/change-protocol.md#handoff-and-acceptance).

## References

- [references/context-and-learning.md](references/context-and-learning.md) - MCP context,
  capability discovery, and durable failure-learning updates.
- [references/boards.md](references/boards.md) - Azure Boards operations, revision safety, rich
  text, comments, links, and cleanup.
- [references/prs.md](references/prs.md) - Azure Repos pull requests, review publication, current
  revision evidence, and completion.
- [references/troubleshooting.md](references/troubleshooting.md) - MCP failure classification and
  ambiguous-write recovery.
- [LEARNINGS.md](LEARNINGS.md) - historical learning inbox; reverify entries before use.

## Navigation

- Skills index: [../README.md](../README.md)
- Troubleshooting: [references/troubleshooting.md](references/troubleshooting.md)
- Repository docs: [../../../docs/INDEX.md](../../../docs/INDEX.md)
