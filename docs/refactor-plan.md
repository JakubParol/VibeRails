# VibeRails Refactor Plan

Plan revision: 1.3, updated on 2026-09-16.
Revision 1.3 requires stage-closeout documents in the stage PR before merge. MCP-only Azure
DevOps/Jira integration, earlier scope refinements and the post-pilot decision remain unchanged.
Stage authorization is recorded separately in STATUS and the stage card.
Live progress belongs only in [STATUS](refactor/STATUS.md).

This is the active internal refactor plan. It is not an adoption template. The root
[ROADMAP.md](../ROADMAP.md) remains the historical July optimization record.

## User Decisions And Constraints

**JE&#346;LI PROSTE ROZWI&#260;ZANIE WYSTARCZA, ROBIMY PROSTO.**

**IF A SIMPLE SOLUTION IS ENOUGH, KEEP IT SIMPLE.**

Choose the simplest solution that meets the agreed requirements and can be verified. Add
complexity only for a demonstrated need. Defer niche edge cases and speculative abstractions.
This applies to the framework, its documentation, and our own orchestration. Preserve agreed
correctness, minimum architecture, and honest evidence; simplicity is not permission to skip them.

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

The parent owns orchestration, integration, verification, coordination records, and shared
Git/PR operations. Overall plan acceptance approves the roadmap and working method, not every
future stage's design. Stage agreements authorize routine implementation, commits and PR work
within their scope. User acceptance and an explicit merge instruction remain separate gates;
one user message can provide both. The current stage's authorization is recorded in its card.

### Operating Loop

1. **Restore first.** Read this plan, STATUS, and the active card. Reconcile the recorded
   workspace, branch, changes, PR, current SHA, checks, and live agents with observable reality.
   An absent agent does not mean Done; inspect its artifacts before reassigning work.
2. **Branch before discussion.** Create `codex/refactor-NN-<scope>` from the updated accepted
   base before starting each new stage/delivery unit. A resumed stage reuses its branch.
   Preserve unrelated work and never switch the shared checkout beneath live workers.
3. **Discuss in plain Polish.** In a few connected sentences explain the intended result,
   approach, and material choices. Avoid long technical lists. Agree scope, exclusions,
   acceptance criteria, and the way the user will see or test the result.
4. **Record agreement.** Create/update the stage card with scope revision, date, a short user
   approval quote/reference, decisions, and relevant prerequisites. Implementation waits for
   this agreement. A material scope or acceptance change returns that part to discussion.
5. **Delegate and supervise.** Assign bounded tasks, explicit model/effort, owned paths,
   relevant context, and expected evidence. Avoid overlapping writes; isolate only when needed.
   Workers do not change shared branches, publish, merge, or edit coordination records unless
   specifically assigned. Parent inspects actual results and integrates accepted work.
6. **Verify and correct.** Run focused checks, obtain proportionate independent review, and
   resolve actionable findings. Preserve green evidence while its inputs remain valid. Publish
   the PR, explain results and limitations, and give the user a simple acceptance walkthrough.
7. **Accept, commit closeout, then merge.** After user acceptance and explicit merge
   authorization, first update STATUS and the stage card with acceptance, completed scope and
   evidence, preparing the Done record for the resulting main. Commit and push those records
   on the same stage PR before merging. While the PR is open, clearly record that merge is
   pending; a prepared Done row is not evidence of a completed merge. Run focused document
   checks and verify required CI against this final head, then merge only that head. Changed
   behavior/scope after acceptance returns to acceptance; missing evidence is never waived.
