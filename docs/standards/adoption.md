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
- self-improvement ticket sink: tracker coordinates, issue type, labels/tags, dedupe rule,
  comment template, auth checks, write approval policy, and missing-auth behavior
- auth model for every selected integration, recorded as non-secret setup instructions
- base branch and branch naming rules
- documented quality gate, if one already exists

Do not infer a provider from the VibeRails repository. Use target repository remotes, existing
docs, config files, and user confirmation.

## Adoption Steps

1. Follow the change protocol.
2. Read this repository's `README.md`, `AGENTS.md`, `docs/INDEX.md`, and required standards.
3. Run the target preflight and save the evidence for the adoption report.
4. Audit the target repository structure, remotes, existing docs, scripts, CI, and issue
   references.
5. Select stack, integration, platform, and self-improvement profiles. Ask before recording an
   uncertain profile.
6. Copy required standards into the target repository `docs/standards/`.
7. Create or update root `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
8. Create `.viberails/adoption.json` from the manifest template, including the final copied
   file list and any unresolved adoption decisions.
9. Create `docs/viberails-adoption.md` from the human-readable adoption template, mirroring
   the manifest decisions for humans.
10. In monorepos, create a documentation root for each standalone app, service, worker, mobile
   app, or package.
11. Add `README.md` to significant feature, module, adapter, and bounded-context folders.
12. Add folder-level `AGENTS.md` only where local rules differ from the parent.
13. Do not copy skills into the target repository by default. Skills are optional Codex assets
    distributed at the Codex user scope from the VibeRails checkout. Vendor a pinned copy into
    the target `.agents/skills/` only on an explicit repository decision; never keep the same
    skill name in both scopes.
14. Define quality gates from existing scripts and stack profile defaults, including the
    path-to-scope map required by `quality-gate.md`.
15. Record the adopted pack version from the VibeRails `CHANGELOG.md` in the target
    `docs/INDEX.md`.
16. Run the documentation audit checklist.
17. Report intentional exceptions and unresolved gaps.

## Target Preflight Evidence

Run these commands or platform-equivalent commands before editing. Record output summaries in
`docs/viberails-adoption.md`; do not paste secrets, tokens, or long raw CI logs.

| Evidence | POSIX shell example | PowerShell example |
|---|---|---|
| Repository root | `git rev-parse --show-toplevel` | `git rev-parse --show-toplevel` |
| Branch and dirty state | `git status --short --branch` | `git status --short --branch` |
| Remotes | `git remote -v` | `git remote -v` |
| Default branch | `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || git remote show origin` | `git symbolic-ref refs/remotes/origin/HEAD; git remote show origin` |
| Stack indicators | `find . -name package.json -o -name pyproject.toml -o -name requirements.txt -o -name Dockerfile` | `Get-ChildItem -Recurse -File -Include package.json,pyproject.toml,requirements.txt,Dockerfile` |
| Existing docs | `find . -name README.md -o -name AGENTS.md -o -path '*/docs/INDEX.md'` | `Get-ChildItem -Recurse -File -Include README.md,AGENTS.md,INDEX.md` |
| CI and gates | `find .github .azuredevops . -maxdepth 3 -name '*pipeline*' -o -name '*quality*' -o -name Makefile` | `Get-ChildItem -Recurse -File -Include '*pipeline*','*quality*',Makefile` |

Skip generated and dependency folders during preflight: `.git`, `.venv`, `venv`,
`node_modules`, `.next`, `dist`, `build`, `coverage`, `.pytest_cache`, `.mypy_cache`,
`.ruff_cache`, `.turbo`, `.nx`, `bin`, and `obj`.

## Existing Repository Merge Policy

Adoption must preserve target repository knowledge. Do not replace existing docs wholesale
unless the user explicitly approves that replacement.

| Target file | Policy |
|---|---|
| Missing root `README.md`, `AGENTS.md`, or `docs/INDEX.md` | Create from the matching template and adapt placeholders immediately. |
| Existing root `README.md` | Merge VibeRails navigation, quality gate, and standards references into the existing project overview. Preserve product purpose, setup, architecture, and operational details. |
| Existing root `AGENTS.md` | Merge VibeRails required reading, change protocol, profile decisions, and local gate rules. Preserve target-specific constraints and warnings. |
| Existing `docs/INDEX.md` | Add required VibeRails standards, adoption record, and local docs without deleting existing entries. |
| Existing local docs | Link and reconcile them; do not duplicate their contents in global standards. |
| Conflicting instructions | Record the conflict in `docs/viberails-adoption.md` and `openQuestions`; ask before choosing behavior that changes project workflow. |

Every adoption report must summarize which existing sections were preserved, which were
changed, and which unresolved conflicts remain.

### Merge Algorithm

1. Read the existing file and list its headings.
2. Preserve product overview, setup, architecture, operations, security, and deployment
   sections unless the user explicitly approves replacement.
3. Add VibeRails navigation, required reading, selected profiles, quality gate, and adoption
   record sections under stable headings.
4. If a stable heading already exists, update or append a subsection instead of creating a
   duplicate heading.
5. Keep target-specific warnings closer to the top than generic standards links.
6. Record any conflict between existing behavior and VibeRails defaults in both
   `docs/viberails-adoption.md` and `.viberails/adoption.json`.
7. Before reporting complete, fill a preservation report.

Preservation report shape:

| File | Preserved sections | Changed sections | Conflicts or follow-up |
|---|---|---|---|
| `README.md` |  |  |  |
| `AGENTS.md` |  |  |  |
| `docs/INDEX.md` |  |  |  |

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

## Minimum Adoption Audit

Before reporting adoption complete:

1. Inspect `git diff --name-only` and confirm every changed file belongs to the adoption.
2. Search for unresolved placeholders such as `<...>`, `TODO`, and `n/a` in adopted files.
3. Verify all Markdown files are reachable from `README.md`, `AGENTS.md`, or a `docs/INDEX.md`.
4. Verify relative Markdown links and anchors.
5. Parse `.viberails/adoption.json`.
6. Confirm `docs/viberails-adoption.md` mirrors the manifest's selected profiles, auth checks,
   quality gate, and self-improve sink.
7. Exclude generated and dependency folders from documentation graph checks:
   `.git`, `.venv`, `venv`, `node_modules`, `.next`, `dist`, `build`, `coverage`,
   `.pytest_cache`, `.mypy_cache`, `.ruff_cache`, `.turbo`, `.nx`, `bin`, and `obj`.
8. If an audit script was copied from `docs/templates/adoption-audit.mjs`, run it from the
   target repository root.
9. Report every audit check that was not automated and why.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption manifest](adoption-manifest.md)
- [Integration profiles](integration-profiles.md)
- [Platform profiles](platform-profiles.md)
- [Self-improve loop](self-improve-loop.md)
- [Stack profiles](stack-profiles.md)
- [Documentation audit](documentation-audit.md)
- [Quality gate](quality-gate.md)
