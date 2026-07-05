# Adopt Standards Prompt

Use this prompt after opening the target repository in Codex. The active working directory is
the target repository that should receive these standards.

```text
Use the standards repository at <standards-repository-path-or-url>.

The current working repository is the target repository.

Adopt the standards from VibeRails into this repository.

Follow the standards repository README, AGENTS.md, docs/INDEX.md, adoption standard, adoption
manifest standard, integration profiles, platform profiles, self-improve loop standard, change
protocol, documentation standard, stack profiles, documentation audit, and quality gate
standard.
Use indexes and headings to route context. Do not load every standard, template, or skill file
unless the audit result shows that area is in scope.
First run the target preflight from the adoption standard, summarize the evidence, and identify:

- VibeRails source path, remote, source ref, and pack version
- target repository root, remote, default/base branch, branch naming, and PR target branch
- stack profile: Next.js frontend only, Next.js full stack, Next.js + Python FastAPI, or an
  explicit exception
- work tracking profile: Azure DevOps Boards, Jira, or none
- code hosting profile: GitHub, Azure Repos, or none
- script platform profile: PowerShell, POSIX shell, or both
- self-improve ticket sink for reusable agent/tooling failures
- auth checks for selected integrations, documented without secrets
- existing quality gate commands and path-to-scope map

Then:

1. copy only relevant standards into docs/standards/
2. create or update README.md, AGENTS.md, and docs/INDEX.md at the repository root
3. create `.viberails/adoption.json` from the VibeRails manifest template, including copied
   files and unresolved decisions
4. create `docs/viberails-adoption.md` from the VibeRails adoption record template
5. create documentation roots for standalone monorepo apps, services, workers, mobile apps,
   and packages
6. add README.md files to significant feature, module, adapter, and bounded-context folders
7. add folder AGENTS.md files only when local rules differ from the parent
8. do not copy `.agents/skills/` entries; skills are installed at the Codex user scope from
   the standards repository (vendor a pinned copy only on explicit decision)
9. document quality gates from existing scripts or stack defaults, including the
   path-to-scope map from the quality gate standard
10. document the self-improve loop: provider sink coordinates, exact fingerprint dedupe,
    manual fallback, create/comment policy, labels/tags, issue type, comment template, auth
    checks, missing-auth behavior, and write approval policy
11. if useful for this repository, copy `docs/templates/adoption-audit.mjs` into a target-local
    tooling folder and run it from the target repository root
12. run the minimum adoption audit and documentation audit
13. report all intentional exceptions and unresolved questions

When updating existing docs, preserve target-specific project purpose, setup, architecture,
quality gate, and local warnings. Merge VibeRails rules into those files instead of replacing
them wholesale. Record preserved sections, changed sections, conflicts, and unresolved
decisions in `docs/viberails-adoption.md` and `.viberails/adoption.json`.

Do not push or open a PR until you ask me and I approve it.
```

## Navigation

- [Documentation index](../INDEX.md)
