# Stack Profiles Standard

Use the closest profile when adopting standards or deciding which documents and gates apply.
Command blocks show full CI coverage, not a local checklist; local work follows
[quality-gate.md](quality-gate.md).

## Web UI Baseline

All web profiles apply [web-ui.md](web-ui.md); React also applies [frontend.md](frontend.md).
Adopt compatible versions; do not force a new release into an existing app. Choosing a profile
generates no application.

Add the project's real focused browser/interaction commands and required visual evidence
([visual acceptance](web-ui.md#visual-acceptance)) to its path-to-scope map. Playwright is the
default for new browser automation; reuse a suitable existing tool. A green build alone is not
visual acceptance.

## Next.js Profiles

All three require `frontend.md`, `web-ui.md`, `architecture.md`, `coding.md` and `quality-gate.md`.

| Profile | Use when | Also required | Document |
|---|---|---|---|
| Next.js Frontend Only | Next.js owns UI only and calls an external or separately managed API. | Nothing; no backend standards unless backend code lives in the repository. | API ownership in the project README. |
| Next.js Full Stack | Next.js owns UI and API routes, route handlers, server actions or backend logic. | Nothing. | Which code is UI, application logic and infrastructure; keep framework code at the edge. |
| Next.js + Python FastAPI | Next.js owns the frontend; FastAPI owns backend application and API logic. | `backend.md`, `backend-testing.md` | API contract location, local run commands, environment variables, integration test requirements. |

Full PR verification defaults (CI). The frontend block applies to every Next.js profile; the
backend block also applies to FastAPI.

```bash
# frontend
npm run lint
npm run typecheck
npm test
npm run build

# backend (Next.js + Python FastAPI only)
ruff check .
mypy .  # or pyright
pytest
```

## Monorepo Rule

Each standalone app, service, worker, mobile app or package selects its own profile. The root
documents cross-project commands and shared standards.

## Stack Exceptions

When no profile matches, record a stack exception instead of forcing a poor fit. Exceptions still
need standards, quality gates, ownership and documentation roots.

| Shape | Required adoption notes |
|---|---|
| Python CLI | Entry points, command examples, packaging metadata, lint/type/test commands, sample input/output location. |
| Python worker | Queue or scheduler contract, retry behavior, idempotency rules, observability, local run command, integration test scope. |
| Shared package | Public API surface, compatibility promise, versioning, consumer list, package-level tests. |
| Infrastructure or IaC | State ownership, plan/apply command policy, environment separation, secrets handling, review gates. |
| Dapr or distributed app | App IDs, components, sidecars, pub/sub or binding contracts, local run topology, failure-mode tests. |

Every exception states:

- why no standard profile fits
- which standards still apply
- canonical quality gate commands
- path-to-scope map entries
- open questions and owner

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Quality gate](quality-gate.md)
