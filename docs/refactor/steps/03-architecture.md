# Stage 03 - Architecture Variants

## Goal

Define `minimal` and `layered` as two sizes of Clean Architecture, preserving the same essential
responsibility and dependency boundaries while reducing unnecessary structure in small projects.

## Agreed Scope

Scope revision: `architecture-1`, approved on 2026-09-16 after a concise comparison of both variants.

- Define shared invariants: presentation invokes application behavior, not ORM/repositories;
  business rules stay outside transport and IO; dependencies are supplied explicitly; application
  code does not import concrete infrastructure.
- Proposed minimum: small use-case/service functions or classes, plus a narrow application-owned
  dependency contract (for Python, a callable or small Protocol where suitable). The contract
  can live beside the use case; no compulsory ports file, DI container or extra domain package
  when they add no value. Infrastructure implements the dependency and wiring stays at the edge.
- Proposed layered variant: explicit application ports, infrastructure adapters/repositories,
  composition roots and feature/domain boundaries where meaningful. Avoid empty pass-through
  layers and abstractions with no demonstrated purpose even in this variant.
- Clarify roles for current Python/FastAPI and Next.js usage without adding new stack support.
  Use the same small behavior to compare the variants so their actual overhead is visible.
- State when a project or standalone area should move to the expanded variant and how to
  refactor incrementally while preserving behavior, evidence and public contracts.
- Reconcile relevant architecture/backend guidance with the configuration design and specify
  what unconfigured legacy adoptees retain. Do not silently reinterpret a configuration field
  as an implemented migration or rewrite other repositories.

Agreed output: canonical variant rules, a short comparison, small concrete examples, and a
practical upgrade path. Avoid creating a sample application, generic DI framework or validator
engine merely to demonstrate the rules.

Out of scope: verification-policy implementation (4), broad documentation cleanup (5), provider
or routing engines (6-7), adoption/migration automation (8), telemetry/CI/CD/kanban and new stacks.
The 15 Astra sources remain deferred.

## Acceptance Criteria

- Both variants satisfy the endpoint-to-application and inward-dependency constraints; neither
  treats a small project as permission to access ORM from presentation.
- Minimal examples are materially smaller without hidden framework/IO coupling or hollow layers.
- The same behavior can be explained/tested through each variant's boundaries; no mandatory
  one-class-per-operation or one-interface-per-method scaffolding is introduced.
- Current stack guidance, preset labels and legacy behavior remain coherent. Project/area
  selection and future migration ownership are explicit, without an inheritance DSL.
- Examples receive meaningful focused verification appropriate to their form, plus independent
  review, user acceptance and explicit merge before stage Done.

## Agreement And Authorization

- Entry date: 2026-09-16. After the completed retrospective review, the user replied `ok` to
  proceeding to the stage 03 discussion.
- After asking for a shorter explanation, the user approved the minimal/layered comparison
  with `ok` on 2026-09-16. This authorizes architecture-1: canonical guidance, examples,
  focused verification, independent review, commits and a stage PR.
- Both variants retain application-owned contracts and inward dependencies. Minimal uses
  simple functions/small classes and argument injection; layered separates meaningful roles
  into explicit layers. Preset mapping remains light -> minimal, standard -> layered.
- Result acceptance and explicit merge authorization remain separate closeout requirements.

## Delegation

| Assignment | Requested model / effort | Reason | Boundary |
|---|---|---|---|
| Minimal example and comparison | GPT-5.6 Terra / high | Bounded code/example design must preserve dependency inversion without excess scaffolding | Read-only proposal; no files, installations, gates or framework execution. |
| Canonical guidance consistency | GPT-5.6 Sol / high | Cross-document architectural constraints and legacy defaults need careful reconciliation | Read-only analysis of relevant current standards, no broad redesign. |
| Standards/examples integration and verification | Parent | One owner for coherent boundaries, selection and evidence | Own edits and focused checks; no adoptee migrations or later-stage implementation. |
| Independent architecture review | GPT-5.6 Sol / high | Check shared invariants, variant semantics and cross-document consistency | Read-only local diff; no broad gates or later-stage implementation. |

