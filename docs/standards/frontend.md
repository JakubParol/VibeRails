# Frontend Standard

This standard applies to Next.js and React frontend projects. It extends
[coding.md](coding.md) and [architecture.md](architecture.md).

## Architecture

Package by feature. Keep pages thin and move behavior into view models, actions, adapters,
hooks, and components with clear responsibilities.

| Layer | Location | Does | Does not |
|---|---|---|---|
| Pages | `app/<feature>/page.tsx` | Layout, route params, composition | Business logic, inline API clients |
| View models | `app/<feature>/*-view-model.ts` | Transform, filter, sort data | Fetch data, manage React state |
| Feature components | `components/<feature>/` | UI for one domain area | Import other feature internals |
| Shared UI | `components/ui/` | Pure presentation primitives | Auth, routing, data fetching |
| Hooks | `hooks/` | Reusable stateful behavior | Feature business rules |
| Lib | `lib/<feature>/` | Types, adapters, API clients, pure functions | React component logic |
| Actions | `app/<feature>/*-actions.ts` | Server-side mutations and API calls | Rendering, UI state |

No cross-feature imports. Shared code belongs in `components/ui/`, `hooks/`, or `lib/`.

## Components

- Shared UI components are pure: props in, JSX out.
- Prefer composition through children and slots over complex config objects.
- Shared components accept final strings; translation and formatting happen in consumers.
- One exported component per file.
- Small private render helpers are acceptable in the same file.
- Props use named interfaces such as `OrderTableProps`.
- Style maps and constants live at module level, not inside render functions.

## Server And Client Components

- Default to Server Components.
- Add `"use client"` only for state, effects, refs, browser APIs, or event handlers.
- Keep client boundaries as low as possible.
- Server-only utilities import `server-only`.
- Do not pass non-serializable props across server/client boundaries.

## Data Fetching

- API calls live in `lib/` or `*-actions.ts`.
- No inline fetch logic inside components.
- Use a shared API URL or client helper.
- Check `response.ok`.
- Parse documented error envelopes.
- Use `AbortController` for cleanup in effects.
- Polling uses a shared hook with visibility detection, not raw `setInterval`.

## State Management

- Use local state first.
- Use `useReducer` for complex multi-field state.
- Use context only for cross-page shared concerns.
- Put shareable filters in URL search params.
- Model async page state with discriminated unions:

```typescript
type PageState<T> =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "empty" }
  | { kind: "ok"; data: T };
```

Do not add Redux, Zustand, or another global store unless project complexity clearly requires it.

## Styling

- Tailwind CSS v4 is the default.
- Prefer utility classes in components.
- Keep `globals.css` limited to variables, resets, and Tailwind base.
- Use `cn()` for conditional class merging.
- Use CVA for variant-driven shared components.
- Use shadcn/ui primitives where they fit.
- Dark mode support is required when the project uses a dark theme.

Dropdown rule:

- Prefer a shared themed select component for all dropdowns.
- Do not use native `<select>` in themed applications unless the design system explicitly
  supports it.
- If no themed select exists, create one in `components/ui/` before adding feature dropdowns.

## Type Safety

- Strict TypeScript.
- No `any`.
- Avoid `as` casts. If unavoidable, add a short reason.
- Domain types live in `lib/<feature>/types.ts`.
- API response types match the backend envelope.
- Export props interfaces from component files.
- Prefer union types over TypeScript `enum`.

## Forms

- Track field-level errors and form-level errors separately.
- Clear a field error when the user edits that field.
- Map API validation errors to fields.
- Submit through action functions or typed API helpers.
- Do not call raw fetch directly inside form components.

## Error Handling

- Use a typed application error model.
- Show user-facing errors through inline messages or shared error components.
- No raw `alert()` for normal app errors.
- Never swallow errors silently.

## Testing

Default unit test runner:

```text
node:test + node:assert/strict
```

Test:

- view models
- adapters and mappers
- filter and sort logic
- action functions with mocked fetch
- pure utilities

Do not unit test CSS classes or layout. Use E2E or visual regression when layout correctness
matters.

Place tests next to source:

```text
foo.ts
foo.test.ts
```

## File Organization

- Pages stay thin.
- View models are pure functions.
- Actions are async functions grouped by concern.
- Extract logic when a page grows past 300 lines.
- Keep feature components inside their feature folder.

## Navigation

- [Documentation index](../INDEX.md)
- [Coding standard](coding.md)
- [Architecture standard](architecture.md)
