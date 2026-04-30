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
10. Define quality gates from existing scripts and stack profile defaults.
11. Run the documentation audit checklist.
12. Report intentional exceptions and unresolved gaps.

## What To Copy

Copy standards that apply to the target repository:

| Target | Standards |
|---|---|
| Every repo | `agent-workflow.md`, `change-protocol.md`, `documentation.md`, `adoption.md`, `documentation-audit.md`, `quality-gate.md` |
| Any code repo | `architecture.md`, `coding.md`, `stack-profiles.md` |
| Next.js | `frontend.md` |
| Python FastAPI | `backend.md`, `backend-testing.md` |

Do not copy standards that do not apply unless the target repository expects that stack soon.

## Output Requirements

At the end of adoption, the target repository must have:

- root documentation trio: `README.md`, `AGENTS.md`, `docs/INDEX.md`
- relevant standards under `docs/standards/`
- documentation roots for standalone monorepo projects
- local folder `README.md` files for significant folders
- documented quality gates
- no orphan Markdown files
- a summary of gaps that need user decisions

## Navigation

- [Documentation index](../INDEX.md)
- [Stack profiles](stack-profiles.md)
- [Documentation audit](documentation-audit.md)
- [Quality gate](quality-gate.md)
