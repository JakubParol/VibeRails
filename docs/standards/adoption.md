# Standards Adoption Standard

Use this standard when applying this standards pack to another repository. The goal is to make
the target repository self-documenting for humans and AI agents.

## Required Inputs

Before editing the target repository, identify:

- target repository root
- project type: single project or monorepo
- stack profile: Next.js frontend only, Next.js full stack, or Next.js + Python FastAPI
- base branch and branch naming rules
- documented quality gate, if one already exists

If the target repository is public on GitHub, use the repository URL as the source of truth for
repository identity and remote setup.

## Adoption Steps

1. Follow the change protocol.
2. Read this repository's `README.md`, `AGENTS.md`, `docs/INDEX.md`, and required standards.
3. Audit the target repository structure.
4. Select the stack profile that matches the target repository.
5. Copy required standards into the target repository `docs/standards/`.
6. Create or update root `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
7. In monorepos, create a documentation root for each standalone app, service, worker, mobile
   app, or package.
8. Add `README.md` to significant feature, module, adapter, and bounded-context folders.
9. Add folder-level `AGENTS.md` only where local rules differ from the parent.
10. Do not copy skills into the target repository by default. Skills are distributed at the
    Codex user scope (`$HOME/.agents/skills`) from the standards repository checkout via
    `scripts/install-skills.ps1`. Vendor a copy into the target `.agents/skills/` only when
    that repository must pin a skill version; never keep the same skill name in both scopes.
11. Define quality gates from existing scripts and stack profile defaults, including the
    path-to-scope map required by `quality-gate.md`.
12. Record the adopted pack version from the standards repository `CHANGELOG.md` in the target
    `docs/INDEX.md`.
13. Run the documentation audit checklist.
14. Report intentional exceptions and unresolved gaps.

## Context Discipline

Use indexes and folder lists to route the audit before opening detailed files. Load standards,
templates, and skills only when the target repository needs that area or the adoption checklist
cannot be completed without it. For monorepos, inspect one standalone app, service, worker,
mobile app, or package at a time, then generalize only when the structure is repeated.

## What To Copy

Copy standards that apply to the target repository:

| Target | Standards |
|---|---|
| Every repo | `agent-workflow.md`, `change-protocol.md`, `documentation.md`, `adoption.md`, `documentation-audit.md`, `quality-gate.md` |
| Any code repo | `architecture.md`, `coding.md`, `stack-profiles.md` |
| Next.js | `frontend.md` |
| Python FastAPI | `backend.md`, `backend-testing.md` |

Do not copy standards that do not apply unless the target repository expects that stack soon.

Skills are not copied during adoption. Install them once per machine at the Codex user scope
with `scripts/install-skills.ps1` from the standards repository; they are then available in
every repository. Vendor a pinned copy only on explicit decision.

## Output Requirements

At the end of adoption, the target repository must have:

- root documentation trio: `README.md`, `AGENTS.md`, `docs/INDEX.md`
- relevant standards under `docs/standards/`
- documentation roots for standalone monorepo projects
- local folder `README.md` files for significant folders
- documented quality gates with a path-to-scope map
- no orphan Markdown files
- a summary of gaps that need user decisions

## Navigation

- [Documentation index](../INDEX.md)
- [Stack profiles](stack-profiles.md)
- [Documentation audit](documentation-audit.md)
- [Quality gate](quality-gate.md)
