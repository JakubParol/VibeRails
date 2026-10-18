# Backend Testing Standard

For backend tests. Extends [coding.md](coding.md), [architecture.md](architecture.md) and
[backend.md](backend.md).

## Test Types

| Type | Scope | IO | Purpose |
|---|---|---|---|
| Unit | Domain and pure application logic | None | Prove rules and transformations quickly. |
| Service | Application use cases with fake ports | Fakes only | Prove orchestration without real infrastructure. |
| Integration | Repositories, adapters, routes, DB behavior | Real infrastructure | Prove infrastructure contracts and wiring. |
| Contract | API request and response shapes | Usually HTTP test client | Prove public API envelopes and validation. |

Test doubles are allowed through ports. Monkey-patching production internals is not.

## Database Integration Tests

When persistence correctness matters, test the real production database technology through the
production repository/session path, with relevant migrations and isolated data. Unit/service
doubles through ports do not establish infrastructure correctness.

For PostgreSQL projects, PostgreSQL via Testcontainers is the default example below. Never use
SQLite or an in-memory substitute as evidence for production PostgreSQL behavior. For another
production engine, use that engine and its real adapter; do not add a second database to a small
project just to follow this example.

```text
Session start -> PostgreSQL container -> migrations to head
Each test     -> truncate tables and restart identities
Session end   -> destroy container
```

Seed through SQL helpers or repository setup, not unrelated API calls; each test starts from a
clean database.

## Fixture Pattern

Recommended root fixtures (PostgreSQL example):

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

## PostgreSQL Example Test Layout

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

Feature-level `conftest.py` may seed that feature's baseline data. Keep support helpers under
`tests/support/`.

## Writing Tests

Integration route test:

```python
def test_create_entity(client) -> None:
    response = client.post("/v1/entities", json={"name": "Example"})

    assert response.status_code == 201
    assert response.json()["data"]["name"] == "Example"
```

PostgreSQL DB side-effect assertion:

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

Schema-modifying tests restore the schema through the production engine's fixture or isolation
mechanism (PostgreSQL example: `restore_schema`):

```python
def test_rollback_when_audit_table_is_missing(client, database_url, restore_schema) -> None:
    with pg_connect(database_url) as conn:
        conn.execute("drop table activity_log")
        conn.commit()

    response = client.post("/v1/entities", json={"name": "Example"})

    assert response.status_code == 500
```

## Test Rules

Many tests are welcome; meaningless tests are defects. Every new test:

- can fail for a real behavioral reason; if production code can break without it failing, it
  proves nothing;
- has no mock-echo assertion (a mock called with the values the test just passed in) without an
  observable outcome also asserted;
- does not test the framework: serialization defaults, ORM basics, library behavior the project
  does not own;
- proves a behavior no existing test proves;
- is named for the behavior and expected outcome, not the method;
- asserts the response envelope, persisted state or returned domain values, never internal call
  order or private attributes.

Also:

- One behavior per test; several assertions are fine when they describe it.
- No test depends on state from a previous test.
- PostgreSQL helpers above: `%s` placeholders and list parameters unless the local helper documents
  another convention; other engines use native binding.
- API assertions respect the response envelope.
- No sleeping; use deterministic synchronization or direct state checks.

## Running Tests

Each project documents exact commands. Defaults:

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
