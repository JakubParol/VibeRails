# Documentation Standard

Documentation gives humans and agents a fast path from overview to the exact local rule.

## Documentation Bundles

A bundle sets the coverage a project maintains, not how much an agent reads per task.

| Area | essential | standard |
|---|---|---|
| Roots | README, AGENTS and docs/INDEX, kept concise. | The same, plus cross-project maps when needed. |
| Setup and verification | Real commands, prerequisites and limits in the root or nearest owner. | The same, plus runbooks for independent workflows. |
| Architecture and contracts | Non-obvious boundaries and decisions; link canonical rules. | Explicit module ownership and contract links. |
| Significant folders | Parent coverage when it is enough; a local README when it is not. | A short local README per significant area. |
| Local AGENTS | Only where rules differ from the parent. | The same. |
| ADRs, runbooks, reports | Only for a real decision, operation or required evidence. | The same. |

Select the bundle explicitly (`configuration.documentation` or project instructions). An
unselected project keeps its existing policy; never infer the bundle from repository size.
Changing the label neither deletes documents nor proves a migration.

## Documentation Roots

A documentation root is a folder that can be run, deployed, tested or copied as one project:
the repository root and every standalone app, service, worker, mobile app or package in a
monorepo. Each root has:

```text
project-root/
|-- README.md      # purpose, setup, structure, architecture
|-- AGENTS.md      # constraints, quality gates, local rules
`-- docs/
    `-- INDEX.md   # every document with one sentence; links up and down
```

The root `docs/` owns cross-project documents and shared standards. A child root's `docs/` owns
its own documents and links to shared standards instead of copying them. Feature and leaf
folders get a README (and AGENTS only for local differences), never a `docs/` folder.

## Significant Folders

A folder is significant when it holds a bounded context, feature module, adapter group or shared
library; domain rules not obvious from filenames; setup, generation, migration or deployment
concerns; or rules that differ from its parent. Document it as the selected bundle requires.

## Navigation Rules

- Every Markdown file is reachable from an index, a parent README or a parent AGENTS file.
- Indexes link down to child documents; child indexes link to the parent index; documents link
  back up.
- Use relative links. No orphaned files.

## Writing

- Lead with what matters. Use short sections, tables, checklists and concrete examples.
- State each rule once, in its owner, and link to it elsewhere ([KIS](kis.md)).
- Keep project decisions in project documents, not shared standards.
- Date or version time-sensitive documents.
- Add documents for a new root, a non-obvious decision, a procedure or a recurring agent mistake.
  Update existing documents first; never write ones that only repeat code.

## Navigation

- [Documentation index](../INDEX.md)
- [Agent workflow](agent-workflow.md)
