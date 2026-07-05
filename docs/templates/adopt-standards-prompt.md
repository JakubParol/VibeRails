# Adopt Standards Prompt

Use this prompt after opening the target repository in Codex. The active working directory is
the target repository that should receive these standards.

```text
Use the standards repository at https://dev.azure.com/Elitmindvs/ELITMIND.CenterOfExcellence/_git/VibeRails.

The current working repository is the target repository.

Adopt the standards from VibeRails into this repository.

Follow the standards repository README, AGENTS.md, docs/INDEX.md, adoption standard, change
protocol, documentation standard, stack profiles, documentation audit, and quality gate
standard.
Use indexes and headings to route context. Do not load every standard, template, or skill file
unless the audit result shows that area is in scope.
First audit the target repository structure and identify whether it is:

- Next.js frontend only
- Next.js full stack
- Next.js + Python FastAPI
- another setup that needs an explicit exception

Then:

1. create or update README.md, AGENTS.md, and docs/INDEX.md at the repository root
2. copy only relevant standards into docs/standards/
3. create documentation roots for standalone monorepo apps, services, workers, mobile apps,
   and packages
4. add README.md files to significant feature, module, adapter, and bounded-context folders
5. add folder AGENTS.md files only when local rules differ from the parent
6. do not copy `.agents/skills/` entries; skills are installed at the Codex user scope from
   the standards repository (vendor a pinned copy only on explicit decision)
7. document quality gates from existing scripts or stack defaults, including the
   path-to-scope map from the quality gate standard
8. run the documentation audit
9. report all intentional exceptions and unresolved questions

Do not push or open a PR until you ask me and I approve it.
```

## Navigation

- [Documentation index](../INDEX.md)
