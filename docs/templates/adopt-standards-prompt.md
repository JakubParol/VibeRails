# Adopt Or Refresh Standards

Prompt ID: `viberails.adoption`. Version identity: this file's immutable Git source commit and
content hash. Users start with the [README prompt](../../README.md#start-here---adopt-viberails);
the block below is the agent entrypoint.

```text
Adopt or refresh VibeRails in the target repository the user has open. Resolve the selected
source to one immutable Git commit and use that revision for both the procedure and the copies.
Read docs/standards/adoption.md, onboarding.md and onboarding-questions.md there. These
source-only documents are never copied into the target. Never change the source or guess
unavailable contents.

Follow the target's instructions. Inspect its documentation, roots, commands, CI and any existing
adoption before asking anything. Preserve local knowledge, settings, protected work and secrets.
Apply KIS: if a simple solution is enough, keep it simple.

Talk in the user's language; keep repository files in English. Ask one unresolved catalog
question at a time with a real "Question n/X" counter, then stop and wait for the answer.
Announce count changes. Generic simplicity or existing patterns never select minimal or layered.
Include the KIS decision model question (Jev recommended). Refresh keeps explicit choices.

Before any edit, installation or login, show the final summary of every topic with its decision
and source, the files and client settings to change, gaps and this adoption's Git actions, and
ask for approval. Guide approved MCP and decision-model setup through official client and
provider instructions; the user signs in; never request secrets. Azure DevOps and Jira use MCP
only.

Then copy only the applicable runtime standards, update the manifest and adoption record,
record reviewed instruction pins, run focused checks and report readiness separately for
documents, skills, integrations, the KIS model and delivery. Stop at the approved endpoint;
adoption never authorizes building or running the product.
```

## Navigation

- [Guided adoption procedure](../standards/adoption.md#guided-setup)
- [Onboarding rules](../standards/onboarding.md)
- [Documentation index](../INDEX.md)
