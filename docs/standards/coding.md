# Coding Standard

These standards apply to all code projects unless a project-specific document adds stricter
rules. Project-specific documents may adapt commands and paths, but not weaken quality
expectations without an explicit exception.

## Required Reading By Work Type

Before changing code, read:

1. [agent-workflow.md](agent-workflow.md)
2. [change-protocol.md](change-protocol.md)
3. [quality-gate.md](quality-gate.md)
4. [architecture.md](architecture.md)
5. this document
6. the stack-specific standard for the files being changed
7. the nearest local `README.md` or `AGENTS.md`

Stack-specific standards:

- Backend: [backend.md](backend.md)
- Backend testing: [backend-testing.md](backend-testing.md)
- Frontend: [frontend.md](frontend.md)

## Quality Gate

Every code project must document a quality gate in its root `AGENTS.md`, `README.md`, or a
linked quality gate document. Follow [quality-gate.md](quality-gate.md) for required areas and
stack defaults.

Rules:

- Linting must finish with zero warnings and zero errors.
- Tests required for the touched area must pass.
- Type checking is mandatory for typed languages.
- Do not hide issues with suppression comments or weakened config.
- If the quality gate is missing, stop and report a blocker.

## Git Workflow

Follow [change-protocol.md](change-protocol.md) for branch setup, pull, commit, push, PR, and
review-loop rules. Do not duplicate local git workflow rules here unless they are stricter than
the change protocol.

## Code Quality

- Use explicit types at public boundaries.
- Use DTOs or schemas for API input and output.
- Keep internal models separate from external contracts.
- Name modules by intent, not by vague categories.
- Keep functions small enough to understand without scrolling through unrelated concerns.
- Extract shared code only when there are real consumers.
- Prefer clear duplication over premature abstraction.
- Make configuration explicit through typed settings objects.

## File Size And Splitting

- Hard limit: 400 lines per source file unless the project documents a stricter limit.
- If a file approaches the limit, split by responsibility.
- One repository class per file.
- One service, use case, or component responsibility per file.
- Group related files into subdirectories when a folder becomes hard to scan.

## Error Handling

- Convert expected domain and application failures into typed errors.
- Do not catch and ignore exceptions silently.
- Log enough context to debug failures without leaking secrets.
- External calls must have timeouts.
- API errors must use a documented response shape.

## Security And Data

- Never log secrets, tokens, credentials, or raw personal data.
- Validate input at boundaries.
- Keep authorization checks explicit and close to use cases.
- Treat migrations, destructive operations, and data repair scripts as high-risk changes.

## Testing

- Test behavior, not implementation details.
- Prefer the lowest test level that proves the behavior.
- Domain and application tests should avoid real IO.
- Infrastructure behavior should be tested with real adapters where correctness depends on them.
- No monkey-patching production internals to make tests pass.

## Navigation

- [Documentation index](../INDEX.md)
- [Change protocol](change-protocol.md)
- [Quality gate](quality-gate.md)
- [Architecture standard](architecture.md)
- [Backend standard](backend.md)
- [Frontend standard](frontend.md)
