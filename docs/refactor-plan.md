# VibeRails Refactor Plan

Updated: 2026-09-16.
Status: preparation and design only; implementation stages have not started.

This is the active internal refactor plan. It is not an adoption template. The root
[ROADMAP.md](../ROADMAP.md) remains the historical July optimization record.

## User Decisions And Constraints

- Make VibeRails lighter, configurable, and easier to adopt. Measure completed-task cost and
  quality, not just instruction length.
- Preserve a minimal Clean Architecture. Presentation endpoints must not call the ORM or
  persistence directly. The exact minimum layering and DI contract still needs design.
- Prefer full PR pipeline verification over repeated local aggregate gate runs. Define the
  small local check set and the fallback for repositories without CI.
- Support Windows, macOS, and Linux without assuming the user's shell. The script distribution
  design remains a proposal until accepted.
- Support Jira and/or Azure DevOps through MCP integrations where suitable; keep teams without
  either provider supported.
- Add configurable routing of work to models and reasoning efforts, with VibeRails suggested
  presets and improvements informed by the self-feedback loop. Initial model scope is the
  GPT-5.6 family, including Sol, Terra, and Luna, plus GPT-6 Astra.
- Version prompts and routing policies so session outcomes can be attributed to the exact
  instructions and selection rules used. Model/effort examples are candidates to evaluate,
  not established cost or quality rankings.
- Treat central session reporting and the self-feedback loop as major final stages of the core
  refactor, not as incidental skill notes.
- Add reusable Azure Pipelines and GitHub Actions CI/CD profiles after the core refactor and
  feedback loop, before a custom kanban.
- Defer the optional custom kanban until after CI/CD. Add further language and framework
  support after the kanban stage, at the very end.
- Keep all 15 [Astra research sources](astra-refactor-reading-list.md) deferred until step 7.

## Coordination

The parent session owns orchestration, decisions, result verification, and this plan. Delegate
bounded tasks to subagents with an explicit scope, file ownership, expected evidence, and
allowed actions. Keep their handoffs compact and link to durable artifacts. The parent checks
results before accepting them or advancing the plan.

Current authorization covers analysis and recording the plan. It does not start the
implementation stages, provider setup, deployments, or backlog writes.

## Ordered Stages

| Step | Area | Intended outcome |
|---|---|---|
| 1 | Audit and baseline | Locate duplicated rules, conflicting instructions, unnecessary work, and representative task costs; include model/effort and prompt identity in comparable quality and completion measures. |
| 2 | Small core and configuration | Separate minimum rules from optional modules; define presets, overrides, platform needs, the supported model catalog, and configurable routing by role/task with bounded agent choice. |
| 3 | Architecture variants | Specify minimal and extended Clean Architecture, including per-project or per-area selection and migration boundaries. |
| 4 | Verification responsibility | Define small local checks, full PR verification, targeted failure recovery, and behavior when CI is absent or unavailable. |
| 5 | Documentation and context | Reduce mandatory reading and duplicated reports; inventory prompt components and their composition, and load only active, relevant rules. |
| 6 | Workflows, skills, and integrations | Make task lifecycle independent of tracker and transport; apply routing to supported dispatch operations, including selection, escalation, fallback, and traceable delegation. |
| 7 | GPT-6 Astra prompt optimization | Read and assess every registered source, then revise, version, and evaluate prompts with routing candidates for Astra and the supported GPT-5.6 family. See the mandatory entry gate below. |
| 8 | Adoption and migration | Provide a short onboarding path, preserve project knowledge, select and pin prompt/routing versions, materialize commands, and distinguish desired configuration from completed migrations. |
| 9 | Pilot and comparison | Exercise small and larger projects; compare model/effort/prompt/routing combinations by total task cost, correctness, rework, and agreement between agents and CI. |
| 10 | Central session reporting | Collect outcomes, measured usage, requested/actual models and efforts, prompt/routing versions, attempts, errors, and verified workarounds with low overhead. |
| 11 | Closed self-feedback loop | Group recurring failures, evaluate prompt and routing improvements, release versioned changes with rollback, retrieve applicable fixes, and measure whether outcomes improve. |
| 12 | CI/CD provider packages | Add optional Azure Pipelines and GitHub Actions adapters/templates; begin with PR verification, then selected deployment scenarios. |
| 13 | Optional lightweight kanban | Reassess existing no-tracker options before building a small board using the shared task contract. |
| 14 | Additional languages and frameworks | Extend architecture, command, verification, and documentation profiles after the earlier stages are proven. |

Steps 4 and 12 are distinct: step 4 defines how agents use verification, including existing
pipelines; step 12 packages reusable provider-specific CI/CD assets. Full feedback-loop
implementation stays in steps 10-11, while its minimal measurement needs inform step 1.

