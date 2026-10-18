# Architecture Standard

`minimal` and `layered` both use Clean Architecture; they differ in structure and abstraction
weight, never in permission to mix presentation, business rules and persistence. Pick the smallest
structure that keeps responsibilities clear and testable ([KIS](kis.md)).

## Variant Selection

- Record a user-approved choice in the project's `AGENTS.md` or linked architecture document. A
  standalone area may have its own, with scope and public boundary documented. Target-specific
  constraints still apply. No configuration inheritance engine.
- Unconfigured legacy adoptees keep their layered requirements and exceptions. Never infer
  `minimal` from project size or silently migrate code.
- `configuration.architecture` ([adopted choices](agent-workflow.md#adopted-choices-and-pins))
  records the selected target;
  reconcile it with local decisions at adoption. A target is not a completed migration.

## Core Principles

- Dependencies point inward toward domain policy.
- Domain logic depends on no framework, database, HTTP, queue or UI, colocated or separate.
- Group by feature or bounded context, not generic technical buckets.
- Share code only for multiple genuine consumers.

## Recommended Layers

Roles, not four mandatory packages.

| Layer | Owns | Must not own |
|---|---|---|
| Domain | Entities, value objects, invariants, domain services | IO, framework imports, persistence models |
| Application | Use cases, orchestration, ports, transactions | HTTP details, concrete infrastructure |
| Interface | Routes, controllers, schemas, UI entry points; translates requests into application calls | Business rules, direct persistence |
| Infrastructure | Port implementations: repositories, external clients, database mappings, queues; owns IO details | Business decisions |

## Two Variants

| Concern | minimal | layered |
|---|---|---|
| Application behavior | A cohesive function or small service class. | Use-case/service modules per meaningful responsibility. |
| Dependency contract | Typed callable or small application-owned interface/Protocol, colocated when useful. | Named application ports grouped by capability. |
| Domain | Pure rules and simple values may live with the use case. | Extract rules/models when reuse or invariants justify it; no empty domain package. |
| Infrastructure | Small adapters/functions implementing the contracts. | Explicit repository/adapter modules by feature/aggregate. |
| Wiring | Parameters or constructors composed at an outer edge; no DI container required. | Explicit composition roots; a per-feature dependencies module is a useful default. |

- Both: presentation calls application behavior, never a persistence port or ORM.
- Neither requires an interface per method, class per operation, generic repository, pass-through
  service or DTO copy at every internal boundary. Keep external API contracts separate and
  application/domain values framework-neutral.
- A repository abstraction exists only when persistence does; a domain value object only to
  protect a useful rule.

[Paired example](../templates/architecture-variants.md): the same behavior in both variants.
Language-specific locations are examples, not a new stack profile.

## Dependency Rule

Allowed direction (domain may be colocated in minimal):

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

- A module needing another's capability depends on an explicit interface, public API or shared
  abstraction, never its private implementation.
- Runtime calls may flow use case -> port -> infrastructure implementation, but application code
  never imports the concrete implementation. Only the composition root selects and binds the
  adapter.
- Inject application behavior into a route, not a persistence callback disguised as a use case.

## Separation Of Concerns

One reason to change per unit: routes/controllers = transport; use cases = orchestration; domain
models = invariants; repositories = persistence; adapters = external systems; view models =
presentation mapping; components = UI rendering and interaction. Avoid `utils`, `helpers` and
`common` files unless narrow and documented.

## Testability Rules

- Use cases run without real IO; external dependencies come through ports, injected via
  constructors, function parameters or framework DI.
- Pure functions stay pure; mapping logic is isolated and directly testable.
- No global mutable state or hidden framework dependencies in domain or application code.

## File And Module Boundaries

- Follow the file size limits in [coding.md](coding.md); split by responsibility before a file
  becomes hard to reason about.
- One service or use case module per clear responsibility.
- Repository implementations stay cohesive per entity, aggregate or capability; a function
  suffices for a small port.
- Keep private helpers near their use; share only after real reuse.

## Documentation Per Boundary

Every app, service, package, bounded context and complex feature module documents purpose, public
entry points, dependency rules, local quality gate, test strategy and known integration points,
placed per the selected [documentation bundle](documentation.md#documentation-bundles): explicit
parent coverage may suffice for essential; standard uses local README coverage for significant
folders. Add AGENTS only for local rule differences. Unselected projects keep their existing
policy.

## Architecture Decisions

Use the [ADR template](../templates/adr.md) for decisions that are expensive to reverse or likely
to be questioned:

```text
docs/architecture/adr/
|-- 0001-use-clean-architecture.md
|-- 0002-use-postgresql-for-integration-tests.md
```

## When To Expand And How To Migrate

Expand when several entry points share rules, domain invariants become substantial, adapters vary
independently or a feature boundary is hard to understand; file count, project age or a new preset
alone is not a reason.

1. Agree the affected area, intended variant and unchanged public behavior.
2. Capture behavior and adapter evidence; identify the actual dependency violations.
3. Extract shared pure rules only where useful; keep presentation and persistence separate.
4. Move contracts/adapters and centralize wiring incrementally, keeping a stable public entry
   point per move; no whole-project rewrite.
5. Check affected behavior and import boundaries with existing tools
   ([quality-gate.md](quality-gate.md)). Keep required guards; never suppress imports or weaken
   tests to pass.
6. Record what is migrated and the remaining gaps; claim compliance only for that scope.

Do not automatically flatten a useful layered design when `minimal` is requested; keep its
project-specific benefits and agree any simplification explicitly.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Documentation standard](documentation.md)
- [Backend standard](backend.md)
- [Frontend standard](frontend.md)
- [Configuration design](configuration.md)
- [Paired architecture example](../templates/architecture-variants.md)
