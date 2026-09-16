# Stage 01 Audit - Cost And Complexity

Date: 2026-09-16. Source snapshot: `d22a9772c13da3699819f8b7648b1dc0fdd67b23`.
Scope: static inspection of VibeRails, not a refactor implementation or a model benchmark.
The inspected standards, templates, skills and scripts are unchanged by this audit.

## Result

The largest opportunities are decisions about how much work a task triggers: local gates,
architecture obligations, reading routes and review staffing. Shortening prose alone will not
remove generated layers, repeated tests or extra agent runs. Keep the existing useful guards
and make the cost-driving defaults explicit choices.

The current refactor already overrides several broad defaults. The findings below concern the
reusable pack that other projects receive; they are not instructions to undo our agreed process.
Priority means implementation attention, not a measured savings ranking or defect severity.

## Prioritized Findings

| ID / priority | Observed current behavior and evidence at the source snapshot | Proposed disposition / owner | Expected benefit and effort |
|---|---|---|---|
| A1 / high | The scoped local gate runs every applicable area: types when supported, behavior/adapter tests when relevant, and a build for a deployable scope. Cross-cutting changes or missing scoped commands can trigger a full local run. [Gate rules, lines 10-17 and 60-72](../standards/quality-gate.md#gate-responsibility-split); the [project template, lines 78-99](../templates/project-AGENTS.md#quality-gate) repeats it. | **Configure + consolidate**, step 4, then template alignment in 5/8. Separate small local checks from full PR verification; define the no-CI path explicitly. | Reduces avoidable commands and failure/retry output. Medium effort; preserve required CI and meaningful behavioral evidence. No runtime savings measured. |
| A2 / high | FastAPI services use constructor injection and application ports; persistence introduces repository implementations, and import-linter is mandatory. [Backend, lines 54-73, 112-118, 178-217](../standards/backend.md#layer-definition-of-done). For integration tests where persistence correctness matters, the standard mandates PostgreSQL/Testcontainers and rejects SQLite regardless of the chosen production database. [Testing, lines 17-35](../standards/backend-testing.md#database-integration-tests). | **Configure**, steps 2-3. Specify a minimal and extended architecture/testing profile; preserve presentation/persistence separation and real-adapter evidence where behavior depends on it. | Reduces unnecessary scaffolding and infrastructure assumptions for small projects. Medium design effort; the exact minimum remains a step 3 decision. |
| A3 / high | Several entry points prescribe overlapping reading orders: [workflow, lines 6-27](../standards/agent-workflow.md#context-loading-order), [project template, lines 5-20](../templates/project-AGENTS.md#required-reading), and [review routing, lines 6-19](../../.agents/skills/code-review/references/area-routing.md#baseline-for-every-agent). The template loads three shared standards on every task, even before task-specific rules. | **Consolidate**, steps 2/5. One canonical reading router, short task/role bundles and conditional references; preserve local project context. | High potential context reduction in repeated small tasks and reviews. Low/medium effort. Full selected-file sizes are measured in the baseline, not actual token charges. |
| A4 / high | When review agents are authorized, the shipped default is two roles plus area specialists. [Authorization, lines 21-29](../../.agents/skills/code-review/references/agent-authorization.md#agent-authorization). Each agent reloads the common baseline; [change protocol, lines 203-226](../standards/change-protocol.md#review-loop) repeats review after fixes until clean or the cycle limit. | **Configure**, step 6. Select reviewers and follow-up scope by changed risk, task size and repository policy. Preserve independence when required. | Avoids automatic extra agent setup, repeated reading and triage. Medium effort. Our task-specific policy already permits proportionate delegation. |
| A5 / medium | Adoption copies ten shared standards into every repo, with thirteen for any code repo; it requires both manifest and human adoption record plus local documentation roots. [Adoption, lines 163-195](../standards/adoption.md#what-to-copy). README, adoption prompt and standard repeat the procedure. | **Consolidate + configure**, steps 2/5/8. Short entry prompt, canonical procedure, small core and active modules; preserve target knowledge, navigation and traceability. | Less adoption/documentation maintenance. Low/medium effort. Copied files are not automatically loaded on every task; this is not a per-request cost claim. |
| A6 / medium | Node and PowerShell validators implement overlapping text, link, orphan and metadata checks; PowerShell also parses scripts. [Scripts contract](../../scripts/README.md#commands), [Node entry](../../scripts/validate.mjs) and [PowerShell entry](../../scripts/validate.ps1). Both are aggregate entrypoints without a documented changed-file selector. | **Consolidate**, steps 2/4/8. Prefer one tested shared implementation plus necessary platform-specific checks. Keep small bootstrap differences when cheaper than a new runtime. | One place for shared fixes and a simpler focused-check path. Medium effort; 406 + 373 lines are file sizes, not a claim that all lines are duplicates. |
| A7 / high | Provider-neutral manifests exist, but bundled E2E targets Azure Boards and uses PowerShell wrappers. [E2E entry](../../.agents/skills/e2e-work-item/SKILL.md), [runbook, lines 29-35 and 77-87](../../.agents/skills/e2e-work-item/references/runbook.md#start-audit), [platform prerequisites, lines 25-29](../standards/platform-profiles.md#rules). Jira support is correctly described as a contract requiring a target connector. | **Configure**, step 6; script materialization in 8. Capability-based tracker/transport selection and explicit prerequisites/fallbacks; preserve tracker/code-host separation. | Easier POSIX/Jira/no-tracker adoption. Medium effort. This is an automation coverage gap, not evidence that provider-neutral support was falsely claimed. |
| A8 / medium | The general standard routes reusable failures through configured tickets; skill guidance also writes LEARNINGS into the shared pack checkout, and one inbox says to commit on any branch. [Standard, lines 24-60](../standards/self-improve-loop.md#required-agent-behavior), [ADO skill, lines 52-68](../../.agents/skills/azure-devops/SKILL.md#failure-learning-loop), [inbox, lines 3-12](../../.agents/skills/code-review/LEARNINGS.md). | **Consolidate + defer implementation**, steps 10-11. One configured capture path, later triage/promotion and scoped knowledge retrieval. Preserve sanitization, dedupe and evidence for fixes. | Avoids competing records and cross-repo working-tree pollution. Medium effort. A significant first occurrence may still deserve reporting; do not impose a universal repeat-count threshold. |

The next configuration stage should define policy dimensions and a few examples, not implement
all eight findings at once. Existing steps already own them; no extra stage is needed.
Source links navigate current files; line references and observations belong to the fixed
snapshot above. Use `git show <snapshot>:<path>` if those source files change later.

## Baseline And Verification Reality

The [baseline record](baseline-01.md) is reproducible from the fixed source snapshot. Selected
full shared rule files contain 3434 whitespace-delimited units for a docs change, 5141 for an
existing FastAPI behavior change, and 9629 for a local FastAPI review path. These sets exclude
target-local instructions, code, diffs, tool output and duplicated reads across agents. They
are not model tokens, runtime usage, latency or savings estimates.

The pack contains 16 standard Markdown files (12873 units), 12 template Markdown files (3593),
three skill entrypoints (3248), and 13 skill reference files (10211). This is an inventory, not
a requirement to read everything. Our internal plan/status/active-card cold-resume set adds
4442 units at this snapshot; it is tracked separately from the reusable pack. Keep it useful
and concise rather than treating project coordination as free context.

Observed on GitHub for accepted main `e19acf6af12976caef7a2053485a4fc39b95738e`:

- No tracked GitHub Actions, Azure Pipelines or `.azuredevops` definitions were found in the
  inspected source tree; GitHub reports zero Actions workflows.
- Check-runs: zero; commit statuses: zero. The combined status response says `pending` with
  zero statuses, which is not evidence of a running pipeline or a passed check.
- External/manual CI not reporting through these surfaces remains unknown. No account-wide
  searches or provider connections were attempted.
- Existing repository validation is documented, but its aggregate scripts were not executed
  during this audit. Step 4 must provide the agreed verification path; absence of CI does not
  authorize a full local gate in this stage.

## Preserve

Keep context-on-demand, protected user work, inward dependency boundaries, meaningful tests,
verified infrastructure behavior, indexed documentation, explicit external-write authority,
source/target profile separation, sanitized learning and deduplication. Do not achieve a smaller
pack by turning missing evidence into PASS or removing acceptance/merge boundaries.

## Representative Scenarios For Later Agreement

| Scenario | Fixed task and acceptance target | Compare later |
|---|---|---|
| Small docs correction | Correct one existing setup instruction; preserve navigation, no behavior change. | Rule files loaded, unnecessary gates/delegates, correct documentation diff. |
| Small existing FastAPI behavior change | Change one validation rule through the existing service boundary, with a relevant behavior test; no new module. | Context, files/abstractions added, commands, correctness and review rework. |
| Larger mixed change and local review | API + Next.js form validation change with the same acceptance cases, followed by review. | Routing, reviewer scope, duplicate work, actual test evidence and acceptance quality. |

Use project-owned fixtures or explicitly selected pilot repositories in step 9. Add a known,
reviewable defect for review evaluation; compare detection and false positives. Freeze task,
input revision, environment and acceptance cases, and record model/effort and prompt/policy
versions. Record actual usage/time only when available; include failed attempts and parent
review. No such execution or model comparison occurred in this stage.

## Triage And Limits

Two read-only agents inspected context and workflow separately. Parent verified the material
claims and measurements. Generic suggestions to remove dirty-tree or publishing permission
checks were not promoted: existing task authorization/overrides must be considered, and their
protection remains useful. Agent-proposed reading sets were reconciled with the project
template's mandatory quality-gate reference and the review authorization reference before
counting. No reviewed agent output alone was treated as proof.

No framework rules, scripts, skills, integrations or external services were changed. Astra
sources and model-specific prompting remain deferred to step 7. Actual historical task cost,
quality, runtime platform parity and savings are not established by this static audit.

## Navigation

- [Stage 01 agreement and evidence](steps/01-audit.md)
- [Baseline and reproduction](baseline-01.md)
- [Current status](STATUS.md)
- [Refactor plan](../refactor-plan.md)
- [Documentation index](../INDEX.md)
