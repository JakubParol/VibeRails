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

## Layer Definition Of Done

Self-verify every changed file against the checklist for its layer before committing. A miss
is not a style nit; fix it before the commit.

Endpoint (router function) is done when:

- it only validates input, maps schemas, and calls one application service method;
- it contains no branching on domain state and computes no derived business values;
- it takes no repository, session, or SQL dependency;
- it maps known failures through the shared exception handler, not per-route try/except.

Application service is done when:

- it orchestrates the use case against ports, not concrete infrastructure;
- every dependency arrives through the constructor from `dependencies.py`;
- persistence, HTTP, queue, and SDK calls happen behind ports it depends on;
- expected failures raise typed application errors.

Repository is done when:

- it implements a port defined in the application layer;
- it returns domain models or documented read models, never raw rows;
- it contains no business decisions;
- raw SQL stays inside it or in module-local SQL helpers.

## Shortcut Examples

Logic in the endpoint - wrong:

```python
@router.post("/orders")
async def create_order(payload: OrderIn, repo: OrderRepo = Depends(get_repo)):
    if payload.total > 10_000 and not payload.approved_by:
        raise HTTPException(422, "approval required")
    order = Order(**payload.dict(), status="pending")
    return await repo.save(order)
```

Right - the rule lives in the service, the route stays transport-only:

```python
@router.post("/orders")
async def create_order(payload: OrderIn, service: OrderService = Depends(get_order_service)):
    order = await service.create_order(payload.to_command())
    return OrderOut.from_domain(order)
```

Inline dependency construction - wrong:

```python
async def create_order(self, command: CreateOrder) -> Order:
    repo = OrderRepository(get_session())
    ...
```

Right - dependencies are injected once through the composition root:

```python
def __init__(self, orders: OrderRepositoryPort) -> None:
    self._orders = orders
```

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

`import-linter` contracts are required for FastAPI projects. Prose rules alone do not stop
shortcuts; the gate must fail on a wrong import direction.

Rules:

- Application cannot import infrastructure.
- Domain cannot import any outer layer.
- Feature modules cannot import another feature's internals.
- Shared code lives in a documented shared package.

Template contract for a feature module (adapt package names):

```ini
[importlinter]
root_package = app

[importlinter:contract:feature-layers]
name = Feature layers point inward
type = layers
layers =
    app.<feature>.api
    app.<feature>.application
    app.<feature>.domain
containers =
    app

[importlinter:contract:application-independent]
name = Application does not import infrastructure
type = forbidden
source_modules =
    app.<feature>.application
    app.<feature>.domain
forbidden_modules =
    app.<feature>.infrastructure
```

Do not add, widen, or justify `ignore_imports` entries to bypass architecture rules. If an
import boundary fails, fix the dependency direction or stop and report the blocker.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
- [Backend testing standard](backend-testing.md)
