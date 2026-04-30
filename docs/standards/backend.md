# Backend Standard

This standard applies to Python and FastAPI backend projects. It extends the general
[coding standard](coding.md) and [architecture standard](architecture.md).

## Architecture

Use Clean Architecture, package by feature, and enforce dependencies inward.

```text
feature/
|-- api/
|   |-- router.py
|   |-- schemas.py
|   `-- <entity>.py
|-- application/
|   |-- ports.py
|   `-- <entity>_service.py
|-- domain/
|   `-- models.py
|-- infrastructure/
|   |-- tables.py
|   |-- repositories/
|   |   |-- <entity>.py
|   |   `-- <complex_entity>/
|   |       |-- repository.py
|   |       `-- _helper.py
|   |-- shared/
|   |   |-- sql.py
|   |   |-- mappers.py
|   |   |-- keys.py
|   |   `-- events.py
|   `-- sources/
|       `-- <source>.py
`-- dependencies.py
```

## Layer Responsibilities

| Layer | Does | Does not |
|---|---|---|
| API | Request validation, schema mapping, DI wiring | Business logic, direct DB access |
| Application | Use case orchestration, rules, transactions, ports | Import infrastructure, know HTTP |
| Domain | Invariants, value objects, entity definitions | Import app, API, or infrastructure |
| Infrastructure | DB queries, HTTP clients, queues, SDKs | Business decisions |

Routes never call repositories directly.

## Dependency Injection

- Use constructor injection for services and repositories.
- Use one `dependencies.py` composition root per feature module.
- Wire dependencies as repo factory -> service factory -> route dependency.
- Do not use global service or repository singletons.
- Do not import concrete infrastructure into application or domain code.

## Async And IO

- API endpoints, DB access, and external IO are async by default.
- Blocking or CPU-heavy work runs outside the API request path.
- External calls must define timeouts.

## Persistence

- Application depends on repository ports.
- Infrastructure implements repository ports.
- One repository per entity or aggregate.
- Repositories return domain models or documented read models, never raw rows.
- Raw SQL stays in infrastructure.
- Shared SQL helpers stay inside the module unless multiple modules truly need them.

## Error Handling

- Use one application exception hierarchy.
- Base error should include status code, public message, and error code.
- Standard error types: not found, validation, business rule, conflict.
- One global exception handler converts known errors to the API error envelope.
- Do not use per-route try/catch for known application errors.
- Unhandled exceptions are logged with context and returned as generic 500 responses.

## Response Envelope

All public API responses use a standard shape:

```json
{
  "data": {},
  "meta": {}
}
```

Errors use:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Collections include pagination metadata when relevant.

## Logging

- Use structured JSON logging to stdout.
- No `print()` statements in production code.
- Include request context when available: request id, correlation id, actor id.
- Use a shared logging helper instead of ad-hoc dicts.
- Use `ERROR` for failures requiring attention, `WARNING` for recoverable issues, `INFO`
  for business events, and `DEBUG` for development-only detail.

## Import Boundaries

Use tooling such as `import-linter` where practical.

Rules:

- Application cannot import infrastructure.
- Domain cannot import any outer layer.
- Feature modules cannot import another feature's internals.
- Shared code lives in a documented shared package.

Do not add, widen, or justify `ignore_imports` entries to bypass architecture rules. If an
import boundary fails, fix the dependency direction or stop and report the blocker.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
- [Backend testing standard](backend-testing.md)
