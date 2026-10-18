# VibeRails

Standards, guardrails and documentation templates for AI-assisted software projects, built on
one rule: **KIS - if a simple solution is enough, keep it simple.**

Pack version: see [CHANGELOG.md](CHANGELOG.md). Adopted repositories record their version in
`docs/INDEX.md`.

## Start Here - Adopt VibeRails

Open the repository you want to configure in Codex and paste:

```text
Set up VibeRails in the repository I currently have open.
Source: https://github.com/JakubParol/VibeRails

Read docs/templates/adopt-standards-prompt.md from that source and follow it.
Inspect my project first, then ask me the onboarding questions one at a time with an honest
question n/X counter, and wait for each answer. Talk to me in my language; keep repository
files in English. Ask me to approve the plan before changing any files or client settings.
Do not change the source VibeRails repository.
```

The agent asks about ten short questions: Git, review, agents and models, structure and
documentation, tracker, skills, test cadence, improvement reporting, the KIS decision model and
final approval. It skips what it can detect (such as the code host) and what you already
decided, and announces any change to the count. UI design is settled later, before the first
screen. You sign in to services yourself; never paste tokens into the chat. Deferred access stays
visible instead of being reported as working.

Starting setup does not authorize implementation or merge. A refresh keeps your earlier choices
instead of repeating onboarding.

## What You Get

- **Runtime standards** copied into your `docs/standards/`: [KIS](docs/standards/kis.md),
  [agent workflow](docs/standards/agent-workflow.md),
  [change protocol](docs/standards/change-protocol.md),
  [documentation](docs/standards/documentation.md),
  [quality gate](docs/standards/quality-gate.md),
  [integration profiles](docs/standards/integration-profiles.md) and
  [self-improve loop](docs/standards/self-improve-loop.md); for code,
  [architecture](docs/standards/architecture.md), [coding](docs/standards/coding.md) and
  [stack profiles](docs/standards/stack-profiles.md); per stack, [web UI](docs/standards/web-ui.md),
  [frontend](docs/standards/frontend.md), [backend](docs/standards/backend.md) and
  [backend testing](docs/standards/backend-testing.md).
- **A manifest and adoption record** (`.viberails/adoption.json`, `docs/viberails-adoption.md`)
  with your choices and pinned instruction hashes.
- **Optional Codex skills** (below).

The adoption procedure itself stays here and is read from a pinned commit:
[adoption](docs/standards/adoption.md), [onboarding rules](docs/standards/onboarding.md),
[questions](docs/standards/onboarding-questions.md),
[manifest reference](docs/standards/adoption-manifest.md) and
[configuration](docs/standards/configuration.md).

Supported today: Codex; Azure Boards, Jira or no tracker (MCP only); GitHub, Azure Repos or no
code host; PowerShell and/or POSIX shell; Next.js, Next.js + FastAPI and Python setups.

## KIS Decision Model

Agents apply KIS everywhere and check simplicity in every review. For quick, narrow judgments
("is the simpler option enough?") a project can use a decision model: TypeSafe Jev (default),
Microsoft-Decision-1 in Azure Foundry, or none. Answers are advice only, and only sanitized
summaries are sent. See [KIS](docs/standards/kis.md#decision-model).

## Agent Skills

Versioned Codex skills in [.agents/skills](.agents/skills/README.md) are optional:

| Skill | Use |
|---|---|
| [azure-devops](.agents/skills/azure-devops/SKILL.md) | Azure Boards work items and Azure Repos PRs through MCP. |
| [code-review](.agents/skills/code-review/SKILL.md) | Local branch, GitHub PR local-diff and Azure DevOps PR reviews. |
| [e2e-work-item](.agents/skills/e2e-work-item/SKILL.md) | Authorized task implementation from a brief or a tracker item. |
| [kis-review](.agents/skills/kis-review/SKILL.md) | Read-only KIS complexity review returning a keep/cut list. |
| [typesafe-jev](.agents/skills/typesafe-jev/SKILL.md) | TypeSafe Jev typed judgments through a helper that refuses secrets. |

Onboarding selects skills and their scope. The installers below install the **whole pack at
user scope** (`$CODEX_HOME/skills` or `$HOME/.codex/skills`); use them only for that choice:
`scripts/install-skills.sh` (Linux/macOS) or `.\scripts\install-skills.ps1` (Windows). Existing
links to other checkouts are reported as conflicts, never replaced; see
[installation ownership](scripts/README.md#skill-installation-ownership).

## Quality Gate

Check the files you changed locally, for example:

```bash
node scripts/validate.mjs --files README.md docs/INDEX.md
```

Full documentation, skill and regression checks run in [PR Verification](.github/README.md).
A full local gate needs an explicit request. See [scripts/README.md](scripts/README.md).

## Navigation

- [Agent instructions](AGENTS.md)
- [Documentation index](docs/INDEX.md)
- [Agent assets](.agents/README.md)
- [Scripts](scripts/README.md)
