# Area Routing

Use this reference to decide which docs each review agent must load and which specialist agents
to add. Agents must read the listed docs themselves before producing findings.

## Baseline For Every Agent

Use the target context resolved by [the skill workflow](../SKILL.md#workflow), including its
native-context fallback for repositories without VibeRails. The target router owns parent/local
instructions and changed-path rules; do not maintain a second mandatory baseline here. Reuse
unchanged context already supplied, and read relevant source before producing a finding.

Missing optional docs alone are not a defect. Report missing required context when it prevents
a supported review decision; do not silently invent the target's rules.

Choose review lenses from the changed scope and risk, rather than assigning a fixed pair. A
general content lens can cover changed behavior, bugs, edge cases, readability, maintainability,
performance, and error handling. A standards lens can cover architecture boundaries, security,
quality gates, project structure, deployment implications, and source delivery constraints.
Use either, both, or a specialist only when the task's required independence and expected value
justify it.

## Standard Bundles

Resolve task/stack/documentation rules through the target's canonical context router. The
specialist table below adds review focus and local sources, not another copy of those bundles.
An orchestrator reads mode, authorization and output instructions needed for its operations;
a bounded read-only specialist needs its assignment, applicable local/task rules and finding
criteria, not unrelated publishing or workflow references.

## Specialist Selection

Add specialists only when the path set makes their expertise useful. If a PR changes several
areas, either spawn one specialist per area or one broader specialist with a clearly separated
path scope. Specialist review agents are read-only. If fixes are approved, apply them
sequentially through the orchestrator or one worker at a time.

Include the [Architecture Shortcut Checklist](#architecture-shortcut-checklist) in every
backend/API, worker, and shared package specialist prompt, and the
[Test Value Checklist](#test-value-checklist) in every prompt that covers changed tests.

| Changed path | Specialist | Additional docs to load when present | Focus |
|---|---|---|---|
| `apps/**`, `web/**`, `frontend/**`, `src/app/**`, `src/pages/**`, `components/**` | Frontend specialist | Frontend standards; nearest app `AGENTS.md`, `README.md`, `docs/INDEX.md`; package manager scripts | React/Next.js or other UI framework boundaries, client/server split, accessibility, state/data access, forms, error states, browser behavior, frontend tests |
| `services/**`, `api/**`, `backend/**`, `src/api/**`, `server/**` | Backend/API specialist | Backend standards; nearest service `AGENTS.md`, `README.md`, `docs/INDEX.md` | Public API behavior, request/response contracts, auth/authorization, clean architecture layers, persistence, error handling, service tests |
| `workers/**`, `jobs/**`, `queues/**`, `functions/**` | Worker specialist | Backend standards; nearest worker docs | Async execution, retries, idempotency, scheduling, queue semantics, observability, tests |
| `packages/**`, `libs/**`, `shared/**` | Shared package specialist | Coding and architecture standards; nearest package docs | Reuse boundaries, dependency direction, public package contracts, avoiding dumping-ground utilities |
| `infra/**`, `infrastructure/**`, `deployments/**`, `.azuredevops/**`, `.github/workflows/**`, `pipelines/**`, `docker*`, `compose*.yml`, `*.bicep`, `*.tf` | Infrastructure specialist | Infrastructure docs, deployment docs, quality gate docs, nearest README/AGENTS | Pipeline safety, environment separation, identities, permissions, networking, secrets, deployment blast radius, no apply/production writes without approval |
| `docs/**`, `README.md`, `AGENTS.md`, child `README.md`, child `AGENTS.md`, child `docs/INDEX.md` | Documentation specialist | Task-relevant documentation rules/local context from the router; audit only for adoption or structural/navigation changes that need it | Required docs hierarchy, navigation, no orphaned docs, concise reusable standards, no duplicate sources of truth |
| `.agents/**` | Agent workflow specialist | `.agents/README.md`, `.agents/skills/README.md`, relevant sibling skill docs, skill-creator `SKILL.md` if available, documentation standards | Repository agent assets, skill metadata, progressive disclosure, local skill conventions, navigation, no secrets in agent assets |
| `scripts/**`, `tools/**`, `bin/**` | Tooling specialist | Tooling README if present, quality gate docs, stack standards for touched commands | Shell/PowerShell safety, gate integrity, CI/local parity, no hidden warnings, no destructive defaults |
| `tests/**`, `test/**`, `__tests__/**`, `*.spec.*`, `*.test.*` | Test specialist | Stack standards for the touched test area; backend-testing or frontend standards when present | Behavior coverage, fixture integrity, deterministic tests, no weak assertions, no production monkey-patching |

## Architecture Shortcut Checklist

First read the owning project's explicit architecture variant and boundaries. Preserve legacy
policy when unselected. In `minimal`, a function can be an application entry point and a typed
callable a port; absence of a service class, domain package, separate ports file or per-feature
`dependencies.py` is not itself a finding. Review the actual responsibility/import boundary.

Backend/API, worker, and shared package specialists must check every changed file against
these known agent shortcuts. Each hit is a finding, normally `P1` or `P2`:

- Business logic in an endpoint: a route or controller that branches on domain state,
  computes derived values, or composes multi-step behavior instead of validating input,
  mapping schemas, and calling application behavior (a function or service method).
- Route or controller calling a repository, session, or SQL directly instead of going
  through an application service.
- Dependencies constructed inline (`Service()`, `Repository()` inside a function) instead of
  injected through an outer composition root, parameters or framework DI.
- Application or domain code importing concrete infrastructure.
- Persistence, HTTP calls, or queue access inside an application service instead of behind a
  port.
- Missing typed error mapping: raw exceptions escaping to the transport layer instead of the
  documented error envelope.
- New `utils`, `helpers`, or `common` dumping grounds without a documented narrow purpose.

## Test Value Checklist

The test specialist, and any specialist reviewing changed tests, must check new and changed
tests against these rules. Meaningless tests are findings, not coverage:

- Every test must be able to fail for a real behavioral reason. A test that cannot fail when
  the production code is broken is a finding.
- No mock-echo assertions: asserting that a mock was called with the exact values the test
  just passed in, without asserting an observable outcome.
- No testing the framework: serialization defaults, ORM basics, or library behavior the
  project does not own.
- No duplicate coverage: a new test must prove a behavior no existing test proves; point to
  the overlapping test when rejecting.
- Test names describe the behavior and expected outcome, not the method under test.
- Assertions check the response envelope, persisted state, or returned domain values - not
  internal call order or private attributes.
- Test doubles go through ports; monkey-patching production internals is a finding.

## Multi-Area PRs

For PRs touching more than one service, package, or app:

- Keep ownership explicit in specialist prompts.
- Check that packages do not import one another's internals.
- Check whether shared behavior belongs in a documented shared package rather than being
  duplicated or coupled across services.
- Require each specialist to list the focused gate it expects, even if verification is not run
  during PR mode.

## Gate Selection

Use documented gates only:

- Follow the canonical router to the actual target commands and quality-gate coverage.
- If scripts exist, prefer repository-defined commands such as `lint`, `test`, `typecheck`,
  `format`, or project-specific wrappers.
- For docs-only changes, use a Markdown/navigation audit appropriate to the repository, loading the documentation-audit checklist only when adoption or restructuring requires it.
- For rendered UI behavior changes, include browser/E2E checks only when the repository
  documents them or the task explicitly needs them.

Do not call an area verified if its documented gate was not run or did not pass.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
