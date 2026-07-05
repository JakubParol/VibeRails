# Documentation Index

This index is the entry point for documentation in this project root.

When copying this template, replace placeholder paths with relative Markdown links once the
target paths are known.

## Project Docs

| Document | Purpose |
|---|---|
| [Project README](../README.md) | Project overview, setup, structure, and quality gate. |
| [Project agents](../AGENTS.md) | AI agent rules and required reading for this project. |

## Stack Profile

Adopted VibeRails pack version: `<version from CHANGELOG.md>`.

Selected profile: `<Next.js frontend only | Next.js full stack | Next.js + Python FastAPI | Python CLI | Python worker | shared package | infrastructure | Dapr or distributed app | mixed monorepo | documented exception>`

## Adoption Record

| Document | Purpose |
|---|---|
| [VibeRails adoption](<relative-path-to-repo>/docs/viberails-adoption.md) | Selected profiles, copied standards, quality gates, auth setup, and unresolved decisions. |

## Local Documents

Add project-specific design notes, ADRs, runbooks, testing guides, and operational documents
as they are created.

| Document | Purpose |
|---|---|
| <document.md> | <short purpose> |

## Shared Standards

Link to the repository-level standards instead of duplicating them inside this project.

| Standard | Purpose |
|---|---|
| [Agent workflow](<relative-path-to-repo>/docs/standards/agent-workflow.md) | How agents load context, edit, verify, and report work. |
| [Adoption](<relative-path-to-repo>/docs/standards/adoption.md) | How agents apply this standards pack to another repository. |
| [Adoption manifest](<relative-path-to-repo>/docs/standards/adoption-manifest.md) | Required `.viberails/adoption.json` fields for adopted repositories. |
| [Change protocol](<relative-path-to-repo>/docs/standards/change-protocol.md) | Required branch, commit, push, PR, and review-loop protocol for AI agents. |
| [Documentation](<relative-path-to-repo>/docs/standards/documentation.md) | Documentation structure, indexes, and navigation rules. |
| [Documentation audit](<relative-path-to-repo>/docs/standards/documentation-audit.md) | Checklist for verifying documentation coverage and navigation. |
| [Integration profiles](<relative-path-to-repo>/docs/standards/integration-profiles.md) | Azure DevOps, Jira, GitHub, and Azure Repos profile contracts. |
| [Platform profiles](<relative-path-to-repo>/docs/standards/platform-profiles.md) | PowerShell and POSIX shell profile rules. |
| [Quality gate](<relative-path-to-repo>/docs/standards/quality-gate.md) | Required verification command standards by project and stack. |
| [Self-improve loop](<relative-path-to-repo>/docs/standards/self-improve-loop.md) | Ticket-based reporting loop for reusable agent and tooling failures. |
| [Stack profiles](<relative-path-to-repo>/docs/standards/stack-profiles.md) | Stack-specific standard bundles for Next.js and FastAPI projects. |
| [Architecture](<relative-path-to-repo>/docs/standards/architecture.md) | Architecture and dependency rules. |
| [Coding](<relative-path-to-repo>/docs/standards/coding.md) | General coding rules. |

Replace `<relative-path-to-repo>` with the path from this `docs/INDEX.md` file to the
repository root. For `apps/web/docs/INDEX.md`, this is `../../..`.

## Navigation

- [Project README](../README.md)
- [Project agents](../AGENTS.md)
- [Repository documentation index](<relative-path-to-repo>/docs/INDEX.md)
