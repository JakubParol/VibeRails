# Frontend Standard

For Next.js/React implementations. Extends [coding](coding.md) and [architecture](architecture.md).
[Web UI and UX](web-ui.md) owns visual direction, layout, accessible interactions and visual
acceptance. Apply both for rendered UI work; neither requires loading unrelated provider rules.

## Architecture

Group by feature and keep route entrypoints thin. Use the selected architecture variant; roles
are responsibilities, not a requirement for empty files, a DI container or pass-through services.

| Responsibility | Default location | Boundary |
|---|---|---|
| Routes and layouts | `app/<route>/page.tsx`, `layout.tsx` | Route input and composition; call data/application operations, no business rules or ORM. |
| Feature UI and state | `app/<feature>/_components/`, `_hooks/` | Local UI, state and interactions; not another feature's private code. |
| Pure view models and types | `app/<feature>/_lib/` | Mapping/filtering/domain values without React state or IO. |
| Server actions and adapters | Feature-local `*-actions.ts`, server/client modules | Validate transport, call application behavior, map errors; separate server-only imports. |
| Shared primitives | `components/ui/` or the selected workspace UI package | Project-owned shadcn components, visual variants and intrinsic interaction behavior. |
| Repeated compositions | `components/layout/`, `components/patterns/` when needed | Shells, headers, toolbars and other actually reused patterns. |
| Shared hooks/clients | `hooks/`, narrowly named `lib/<capability>/` | Only genuinely shared behavior, never a dumping ground. |

These paths are defaults, not a migration order. Preserve a useful existing feature structure.
Cross-feature use goes through a documented public entrypoint; importing private internals is
forbidden. This replaces a blanket ban on all cross-feature imports.

Next.js full-stack route handlers/server actions call application use cases, never ORM or
persistence directly. Frontend-only projects use the existing typed API client/hooks; do not
reimplement the backend domain. Add application orchestration only when it has meaningful work.

## shadcn/ui Component Boundary

shadcn/ui is required for the React web component foundation, not merely a suggestion. Import
project-owned components from the selected UI directory/package. Extend their variants or compose
them instead of rebuilding a button, input, dialog, menu or select in each feature.

- No raw Radix UI usage in pages, features, hooks or alternate wrapper folders: this includes
  `@radix-ui/*`, `radix-ui` and re-exports that disguise direct primitive usage. Do not hand-build
  a second headless component layer or a raw Radix replacement for an available shadcn component.
- New foundations prefer the current shadcn Base UI option, accessed through shadcn components.
  Existing shadcn components may retain their generated Radix internals/dependencies. Do not
  delete those dependencies or automatically migrate a working foundation to satisfy a name scan.
  Direct Base UI imports also stay inside the selected shadcn UI boundary, not feature code.
- Inspect existing `components.json`, generated sources, package versions and lockfile before
  adding anything. Select one compatible primitive family/style; do not mix examples from
  different families. Check current official docs and record the choice during adoption.
- Preview registry changes and merge local customizations rather than blindly overwriting them.
  Add only used components. Community blocks/registries require source, dependency and license
  review within scope, not an automatic bulk install.
- A missing component is built from existing shadcn pieces and semantic HTML when possible.
  An unavoidable unsupported primitive needs an explicit narrow exception before introduction;
  do not bypass the rule by renaming its file or re-exporting the package.

