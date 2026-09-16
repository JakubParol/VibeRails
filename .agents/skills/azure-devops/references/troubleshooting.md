# Azure DevOps Troubleshooting

Use this reference when a connected Azure DevOps MCP operation fails, times out, returns an
ambiguous result, or lacks a required capability.

First inspect the integration's current tool metadata, authentication state, operation schema, and
sanitized error. Use an MCP-provided diagnostic operation only when one exists. Do not switch to
Azure CLI, PowerShell, direct REST, raw payloads, or an unselected client.

Classify the result before choosing a next action:

| Class | Meaning | Action |
|---|---|---|
| Successful with data | The MCP tool returned the expected provider object. | Validate stable identity and read back the state relevant to the operation. |
| Successful-empty | The MCP operation succeeded and its schema permits an empty result or no-content write. | Treat it as success; read the exact target when final state needs confirmation. |
| Permanent until corrected | Missing authentication/permission, invalid input, absent target, unsupported operation, process/policy restriction, self-review guard, or stale revision. | Correct the input/state or report the dependent capability/authority blocker. Do not retry unchanged. |
| Transient read failure | Timeout, throttling, connection loss, or provider service failure before any write. | Retry at most once when the error is concretely recoverable, then report the blocker. |
| Ambiguous write | Timeout, connection loss, or malformed/missing response after a write may have reached Azure DevOps. | Read authoritative state by stable identity, exact refs, or permitted marker. Reuse/reconcile found effects; retry only after absence is established and repetition is safe. |
| Unknown | MCP metadata and sanitized error do not support a safe classification. | Stop, preserve the evidence, and report the limitation. |

## Symptom Table

| Symptom | Likely cause | Next step |
|---|---|---|
| No Azure DevOps MCP tool is connected | Required provider integration is unavailable. | Report the missing integration; block only Azure DevOps-dependent actions. Do not install or use another client. |
| MCP is connected but the operation is absent | The server does not expose that capability. | Report the exact missing operation. Continue independent work only. |
| Authentication or permission denied | The integration session lacks valid auth or provider permission. | Report the affected operation and required permission from MCP metadata/error. Do not request broader access than the task needs. |
| Read returns no objects | It may be a real empty result or a failed/incorrectly scoped query. | Confirm tool success, coordinates, filters, and pagination before concluding nothing exists. |
| Write times out or returns no usable result | The provider may have applied all or part of the write. | Read by stable identity, exact source/target, or permitted marker before another attempt. |
| Create result is ambiguous | Repeating may create a duplicate work item, PR, comment, or thread. | Query the exact fingerprint. Continue from one match; stop on multiple or uncertain matches. |
| Revision conflict | Another actor changed shared state after the read. | Reread, reconcile intent, and use the new revision only for a newly authorized guarded write. |
| Read exposes a revision but write has no revision input | The selected MCP path cannot protect the shared update. | Report the mutation unavailable; readback is not a lost-update guard. |
| PR source commit differs from reviewed/tested commit | Evidence is stale. | Stop publication/completion and re-review or reverify the current commit. |
| Pipeline/policy data lacks current tested commit | The MCP read is incomplete for acceptance evidence. | Report the evidence gap; do not infer PASS from configuration or an older run. |
| MCP response omits stable identity needed for readback | The outcome cannot be reconciled safely. | Stop and report the missing identity/output capability. |
| Provider text or formatting changed unexpectedly | The integration/provider normalized content or the selected field format is unsupported. | Read the stored value, preserve meaning/required structure, and correct only through an authorized supported MCP operation. |

## Escalation Rule

Stop when the bounded retry is exhausted, remote identity remains ambiguous, a permanent failure
is unchanged, or the required operation/revision capability is unavailable. Report:

- selected MCP operation and target scope;
- sanitized error or missing schema capability;
- authentication/permission evidence exposed by MCP;
- authoritative readback attempted;
- whether the result is absent, applied, partial, duplicate, or still unknown;
- the blocked dependent action and independent work that remains possible.

Record a durable learning only through
[context-and-learning.md#failure-learning-update-pattern](context-and-learning.md#failure-learning-update-pattern)
after the fix is verified through MCP and remote readback.

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Context and learning: [context-and-learning.md](context-and-learning.md)
- Boards reference: [boards.md](boards.md)
- Pull request reference: [prs.md](prs.md)
- Skills index: [../../README.md](../../README.md)