8. **Confirm and introduce the next stage.** Read back the actual merge and verify that remote
   main includes the closeout record. Only then report the stage complete. Final source/tested
   and merge SHAs may be recorded in the PR/report; do not add another commit merely to cite a
   commit's own SHA. Introduce the next stage and wait for agreement, except after step 09:
   apply the [pilot decision gate](#decision-after-step-09) before further stage work.

Default delivery unit: one stage branch and PR. Agree splits before implementing a large
stage; all agreed deliveries must be accepted and merged before stage Done. Routine work within
an agreement does not require repeated permission. Missing prerequisites block dependent work
only; continue useful independent work where safe.

For this refactor's local execution, use POSIX/.sh commands. Never run `lint.ps1`; other
PowerShell execution requires an explicit user request. Locally run changed-file format/lint
and the smallest meaningful behavior or documentation checks. Broad type checks, builds,
full suites and complete gates belong to PR verification unless the user explicitly requests
a full local run. This task policy overrides older broader local-gate wording; future adopting
projects still select their own supported script platforms.

### Durable State And Checkpoints

- This plan owns scope and process. [STATUS](refactor/STATUS.md) is the sole live lifecycle
  register and exact next action. On-demand stage cards own agreements, decisions, assignments,
  evidence and history, not a second current-status field. Use the [card structure](refactor/README.md#stage-card-fields).
- Parent checkpoints after agreement, before dispatch, after accepted results, when a decision
  or blocker changes, and before pausing/ending. Persist useful agent results, not tool logs.
  Agent IDs are lookup aids, never the only durable record.
- On a user's stage-merge instruction, the [operating loop](#operating-loop) requires the
  closing STATUS/card commit before merge in that same delivery. Never defer the Done record
  to the next stage or leave it only locally. If an earlier merge omitted it, repair the remote
  record promptly through the authorized documentation delivery; this is recovery, not a new
  stage or a recurring checkpoint PR chain.
- A published snapshot may lag a merge. Reconcile against Git/PR evidence before acting. Never
  infer acceptance from silence or elapsed time. Read only relevant completed decisions on resume.
- Optional stages may be explicitly `Skipped by user`, with the decision recorded. Skipped is
  not implemented. A blocker remains a reason/next action alongside the current lifecycle state.

### Model Selection For Our Delegates

This policy applies from stage 0, before the configurable routing feature is implemented.
Set model and effort explicitly through supported spawn parameters, using compact context.
Choose by task complexity, ambiguity, risk, and observed results; simple bounded work may start
with Luna, while consequential design or difficult review may start stronger.

User-suggested escalation candidates: **Luna Max -> Terra Max -> Sol High -> Astra xHigh**.
This is not a mandatory staircase or proven cost/quality ranking; other supported efforts may
fit better. Before escalating, distinguish reasoning failure from missing context, unclear
instructions or broken tools. Pass prior work and concrete gaps; do not restart blindly.

Record task type, requested model/effort, reason, outcome and escalation in the stage card.
Use measured usage when available; otherwise say unknown. Judge the total cost of an accepted
correct result, including parent review, retries and rework. Feed observations into steps 10-11.

## Ordered Stages

| Step | Area | Intended outcome |
|---|---|---|
| 0 | Controlled plan preparation | Discoverable plan, STATUS, preparation card, source records and startup prompt; independent review, fresh-context resume check, user acceptance and merge. |
| 1 | Audit and baseline | Locate duplicated rules, conflicting instructions, unnecessary work, and representative task costs; include model/effort and prompt identity in comparable quality and completion measures. |
| 2 | Small core and configuration | Separate minimum rules from optional modules; define presets, overrides, platform needs, the supported model catalog, and configurable routing by role/task with bounded agent choice. |
| 3 | Architecture variants | Specify minimal and extended Clean Architecture, including per-project or per-area selection and migration boundaries. |
| 4 | Verification responsibility | Define small local checks, full PR verification, targeted failure recovery, and behavior when CI is absent or unavailable. |
| 5 | Documentation and context | Reduce mandatory reading and duplicated reports; inventory prompt components and their composition, and load only active, relevant rules. |
| 6 | Workflows, skills, and integrations | Provider-neutral lifecycle and supported dispatch/routing operations, with the [workflow requirements](#step-06-workflows-skills-and-integrations) below. |
| 7 | GPT-6 Astra prompt optimization | Revise, version and evaluate prompts/routing under the [research gate and evaluation scope](#step-7-astra-entry-gate). |
| 8 | Adoption and migration | Short onboarding, pinned prompt/routing versions and materialized commands, with the [existing-project migration requirements](#step-08-adoption-and-migration) below. |
| 9 | Pilot and comparison | Run the [bounded pilot](#step-09-pilot-and-comparison) and reach the explicit continuation decision before later stages. |
| 10 | Central session reporting | Collect outcomes, measured usage, requested/actual models and efforts, prompt/routing versions, attempts, errors, and verified workarounds with low overhead. |
| 11 | Closed self-feedback loop | Group recurring failures, evaluate prompt and routing improvements, release versioned changes with rollback, retrieve applicable fixes, and measure whether outcomes improve. |
| 12 | CI/CD provider packages | Add optional Azure Pipelines and GitHub Actions adapters/templates; begin with PR verification, then selected deployment scenarios. |
| 13 | Optional lightweight kanban | Reassess existing no-tracker options before building a small board using the shared task contract. |
| 14 | Additional languages and frameworks | Extend architecture, command, verification, and documentation profiles after the earlier stages are proven. |

Steps 4 and 12 are distinct: step 4 defines how agents use verification, including existing
pipelines; step 12 packages reusable provider-specific CI/CD assets. Full feedback-loop
implementation stays in steps 10-11, while its minimal measurement needs inform step 1.
Steps 1/9 use small comparison records before central collection exists. Step 4 must confirm
VibeRails' own verification path: existing CI, or minimal repo CI if absent and agreed; this
does not pull the reusable provider packages from step 12 forward. Step 13 can be explicitly
skipped without blocking step 14. The next stage card locks detailed choices and exit evidence
before implementation; the table is not approval to decide all future designs autonomously.

## Step 06 Workflows, Skills And Integrations

These requirements refine the existing stage. Agree detailed scope, available capabilities and
proof at entry; no future stage card, manifest field or implementation is created by this plan.
Retain supported dispatch selection, escalation, fallback and traceable delegation under the
[model/routing contract](#model-routing-and-prompt-versions); evaluation remains in 07 and
configuration activation in 08.
Provider/transport choices and the no-tracker option remain owned by
[Trackers And The Deferred Kanban](#trackers-and-the-deferred-kanban).

### Skill Context

Keep [agent-workflow.md](standards/agent-workflow.md) as the canonical context policy. Within
skills, use explicit "Read when" conditions and distinguish applicable instructions from
reference knowledge and historical records. Reuse unchanged context; distribute full tool
outputs to delegates only for a concrete need. Narrow changes to stage 05 documents are allowed
when the changed workflow needs them, without rebuilding the router. Do not impose fixed word
limits or introduce a context-budget engine.

### Authorization And Handoff

Distinguish authority to implement, push, create/publish a PR and merge. A clear workflow request
may authorize several operations; do not request consent again for actions already covered.
A link, available tool or configuration choice grants no implementation or write authority.
Support an optional team handoff where the agent stops at a draft PR and a human owns publication
and merge; do not make it the universal workflow. Manifest/configuration changes remain behind
the [step 08 migration boundary](#step-08-adoption-and-migration).

At handoff verify the repository, branches, reviewed commit, actual PR state and scope/revision
of CI evidence. Agent-task completion is distinct from feature acceptance and merge. Inspect
the actual verification path for draft PRs rather than assuming required pipelines run on drafts.

### Integration Failures And Shared Writes

Distinguish environment/checkout, configuration, tool availability, connection startup,
authorization and operation-support failures. Use bounded, justified retries. After an
ambiguous write, inspect remote state before retrying creation of a PR, comment or work item;
never treat a tool error as a successful empty result. Use existing provider revision/version
preconditions for shared-state writes when available. Readback verifies the result but does
not replace protection against overwriting a concurrent change.

Keep these rules tracker/transport-neutral; provider profiles own concrete tools, workarounds
and limitations. Do not build a custom MCP server, universal adapter or orchestration engine.

### Review And Verification Evidence

Choose review by scope/risk while preserving required independence; no fixed specialist fleet.
Starting review does not invalidate still-applicable green checks. After fixes, repeat only
checks affected by the change. Static-only review may be an explicit project setting, not a
universal prohibition on a reviewer running a needed check.

A successful test process is insufficient when no tests ran. Assess report freshness, cases
actually executed, skips and whether coverage supports the claimed result. Missing/stale reports
or zero executed tests are not PASS. Preserve the small-local/full-CI split from
[quality-gate.md](standards/quality-gate.md). Reuse existing tools; do not mandate JUnit or a new
runner. Add an adapter only for a demonstrated gap within agreed scope.

### Stage 06 Acceptance Evidence

Agree a few small behavior trials, such as an ambiguous write result, stale reviewed commit,
zero executed tests or an unavailable required integration operation. Literal instruction-text
checks do not replace these trials. Clearly distinguish fixture/mock evidence from live
integration behavior and enforced permissions. Do not create an exhaustive provider/platform
matrix; the entry agreement identifies actual scope, access and obtainable evidence.

## Step 7 Astra Entry Gate

Before designing or editing Astra prompts, read the
[complete 15-source register](astra-refactor-reading-list.md) and complete its entry checklist.
Record unavailable sources rather than silently omitting them. Do not analyze those sources
during earlier stages. Context, cost, and feedback findings also feed steps 10-11, subject to
[the post-pilot decision](#decision-after-step-09).

After the reading gate, reuse the small general scenarios from
[stage 06](#stage-06-acceptance-evidence) to evaluate context selection, scope compliance,
responses to missing permissions/evidence and correct handoff. Code quality or prompt length
alone is not enough. The model/runtime, candidate and versioning contract is in
[Model Routing And Prompt Versions](#model-routing-and-prompt-versions). Full pilots remain
in step 09; this stage does not substitute for them.

## Model Routing And Prompt Versions

This section describes the planned framework capability; our actual delegate policy above
already applies to this refactor. The
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

For step 07 evaluation and later feedback experiments, compare a bounded set of justified
prompt/model/routing candidates. Where practical separate prompt changes from model or routing
changes so effects remain attributable. Apply the outcome/cost criteria from the
[pilot contract](#step-09-pilot-and-comparison); prompt variants follow the versioning rule above.
Publish improved recommendations with evidence, configured
promotion rules, and rollback; do not silently replace project pins or rewrite a policy in
the middle of a run. Escalations already allowed by the active policy remain possible.

## Step 08 Adoption And Migration

Include an update of an existing project with locally adapted standards in acceptance, alongside
fresh adoption. Distinguish local knowledge, deliberate settings, useful extensions and actual
conflicts with the new contract. Before overwriting, present the proposed changes and conflicts;
preserve permission limits, commands, architecture, required CI and project knowledge. A new
preset does not automatically invalidate them.

Keep the declared target state separate from migration actually performed and verified.
New manifest fields, configuration activation and migration belong here, after the preceding
semantics are ready; record remaining work rather than treating a changed label as completed
adoption. Validate on controlled examples or agreed copies. Updating a real project requires separate authorization;
select no concrete repository or change its configuration during this planning update.
Command materialization uses the existing
[cross-platform design scope](#cross-platform-scripts-design-scope).

## Step 09 Pilot And Comparison

Include a small project and a larger team scenario with locally modified standards. Select
specific environments and access at stage entry. Pin compared revisions, settings, tasks and
acceptance criteria, including before/after migration. Evaluate correctness, boundary violations,
rework, human involvement, elapsed time, available usage data, agreement with required checks
and whether another developer can take over the work. Include failed attempts and coordination/
delegation overhead. Word counts are not tokens, time or savings; disclose unavailable measures.

### Decision After Step 09

After step 09 is complete and merged, present its results and limitations. The user explicitly
decides whether to continue, first correct the core, narrow scope or change priorities. Record
the decision in the existing STATUS/stage record. Without that decision, do not start step 10
or any later stage. Steps 10-14 remain in the plan; this checkpoint is not a new stage and is
not automatic approval of their implementation. Normal stage-scope agreement still applies.

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

Azure DevOps and Jira workflows use their connected MCP operations. Stage 06 removes the Azure
DevOps command wrappers and active instructions for using them. Missing MCP capability is
reported explicitly, with no CLI/raw-REST workaround or replacement wrapper.

Design a shared task lifecycle with provider-specific state mapping and capability discovery.
Tracker, code host, CI provider, and connection method are independent configuration choices.
When both Jira and Azure DevOps are used, define ownership and routing for each task; do not
assume duplicate records or bidirectional synchronization.

Resolve the required operation and authentication from the current MCP's exposed capabilities.
Do not bind shared workflow rules to fixed tool names or assume all connections expose the same
operations. An unavailable operation blocks its dependent action, not unrelated authorized work.

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
- Close important misses with what earlier review/QA missed, why, and the specific test/control
  that prevents recurrence. Do not require an essay after routine success.
- Record applicability and last verification; replace/archive obsolete advice without deleting
  history or adding an ever-growing list of global instructions. Check relevant lessons when
  used or when related code/tools change; start without a separate scheduled audit service.

## Lightweight Readiness And Acceptance

Use existing stage/task cards to identify only needed access, provider, test data, QA environment,
and the concrete proof path before implementation. For UI, connect agreed design/behavior to an
actual scenario and evidence from the tested build; Figma is optional. A screenshot or agent PASS
alone does not prove all criteria. No automatic PASS for absent checks.

Start with plain records and existing workflow/CI controls. Add a small programmatic guard only
for a demonstrated repeated failure, not a new state-machine framework. Preserve parent ownership,
SHA-bound evidence, and user acceptance. The scoped external analysis and four candidate
refinements are in [inspiration review](refactor/inspiration-review.md); no extra stage is added.

## Navigation

- [Documentation index](INDEX.md)
- [Current state](refactor/STATUS.md)
- [Record structure](refactor/README.md)
- [Startup prompt](refactor/start.md)
- [Deferred Astra reading list](astra-refactor-reading-list.md)
- [Historical optimization roadmap](../ROADMAP.md)
