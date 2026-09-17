# VibeRails

Standards, guardrails, and documentation templates for AI-assisted software projects.

Pack version: see [CHANGELOG.md](CHANGELOG.md). Adopting repositories record the adopted
version in their `docs/INDEX.md`.

## Start Here - Adopt VibeRails

Open the repository you want to configure in your coding agent, then paste this prompt.
Current supported setup is Codex with access to that working tree and the source repository.
You do not need to choose files, edit a manifest, find a commit hash or install skills first.

```text
Set up VibeRails in the repository I currently have open.
Source: https://github.com/JakubParol/VibeRails

Read docs/templates/adopt-standards-prompt.md from that source and follow its guided procedure.
Inspect my project, then use its canonical onboarding questions, one at a time, with an honest
question n/X counter. After each question, stop and wait for my answer. Conduct the conversation
in my language and switch when I do; keep repository instructions in English.
Recommend relevant standards and help configure and check the MCP connections I select.
Ask me to approve the setup and delivery plan before changing files or client settings.
Do not change the source VibeRails repository.
```

The agent uses the [question catalog](docs/standards/onboarding-questions.md) and
[conversation rules](docs/standards/onboarding.md), reusing explicit decisions and detected
facts while announcing changes to the remaining question count. Generic preferences such as
"keep it simple" do not select `minimal` or `layered`. Before approval, it accounts for all
21 topics, including sources for known choices and reasons for skips or deferrals.
It will explain what it found, guide you
through standards, tracker/code-host choices,
MCP access, optional skills and delivery permissions, then apply the approved plan. Azure Boards,
Jira and no tracker are supported choices; code hosting is selected separately. Sign in through
your client's authentication flow, never by pasting tokens into chat. Missing access can be
explicitly deferred and stays visible, not reported as a working integration.

At handoff expect selected settings, preserved local decisions, check results, connection gaps
and the actual local/PR outcome. Starting setup does not authorize application implementation
or merge. Refreshing an existing adoption preserves its choices rather than repeating onboarding.

Agent entrypoint: [shared adoption prompt](docs/templates/adopt-standards-prompt.md).
A local checkout or a chosen source ref can be supplied instead; the agent resolves and records
an immutable source commit before copying. Without source access, it must report that gap, not
reconstruct the pack from memory. No background service or additional installer is required.

## What VibeRails Provides

This repository is a reusable, process-neutral standards pack for software projects developed
with AI coding agents. It is meant to be referenced from another repository when a project is
created or when an existing project needs consistent documentation, agent instructions,
architecture rules, and quality gates.

A user can point an AI agent at this repository and ask it to adopt these standards in the
target project. The agent should copy the relevant templates, create missing Markdown files,
wire the documentation navigation, record selected profiles, and adapt the standards to the
target repository without turning this repository into project-specific documentation.

VibeRails is currently Codex-first. It supports generic adoption across Windows, Linux, and
macOS with optional profiles for Azure DevOps or Jira work tracking, GitHub or Azure Repos code
hosting, and PowerShell or POSIX shell commands. Provider choices belong to the target
repository and must be recorded during adoption.

The standards are project-agnostic, but currently cover these common setups:

| Setup | Intended use |
|---|---|
| Next.js frontend only | Next.js owns the UI and talks to an external or separately managed API. |
| Next.js full stack | Next.js owns both frontend and API routes/server actions inside one project. |
| Next.js + Python FastAPI | Next.js owns the frontend while FastAPI owns backend application and API logic. |

The standards are intentionally opinionated. Project-specific documents may add detail, but
they should not weaken the defaults unless the exception is explicit and justified.

## Web UI Quality

React web projects use project-owned shadcn/ui components with component-local styles and
semantic theme tokens. No raw Radix usage in feature code. New foundations prefer shadcn's
Base UI option; working shadcn/Radix internals are not automatically migrated.

[Web UI and UX](docs/standards/web-ui.md) defines visual direction, reusable layout patterns,
responsive/accessibility states and browser acceptance. [Frontend](docs/standards/frontend.md)
owns Next.js boundaries, component reuse, styling and test selection. Build one polished
representative screen before expanding; do not add a second design system or decorative stack.
These standards guide implementation, not a guarantee of visual quality without inspecting it.

## Agent Skills

Versioned Codex skills live in [.agents/skills](.agents/skills/README.md). They capture
repeatable repository workflows. They are optional agent assets, not part of core adoption.
Choose the skills first, then their scope during onboarding: a pinned project-local copy or
one user-scope installation available in all Codex projects. Existing working selections are
reused. The commands below install the **whole pack at user scope**; use them only when that
complete selection and scope were approved, not for a subset or project-local onboarding:

| Platform | Command |
|---|---|
| Linux/macOS | `scripts/install-skills.sh` |
| Windows or PowerShell | `.\scripts\install-skills.ps1` |

