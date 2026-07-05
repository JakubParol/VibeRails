# Standards Adoption Standard

Use this standard when applying VibeRails to another repository. The goal is to make the
target repository self-documenting for humans and Codex while keeping VibeRails generic,
process-neutral, and useful across Windows, Linux, and macOS.

VibeRails is copied into a target repository as selected standards and templates. The target
repository owns its adopted copies. The source VibeRails checkout remains useful for audit,
upgrade, and optional Codex skill installation, but the target repository must not depend on a
runtime symlink back to VibeRails.

## Supported Scope

Current support is Codex-first:

| Area | Supported profiles |
|---|---|
| Agent runtime | Codex |
| Work tracking | Azure DevOps Boards, Jira |
| Code hosting | GitHub, Azure Repos |
| Script platform | PowerShell, POSIX shell, or both |
| Self-improvement reporting | Work-tracker ticket sink selected during adoption |

Integration profiles document what the target repository must decide and record. They do not
imply automation, credentials, live service access, or a required provider.

## Required Inputs

Before editing the target repository, identify or ask for:

- target repository root
- VibeRails source path or URL
- project type: single project or monorepo
- stack profile, or an explicit exception when no supplied profile matches
- work tracking profile: `azure-devops-work-tracking`, `jira-work-tracking`, or `none`
- code hosting profile: `github-code-hosting`, `azure-repos-code-hosting`, or `none`
- script platform profile: `powershell`, `posix-shell`, or `both`
- self-improvement ticket sink: tracker, project/board, issue type, labels/tags, dedupe query,
  and comment format
- auth model for every selected integration, recorded as non-secret setup instructions
- base branch and branch naming rules
- documented quality gate, if one already exists

Do not infer a provider from the VibeRails repository. Use target repository remotes, existing
docs, config files, and user confirmation.

## Adoption Steps

1. Follow the change protocol.
2. Read this repository's `README.md`, `AGENTS.md`, `docs/INDEX.md`, and required standards.
3. Audit the target repository structure, remotes, existing docs, scripts, CI, and issue
   references.
4. Select stack, integration, platform, and self-improvement profiles. Ask before recording an
   uncertain profile.
5. Copy required standards into the target repository `docs/standards/`.
6. Create or update root `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
7. Create `.viberails/adoption.json` from the manifest template.
8. Create `docs/viberails-adoption.md` from the human-readable adoption template.
9. In monorepos, create a documentation root for each standalone app, service, worker, mobile
   app, or package.
10. Add `README.md` to significant feature, module, adapter, and bounded-context folders.
11. Add folder-level `AGENTS.md` only where local rules differ from the parent.
12. Do not copy skills into the target repository by default. Skills are optional Codex assets
    distributed at the Codex user scope from the VibeRails checkout. Vendor a pinned copy into
    the target `.agents/skills/` only on an explicit repository decision; never keep the same
    skill name in both scopes.
13. Define quality gates from existing scripts and stack profile defaults, including the
    path-to-scope map required by `quality-gate.md`.
14. Record the adopted pack version from the VibeRails `CHANGELOG.md` in the target
    `docs/INDEX.md`.
15. Run the documentation audit checklist.
16. Report intentional exceptions and unresolved gaps.

## Context Discipline

Use indexes and folder lists to route the audit before opening detailed files. Load standards,
templates, and skills only when the target repository needs that area or the adoption checklist
cannot be completed without it. For monorepos, inspect one standalone app, service, worker,
mobile app, or package at a time, then generalize only when the structure is repeated.

## What To Copy

Copy standards that apply to the target repository:

| Target | Standards |
|---|---|
| Every repo | `agent-workflow.md`, `change-protocol.md`, `documentation.md`, `adoption.md`, `adoption-manifest.md`, `documentation-audit.md`, `integration-profiles.md`, `platform-profiles.md`, `quality-gate.md`, `self-improve-loop.md` |
| Any code repo | `architecture.md`, `coding.md`, `stack-profiles.md` |
| Next.js | `frontend.md` |
| Python FastAPI | `backend.md`, `backend-testing.md` |

Do not copy standards that do not apply unless the target repository expects that stack soon.

Skills are not copied during adoption. Install them once per machine at the Codex user scope
from the VibeRails checkout only when the user wants those optional workflows. Vendor a pinned
copy only on explicit decision.

## Output Requirements

At the end of adoption, the target repository must have:

- root documentation trio: `README.md`, `AGENTS.md`, `docs/INDEX.md`
- `.viberails/adoption.json`
- `docs/viberails-adoption.md`
- relevant standards under `docs/standards/`
- selected integration, platform, and self-improvement decisions recorded
- auth setup documented without secrets
- documentation roots for standalone monorepo projects
- local folder `README.md` files for significant folders
- documented quality gates with a path-to-scope map
- no orphan Markdown files
- a summary of gaps that need user decisions

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption manifest](adoption-manifest.md)
- [Integration profiles](integration-profiles.md)
- [Platform profiles](platform-profiles.md)
- [Self-improve loop](self-improve-loop.md)
- [Stack profiles](stack-profiles.md)
- [Documentation audit](documentation-audit.md)
- [Quality gate](quality-gate.md)
