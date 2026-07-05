# VibeRails

Standards, guardrails, and documentation templates for AI-assisted software projects.

Pack version: see [CHANGELOG.md](CHANGELOG.md). Adopting repositories record the adopted
version in their `docs/INDEX.md`.

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

## Agent Skills

Versioned Codex skills live in [.agents/skills](.agents/skills/README.md). They capture
repeatable repository workflows. They are optional agent assets, not part of core adoption.
Install them once per machine at the Codex user scope only when the user wants these workflows
available in every repository:

| Platform | Command |
|---|---|
| Linux/macOS | `scripts/install-skills.sh` |
| Windows or PowerShell | `.\scripts\install-skills.ps1` |

Both installers target `$CODEX_HOME/skills`, or `$HOME/.codex/skills` when `CODEX_HOME` is not
set.

| Skill | Intended use |
|---|---|
| [azure-devops](.agents/skills/azure-devops/SKILL.md) | Optional Azure DevOps profile skill for Azure Boards work items, Azure Repos pull requests, and reusable Azure DevOps failure fixes. |
| [code-review](.agents/skills/code-review/SKILL.md) | Optional review skill for local branch reviews, GitHub PR local-diff reviews, and Azure DevOps PR reviews. |
| [e2e-work-item](.agents/skills/e2e-work-item/SKILL.md) | Optional Azure DevOps profile skill for Azure Boards `[E2E]` work item implementation. |

## Quick Adoption Prompt

To apply these standards to another repository, start with
[docs/templates/adopt-standards-prompt.md](docs/templates/adopt-standards-prompt.md).

Open the target repository in Codex first, then provide the standards repository path or URL
in that prompt. The agent records the target repository root during preflight instead of
guessing it from the prompt text.

## How To Use This Repository

When working in another repository, give the AI agent access to this repository and ask it to:

1. Read this repository's `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
2. Follow [docs/standards/adoption.md](docs/standards/adoption.md).
3. Select stack, work tracking, code hosting, platform, and self-improve profiles.
4. Copy the relevant standards into the target repository's `docs/standards/`.
5. Create or update the target repository root `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
6. Create `.viberails/adoption.json` and `docs/viberails-adoption.md`.
7. For monorepos, create a full documentation root for each standalone app, service, worker,
   mobile app, or package.
8. Add local `README.md` files to significant feature, module, adapter, and bounded-context
   folders.
9. Add folder-level `AGENTS.md` files only where local agent rules differ from the parent.
10. Do not copy skills into the target project. Install them once per machine at the Codex
   user scope only when those optional workflows are needed; see
   [.agents/skills](.agents/skills/README.md).
11. Update navigation links so agents can drill down from general standards to local context.

The target repository owns its final documentation. This repository provides reusable defaults,
templates, and structure.

## Reading Order

For every project that uses this template, start from broad context and drill down:

1. Root `README.md` - what the project is and how to run it.
2. Root `AGENTS.md` - rules for AI agents working in the project.
3. `docs/INDEX.md` - table of contents for project documentation.
4. `docs/standards/agent-workflow.md` - context loading, planning, editing, verification, and reporting.
5. `docs/standards/change-protocol.md` - branch, commit, push, PR, and review-loop protocol.
6. General standards in `docs/standards/`.
7. Stack-specific standards for the code being changed.
8. Child project `README.md`, `AGENTS.md`, and `docs/INDEX.md` when working in a monorepo
   app, service, worker, mobile app, or package.
9. Nearest folder-level `README.md` or `AGENTS.md` for local context.

## Standards

| Area | Document |
|---|---|
| Agent workflow | [docs/standards/agent-workflow.md](docs/standards/agent-workflow.md) |
| Adoption | [docs/standards/adoption.md](docs/standards/adoption.md) |
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
| Frontend | [docs/standards/frontend.md](docs/standards/frontend.md) |

## Agent Assets

| Area | Document |
|---|---|
| Agent assets | [.agents/README.md](.agents/README.md) |
| Agent skills | [.agents/skills/README.md](.agents/skills/README.md) |

## Quality Gate

Before reporting changes as ready, run:

```bash
node scripts/validate.mjs
```

This checks Markdown links and anchors, orphaned Markdown files, ASCII-only documentation and
skill files, skill metadata, and source-specific terms in `.agents`.

When PowerShell is available, also run:

```powershell
.\scripts\validate.ps1
```

The PowerShell gate performs the same repository checks and additionally parses `.ps1` files.

## Templates

Use files in [docs/templates](docs/templates/) when starting a new project or adding a
documented sub-area:

- `adopt-standards-prompt.md` - prompt for applying these standards to another repository.
- `viberails-adoption.md` - human-readable adoption record for target repositories.
- `viberails-adoption.json` - machine-readable adoption manifest template.
- `adoption-audit.mjs` - optional target-side audit script to copy into adopted repositories.
- `project-README.md` - copy to project root as `README.md`.
- `project-AGENTS.md` - copy to project root as `AGENTS.md`.
- `project-docs-INDEX.md` - copy to project root as `docs/INDEX.md`.
- `folder-README.md` - copy to a significant non-root folder as `README.md`.
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
