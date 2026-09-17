# Adopt Or Refresh Standards

Prompt ID: `viberails.adoption`. Version identity: this file's immutable Git source commit and
actual content hash. Shared wording is model-neutral; client/tool support remains explicit.
Users start with the [copyable README prompt](../../README.md#start-here---adopt-viberails).
The block below is the agent entrypoint, not a form the user must complete.

```text
Adopt or refresh VibeRails in the target repository the user has open. Use the source selected
by the user or launching README; ask only if it is ambiguous. Resolve the source to one immutable
Git commit and read its docs/standards/adoption.md, especially Guided Setup, along with
docs/standards/onboarding.md and docs/standards/onboarding-questions.md. Use that same revision
for the procedure and copies. Never change the source repository or guess unavailable contents.

Follow applicable target instructions. Inspect its actual documentation, roots, commands, CI and
existing adoption before editing. Distinguish planned architecture from implemented components.
Preserve local knowledge, settings, protected work and secrets.

Conduct the guided conversation in the user's language; switch with their own messages unless
they explicitly request another language. The English bootstrap text does not reset that choice.
Keep repository instructions in English. Use the canonical catalog, translate it faithfully,
ask one unresolved applicable question at a time with the real n/X counter, then yield and wait
for the answer. Announce any count change; silence and accepted question cards are not answers.
Recommend relevant standards and collect selected provider coordinates without tokens.
Separate tracker, code host, client MCP setup, optional skill scope and action authority. A user
must not need manifest field names, source hashes or a custom prompt. Retain existing choices on
refresh and do not ask again for known answers or already-authorized operations.

Keep future-task Git actions separate from this adoption's Git actions and final setup approval.
Do not choose personal skills because they are installed. Review timing, review staffing,
coding/testing delegation, model policy and test cadence are separate decisions. Record choices
without a matching manifest field as explicit target project rules, never as a different value.

Show the effective choices, files/client settings to change, proposed scoped access checks,
remaining gaps and delivery endpoint. Obtain approval before edits, installations or login flows.
An explicit grant already covering this plan remains valid; seek only missing decisions or scope.
Guide approved MCP setup through the current client's supported mechanisms and official provider
instructions. Check selected resources through MCP. Record deferred access honestly; Azure DevOps
and Jira never fall back to provider CLI, raw REST or wrappers. Do not mutate remote data to test
permissions without separate covered authority.

Execute the approved adoption/refresh procedure. Maintain the existing manifest and human record,
complete explicit configuration, selected references and reviewed instruction pins. Keep routing
inherited unless separately authorized at runtime. Never repin unexplained drift, erase conflicts
or disguise missing required values as a completed setup. An unchanged repeat is a no-op.

Use focused documentation/adoption checks and existing CI for required broad verification.
Report actual readiness separately for documents, skills, integrations and delivery; include
next actions for missing access or migration. Continue only to the approved local/PR/merge
endpoint with current evidence. Adoption is not permission to build or run the product.
```

## Navigation

- [Guided adoption procedure](../standards/adoption.md#guided-setup)
- [Canonical questions](../standards/onboarding-questions.md)
- [Conversation and decision rules](../standards/onboarding.md)
- [Configuration contract](../standards/configuration.md)
- [Documentation index](../INDEX.md)
