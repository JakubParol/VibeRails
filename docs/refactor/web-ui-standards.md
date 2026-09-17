# Web UI Standards Delivery

Internal task record, not an adopter template. [STATUS](STATUS.md) owns the live checkpoint.

## Agreement

Scope `web-ui-1`, 2026-09-17. The user requested a beautiful, modern, lightweight, distinctive
web UI standard: shadcn/ui, no raw Radix, reusable components, component-owned styling, current
UI/UX research and the simplicity principle. The same request explicitly authorizes changes,
one PR and merge after verification. The standing solo-execution/self-review exception remains;
no independent delegates or observed model/effort selection are claimed.

Base: `c9ae8f430ca931e878f438258eebef2123026ad8` (0.4.4).
Branch: `codex/web-ui-standards`. Candidate: 0.5.0 because prior optional guidance is tightened.

## Scope And Acceptance

- web-ui.md owns visual direction, composition, interaction, accessibility and browser acceptance.
  frontend.md owns Next.js/React, shadcn boundaries, colocated styles, data and test mechanisms.
- Require shadcn-owned components, prohibit raw primitive bypasses, and preserve legitimate
  generated Radix internals during existing-project refresh. Prefer shadcn Base UI for new work.
- Global tokens/reset remain allowed; per-page skins and scattered component overrides do not.
  Reconcile feature organization, public imports, interactive primitives and compound exports.
- Integrate the rules with onboarding, stack selection, context routing, review and existing
  templates. Do not create another design-system runtime, schema, runner or mandatory document set.
- Verify this standards delivery with focused document checks, semantic review and repository CI.
  An adopter's actual rendered UI still needs its own browser/interaction and owner acceptance.
- Preserve old stage records, frozen comparison inputs and unresolved 08/09 experiments. No
  application, other repository, client configuration, provider operation or package install.

## Research Decisions

Primary sources checked 2026-09-17. Recheck version-sensitive APIs in the adopting project;
these references are not instructions to install tools or a permanent compatible-version matrix.

| Source | Decision and limitation |
|---|---|
| [shadcn introduction](https://ui.shadcn.com/docs), [Base UI default](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default) | Use project-owned shadcn composition. New Base UI preference does not require an existing Radix-based shadcn migration. |
| [shadcn CLI preview](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4), [changelog](https://ui.shadcn.com/docs/changelog) | Inspect registry deltas; preserve generated dependency choices, including the current cn utility, rather than imposing an older helper layout. |
| [shadcn theming](https://ui.shadcn.com/docs/theming), [Tailwind utilities](https://tailwindcss.com/docs/styling-with-utility-classes), [theme variables](https://tailwindcss.com/docs/theme) | Semantic tokens plus component-local utilities; no separate global feature skin or duplicated token registry. |
| [shadcn Field](https://ui.shadcn.com/docs/components/base/field), [tables](https://ui.shadcn.com/docs/components/base/data-table), [charts](https://ui.shadcn.com/docs/components/base/chart) | Reuse accessible field anatomy and composable data patterns; no mandatory form/grid/chart dependency for every project. |
| [Vercel interface guidance](https://vercel.com/design/guidelines) | Useful interaction polish, not a wholesale policy import. Reject zoom restrictions, APCA replacing WCAG, blanket deep-linking of transient state, brand-specific copy and automatic install scripts. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | AA baseline with correct thresholds and exceptions; 44px touch preference is distinct from the 24px AA target/spacing criterion. |
| [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [focus visibility](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [forms](https://www.w3.org/WAI/tutorials/forms/validation/) | Preserve readable zoom, keyboard operation, contextual focus and meaningful validation; library defaults do not certify a complete app. |
| [Next.js boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components), [mutations](https://nextjs.org/docs/app/getting-started/mutating-data), [testing](https://nextjs.org/docs/app/guides/testing/vitest), [React effects](https://react.dev/learn/you-might-not-need-an-effect) | Narrow client boundaries, explicit server authorization, no unnecessary derived-state effects and distinct pure/DOM/browser test needs. |
| [Web Vitals](https://web.dev/articles/vitals), [Playwright behavior](https://playwright.dev/docs/best-practices), [visuals](https://playwright.dev/docs/test-snapshots), [accessibility](https://playwright.dev/docs/accessibility-testing) | Distinguish field targets, lab evidence, visual baselines and manual interaction. No green-code-test claim of beauty or complete accessibility. |

Some direct Next.js reads returned an unsupported Markdown content response; the relevant
indexed official page content was available and read. No exact new Next.js version is inferred.
Aesthetic defaults are project policy informed by these sources, not universal measurements.

## Semantic Review Cases

The following are single-agent reasoning checks against the written contract, not spawned-agent,
rendered-app, library-installation or accessibility test executions:

| Case | Expected contract behavior |
|---|---|
| New React web project | Guided setup proposes shadcn and its compatible foundation, local styles and a representative-screen direction. No full component catalog installed. |
| Existing shadcn/Radix project | Preserve generated internals; refuse new raw feature imports. Migration and changed policy require an approved refresh. |
| Raw Radix re-export hidden in lib | Treat as a boundary violation, not an alternative component distribution. |
| Dialog with focus/open state and multiple exports | Legitimate component behavior/family; no artificial split or replacement focus implementation. |
| Global tokens versus .page button styling | Tokens/reset pass; feature selectors and per-page visual overrides do not. |
| Documentation-only target | Record planned web rules and future visual acceptance without creating a fake app or claiming browser success. |
| Python/non-web target | No web standards in required bundles; conditional links are not a mandatory read list. |
| Accessible mobile select | Use the selected themed shadcn Native Select or Select; do not force custom headless interaction. |
| Missing browser access / passing code tests | Visual acceptance remains unverified; no fake screenshot or broad local build fallback. |
| Data/AI screen | Keep truthful partial/stale/cancelled states, sources and meaningful recovery; no fabricated progress/effects. |

## Verification And Publication

Focused validation passed for all 14 changed Markdown files, including the affected review
skill. Whitespace checks passed. All 12 existing changed-file baselines match the pinned remote
blobs; the two other files are new. Ten semantic cases received self-review, not runtime testing.
The first local check found four missing links/anchors in the older retained context. Refreshing
three unchanged source references to verified current blobs resolved those local-context gaps;
no product guard or test was weakened. Broad verification remains pending until current-head CI.

Local Git network transport is unavailable. A retained source snapshot is used for editing;
changed existing files are reconciled against immutable main blobs before publication. Only
scoped changed blobs are applied over the actual remote base tree, preserving other content.
Local snapshot commits are not remote source SHAs. No transfer workflow, force push or credentials.

Before merge: locally commit closing records, publish in the same PR, inspect final-head CI,
merge with expected-head protection and read back remote main. The PR owns final source/tested/
merge identities; no extra checkpoint PR is needed. No rendered UI, WCAG conformance, performance
improvement, live MCP use or independent 08/09 evidence is claimed by these documentation checks.

## Navigation

- [Documentation index](../INDEX.md)
- [Current checkpoint](STATUS.md)
- [Web UI and UX](../standards/web-ui.md)
- [Frontend implementation](../standards/frontend.md)