The [shadcn introduction](https://ui.shadcn.com/docs) describes ownership/composition. Its
[Base UI update](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default) keeps Radix support;
the [CLI guide](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) documents preview/diff workflows.
These are reference capabilities, not permission to run installers or force an existing migration.

Where ESLint/import-boundary tooling exists, restrict primitive imports/re-exports outside the
named UI boundary, including the root `radix-ui` package and deep imports. Test one allowed
shadcn consumer and one forbidden primitive consumer using that tooling. Without such a guard,
review imports explicitly and report it as manual evidence, not an enforced architectural rule.

## Components

Shared primitives may own focus, open state, refs, keyboard handling and accessibility behavior.
They must not own business policy, authentication, navigation decisions or data fetching. Pure
presentational components remain props-to-JSX. Feature containers supply data and intent.

Prefer children and slots to giant configuration objects. Reuse a primitive immediately; extract
larger patterns when duplication is real. Do not add a redundant AppButton around an already
project-owned Button. Consumers own translations and domain formatting; expose accessible labels.

Use named props types and explicit contracts, deriving intrinsic/library props where useful.
One cohesive component responsibility per file; a shadcn compound family may export its related
parts together. Do not split Dialog and all its parts merely to satisfy one-export-per-file.
Private render helpers are fine. Apply coding.md's file limit and extract responsibilities when
a page approaches 300 lines, rather than hiding complexity in a giant view model.

## Styling

Tailwind CSS v4 with shadcn semantic tokens is the default. All visual rules belong to the
component that owns the rendered element; page/layout wrappers are components too.

- Colocate utility classes and CVA variants with the component. Consume `bg-background`,
  `text-foreground`, semantic status tokens and the shared spacing/radius scales rather than
  inventing feature palettes, hex colors, magic shadows or repeated arbitrary values.
- `globals.css` is restricted to imports, theme tokens/mappings, reset and minimal document
  base rules. No feature/page selectors, component skins, `.dashboard button` fixes or global
  `@apply` utility bundles. Theme variables are the necessary shared input, not global component styling.
- Use the installed shadcn-compatible `cn` utility. Keep the existing helper or generated package
  choice; do not install a duplicate implementation. Keep static class maps outside renders.
- A consumer's `className` may place a component in its layout; repeated changes to its visual
  identity belong in the owning variant, not per-page overrides or descendant selectors.
  Internal slot selectors may be maintained inside their owning component only.
- Prefer static complete Tailwind classes. Inline styles/CSS variables are limited to actual
  runtime values (for example chart geometry), scoped to the owning component and validated;
  they are not a second hard-coded theme. Scoped library-required CSS needs a documented narrow
  exception, not a new global stylesheet or CSS-in-JS framework.
- Use one selected theme system. If both light/dark are promised, define and test both; preserve
  an explicitly single-theme product. Apply the selected mode without avoidable flash or hydration
  mismatch and use an appropriate color-scheme. Do not duplicate feature components by theme.

See [shadcn theming](https://ui.shadcn.com/docs/theming) and
[Tailwind utility composition](https://tailwindcss.com/docs/styling-with-utility-classes).
The [current changelog](https://ui.shadcn.com/docs/changelog) is version context, not an upgrade instruction.

Dropdowns use the shared shadcn Select/Combobox, or a deliberately selected shadcn Native Select
for simpler/mobile interactions. Preserve its labels, keyboard and theme behavior. No unstyled
feature `<select>` and no custom div-based control when an existing accessible component fits.

## Server And Client Components

Default to Server Components; put client boundaries around actual interaction, not whole pages
for convenience. Shared interactive primitives may be client components without making all their
parents client components. Server-only utilities import `server-only`. Never expose secrets or
pass arbitrary service objects/callbacks across the boundary; follow React serialization rules.

Server Components may await feature data/application functions directly; do not call the app's
own HTTP routes merely to reach server code. Transport/fetch details live in typed adapters, not
inline render logic. Server Actions are mutation boundaries, not the default for every read.
Every action/route validates input and authorization server-side; hidden controls are not security.
See [component boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components)
and [mutations](https://nextjs.org/docs/app/getting-started/mutating-data).

## Data Fetching And State

Use an existing typed client, check response status and parse the documented error envelope.
Treat external JSON as untrusted: a TypeScript cast is not runtime validation. Use cancellation
and request identity where needed so a stale response cannot replace newer state. Polling uses a
shared visibility-aware hook only when the product needs polling.

Set cache ownership, freshness and invalidation explicitly for the installed Next.js version;
never share user-specific data through an inappropriate cache. Use parallel independent reads
and scoped loading/error boundaries where useful. Do not add a query library solely for one request.

Keep local state local, URL state shareable and server data out of duplicated global stores.
Compute derived values directly; use effects for synchronization with external systems, not
copying/filtering props into state. Use useReducer for genuinely complex state and context for
shared concerns; Redux/Zustand needs a demonstrated requirement. See [React effect guidance](https://react.dev/learn/you-might-not-need-an-effect).

Model loading, error, empty and usable data explicitly with discriminated unions; allow refreshing
or stale data without pretending it is a new empty page. Forms separate field/form errors and
submit through actions/typed clients. Use shared shadcn Field/Input and native form semantics;
add a form library only for actual complexity. Preserve pending, retry and rollback behavior.
Typed errors feed inline/shared error UI; no silent catch or raw alert for normal application errors.

## Type Safety

Strict TypeScript; no application `any`. Prefer unions over enums, avoid unchecked casts and
explain unavoidable boundary conversions. Keep domain types feature-local and API types aligned
with actual contracts. Do not fork generated shadcn prop APIs or copy DTOs at every internal layer.

## Performance And Testing

Use supported Next.js image/font facilities where applicable, reserving geometry and limiting
font weights. Lazy-load genuinely heavy optional UI; keep providers narrow. No default chart,
editor, animation or global-state bundle on every route. Profile a meaningful interaction before
adding memoization or virtualization; do not optimize only a static landing screenshot.

Use [Core Web Vitals](https://web.dev/articles/vitals) as default field targets: LCP <= 2.5s,
INP <= 200ms, CLS <= 0.1 at the 75th percentile, assessed separately for mobile/desktop. Document
context and justified budgets; a lab run or structural gate does not prove field compliance.

Pure functions/mappers/adapters can retain `node:test` and `node:assert/strict`. Use the existing
DOM-capable runner and Testing Library for component interaction when needed; Node alone is not
a React DOM harness. Do not add a second unit runner for unchanged pure tests. Use browser/E2E
coverage for async server rendering or interactions not supported by the unit environment.
[Next.js testing guidance](https://nextjs.org/docs/app/guides/testing/vitest) documents this distinction.

Test visible outcomes, error/retry paths, keyboard/focus and risky responsive behavior. Keep tests
near their source; no mock-echo, library-internal or CSS-class assertions masquerading as user
behavior. Use existing tools for import/style boundaries and targeted browser evidence under
[visual acceptance](web-ui.md#visual-acceptance). Playwright and axe integration are recommended
when adding browser automation, not mandatory extra installations in a documentation-only repo.
Full types, suites, builds and browser matrices remain in CI; local evidence is focused.

## Navigation

- [Documentation index](../INDEX.md)
- [Web UI and UX](web-ui.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
- [Quality gate](quality-gate.md)
