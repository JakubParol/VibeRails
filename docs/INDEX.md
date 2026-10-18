# Documentation Index

Entry point for the VibeRails standards, templates and internal records.

## Runtime Standards

Copied into adopted repositories when they apply.

| Document | Purpose |
|---|---|
| [kis.md](standards/kis.md) | Keep It Simple: the rule, KIS review and the optional decision model. |
| [agent-workflow.md](standards/agent-workflow.md) | Context routing, adopted choices and delegation. |
| [change-protocol.md](standards/change-protocol.md) | Task lifecycle, authorization, Git, review loop and final report. |
| [documentation.md](standards/documentation.md) | Documentation bundles, roots and navigation. |
| [quality-gate.md](standards/quality-gate.md) | Local versus CI checks, test cadence, commands and evidence. |
| [integration-profiles.md](standards/integration-profiles.md) | Tracker and code-host profiles, MCP-only providers, recovery and auth. |
| [self-improve-loop.md](standards/self-improve-loop.md) | Reporting reusable agent and tooling failures. |
| [architecture.md](standards/architecture.md) | Minimal and layered Clean Architecture boundaries. |
| [coding.md](standards/coding.md) | General coding rules. |
| [stack-profiles.md](standards/stack-profiles.md) | Stack bundles and full CI defaults. |
| [web-ui.md](standards/web-ui.md) | Visual direction, accessible UX and browser acceptance. |
| [frontend.md](standards/frontend.md) | Next.js/React, shadcn boundaries, styles, data and tests. |
| [backend.md](standards/backend.md) | Python/FastAPI layers, DI, persistence, errors and imports. |
| [backend-testing.md](standards/backend-testing.md) | Backend test types, real database tests and test value rules. |

## Adoption Procedure (Source Only)

Read from a pinned VibeRails commit during adoption or refresh; never copied.

| Document | Purpose |
|---|---|
| [adoption.md](standards/adoption.md) | Guided setup, MCP setup, copy list, merge, refresh and audit. |
| [onboarding.md](standards/onboarding.md) | Conversation rules, decision evidence and decision storage. |
| [onboarding-questions.md](standards/onboarding-questions.md) | The English question catalog. |
| [adoption-manifest.md](standards/adoption-manifest.md) | `.viberails/adoption.json` fields and instruction pins. |
| [configuration.md](standards/configuration.md) | Configuration contract, presets and versions. |

## Templates

| Template | Use |
|---|---|
| [adopt-standards-prompt.md](templates/adopt-standards-prompt.md) | Agent entrypoint for adoption or refresh. |
| [project-README.md](templates/project-README.md) | New project root `README.md`. |
| [project-AGENTS.md](templates/project-AGENTS.md) | New project root `AGENTS.md`, including VibeRails decisions and KIS. |
| [project-docs-INDEX.md](templates/project-docs-INDEX.md) | New project root `docs/INDEX.md`. |
| [folder-README.md](templates/folder-README.md) | Significant non-root folder `README.md`. |
| [folder-AGENTS.md](templates/folder-AGENTS.md) | Folder with local agent rules. |
| [viberails-adoption.md](templates/viberails-adoption.md) | Target `docs/viberails-adoption.md`. |
| [viberails-adoption.json](templates/viberails-adoption.json) | Target `.viberails/adoption.json` (placeholders, not defaults). |
| [adoption-audit.mjs](templates/adoption-audit.mjs) | Optional read-only structural audit; see its [internals](templates/adoption-audit/README.md). |
| [adoption-state.mjs](templates/adoption-state.mjs) | Configuration and version checks, explicit preset initialization. |
| [adoption-pins.mjs](templates/adoption-pins.mjs) | Read-only instruction fingerprint snapshots. |
| [architecture-variants.md](templates/architecture-variants.md) | Paired minimal/layered example with a behavior check. |
| [adr.md](templates/adr.md), [design-note.md](templates/design-note.md), [runbook.md](templates/runbook.md), [api-contract.md](templates/api-contract.md), [quality-gate.md](templates/quality-gate.md) | Focused project documents. |

## Agent Assets And Operations

| Document | Purpose |
|---|---|
| [../.agents/README.md](../.agents/README.md) | Repository agent assets. |
| [../.agents/skills/README.md](../.agents/skills/README.md) | Optional Codex skills. |
| [../scripts/README.md](../scripts/README.md) | Validation, installers and test commands. |
| [../.github/README.md](../.github/README.md) | PR Verification coverage and limits. |
| [../CHANGELOG.md](../CHANGELOG.md) | Versioned changes to the pack. |
| [../ROADMAP.md](../ROADMAP.md) | Historical July 2026 optimization roadmap. |

## Internal Refactor Records

Not adoption templates. Start from the [plan](refactor-plan.md), the live [STATUS](refactor/STATUS.md)
and the [record index](refactor/README.md), which lists every stage card and delivery record.
Current delivery: [core slimming, onboarding and KIS](refactor/core-slim-kis.md). Stage 08
research sources: [Astra reading list](astra-refactor-reading-list.md).

## Navigation

- [Repository README](../README.md)
- [Agent instructions](../AGENTS.md)
