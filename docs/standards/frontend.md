# Frontend Standard

For Next.js/React. Extends [coding](coding.md) and [architecture](architecture.md). [Web UI and
UX](web-ui.md) owns visual direction, layout, accessible interactions and visual acceptance; apply
both for rendered UI.

## Architecture

Group by feature; keep route entrypoints thin. Use the selected architecture variant; roles are
responsibilities, not empty files, a DI container or pass-through services.

| Responsibility | Default location | Boundary |
|---|---|---|
| Routes and layouts | `app/<route>/page.tsx`, `layout.tsx` | Route input and composition; call data/application operations; no business rules or ORM. |
| Feature UI and state | `app/<feature>/_components/`, `_hooks/` | Local UI, state, interactions; not another feature's private code. |
| Pure view models and types | `app/<feature>/_lib/` | Mapping/filtering/domain values; no React state or IO. |
| Server actions, route handlers and adapters | Feature-local `*-actions.ts`, server/client modules | Validate transport, call application use cases (never ORM or persistence directly), map errors; separate server-only imports. |
| Shared primitives | `components/ui/` or the selected workspace UI package | Project-owned shadcn components, visual variants, intrinsic interaction behavior. |
| Repeated compositions | `components/layout/`, `components/patterns/` when needed | Shells, headers, toolbars, other actually reused patterns. |
| Shared hooks/clients | `hooks/`, narrowly named `lib/<capability>/` | Genuinely shared behavior only; never a dumping ground. |

- Paths are defaults; keep a useful existing feature structure.
- Cross-feature use goes through a documented public entrypoint, never private internals.
- Frontend-only projects use the existing typed API client/hooks and do not reimplement the backend
  domain. Add application orchestration only for meaningful work.

## shadcn/ui Component Boundary

shadcn/ui is the required React web component foundation. Import project-owned components from the
selected UI directory/package; extend variants or compose instead of rebuilding a button, input,
dialog, menu or select per feature.

- No raw Radix UI in pages, features, hooks or alternate wrapper folders (`@radix-ui/*`,
  `radix-ui`, disguising re-exports). Build no second headless layer or raw Radix replacement for
  an available shadcn component.
- New foundations prefer shadcn's Base UI option, used through shadcn components; direct Base UI
  imports also stay inside the shadcn UI boundary. Existing components may keep generated Radix
  internals/dependencies: do not delete them or auto-migrate a working foundation to satisfy a name
  scan.
- Before adding anything, inspect `components.json`, generated sources, package versions and
  lockfile. Pick one compatible primitive family/style (never mix examples across families), check
  current official docs, record the choice at adoption.
- Preview registry changes; merge local customizations, never overwrite; add only used components.
  Community blocks/registries need source, dependency and license review within scope, never a
  bulk install.
- Build a missing component from shadcn pieces and semantic HTML. An unavoidable unsupported
  primitive needs an explicit narrow exception first; renaming or re-exporting is no bypass.

