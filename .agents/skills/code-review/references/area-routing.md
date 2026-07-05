# Area Routing

Use this reference to decide which docs each review agent must load and which specialist agents
to add. Agents must read the listed docs themselves before producing findings.

## Baseline For Every Agent

Every agent must load these files when they exist:

- `AGENTS.md`
- `README.md`
- `docs/INDEX.md`
- `docs/standards/agent-workflow.md`
- `docs/standards/change-protocol.md`
- `docs/standards/quality-gate.md`
- nearest folder-level `README.md` or `AGENTS.md` for the changed path

Do not fail a review just because a listed optional document is missing. Missing required
repository docs can be a finding when the repository's own standards require them.

Agent 1 - Diff Content Review focuses on changed behavior, bugs, edge cases, readability,
maintainability, performance, and error handling.

Agent 2 - Standards and Infrastructure Review focuses on standards compliance, architecture
boundaries, security, quality gates, project structure, deployment implications, and source
delivery constraints.

## Standard Bundles

When assigning a specialist, expand these bundles into concrete paths that exist in the target
repository:

- Backend standards: `docs/standards/coding.md`, `docs/standards/architecture.md`,
  `docs/standards/backend.md`, `docs/standards/backend-testing.md`.
- Frontend standards: `docs/standards/coding.md`, `docs/standards/architecture.md`,
  `docs/standards/frontend.md`.
- Documentation standards: `docs/standards/documentation.md`,
  `docs/standards/documentation-audit.md`.
- Quality standards: `docs/standards/quality-gate.md` plus repository-specific gate docs when
  present.

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
| `docs/**`, `README.md`, `AGENTS.md`, child `README.md`, child `AGENTS.md`, child `docs/INDEX.md` | Documentation specialist | Documentation standards, documentation audit, nearest parent docs | Required docs hierarchy, navigation, no orphaned docs, concise reusable standards, no duplicate sources of truth |
| `.agents/**` | Agent workflow specialist | `.agents/README.md`, `.agents/skills/README.md`, relevant sibling skill docs, skill-creator `SKILL.md` if available, documentation standards | Repository agent assets, skill metadata, progressive disclosure, local skill conventions, navigation, no secrets in agent assets |
| `scripts/**`, `tools/**`, `bin/**` | Tooling specialist | Tooling README if present, quality gate docs, stack standards for touched commands | Shell/PowerShell safety, gate integrity, CI/local parity, no hidden warnings, no destructive defaults |
| `tests/**`, `test/**`, `__tests__/**`, `*.spec.*`, `*.test.*` | Test specialist | Stack standards for the touched test area; backend-testing or frontend standards when present | Behavior coverage, fixture integrity, deterministic tests, no weak assertions, no production monkey-patching |

## Architecture Shortcut Checklist

Backend/API, worker, and shared package specialists must check every changed file against
these known agent shortcuts. Each hit is a finding, normally `P1` or `P2`:

- Business logic in an endpoint: a route or controller that branches on domain state,
  computes derived values, or composes multi-step behavior instead of validating input,
  mapping schemas, and calling one application service.
- Route or controller calling a repository, session, or SQL directly instead of going
  through an application service.
- Dependencies constructed inline (`Service()`, `Repository()` inside a function) instead of
  injected through the module composition root or framework DI.
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

- Read root `README.md`, `AGENTS.md`, `docs/INDEX.md`, and quality-gate docs for commands.
- If scripts exist, prefer repository-defined commands such as `lint`, `test`, `typecheck`,
  `format`, or project-specific wrappers.
- For docs-only changes, use a Markdown/navigation audit appropriate to the repository, for
  example `rg --files -uu -g "*.md"` plus the local documentation audit standard when present.
- For rendered UI behavior changes, include browser/E2E checks only when the repository
  documents them or the task explicitly needs them.

Do not call an area verified if its documented gate was not run or did not pass.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