## Step 7 Astra Entry Gate

Before designing or editing Astra prompts, read the
[complete 15-source register](astra-refactor-reading-list.md) and complete its entry checklist.
Record unavailable sources rather than silently omitting them. Do not analyze those sources
during earlier stages. Context, cost, and feedback findings also feed steps 10-11.

## Model Routing And Prompt Versions

This is a planned capability, not a change to the models used by the current session. The
initial catalog covers the GPT-5.6 family and GPT-6 Astra. Verify exact runtime model IDs,
available reasoning efforts, account access, and dispatch capabilities during step 7 before
turning candidate settings into supported presets.

User-provided starting examples to evaluate:

| Work | Candidate routing |
|---|---|
| Planning | GPT-6 Astra with xHigh reasoning |
| Implementation | Agent selects from an allowed pool such as GPT-5.6 Sol, Luna with Max reasoning, or Terra with Max reasoning. Sol's effort remains configurable. |
| Review, investigation, and other roles | Separate configurable routes, selected and evaluated during detailed design. |

Keep model and reasoning effort as separate settings. Route by role and task needs, including
complexity, ambiguity, impact, required capabilities, and budget. These examples do not assert
that a particular model or reasoning level is always cheaper or more effective.

Configuration should resolve authorized run overrides, then task/area settings, project
settings, and the selected versioned VibeRails preset, subject to higher-priority instructions
and actual runtime capabilities. Agents may choose only within the allowed model/effort pool.
Define bounded retries, escalation, fallback, and the evidence needed for a change of route.
Report unavailable routes instead of silently substituting disallowed models or efforts.

Dispatch must use capabilities actually exposed by the runtime. Prompt text alone does not
switch a model. Record requested and observed model/effort separately; if actual settings are
not observable, mark them unknown. This also applies when a child inherits its parent's model.

Versioning proposal:

- Give each maintained prompt a stable ID, immutable version, and content hash. Prefer
  Git-backed versions and release records over adding a separate prompt-management service.
- Version routing policies and suggested presets independently from prompt contents; pin the
  selected versions in each adopting project and resolve them for each run.
- Record a manifest of the effective prompt composition: shared instructions, relevant
  project/skill instructions, model-specific adaptations, and safe references to variable
  context. One template hash does not identify all instructions the agent received.
- Mark opaque or unavailable instruction layers explicitly. Central reports should retain
  safe version/hash references by default, not raw private instructions or task payloads.
- Keep shared rules canonical. Add model-specific prompt variants only when evaluations show
  a reason for them, rather than copying the full instruction set for every model.

The feedback loop evaluates versioned candidate prompts and routing policies on comparable
tasks. Measure completion, correctness, rework, total usage/cost, and latency, including failed
attempts and delegation overhead. Separate prompt and routing changes where practical so
their effects remain attributable. Publish improved recommendations with evidence, configured
promotion rules, and rollback; do not silently replace project pins or rewrite a policy in
the middle of a run. Escalations already allowed by the active policy remain possible.

## Cross-Platform Scripts: Design Scope

Recommendation for discussion: separate project commands, reusable VibeRails logic, platform
launchers, and provider clients. Prefer existing project commands; add shared tested code only
where it removes meaningful repeated logic.

| Option | Advantage | Cost or limitation |
|---|---|---|
| Full PowerShell and shell implementations | Native tools on each platform | Every behavior fix needs two implementations and parity checks. |
| Pseudocode translated by an agent at adoption | Flexible output for the target stack | Each adoption creates another implementation; drift, regression testing, and later upgrades remain necessary. |
| One tested implementation with small launchers | Shared behavior and reusable fixes | Needs an available runtime; platform-specific process handling still needs validation. |
| Task contract mapped to existing project commands | Fewest new dependencies and scripts | The concrete commands remain project-specific. |

Use a short task contract describing inputs, outputs, exit codes, and side effects. Map it to
existing project tools during adoption. Pseudocode can explain missing behavior, but should
not be the sole implementation or correctness evidence. Generate only missing glue, then
review, verify, and commit it; do not regenerate scripts on every task execution.

Do not introduce a universal runner or require Node in every Python repository solely for
VibeRails. Reusable pack tooling can retain an explicit runtime prerequisite; adopted project
commands should use the project's existing runtime where practical. Keep genuinely small
platform-specific bootstrap code separate when a shared core would add more dependencies than
it removes. Candidate for later audit: consolidate duplicated validation behavior in
`scripts/validate.mjs` and `scripts/validate.ps1`, preserving PowerShell parsing separately.

The decision must account for runtime prerequisites, argument/path handling, exit codes,
repeatability, upgrades, and tests on the platforms the target repository supports. Reuse a
target's existing tools and commands before adding a runner. Selecting a platform does not
authorize agents to run aggregate lint or verification scripts.

