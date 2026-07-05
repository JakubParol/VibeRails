# Stack Profiles Standard

Use the closest stack profile when adopting standards or deciding which documents and quality
gates apply.

## Next.js Frontend Only

Use when Next.js owns UI only and calls an external or separately managed API.

Required standards:

- `frontend.md`
- `architecture.md`
- `coding.md`
- `quality-gate.md`

Default quality gate:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Document API ownership in the project README. Do not add backend standards unless backend code
lives in the repository.

## Next.js Full Stack

Use when Next.js owns UI and API routes, route handlers, server actions, or backend logic.

Required standards:

- `frontend.md`
- `architecture.md`
- `coding.md`
- `quality-gate.md`

Default quality gate:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Document which code is UI, application logic, and infrastructure. Keep framework code at the
edge of the application.

## Next.js + Python FastAPI

Use when Next.js owns the frontend and FastAPI owns backend application and API logic.

Required standards:

- `frontend.md`
- `backend.md`
- `backend-testing.md`
- `architecture.md`
- `coding.md`
- `quality-gate.md`

Default quality gate:

```bash
# frontend
npm run lint
npm run typecheck
npm test
npm run build

# backend
ruff check .
mypy .  # or pyright
pytest
```

Document the API contract location, local run commands, environment variables, and integration
test requirements.

## Monorepo Rule

Each standalone app, service, worker, mobile app, or package selects its own profile. The
repository root documents cross-project commands and shared standards.

## Stack Exceptions

When no supplied profile matches, record a stack exception instead of forcing a poor fit.
Exceptions still need standards, quality gates, ownership, and documentation roots.

| Shape | Required adoption notes |
|---|---|
| Python CLI | Entry points, command examples, packaging metadata, lint/type/test commands, and sample input/output location. |
| Python worker | Queue or scheduler contract, retry behavior, idempotency rules, observability, local run command, and integration test scope. |
| Shared package | Public API surface, compatibility promise, versioning, consumer list, and package-level tests. |
| Infrastructure or IaC | State ownership, plan/apply command policy, environment separation, secrets handling, and review gates. |
| Dapr or distributed app | App IDs, components, sidecars, pub/sub or binding contracts, local run topology, and failure-mode tests. |

Every exception must include:

- why no standard profile fits
- which standards still apply
- canonical quality gate commands
- path-to-scope map entries
- open questions and owner

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Quality gate](quality-gate.md)
