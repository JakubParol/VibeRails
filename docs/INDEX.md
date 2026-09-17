# Documentation Index

This index is the entry point for all standards and templates in this repository.

## Refactor Preparation

| Document | Purpose |
|---|---|
| [Active refactor plan](refactor-plan.md) | Simplicity principle, complete scope, stage gates, delegation, routing and acceptance rules. |
| [Current refactor status](refactor/STATUS.md) | Sole progress register and exact resume action; reconcile with Git/PR state. |
| [Refactor record structure](refactor/README.md) | Lightweight card fields, lifecycle meanings, and record navigation. |
| [Stage 00 preparation](refactor/steps/00-plan-preparation.md) | Scope agreement, independent reviews, verification and preparation PR evidence. |
| [Stage 01 audit](refactor/steps/01-audit.md) | Approved audit scope, evidence, delegation and delivery record. |
| [Stage 01 findings](refactor/audit-01.md) | Prioritized overhead findings, source evidence, preserved guards and later pilot scenarios. |
| [Stage 01 baseline](refactor/baseline-01.md) | Reproducible selected-file measurements and explicit limits of cost inference. |
| [Stage 02 configuration](refactor/steps/02-configuration.md) | Approved small-core/configuration scope, decisions and delivery evidence. |
| [Stage 03 architecture](refactor/steps/03-architecture.md) | Approved architecture variants, examples, verification and delivery evidence. |
| [Stage 04 verification](refactor/steps/04-verification.md) | Approved local/CI responsibility, implementation, tests and delivery evidence. |
| [Stage 05 context](refactor/steps/05-context.md) | Approved context routing, documentation bundles and concrete task evidence. |
| [Stage 06 workflows](refactor/steps/06-workflows.md) | Approved neutral cleanup, workflow/integration behavior and bounded evidence. |
| [Stage 07 adoption](refactor/steps/07-adoption.md) | Agreed general adoption/update baseline, solo execution, tests and handoff. |
| [Stage 09 pilot](refactor/steps/09-pilot.md) | Authorized controlled comparison, closing evidence and mandatory stop. |
| [Stage 09 results](refactor/pilot-09.md) | Pinned small/multi-root scenarios, failures, reproducibility and unproved claims. |
| [Stage 08 prompts](refactor/steps/08-prompts.md) | Authorized shared-instruction refinement, evidence and model limits. |
| [Stage 08 research](refactor/research-08.md) | Disposition of all 15 sources and actual runtime capability limits. |
| [Stage 08 comparison](refactor/prompt-evaluation-08.md) | Component fingerprints, semantic scenarios and explicit measurement limits. |
| [Stage 05 context comparison](refactor/context-proof-05.md) | Before/after D/B/R context selection, correctness checks and honest measurement limits. |
| [00-02 retrospective review](refactor/review-00-02.md) | User-requested cross-stage verification before architecture work. |
| [00-04 retrospective review](refactor/review-00-04.md) | User-requested correctness/completeness review before documentation/context work. |
| [Core and configuration contract](standards/configuration.md) | Explicit version-1 choices, two presets, compatibility and authorized adoption. |
| [Configuration examples](refactor/configuration-examples.md) | Small Python and larger Next.js/FastAPI design excerpts with explicit effective choices. |
| [Refactor startup prompt](refactor/start.md) | Copyable prompt for resuming orchestration without assuming approval. |
| [Scoped inspiration review](refactor/inspiration-review.md) | Article/code findings, limitations and small candidate refinements. |
| [Astra refactor reading list](astra-refactor-reading-list.md) | Original 15-source register, stage 08 assessment and explicitly unavailable material. |
| [Web UI standards delivery](refactor/web-ui-standards.md) | Scope, primary-source decisions and evidence limits for the web UI contract. |
| [Guided onboarding delivery](refactor/guided-onboarding.md) | Scope, scenario review and verification limits for the README-led setup path. |
| [08-09 verification follow-up](refactor/verification-08-09.md) | Reproduced instruction-boundary fixes, platform evidence and original acceptance gaps. |

Stage 07 provides the frozen model-neutral baseline. The stage 08 assessment records all
15 source attempts and unavailable material; original descriptions remain research leads.
The register and evidence are internal refactor records, not adoption templates.

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
| [web-ui.md](standards/web-ui.md) | Visual direction, layout, accessible UX, data/AI states and browser acceptance. |
| [frontend.md](standards/frontend.md) | Next.js/React, shadcn component boundaries, local styles, data and tests. |

## Templates

| Template | Use |
|---|---|
| [adopt-standards-prompt.md](templates/adopt-standards-prompt.md) | Prompt for applying these standards to another repository. |
| [viberails-adoption.md](templates/viberails-adoption.md) | Copy to target repositories as `docs/viberails-adoption.md`. |
| [viberails-adoption.json](templates/viberails-adoption.json) | Copy to target repositories as `.viberails/adoption.json`. |
| [adoption-audit.mjs](templates/adoption-audit.mjs) | Optional read-only structural audit; run from source or copy with its helper directory and the helpers below. |
| [Adoption audit internals](templates/adoption-audit/README.md) | Preserved structural checks split by responsibility. |
| [adoption-state.mjs](templates/adoption-state.mjs) | Exact configuration/version checks and explicit preset initialization; no command execution. |
| [adoption-pins.mjs](templates/adoption-pins.mjs) | Safe instruction identities, immutable refs and read-only fingerprint snapshots. |
| [project-README.md](templates/project-README.md) | Copy to a new project root as `README.md`. |
| [project-AGENTS.md](templates/project-AGENTS.md) | Copy to a new project root as `AGENTS.md`. |
| [project-docs-INDEX.md](templates/project-docs-INDEX.md) | Copy to a new project root as `docs/INDEX.md`. |
| [folder-README.md](templates/folder-README.md) | Copy into a significant non-root folder as `README.md`. |
| [folder-AGENTS.md](templates/folder-AGENTS.md) | Copy into a folder with local agent rules or domain knowledge. |
| [architecture-variants.md](templates/architecture-variants.md) | Paired minimal/layered behavior illustrations, stack mapping and focused checks. |
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
| [../.github/README.md](../.github/README.md) | Repository PR Verification coverage, evidence and limitations. |
| [../ROADMAP.md](../ROADMAP.md) | Internal historical roadmap for the 2026 optimization effort; not an adoption template. |
| [../CHANGELOG.md](../CHANGELOG.md) | Versioned changes to the standards pack. |

## Navigation

- [Repository README](../README.md)
- [Agent instructions](../AGENTS.md)