References: [shadcn introduction](https://ui.shadcn.com/docs) (ownership/composition),
[Base UI update](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default) (Radix support kept),
[CLI guide](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) (preview/diff workflows). They are
not permission to run installers or force a migration.

Where ESLint/import-boundary tooling exists, restrict primitive imports/re-exports (including root
`radix-ui` and deep imports) outside the UI boundary and test one allowed shadcn consumer and one
forbidden primitive consumer. Without a guard, review imports explicitly and report that as manual
evidence, not an enforced rule.

## Components

- Shared primitives may own focus, open state, refs, keyboard handling and accessibility behavior;
  never business policy, authentication, navigation decisions or data fetching.
- Pure presentational components stay props-to-JSX; feature containers supply data and intent.
- Prefer children and slots to giant configuration objects. Reuse a primitive at once; extract
  larger patterns when duplication is real. No AppButton around a project-owned Button.
- Consumers own translations and domain formatting; expose accessible labels.
- Named props types and explicit contracts; derive intrinsic/library props where useful.
- One cohesive component responsibility per file; a shadcn compound family may export its parts
  together. Private render helpers are fine.
- Apply coding.md's file limit; extract responsibilities when a page nears 300 lines instead of
  hiding complexity in a giant view model.

## Styling

Tailwind CSS v4 with shadcn semantic tokens is the default. Visual rules belong to the component
that owns the rendered element; page/layout wrappers are components too.

- Colocate utility classes and CVA variants with the component. Use `bg-background`,
  `text-foreground`, semantic status tokens and shared spacing/radius scales; no feature palettes,
  hex colors, magic shadows or repeated arbitrary values.
- `globals.css`: imports, theme tokens/mappings, reset and minimal document base rules only. No
  feature/page selectors, component skins, `.dashboard button` fixes or global `@apply` bundles.
- Use the installed shadcn-compatible `cn`; install no duplicate. Keep static class maps outside
  renders.
- A consumer's `className` may place a component in its layout; repeated changes to its visual
  identity belong in the owning variant, not page overrides or descendant selectors. Internal slot
  selectors live only in the owning component.
- Prefer static complete Tailwind classes. Inline styles/CSS variables only for real runtime values
  (for example chart geometry), scoped to the owning component and validated; never a second
  hard-coded theme. Scoped library-required CSS needs a documented narrow exception, not a new
  global stylesheet or CSS-in-JS framework.
- One selected theme system. If light and dark are both promised, define and test both; an
  explicitly single-theme product stays single-theme. Apply the mode without avoidable flash or
  hydration mismatch, with an appropriate color-scheme. No per-theme component duplicates.
- Dropdowns: shared shadcn Select/Combobox, or a deliberately selected shadcn Native Select for
  simpler/mobile interactions; keep labels, keyboard and theme behavior. No unstyled feature
  `<select>`, no div-based control where an accessible component fits.

References: [shadcn theming](https://ui.shadcn.com/docs/theming),
[Tailwind utility composition](https://tailwindcss.com/docs/styling-with-utility-classes),
[shadcn changelog](https://ui.shadcn.com/docs/changelog) (version context only).

## Server And Client Components

- Default to Server Components; client boundaries wrap actual interaction, not whole pages. Shared
  interactive primitives may be client components without making parents client.
- Server-only utilities import `server-only`. Never expose secrets or pass arbitrary service
  objects/callbacks across the boundary (React serialization rules).
- Server Components await feature data/application functions directly, not the app's own HTTP
  routes. Transport/fetch details live in typed adapters, not render logic.
- Server Actions are mutation boundaries, not the default for reads. Every action/route validates
  input and authorization server-side; hidden controls are not security.

See [component boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components)
and [mutations](https://nextjs.org/docs/app/getting-started/mutating-data).

## Data Fetching And State

- Use the existing typed client; check status; parse the documented error envelope. External JSON
  is untrusted: validate at runtime (a TypeScript cast is not validation).
- Use cancellation/request identity so stale responses cannot overwrite newer state. Poll only
  when needed, through a shared visibility-aware hook.
- Set cache ownership, freshness and invalidation explicitly for the installed Next.js version;
  never share user-specific data through an inappropriate cache. Parallelize independent reads;
  scope loading/error boundaries; no query library for one request.
- Local state local, URL state shareable, server data out of duplicated global stores. Compute
  derived values directly; effects synchronize external systems, not copy/filter props into state
  ([React effect guidance](https://react.dev/learn/you-might-not-need-an-effect)). useReducer for
  complex state, context for shared concerns; Redux/Zustand needs a demonstrated requirement.
- Model loading, error, empty and usable data as discriminated unions; stale or refreshing data is
  not an empty page.
- Forms: separate field and form errors; submit through actions/typed clients; shared shadcn
  Field/Input and native form semantics; a form library only for real complexity; preserve pending,
  retry and rollback behavior.
- Typed errors feed inline/shared error UI; no silent catch or raw alert for normal errors.

## Type Safety

Strict TypeScript, no application `any`. Prefer unions to enums; avoid unchecked casts and explain
unavoidable boundary conversions. Keep domain types feature-local and API types aligned with real
contracts. Never fork generated shadcn prop APIs or copy DTOs at every internal layer.

## Performance And Testing

- Use supported Next.js image/font facilities where applicable: reserve geometry, limit font
  weights.
- Lazy-load genuinely heavy optional UI; keep providers narrow. No default chart, editor,
  animation or global-state bundle on every route.
- Profile a meaningful interaction before adding memoization or virtualization; do not optimize
  only a static landing screenshot.
- Default field targets ([Core Web Vitals](https://web.dev/articles/vitals)): LCP <= 2.5s,
  INP <= 200ms, CLS <= 0.1 at the 75th percentile, assessed separately for mobile and desktop.
  Document context and justified budgets; a lab run or structural gate does not prove field
  compliance.
- Pure functions/mappers/adapters may keep `node:test` and `node:assert/strict`. Use the existing
  DOM-capable runner and Testing Library for component interaction (Node alone is not a React DOM
  harness); add no second unit runner for unchanged pure tests. Use browser/E2E coverage for async
  server rendering or interactions the unit environment cannot support
  ([Next.js testing guidance](https://nextjs.org/docs/app/guides/testing/vitest)).
- Test visible outcomes, error/retry paths, keyboard/focus and risky responsive behavior, near the
  source. No mock-echo, library-internal or CSS-class assertions posing as user behavior.
- Browser evidence follows [visual acceptance](web-ui.md#visual-acceptance); Playwright and axe are
  recommended, not mandatory installs. Use existing tools for import/style boundary checks.

## Navigation

- [Documentation index](../INDEX.md)
- [Web UI and UX](web-ui.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
- [Quality gate](quality-gate.md)
