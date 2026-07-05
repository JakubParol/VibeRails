# Documentation Index

This index is the entry point for all standards and templates in this repository.

## Standards

| Document | Purpose |
|---|---|
| [agent-workflow.md](standards/agent-workflow.md) | How AI agents load context, plan work, edit files, verify changes, and report results. |
| [adoption.md](standards/adoption.md) | How agents apply this standards pack to another repository. |
| [adoption-manifest.md](standards/adoption-manifest.md) | Required `.viberails/adoption.json` fields for adopted repositories. |
| [change-protocol.md](standards/change-protocol.md) | Required branch, commit, push, PR, and review-loop protocol for AI agents. |
| [documentation.md](standards/documentation.md) | Required Markdown structure, folder documentation, indexes, and navigation rules. |
| [documentation-audit.md](standards/documentation-audit.md) | Checklist for verifying documentation coverage and navigation. |
| [integration-profiles.md](standards/integration-profiles.md) | Optional Azure DevOps, Jira, GitHub, and Azure Repos profile contracts. |
| [platform-profiles.md](standards/platform-profiles.md) | PowerShell and POSIX shell adoption profile rules. |
| [quality-gate.md](standards/quality-gate.md) | Required verification command standards by project and stack. |
| [self-improve-loop.md](standards/self-improve-loop.md) | Ticket-based reporting loop for reusable agent and tooling failures. |
| [stack-profiles.md](standards/stack-profiles.md) | Stack-specific standard bundles for Next.js and FastAPI projects. |
| [architecture.md](standards/architecture.md) | Clean Architecture, separation of concerns, module boundaries, and testability rules. |
| [coding.md](standards/coding.md) | General coding standards shared by all stacks. |
| [backend.md](standards/backend.md) | Backend standards for Python, FastAPI, persistence, DI, logging, and imports. |
| [backend-testing.md](standards/backend-testing.md) | Backend test strategy, PostgreSQL integration tests, fixtures, and test rules. |
| [frontend.md](standards/frontend.md) | Frontend standards for Next.js, React, state, styling, forms, and tests. |

## Templates

| Template | Use |
|---|---|
| [adopt-standards-prompt.md](templates/adopt-standards-prompt.md) | Prompt for applying these standards to another repository. |
| [viberails-adoption.md](templates/viberails-adoption.md) | Copy to target repositories as `docs/viberails-adoption.md`. |
| [viberails-adoption.json](templates/viberails-adoption.json) | Copy to target repositories as `.viberails/adoption.json`. |
| [project-README.md](templates/project-README.md) | Copy to a new project root as `README.md`. |
| [project-AGENTS.md](templates/project-AGENTS.md) | Copy to a new project root as `AGENTS.md`. |
| [project-docs-INDEX.md](templates/project-docs-INDEX.md) | Copy to a new project root as `docs/INDEX.md`. |
| [folder-README.md](templates/folder-README.md) | Copy into a significant non-root folder as `README.md`. |
| [folder-AGENTS.md](templates/folder-AGENTS.md) | Copy into a folder with local agent rules or domain knowledge. |
| [adr.md](templates/adr.md) | Copy for architecture decision records. |
| [design-note.md](templates/design-note.md) | Copy for design notes before larger changes. |
| [runbook.md](templates/runbook.md) | Copy for operational procedures. |
| [api-contract.md](templates/api-contract.md) | Copy for API contracts. |
| [quality-gate.md](templates/quality-gate.md) | Copy for project quality gate documentation. |

## Agent Assets

| Document | Purpose |
|---|---|
| [../.agents/README.md](../.agents/README.md) | Repository-scoped agent assets for VibeRails. |
| [../.agents/skills/README.md](../.agents/skills/README.md) | Optional Codex skills grouped by provider/profile. |

## Repository Operations

| Document | Purpose |
|---|---|
| [../scripts/README.md](../scripts/README.md) | Repository maintenance and validation commands. |
| [../ROADMAP.md](../ROADMAP.md) | Internal historical roadmap for the 2026 optimization effort; not an adoption template. |
| [../CHANGELOG.md](../CHANGELOG.md) | Versioned changes to the standards pack. |

## Navigation

- [Repository README](../README.md)
- [Agent instructions](../AGENTS.md)
