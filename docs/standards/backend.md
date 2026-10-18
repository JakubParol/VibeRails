# Backend Standard

For Python/FastAPI backends. Extends the [coding standard](coding.md) and
[architecture standard](architecture.md).

## Architecture

Use the [selected architecture variant](architecture.md#variant-selection), package by feature,
enforce dependencies inward. Both variants keep the responsibilities below. Legacy adoptees without
an explicit variant keep the layered default.

Minimal feature (no separate domain or ports package):

```text
feature/
|-- api.py             # calls a bound application operation
|-- application.py     # use case, pure rules, small callable/Protocol contracts
|-- infrastructure.py  # adapters; persistence and external IO
`-- dependencies.py    # optional location for edge wiring; app wiring may serve small features
```

Layered feature (roles, not scaffolding: create only modules with a real responsibility):

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

Roles follow [architecture.md](architecture.md#recommended-layers); the API layer is the Interface
layer: request validation, schema mapping, DI wiring, no business logic or direct DB access.
Routes never call repositories directly.

## Layer Definition Of Done

Check each changed file against its layer's list before committing; fix any miss first.

Endpoint (router function) is done when:

- it only validates input, maps schemas and calls an application entry point (function or method);
- it has no branching on domain state and computes no derived business values;
- it takes no repository, session or SQL dependency;
- it maps known failures through the shared exception handler, not per-route try/except.

Application service is done when:

- it orchestrates against ports, not concrete infrastructure;
- every dependency arrives via parameters or a constructor from an outer composition root;
- persistence, HTTP, queue and SDK calls stay behind ports;
- expected failures raise typed application/domain errors.

Repository/adapter is done when:

- it implements an application-layer port;
- it returns what the port contract says: plain values/domain/read models, or an acknowledgement
  or nothing for a write-only operation; never ORM objects or raw driver rows;
- it makes no business decisions;
- raw SQL stays inside it or in module-local SQL helpers.

Variants follow [Two Variants](architecture.md#two-variants): in minimal a typed callable is a
port and a function can implement it, with no class or separate `ports.py` required. Both variants
keep ORM models out of application code.

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

Right - the rule lives outside the route. A service class is one valid style; a bound use-case
function is another ([paired examples](../templates/architecture-variants.md)):

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

- Wiring follows [Two Variants](architecture.md#two-variants): ordinary parameters or constructors,
  no generic DI container. Framework DI may bind the application operation at the interface edge.
- Wire adapter -> application operation -> route dependency; the route receives the bound use case,
  never a repository, ORM session or save callback.
- No global service or repository singletons.

## Async And IO

- API endpoints, DB access and external IO are async by default.
- Blocking or CPU-heavy work runs outside the API request path.
- External calls define timeouts.

## Persistence

Repository cohesion follows [architecture.md](architecture.md#file-and-module-boundaries). Shared
SQL helpers stay module-local unless multiple modules truly need them.

## Error Handling

- Small, typed, framework-neutral application/domain errors. Share a base only where it helps
  handling, not to build an empty hierarchy.
- Errors may carry an application code, safe message and details. HTTP status belongs to the
  interface handler.
- Standard types: not found, validation, business rule, conflict.
- One global handler maps known error types/codes to HTTP status and the API envelope, preserving
  externally visible status/envelope behavior when relocating the mapping.
- Unhandled exceptions are logged with context and returned as generic 500 responses.

## Response Envelope

All public API responses use this shape:

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

- Structured JSON to stdout through a shared logging helper, not ad-hoc dicts. No `print()` in
  production code.
- Include request id, correlation id and actor id when available.
- `ERROR` failures needing attention, `WARNING` recoverable issues, `INFO` business events, `DEBUG`
  development-only detail.

## Import Boundaries

`import-linter` contracts are required for FastAPI projects: prose does not stop shortcuts, so the
gate must fail on a wrong import direction.

- Application never imports infrastructure; domain never imports an outer layer.
- Features never import another feature's internals; shared code lives in a documented shared
  package.

Minimal features: check the actual flat module names, with no invented domain package. Keep wiring
outside `application`; imports through wiring also violate the rule.

```ini
[importlinter]
root_package = app

[importlinter:contract:application-independent]
name = Minimal application does not import infrastructure or API
type = forbidden
source_modules =
    app.<feature>.application
forbidden_modules =
    app.<feature>.infrastructure
    app.<feature>.api
```

Layered features with a domain package: layer rule plus infrastructure rule (fully qualified names,
no `containers` prefix):

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

[importlinter:contract:application-independent]
name = Inner layers do not import infrastructure
type = forbidden
source_modules =
    app.<feature>.application
    app.<feature>.domain
forbidden_modules =
    app.<feature>.infrastructure
```

Adapt contracts to real modules and keep existing checks. The excerpts are not a full guard: also
keep checks for forbidden framework/ORM imports and cross-feature internals. Selecting a variant
never removes import enforcement. Syntax:
[forbidden](https://import-linter.readthedocs.io/en/latest/contract_types/forbidden/),
[layers](https://import-linter.readthedocs.io/en/v2.11/contract_types/layers/).

Never add, widen or justify `ignore_imports` entries to bypass architecture rules. On a failing
boundary, fix the dependency direction or stop and report the blocker.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
- [Backend testing standard](backend-testing.md)
