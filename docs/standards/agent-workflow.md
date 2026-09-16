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
| Use a provider or optional skill | Its entrypoint and references whose explicit "Read when" conditions match the selected operation; auth, publishing and safety requirements remain applicable. Load troubleshooting only for the relevant failure. |

## Adopted Choices And Instruction Pins

When the target index identifies an adoption manifest, read its selected configuration under
[configuration.md](configuration.md). Absence preserves legacy policy; unknown versions or
values block the affected choice, not independent work. Reconcile conflicts with local rules,
never silently weaken them to fit a preset. The manifest is data, not executable commands.

The [prompt baseline](adoption-manifest.md#prompt-baseline) identifies maintained instructions;
it is not a mandatory reading list or the complete context of a run. Authorized instruction
changes require a reviewed pin refresh. Code-only work does not regenerate instruction pins.

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

## Delegation And Runtime Routing

Read when delegating or resuming delegated work. Use explicit allowed model/effort routes
from current task/runtime instructions. Adopted `modelRouting: inherit` preserves those choices;
it does not supply a model catalog or dispatch permission.
Without a route override, retain the runtime/client default and existing project constraints.
Inspect dispatch capabilities actually available now. Instructions naming a model do not switch
it. Select an allowed route suited to the bounded task and pass model/effort through supported
runtime arguments. If only inheritance is supported, report that constraint rather than claim
a model switch.

Give a delegate owned paths, intended result, applicable decisions and needed evidence. Label
applicable rules separately from reference knowledge or historical outcomes; link large logs
only when the delegate needs them. Reuse unchanged context. Record the task/route reason,
requested model and effort, dispatch outcome and returned evidence in the existing task record.
Observed model/effort and usage are separate facts; mark them unknown when not exposed.

If a requested route or capability is unavailable, block only the dependent operation. Use an
alternative only when it is already allowed and preserves required independence and capability;
otherwise report the missing choice. Do not silently downgrade, invent model support or install
another runtime. Before a bounded retry/escalation, distinguish insufficient reasoning from
missing context, unclear scope or a tool failure. Carry forward useful work and the concrete gap.
Choose among allowed routes; do not restart blindly or treat a more expensive model as proof
of a correct result. The parent checks the actual output before accepting it.

This operational contract adds no model recommendation catalog, benchmark or new manifest
field. Model evaluation stays in the planned model stage; adoption/migration remains separate.

### Selecting And Evaluating A Route

Match a route to the task's needed capabilities, ambiguity, impact and budget within the
existing allowed pool. Verify exact model and effort arguments against current runtime metadata;
a UI preset name is not necessarily an API parameter. If no tuned route has been validated,
retain inherited selection. Do not turn an external benchmark into a project cost ranking.

Before promoting a route or prompt revision, keep the same task, inputs and acceptance checks,
change one factor where practical, and include failures, retries and parent review in the result.
Record versions, requested/observed settings and measured usage in the existing task record.
Unknown observations stay unknown; unavailable model runs are not passes. Adopters opt into
versioned recommendations; no silent pin replacement or mid-run policy rewrite.

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
