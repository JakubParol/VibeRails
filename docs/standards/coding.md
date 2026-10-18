# Coding Standard

Applies to all code projects. Project documents may adapt commands and paths or add stricter
rules; weakening quality expectations needs an explicit exception.
[agent-workflow.md](agent-workflow.md) selects which rules to read; this document owns coding
constraints only.

## Quality Gate

Document the gate in root `AGENTS.md`, `README.md` or a linked document, per
[quality-gate.md](quality-gate.md).

- Lint finishes with zero warnings and zero errors.
- Tests required for the touched area pass.
- Typed languages keep type checking; broad type checks run in PR CI.
- No suppression comments or weakened config to hide issues.
- Missing commands or CI: see [quality-gate.md](quality-gate.md#missing-gate-or-ci).

## Git Workflow

Follow [change-protocol.md](change-protocol.md) for branch, pull, commit, push, PR and review-loop
rules; repeat them here only if stricter.

## Code Quality

- Explicit types at public boundaries.
- DTOs or schemas for API input and output; internal models stay separate from external contracts.
- Name modules by intent, not vague categories.
- Keep functions small enough to read without scrolling through unrelated concerns.
- Extract shared code only for real consumers; prefer clear duplication over premature abstraction
  ([KIS](kis.md)).
- Make configuration explicit through typed settings objects.

## File Size And Splitting

- Hard limit: 400 lines per source file unless the project documents a stricter limit.
- Split by responsibility when a file approaches the limit.
- One service, use case or component responsibility per file.
- Repository and adapter cohesion: [architecture.md](architecture.md#file-and-module-boundaries).
- Group related files into subdirectories when a folder is hard to scan.

## Error Handling

- Convert expected domain and application failures into typed errors.
- Never catch and silently ignore exceptions.
- Log enough context to debug without leaking secrets.
- External calls have timeouts.
- API errors use a documented response shape.

## Security And Data

- Never log secrets, tokens, credentials or raw personal data.
- Validate input at boundaries.
- Keep authorization checks explicit and close to use cases.
- Treat migrations, destructive operations and data repair scripts as high-risk.

## Testing

- Test behavior, not implementation details, at the lowest level that proves it.
- Domain and application tests avoid real IO; test infrastructure with real adapters where
  correctness depends on them.
- No monkey-patching production internals to make tests pass.

## Navigation

- [Documentation index](../INDEX.md)
- [Change protocol](change-protocol.md)
- [Quality gate](quality-gate.md)
- [Architecture standard](architecture.md)
- [Backend standard](backend.md)
- [Frontend standard](frontend.md)
