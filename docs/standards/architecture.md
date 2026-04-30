# Architecture Standard

Projects use Clean Architecture, separation of concerns, explicit boundaries, and testability
as defaults. The goal is code that agents and humans can change safely without loading the
entire system into context.

## Core Principles

- Dependencies point inward toward domain policy.
- Domain logic does not depend on frameworks, databases, HTTP, queues, or UI.
- Application code orchestrates use cases and depends on ports, not infrastructure.
- Infrastructure implements ports and owns IO details.
- Interface layers translate external requests into application calls.
- Modules are grouped by feature or bounded context, not by generic technical buckets.
- Shared code exists only when multiple consumers genuinely need it.

## Recommended Layers

| Layer | Owns | Must not own |
|---|---|---|
| Domain | Entities, value objects, invariants, domain services | IO, framework imports, persistence models |
| Application | Use cases, orchestration, ports, transactions | HTTP details, concrete infrastructure |
| Interface | Routes, controllers, schemas, UI entry points | Business rules, direct persistence |
| Infrastructure | Repositories, external clients, database mappings, queues | Business decisions |

## Dependency Rule

Allowed direction:

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

- Prefer files under 400 lines.
- Split by responsibility before a file becomes hard to reason about.
- One repository class per entity or aggregate.
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

Use folder-level `README.md` for human context and `AGENTS.md` for local agent rules.

## Architecture Decisions

Use an ADR when a decision is expensive to reverse or likely to be questioned later.

Suggested location:

```text
docs/architecture/adr/
|-- 0001-use-clean-architecture.md
|-- 0002-use-postgresql-for-integration-tests.md
```

Each ADR should state context, decision, consequences, and status.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Documentation standard](documentation.md)
- [Backend standard](backend.md)
- [Frontend standard](frontend.md)
