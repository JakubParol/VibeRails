# Stage 03 - Architecture Variants

## Proposed Goal

Define `minimal` and `layered` as two sizes of Clean Architecture, preserving the same essential
responsibility and dependency boundaries while reducing unnecessary structure in small projects.

## Scope Proposal

Scope revision: `architecture-1`. Awaiting user agreement.

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

Proposed output: canonical variant rules, a short comparison, small concrete examples, and a
practical upgrade path. Avoid creating a sample application, generic DI framework or validator
engine merely to demonstrate the rules.

Out of scope: verification-policy implementation (4), broad documentation cleanup (5), provider
or routing engines (6-7), adoption/migration automation (8), telemetry/CI/CD/kanban and new stacks.
The 15 Astra sources remain deferred.

## Proposed Acceptance Criteria

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
- This authorizes branch/checkpoint preparation and discussion, not yet `architecture-1` work.
- Key proposed decision to confirm: retain application-owned ports/contracts and inward
  dependencies in both variants; vary physical structure and abstraction weight instead.
- No architecture implementation/design assignment is dispatched before scope agreement.

## Delivery And Verification

Branch: `codex/refactor-03-architecture`, created from accepted main
`8c1ac9119f908323879a7a542d924a2828899369`. The completed review checkpoint `ea6e446` was carried
as commit `d131a62`; publish it with this stage's eventual PR instead of a separate review PR.
No stage PR or architecture changes exist yet. Current state is in [STATUS](../STATUS.md).

## Navigation

- [Current state](../STATUS.md)
- [Configuration contract](../../standards/configuration.md)
- [Retrospective review](../review-00-02.md)
- [Refactor plan](../../refactor-plan.md)
- [Documentation index](../../INDEX.md)
