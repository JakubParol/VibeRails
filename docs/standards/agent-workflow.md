# Agent Workflow Standard

This is the canonical context-selection policy. Project instructions, templates and skills
point here and add only their local or operation-specific requirements. A link is a route,
not an instruction to read every linked document.

## Context Loading Order

1. Identify the target paths and owning documentation root. Read all applicable `AGENTS.md`
   instructions from repository/parent roots down to those paths; a nearer file does not make
   parent constraints disappear. Preserve explicit project-required reading.
2. Use the owning `docs/INDEX.md` to locate standards and local context. In a monorepo, use the
   child root's index and parent links. Read README sections only when their purpose, setup,
   boundary or command information is needed for the current decision.
3. Select rules from the task table below. Inspect headings/search results first, then read
   the complete relevant sections and their conditions; do not infer a rule from its title.
   Reuse unchanged instructions already in context instead of reopening them through backlinks.
4. Inspect local README/AGENTS coverage along the target path and any affected boundary.
   Expand when public contracts, API consumers, shared types, infrastructure or command/gate
   behavior cross an area boundary. If required context is missing, report the affected
   decision and continue only independent work.

Use the target's owning standards path, normally `docs/standards/`. A standalone copied project
may own local copies; a monorepo child may link to its parent. Resolve that path from the target
index, not from an optional skill's installation directory.

| Task or decision | Relevant context |
|---|---|
| Change a file | Applicable [change protocol](change-protocol.md) sections for scope, protected work, authorization, editing and delivery. Read branch/commit/PR procedures when those operations are needed. Every edit also uses the verification row below. |
| Correct existing documentation | The target instruction/source of truth, local constraints and [documentation](documentation.md) quality/navigation rules. Load the documentation audit only for adoption or structural/navigation changes that need it. |
| Change code or tests | [Coding](coding.md), [architecture](architecture.md), local boundaries and the affected stack: [backend](backend.md), [backend testing](backend-testing.md) or [frontend](frontend.md). Read behavior, contract and test rules relevant to the change, not every stack. |
| Select/run verification | Actual target commands plus the [quality gate](quality-gate.md) responsibility split and applicable scope/coverage. Missing CI never implies PASS or permission for a full local gate. |
| Review | The applicable review skill/mode, changed paths and the same task rules that govern those paths. Load only relevant specialist/checklist sections; review does not turn every linked workflow into an active one. |
| Adopt/restructure documentation | [Adoption](adoption.md), selected [documentation bundle](documentation.md#documentation-bundles), [audit](documentation-audit.md) and actual target profiles. An ordinary edit does not trigger adoption. |
| Use a provider or optional skill | Its entrypoint and the reference for the selected operation; auth, publishing and safety requirements remain applicable. Load troubleshooting only for the relevant failure. |

## Context Budget Rule

Load enough to make the next decision correctly. `rg`, file lists and headings help locate it;
they do not replace understanding a relevant rule. A small task may still need an important
local warning, API contract or verification limitation. Neither documentation bundle permits
skipping applicable instructions.

Do not load inactive stacks, unused providers, old phase reports or all skill references by
default. Broad audits may need wider reading; state that scope. Revisit context when its inputs
change or when it no longer supports a decision. Do not re-read an unchanged file merely because
another document links back to it.

For delegated work, give the bounded task, owned paths, relevant decisions and evidence already
known. The delegate still follows applicable local instructions and inspects the source needed
to judge its assignment. Do not attach every previous agent report or the full task history.

## Folder Context Rule

Documentation structure, bundles and local-file requirements belong to
[documentation.md](documentation.md). Indexes route to existing local knowledge; they are not
checklists of documents every agent must load. Project/folder AGENTS files contain local deltas,
not another copy of this router or the shared architecture/verification rules.

## Editing

[Change protocol](change-protocol.md) owns Git operations, task authorization and delivery.
An available document, tool or configured profile does not authorize an action. For substantial
work preserve the agreed plan and checkpoint; a simple correction does not need a new process.

## Verification

[Quality gate](quality-gate.md) owns local/CI responsibility. Select meaningful checks for the
actual change and retain the verified revision and limits. Do not run unrelated checks merely
because their instructions were read.

## Reporting

[Change protocol: Final Report](change-protocol.md#final-report) owns the user-facing result.
Keep durable decisions/evidence in the task's existing record when needed for review or resume;
link to that record instead of repeating it in every message. Never turn missing evidence into
completion or omit a blocker to make a report shorter.

## Navigation

- [Documentation index](../INDEX.md)
- [Documentation standard](documentation.md)
- [Change protocol](change-protocol.md)
- [Quality gate](quality-gate.md)
