# AGENTS.md - Standards Repository

This repository contains reusable standards and templates for AI-assisted software projects.
When editing these files, preserve the repository's purpose: a practical template that can be
copied into many projects while keeping projects built in a consistent way.

## Required Reading

Before changing this repository, read:

1. [README.md](README.md)
2. [docs/INDEX.md](docs/INDEX.md)
3. [docs/standards/agent-workflow.md](docs/standards/agent-workflow.md)
4. [docs/standards/change-protocol.md](docs/standards/change-protocol.md)
5. [docs/standards/documentation.md](docs/standards/documentation.md)

Read stack-specific standards only when editing that area.

## Editing Rules

- Keep documents Markdown-first and easy to copy into other repositories.
- Write standards in English unless a project-specific file explicitly chooses another language.
- Keep examples concrete, but label project-specific assumptions as defaults.
- Do not create duplicate sources of truth. Prefer linking to the canonical standard.
- Keep navigation links current whenever files move.
- Use ASCII in documentation unless the file already requires another character set.
- Prefer short sections, tables, and checklists over long prose.

## Structure Rules

- Root files explain the standards repository itself.
- `docs/INDEX.md` is the table of contents.
- `docs/standards/` contains reusable rules.
- `docs/templates/` contains files meant to be copied into projects.
- Do not place project-specific implementation details in the root.

## Change Workflow

1. Identify which standard or template owns the change.
2. Update the canonical document first.
3. Update indexes and navigation links.
4. Check for broken relative links.
5. Report any intentional exception or unresolved ambiguity.

## Navigation

- [README.md](README.md)
- [docs/INDEX.md](docs/INDEX.md)