A shared runtime does not make every invoked command portable: Node documents distinct
handling for Windows batch entrypoints in its
[child-process documentation](https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows).
Verify portability on the platforms actually supported; do not infer Windows correctness
from a Linux-only run.

## Trackers And The Deferred Kanban

The current pack bundles Azure DevOps workflow skills and PowerShell wrappers. Jira currently
has a documented integration/adoption contract, not an equivalent bundled E2E implementation.

Design a shared task lifecycle with provider-specific state mapping and capability discovery.
Tracker, code host, CI provider, and connection method are independent configuration choices.
When both Jira and Azure DevOps are used, define ownership and routing for each task; do not
assume duplicate records or bidirectional synchronization.

Recommendation for discussion: prefer the official MCP when it supports the required
operation and authentication in the user's client. Record an explicit CLI/API or manual
alternative for missing capabilities. Do not bind shared workflow rules to specific tool names
or assume all providers expose the same operations.

The official [Atlassian Rovo MCP](https://developer.atlassian.com/cloud/rovo-mcp/) supports Jira
Cloud task operations. Its Cloud support should not be generalized to Jira Data Center.
Microsoft provides local and remote Azure DevOps MCP options; its
[current remote setup guidance](https://learn.microsoft.com/en-us/azure/devops/mcp-server/remote-mcp-server?view=azure-devops)
recommends local MCP for clients currently unable to complete the remote Entra authentication,
including Codex. Recheck client compatibility at implementation time. These observations are
from documentation reviewed on 2026-09-16; no account integration has been tested here.

Plan a useful no-tracker mode before a custom board exists. Evaluate small repository-local
task records and existing team tools. A proposed first option is one Markdown file per task
with a stable ID, status, acceptance criteria, and an index; this needs no hosted board.
A later board should use the same task model rather than introduce a second backlog. Session
telemetry and reusable framework incidents remain separate from product tasks even if their
storage service is shared.

## CI/CD Scope And Deferred Languages

Step 12 targets Azure Pipelines and GitHub Actions. Preserve working pipelines during adoption
and add only missing capabilities. Keep CI verification and environment-specific CD separate;
deployment targets, credentials, promotion, and rollback need explicit project configuration.

Recommendation for discussion: share a verification contract and repository-owned commands,
with two small provider adapters for environment setup, execution, result publication, and PR
status. Start with PR verification and add optional CD profiles for actual deployment needs.
Account for provider-specific trigger and branch policies, not just YAML syntax.

For example, [GitHub required checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
can remain pending when a required workflow is filtered out. An always-evaluated required
summary should distinguish failures, cancellation, and intentionally skipped work. For
[Azure Repos](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/azure-repos-git?view=azure-devops#pr-triggers),
PR validation is configured through build-validation branch policies rather than YAML `pr:`
triggers. Draft-PR behavior must be accounted for when the workflow uses drafts.

Publish concise results keyed to the verified revision, with check outcomes and links to
detailed failure logs. Agents should read detailed logs only for relevant failures. This is
an expected efficiency benefit to measure, not an already-proven token saving.

Step 14 records the intention to support additional languages and frameworks beyond the
current Python/FastAPI and Next.js/React focus. Select the first additions from real adoption
needs; do not expand the supported stack during the core refactor.

## Feedback Loop Design Requirements

- Record successful, failed, and interrupted sessions so comparisons have a denominator.
- Prefer tool/runtime measurements; distinguish unavailable or estimated usage from observed
  counts. Attribute parent/subagent usage and resumed work without double counting.
- Capture a compact execution summary, relevant framework version/configuration, repeated
  attempts, sanitized errors, proposed causes, and evidence for verified workarounds.
- Include prompt IDs/versions, effective composition references, routing-policy versions,
  selection reasons, and requested/observed model and effort for each attempt. Link parent,
  subagent, retry, and resumed execution records without double counting their usage.
- Keep collection cheap and recoverable when the central service is unavailable. Choose the
  storage and retention model during detailed design; avoid concurrent edits to one shared
  Markdown inbox as the ingestion protocol.
- Group related incidents, separate hypotheses from validated fixes, and prioritize by
  recurrence, cost, and outcome impact.
- Route improvements through review and verification, then compare later sessions to confirm
  benefit. Include prompt and routing candidates, preserve project pins, and retain previous
  versions for rollback. Retrieve only relevant, applicable learnings during normal work.
- Measure the feedback system's own overhead and keep product backlogs independent from
  framework telemetry.

## Navigation

- [Documentation index](INDEX.md)
- [Deferred Astra reading list](astra-refactor-reading-list.md)
- [Historical optimization roadmap](../ROADMAP.md)
