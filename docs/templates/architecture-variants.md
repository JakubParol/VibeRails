# The Same Behavior In Two Architecture Variants

Illustration: create a note, trim its title, reject a blank title before saving, and return the
normalized value. Both variants keep presentation -> application -> application-owned contract
-> adapter. The outer composition root binds the adapter; presentation receives a complete
application operation, not a persistence dependency.

The blocks are executable, compact illustrations of responsibilities, shown together for easy
comparison. Split at the role comments into the indicated modules when adopting; add the normal
imports for that layout. They are not a complete FastAPI/Next.js app or a packaged import-guard
fixture. Memory adapters are unit-test doubles, not proof of database integration. Real IO
still follows the backend's async, timeout, error-mapping and persistence-testing rules.

## Minimal

Suggested roles: `application.py`, `api.py`, `infrastructure.py`, and outer wiring (for example
`dependencies.py`, or an existing app composition module). The callable port lives beside the
use case. No domain package or DI container is required for this one small rule.

```python
from collections.abc import Callable

# application.py: contracts and pure application behavior
SaveTitle = Callable[[str], None]
CreateNote = Callable[[str], str]

class InvalidTitle(ValueError):
    pass

def create_note(raw_title: str, save: SaveTitle) -> str:
    title = raw_title.strip()
    if not title:
        raise InvalidTitle("title is required")
    save(title)
    return title

# api.py: already-decoded input and output mapping only
def post_note(payload: dict[str, str], create: CreateNote) -> dict[str, object]:
    return {"data": {"title": create(payload["title"])}, "meta": {}}

# infrastructure.py: test adapter, no shared global state
class MemoryNotes:
    def __init__(self) -> None:
        self.titles: list[str] = []

    def save(self, title: str) -> None:
        self.titles.append(title)

# outer composition: the only place selecting a concrete adapter
def build_example() -> tuple[CreateNote, MemoryNotes]:
    notes = MemoryNotes()
    return lambda raw: create_note(raw, notes.save), notes
```

Application code knows only `SaveTitle`. A real storage function with the same contract can
replace the test adapter at the outer edge. The route never passes a save function into business
code; that binding already happened in `build_example`.

## Layered

Suggested roles: `domain/title.py`, `application/ports.py`, `application/notes.py`,
`api/router.py`, `infrastructure/notes.py`, and `dependencies.py`. Here the title invariant is
assumed to be shared by several entry points, which justifies a domain value. Without that need,
do not add the value object solely to imitate this example.

```python
from collections.abc import Callable
from dataclasses import dataclass
from typing import Protocol

# domain/title.py: transport-neutral, reusable invariant
class InvalidTitle(ValueError):
    pass

@dataclass(frozen=True)
class NoteTitle:
    value: str

    def __post_init__(self) -> None:
        normalized = self.value.strip()
        if not normalized:
            raise InvalidTitle("title is required")
        object.__setattr__(self, "value", normalized)

# application/ports.py: named application-owned dependency contract
class NoteWriter(Protocol):
    def save(self, title: NoteTitle) -> None: ...

# application/notes.py: orchestration against the port
CreateNote = Callable[[str], str]

class NoteService:
    def __init__(self, notes: NoteWriter) -> None:
        self._notes = notes

    def create(self, raw_title: str) -> str:
        title = NoteTitle(raw_title)
        self._notes.save(title)
        return title.value

# api/router.py: same presentation contract
def post_note(payload: dict[str, str], create: CreateNote) -> dict[str, object]:
    return {"data": {"title": create(payload["title"])}, "meta": {}}

# infrastructure/notes.py: unit-test adapter satisfying NoteWriter
class MemoryNotes:
    def __init__(self) -> None:
        self.titles: list[str] = []

    def save(self, title: NoteTitle) -> None:
        self.titles.append(title.value)

# dependencies.py: explicit composition root
def build_example() -> tuple[CreateNote, MemoryNotes]:
    notes = MemoryNotes()
    return NoteService(notes).create, notes
```

The visible result is identical. Layered makes the shared invariant, named port and service
explicit; it does not improve correctness merely by adding files. ORM types never cross the
port, and the domain value has no HTTP status or framework dependency.

## Mapping To Current Stacks

In FastAPI, a dependency provider returns the bound function or service operation; the endpoint
receives it through framework DI. Transport schemas and the global error handler remain at the
API edge. They validate/decode input and map `InvalidTitle` to the agreed HTTP response; neither
snippet implements or tests that HTTP layer.

In Next.js full stack, outer composition injects the client/repository contract into application
behavior; the route handler/server action receives and invokes the bound application operation.
In frontend-only work, use the existing API client/hooks instead of duplicating the backend domain.
Never pass non-serializable service objects through a server/client component boundary. See
[frontend.md](../standards/frontend.md).

## Focused Behavior Check

Run at the standards repository root with Python 3.9+ (standard library only). It checks the
actual snippets for normalized output/storage, rejection without a write, and a failing injected
port. It does not prove real HTTP, database behavior, typing, or the target's package imports.

```bash
python3 - <<'PY'
import re
from pathlib import Path

text = Path("docs/templates/architecture-variants.md").read_text()
sources = re.findall(r"```python\n(.*?)\n```", text, re.S)
assert len(sources) == 2
for source in sources:
    ns = {}
    exec(compile(source, "architecture-example", "exec"), ns)
    create, notes = ns["build_example"]()
    expected = {"data": {"title": "Launch plan"}, "meta": {}}
    assert ns["post_note"]({"title": "  Launch plan  "}, create) == expected
    assert notes.titles == ["Launch plan"]
    try:
        ns["post_note"]({"title": " \t "}, create)
    except ns["InvalidTitle"]:
        pass
    else:
        raise AssertionError("blank title accepted")
    assert notes.titles == ["Launch plan"], "invalid input reached storage"

    def fail_save(value):
        raise OSError("storage unavailable")

    class FailingWriter:
        save = staticmethod(fail_save)

    try:
        if "NoteService" in ns:
            ns["NoteService"](FailingWriter()).create("valid")
        else:
            ns["create_note"]("valid", fail_save)
    except OSError as exc:
        assert str(exc) == "storage unavailable"
    else:
        raise AssertionError("injected storage failure was hidden or bypassed")
print("Both variants: behavior checks passed")
PY
```

## Navigation

- [Architecture and migration rules](../standards/architecture.md)
- [Backend standard](../standards/backend.md)
- [Backend testing standard](../standards/backend-testing.md)
- [Documentation index](../INDEX.md)