Advice assignments and independent review completed. Review reported No findings and independently
ran the paired examples plus scoped link/whitespace checks. Parent integration corrected the
draft example issues listed below; no agent escalation was needed. Requested model/effort is
not observed runtime usage and no token-cost ranking is inferred.

## Implementation And Triage

- Canonical [variant rules](../../standards/architecture.md) now define common boundaries,
  manual project/area selection, minimal/layered differences and incremental migration.
- Backend, relevant frontend guidance, the project instruction template and the review checklist
  are aligned. Minimal permits callable ports and parameter injection; neither variant permits
  direct persistence from presentation or application imports of infrastructure.
- [Paired examples](../../templates/architecture-variants.md) execute the same note behavior.
  Parent corrected the delegate draft so the presentation receives a bound use case, removed
  global mutable storage, and kept the layered domain invariant in the constructor.
- The snippets are responsibility illustrations, not a scaffolded application or package-level
  import fixture. Memory adapters are test doubles; no real HTTP/DB validation is claimed.
- Application error guidance now leaves HTTP status mapping at the interface, preserving API
  response behavior. Existing import enforcement remains required; excerpts use actual variant
  shapes without requiring a nonexistent minimal domain package.
- Parent verified import-linter forbidden/layer syntax against official documentation. The
  old fully-qualified layers plus containers prefix was replaced by unprefixed qualified names.
  These external technical references are unrelated to the deferred Astra source list.
- Existing database-test policy, gate execution, broad reading and review orchestration remain
  unchanged. Unrelated cross-feature policy cleanup was not included.
- Used local skill-creator guidance only for the narrow review-reference edit; no model-specific
  prompt optimization or skill entrypoint/activation change was performed.

## Verification Evidence And Limits

The embedded standard-library behavior recipe passed for both examples: normalized response
and stored value, rejection without a write, and use of a failing injected dependency. Focused
changed-file Markdown checks passed. Existing adoption/template JSON, backend-test/gate policy,
scripts and code-review metadata were confirmed unchanged.

The skill-creator quick validator could not start because PyYAML is absent in both available
Python runtimes. No packages were installed. Focused checks of the unchanged SKILL frontmatter
and required UI metadata passed; this is not a successful quick_validate run.

Both import-contract excerpts parse as INI and their shown syntax was checked against official
Import Linter documentation. No installed import-linter/target package graph was executed.
Independent review found no concrete gap within this stage's documentation/example scope.
No full gate, build, PowerShell, real HTTP/DB test or deferred Astra analysis was run.

## Delivery And Verification

Branch: `codex/refactor-03-architecture`, created from accepted main
`8c1ac9119f908323879a7a542d924a2828899369`. The completed review checkpoint `ea6e446` was carried
as commit `d131a62`; publish it with this stage's eventual PR instead of a separate review PR.
Published for review as draft: [PR #5](https://github.com/JakubParol/VibeRails/pull/5).
Reviewed content commit: `edda1591ee857c3ae6c223b0c2fc3d11fec98239`; publication checkpoint
updates are checked separately. Reconcile the final head in the PR before reusing its evidence.
Current state is in [STATUS](../STATUS.md).

## Acceptance And Merge Evidence

On 2026-09-16 the user confirmed `Zmergowane - dalej`. GitHub confirms the owner merged
[PR #5](https://github.com/JakubParol/VibeRails/pull/5) at `2026-09-16T09:49:17Z`, from source
`8a151107f7a36c8d3953c854d083f45a82de4dd1` to merge
`965bc3c0231d2a90c3c2d563ebc1987759130cf0`.

The refreshed main contains the source head and its tree matches it exactly. Earlier focused
verification and independent review remain applicable to unchanged content; PR checks are empty,
not green CI. No delegates remained active during the transition. The confirmed owner action
and user message close acceptance/merge. Step 04 still requires its own scope agreement.

## Navigation

- [Current state](../STATUS.md)
- [Configuration contract](../../standards/configuration.md)
- [Retrospective review](../review-00-02.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
