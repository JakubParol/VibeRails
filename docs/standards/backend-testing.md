# Backend Testing Standard

This standard applies to backend tests. It extends [coding.md](coding.md),
[architecture.md](architecture.md), and [backend.md](backend.md).

## Test Types

| Type | Scope | IO | Purpose |
|---|---|---|---|
| Unit | Domain and pure application logic | None | Prove rules and transformations quickly. |
| Service | Application use cases with fake ports | Fakes only | Prove orchestration without real infrastructure. |
| Integration | Repositories, adapters, routes, DB behavior | Real infrastructure | Prove infrastructure contracts and wiring. |
| Contract | API request and response shapes | Usually HTTP test client | Prove public API envelopes and validation. |

Test doubles are allowed through ports. Monkey-patching production internals is not.

## Database Integration Tests

When persistence correctness matters, use real PostgreSQL via Testcontainers.

Default session flow:

```text
Session start -> PostgreSQL container -> migrations to head
Each test     -> truncate tables and restart identities
Session end   -> destroy container
```

Rules:

- PostgreSQL only for backend integration tests.
- No SQLite, aiosqlite, or in-memory database substitutes.
- Tests use the same repository and session path as production.
- Seed through SQL helpers or repository setup, not unrelated API calls.
- Each test starts from a clean database state.

## Fixture Pattern

Recommended root fixtures:

| Fixture | Scope | Purpose |
|---|---|---|
| `database_url` | session | Start container, run migrations, yield URL. |
| `_configure_database` | session | Configure settings and dispose engines on teardown. |
| `_reset_database` | function | Truncate all tables before each test. |
| `restore_schema` | function | Rebuild schema after tests that modify DDL. |

Recommended support helpers:

| Helper | Use |
|---|---|
| `pg_connect(url)` | Sync PostgreSQL connection for seeding and assertions. |
| `run_script(url, sql)` | Execute multi-statement seed SQL. |
| `execute_query(url, sql, params)` | Execute one query and return rows. |
| `truncate_all_tables(url, table_names)` | Fast cleanup with cascade and identity restart. |

## Test Layout

```text
tests/
|-- conftest.py
|-- test_health.py
|-- <feature>/
|   |-- conftest.py
|   `-- test_<entity>_routes.py
`-- support/
    |-- postgres_compat.py
    `-- runtime.py
```

Feature-level `conftest.py` files may seed baseline data for that feature. Keep test support
helpers under `tests/support/`.

## Writing Tests

Integration route test:

```python
def test_create_entity(client) -> None:
    response = client.post("/v1/entities", json={"name": "Example"})

    assert response.status_code == 201
    assert response.json()["data"]["name"] == "Example"
```

DB side-effect assertion:

```python
def test_create_entity_writes_audit_event(client, database_url) -> None:
    response = client.post("/v1/entities", json={"name": "Example"})
    entity_id = response.json()["data"]["id"]

    with pg_connect(database_url) as conn:
        row = conn.execute(
            "select entity_id from activity_log where entity_id = %s",
            [entity_id],
        ).fetchone()

    assert row is not None
```

Tests that modify schema must request `restore_schema`:

```python
def test_rollback_when_audit_table_is_missing(client, database_url, restore_schema) -> None:
    with pg_connect(database_url) as conn:
        conn.execute("drop table activity_log")
        conn.commit()

    response = client.post("/v1/entities", json={"name": "Example"})

    assert response.status_code == 500
```

## Rules

- One behavior per test.
- Multiple assertions are fine when they describe one behavior.
- No test depends on state from a previous test.
- Use `%s` placeholders for PostgreSQL query parameters.
- Pass query params as lists unless the local helper documents another convention.
- API assertions must respect the response envelope.
- Avoid sleeping in tests. Prefer deterministic synchronization or direct state checks.

## Running Tests

Each project should document exact commands. Recommended defaults:

```bash
cd services/api
python -m pytest tests/ -q
python -m pytest tests/<feature>/ -q
python -m pytest tests/<feature>/test_<entity>_routes.py::test_create_entity -q
```

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
- [Backend standard](backend.md)
