# Architecture Standard

Both `minimal` and `layered` use Clean Architecture. They differ in physical structure and
abstraction weight, not in permission to mix presentation, business rules and persistence.
Choose the smallest structure that makes the actual responsibilities clear and testable.

## Variant Selection

Use an explicit architecture decision in the owning project's existing `AGENTS.md` or linked
architecture document. A standalone area may have its own explicit decision; document its
scope and public boundary. Do not add a configuration inheritance engine.

Unconfigured legacy adoptees keep their previous layered requirements and explicit exceptions.
Do not infer `minimal` from project size or silently migrate existing code. A user-approved,
documented project decision may select a variant; target-specific constraints still apply.
The future `configuration.architecture` field is defined in [configuration.md](configuration.md),
but its automated adoption/activation remains deferred to refactor step 07. Recording that field
alone does not select or implement a migration today.

## Core Principles

- Dependencies point inward toward domain policy.
- Domain logic does not depend on frameworks, databases, HTTP, queues, or UI, whether it lives
  in a small application module or a separate domain package.
- Application code orchestrates use cases and depends on ports, not infrastructure.
- Infrastructure implements ports and owns IO details.
- Interface layers translate external requests into application calls.
- Modules are grouped by feature or bounded context, not by generic technical buckets.
- Shared code exists only when multiple consumers genuinely need it.

## Recommended Layers

These are responsibility roles, not a requirement to create four packages in every project.

| Layer | Owns | Must not own |
|---|---|---|
| Domain | Entities, value objects, invariants, domain services | IO, framework imports, persistence models |
| Application | Use cases, orchestration, ports, transactions | HTTP details, concrete infrastructure |
| Interface | Routes, controllers, schemas, UI entry points | Business rules, direct persistence |
| Infrastructure | Repositories, external clients, database mappings, queues | Business decisions |

## Two Variants

| Concern | minimal | layered |
|---|---|---|
| Application behavior | A cohesive function or small service class. | Explicit use-case/service modules for meaningful responsibilities. |
| Dependency contract | A typed callable or small application-owned interface/Protocol, colocated when useful. | Named application ports, grouped by the capability they expose. |
| Domain | Pure rules and simple values may live with the use case. | Extract domain rules/models when reuse or invariants justify it; no empty domain package. |
| Infrastructure | Small adapters/functions implementing the required contracts. | Explicit repository/adapter modules, organized by feature/aggregate. |
| Wiring | Parameters or constructors, composed at an outer edge; no DI container required. | Explicit composition roots; a per-feature dependencies module is a useful default. |
| Presentation | Calls application behavior, never a persistence port or ORM directly. | The same boundary. |

Neither variant requires an interface per method, class per operation, generic repository,
pass-through service, or DTO copy at every internal boundary. Retain separate external API
contracts and framework-neutral application/domain values. A repository abstraction exists
only when persistence exists; a domain value object exists because it protects a useful rule.

See [the paired example](../templates/architecture-variants.md) for the same behavior in both
variants. Language-specific locations are examples, not a new stack profile.

## Dependency Rule

Allowed code dependency direction (domain may be colocated in minimal):

```text
Interface -> Application -> Domain
Infrastructure -> Application -> Domain
```

Forbidden direction:

```text
Domain -> Application
Domain -> Infrastructure
Application -> Infrastructure
Feature A -> Feature B internals
```

If one module needs a capability from another module, depend on an explicit interface, public
API, or shared abstraction. Do not import another module's private implementation.

Runtime calls may go from a use case through its port to an infrastructure implementation.
That does not permit an application import of the concrete implementation. The composition
root alone selects and binds the adapter. Inject application behavior into a route, rather
than handing the route a persistence callback disguised as a use case.

## Separation Of Concerns

Each unit should have one reason to change:

- routes/controllers handle transport concerns
- use cases handle orchestration
- domain models handle invariants
- repositories handle persistence
- adapters handle external systems
- view models handle presentation mapping
- components handle UI rendering and interaction

Avoid files named `utils`, `helpers`, or `common` unless their purpose is narrow and documented.

## Testability Rules

- Design use cases so they can be tested without real IO.
- Inject dependencies through constructors, function parameters, or framework DI.
- Use ports for external dependencies.
- Keep pure functions pure.
- Keep mapping logic isolated and directly testable.
- Avoid global mutable state.
- Avoid hidden framework dependencies in domain or application code.

## File And Module Boundaries

- Follow the file size limits in [coding.md](coding.md).
- Split by responsibility before a file becomes hard to reason about.
- Keep repository implementations cohesive around an entity, aggregate or capability; use
  a function when it fulfills a small port without needing a class.
- One service or use case module per clear responsibility.
- Keep private helpers near the code that uses them.
- Promote helpers to shared modules only after real reuse exists.

## Documentation Per Boundary

Every app, service, package, bounded context, and complex feature module must document:

- purpose
- public entry points
- dependency rules
- local quality gate
- test strategy
- known integration points

Locate that information according to the selected [documentation bundle](documentation.md#documentation-bundles):
explicit parent coverage may suffice for essential; standard uses local README coverage for
significant folders. Preserve required facts in either location and add AGENTS only for local
rule differences. Unselected projects retain their existing documentation policy.

## Architecture Decisions

Use an ADR when a decision is expensive to reverse or likely to be questioned later.

Suggested location:

```text
docs/architecture/adr/
|-- 0001-use-clean-architecture.md
|-- 0002-use-postgresql-for-integration-tests.md
```

Each ADR should state context, decision, consequences, and status.

## When To Expand And How To Migrate

Expand structure when several entry points share rules, domain invariants become substantial,
adapters vary independently, or a feature boundary becomes difficult to understand. File count,
project age or a new preset alone does not prove that more layers help.

1. Agree the affected feature/area, intended variant and unchanged public behavior.
2. Capture relevant behavior and adapter evidence; identify the actual dependency violations.
3. Extract shared pure rules only where useful, keeping presentation and persistence separate.
4. Move existing contracts/adapters and centralize wiring incrementally; keep a stable public
   entry point during each move rather than rewriting the whole project.
5. Check the affected behavior and import boundaries using existing project tools. Preserve
   required guards; do not suppress imports or weaken tests to make the migration pass.
6. Record what is actually migrated and any remaining gaps. Only then claim compliance for
   that scope; a target selection and completed migration are different facts.

Do not automatically flatten an already useful layered design when `minimal` is requested.
Keep project-specific benefits and agree any simplification explicitly. Gate execution policy,
adoption automation and routing remain owned by their own standards/refactor stages.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Documentation standard](documentation.md)
- [Backend standard](backend.md)
- [Frontend standard](frontend.md)
- [Configuration design](configuration.md)
- [Paired architecture example](../templates/architecture-variants.md)