Both installers target `$CODEX_HOME/skills`, or `$HOME/.codex/skills` when `CODEX_HOME` is not
set. Existing links to other checkouts or user skills are conflicts, never silently replaced;
see [installation ownership](scripts/README.md#skill-installation-ownership) before upgrading.

| Skill | Intended use |
|---|---|
| [azure-devops](.agents/skills/azure-devops/SKILL.md) | Optional Azure DevOps MCP skill for Azure Boards work items, Azure Repos pull requests, and reusable Azure DevOps failure fixes. |
| [code-review](.agents/skills/code-review/SKILL.md) | Optional review skill for local branch reviews, GitHub PR local-diff reviews, and Azure DevOps PR reviews. |
| [e2e-work-item](.agents/skills/e2e-work-item/SKILL.md) | Optional authorized task implementation from a brief or selected tracker, with MCP provider bindings and no-tracker support. |

## Quick Adoption Prompt

Use the copyable [Start Here prompt](#start-here---adopt-viberails) above. The
[adoption procedure](docs/standards/adoption.md#guided-setup) owns the conversation, approval,
copying and verification steps; users should not have to write a project-specific prompt.
Shared instructions remain model-neutral. See the [configuration contract](docs/standards/configuration.md)
and [refresh procedure](docs/standards/adoption.md#existing-project-refresh) for existing projects.

## How To Use This Repository

Use the [adoption standard](docs/standards/adoption.md) for the workflow, preservation rules,
profile decisions and evidence. The [adoption prompt](docs/templates/adopt-standards-prompt.md)
starts that operation; ordinary project edits do not run adoption again. The target repository
owns its final documentation and existing knowledge. This pack supplies reusable defaults.

## Reading Order

Follow the [canonical context router](docs/standards/agent-workflow.md). The index locates
relevant rules; it does not require loading the whole pack. Project/folder instructions add
local constraints, and optional skills add only requirements for the selected operation.

## Standards

| Area | Document |
|---|---|
| Agent workflow | [docs/standards/agent-workflow.md](docs/standards/agent-workflow.md) |
| Adoption | [docs/standards/adoption.md](docs/standards/adoption.md) |
| Onboarding questions | [docs/standards/onboarding-questions.md](docs/standards/onboarding-questions.md) |
| Onboarding conversation and decisions | [docs/standards/onboarding.md](docs/standards/onboarding.md) |
| Adoption manifest | [docs/standards/adoption-manifest.md](docs/standards/adoption-manifest.md) |
| Change protocol | [docs/standards/change-protocol.md](docs/standards/change-protocol.md) |
| Documentation | [docs/standards/documentation.md](docs/standards/documentation.md) |
| Documentation audit | [docs/standards/documentation-audit.md](docs/standards/documentation-audit.md) |
| Integration profiles | [docs/standards/integration-profiles.md](docs/standards/integration-profiles.md) |
| Platform profiles | [docs/standards/platform-profiles.md](docs/standards/platform-profiles.md) |
| Quality gate | [docs/standards/quality-gate.md](docs/standards/quality-gate.md) |
| Self-improve loop | [docs/standards/self-improve-loop.md](docs/standards/self-improve-loop.md) |
| Stack profiles | [docs/standards/stack-profiles.md](docs/standards/stack-profiles.md) |
| Architecture | [docs/standards/architecture.md](docs/standards/architecture.md) |
| General coding | [docs/standards/coding.md](docs/standards/coding.md) |
| Backend | [docs/standards/backend.md](docs/standards/backend.md) |
| Backend testing | [docs/standards/backend-testing.md](docs/standards/backend-testing.md) |
| Web UI and UX | [docs/standards/web-ui.md](docs/standards/web-ui.md) |
| Frontend | [docs/standards/frontend.md](docs/standards/frontend.md) |

## Agent Assets

| Area | Document |
|---|---|
| Agent assets | [.agents/README.md](.agents/README.md) |
| Agent skills | [.agents/skills/README.md](.agents/skills/README.md) |

## Quality Gate

Locally validate the files you changed, for example:

```bash
node scripts/validate.mjs --files README.md docs/INDEX.md
```

Run the small validator regression tests when its behavior changes. Full documentation,
navigation and skill validation belongs to [PR Verification](.github/README.md), together with
validator regressions and the maintained architecture examples. Local full gates require an
explicit user request; missing CI is a reported limitation, not permission to run them.

See [scripts/README.md](scripts/README.md) for exact commands, focused coverage and the legacy
PowerShell validator's limits. Keep CI evidence tied to the source and actually tested revisions.

## Templates

Use files in [docs/templates](docs/templates/) when starting a new project or adding a
documented sub-area:

- `adopt-standards-prompt.md` - prompt for applying these standards to another repository.
- `viberails-adoption.md` - human-readable adoption record for target repositories.
- `viberails-adoption.json` - machine-readable adoption manifest template.
- `adoption-audit.mjs`, its helper directory, `adoption-state.mjs` and `adoption-pins.mjs` - optional read-only adoption checks and instruction fingerprints.
- `project-README.md` - copy to project root as `README.md`.
- `project-AGENTS.md` - copy to project root as `AGENTS.md`.
- `project-docs-INDEX.md` - copy to project root as `docs/INDEX.md`.
- `folder-README.md` - copy into a significant non-root folder as `README.md`.
- `folder-AGENTS.md` - copy into folders that need local agent rules.
- `adr.md`, `design-note.md`, `runbook.md`, `api-contract.md`, `quality-gate.md` - copy for
  focused project documentation.

## Core Rules

- Keep documentation Markdown-first.
- Follow the change protocol for branch setup, commits, push, PR, and review loops.
- Use the adoption standard when applying these standards to another repository.
- Record selected profiles and the self-improve ticket sink during adoption.
- Prefer local context files over long global documents.
- Every repository root and standalone monorepo project has `README.md`, `AGENTS.md`, and
  `docs/INDEX.md`.
- Every significant non-root folder must explain its purpose and boundaries.
- Agents must read only the context needed for the current task, but they must not skip
  required parent standards.
- Code follows Clean Architecture, separation of concerns, explicit boundaries, dependency
  injection, and testability by default.
- Tests prove behavior at the lowest useful level and integration points with real adapters
  where correctness depends on infrastructure.

## Navigation

- [Agent instructions](AGENTS.md)
- [Documentation index](docs/INDEX.md)
- [Agent assets](.agents/README.md)
- [Scripts](scripts/README.md)
