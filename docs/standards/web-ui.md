# Web UI And UX Standard

Read for rendered web UI work. Owns visual and interaction quality; [frontend.md](frontend.md) owns
React/Next.js, shadcn/ui and style placement; [quality-gate.md](quality-gate.md) owns execution and
evidence. Data and AI sections apply only when those features exist. No brand or palette is
prescribed; a project may choose another coherent direction.

Aim for a calm, fast, distinctive interface: composition, then polish, then decoration. A component
catalog is a foundation, not a design. Follow [KIS](kis.md).

## Design Direction Before Expansion

- New UI or material redesign: record a short direction in the existing design note, task or
  README: primary user/job, key action, density, navigation, supported screens/themes, visual
  character. Small fixes inherit it.
- Reuse approved brand assets/references; ask only about unresolved consequential choices;
  otherwise propose one coherent direction, not a moodboard.
- Before the first screen, settle what is still open, one question at a time in the user's
  language: appearance (the user shows a design or examples, or the agent proposes one direction
  and waits for feedback); devices (computer; computer and phone; or computer, phone and tablet,
  recommended: one browser app with a layout adapted to screen size, not native apps); themes
  (light, dark, or both with a switch, recommended; both need visual and readability proof).
  Record the answers in the design note or README; never assume them from a recommendation.
- Use real or labeled synthetic content, including long labels and sparse/dense data.
- Build one representative page and main interaction first; review narrow and wide renders against
  the direction. A new visual language needs owner agreement unless scope covers it; extend one
  vocabulary across routes. Record approved tokens/pattern locations once; code owns values.

## Visual Composition

- One first point of attention and one primary action per task area. Group by user intent; not every
  datum is a prominent card, badge or metric.
- Intentional grid, aligned edges, consistent vertical rhythm. Prefer whitespace, typography and
  restrained surface contrast to nested boxes and heavy shadows.
- Compact tokens (surfaces, text, accents, semantic states, spacing, radius, elevation); one
  primary accent family by default; status/chart colors separate. Verify all interactive states.
- Small type scale; start at 16px body text and 1-2 typefaces. Compact data labels may differ but
  never make controls or essential text illegible. Prose and dense dashboards need different
  widths.
- One icon family, size and stroke; no emoji as icons; text alternatives for meaningful symbols.
- Gradients, glass, glow, giant radii, animated backgrounds and decorative KPI rows are not
  defaults; one restrained signature treatment is fine. Never trade reading, contrast or
  performance for a screenshot effect.

## Layout And Responsiveness

- One application shell; reusable page/section patterns once repetition exists, never empty shell
  abstractions. Navigation lives in the shell; page identity, contextual actions and content stay
  predictable.
- Document page for long linkable work, side panel for contextual inspection, dialog for short
  focused decisions. No nested modals or mandatory drawer per operation.
- CSS grid/flex and intrinsic sizing over JavaScript measurement or fixed pixels; content-driven
  breakpoints, not a different app per device.
- Keep primary tasks reachable on narrow screens (soft keyboards, safe areas, long text,
  persistent toolbars). Wide screens add density, not stretched paragraphs or stranded cards.
- Page-level overflow is intentional: a wide table may scroll in its own labeled region, the page
  never scrolls horizontally. Reflow ordinary content at 320 CSS pixels; test 200% text resize and
  the relevant 400% zoom/reflow case; preserve browser zoom.
  [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) lists exceptions (content
  needing two dimensions).

## Interaction And Content

Every visible control works or honestly explains why it is unavailable: no fake buttons,
placeholder links or invented success. Links navigate, buttons act. Keep shareable navigation/filter
state in the URL (not sensitive input or transient UI state); back, forward and refresh preserve
context.

| Situation | Required experience |
|---|---|
| Initial load | Restrained placeholder sized to final content; no unnecessary full-page spinner. |
| Refresh with usable data | Keep data visible; indicate updating/staleness. |
| Empty or no matches | Distinguish first use from filtered-out results; explain next step or reset. |
| Error or offline | Preserve useful input/data; explain the failed operation; offer safe recovery. |
| Saving or background work | Indicate the actual operation; prevent duplicate submission; keep layout stable. |
| Destructive action | Explain target/consequence; confirm or offer a genuinely reversible undo. |
| Success | Confirm the actual outcome near its context; a transient toast is not the only durable result. |

Forms ([WAI form guidance](https://www.w3.org/WAI/tutorials/forms/validation/)):

- Specific labels and inline help; placeholders are examples, not labels.
- Group fields sensibly; supply autocomplete/input modes; preserve typed input after failure.
- No aggressive validation while typing. Show field and form errors at appropriate times,
  associate them with controls, focus the first actionable error after submit. An edit may make an
  error stale but does not prove validity.
- Allow paste and password managers. Warn only about real unsaved work.
- Native form/keyboard behavior must not break textarea input or IME composition.

## Accessibility Baseline

Target applicable [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) criteria. The points below are not
exhaustive; a component library or automated scan alone cannot certify the application.

- Semantic landmarks, ordered headings, labels, a skip link for repeated navigation. Everything
  keyboard-operable with visible, logical focus. No hover-only action, color-only status or
  tooltip-only essential instruction.
- Modals use the selected component's supported naming, initial focus, containment, focus return,
  Escape/dismissal and accessible close path per the
  [dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), not a hand-written
  focus trap. Sticky UI must not obscure the active control (aim for fully visible).
- Text contrast 4.5:1 (3:1 for qualifying large text) and applicable 3:1 non-text contrast, checked
  for muted text, controls, charts and both selected themes. WCAG exceptions apply; APCA or a
  subjective palette preview does not replace AA.
  [Contrast reference](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Meet the [24 by 24 CSS-pixel target/spacing criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
  with its exceptions; prefer at least 44 by 44 for principal touch controls (ergonomic default).
- Announce relevant asynchronous results/errors without moving focus unexpectedly or reading every
  streamed token aloud. Respect reduced motion, zoom and high-contrast/forced-color use.

## Motion And Perceived Speed

- Motion explains a state change or adds a small, intentional moment of delight. Prefer
  component-local CSS transitions on opacity/transform, never `transition-all`.
- Consistent short durations (roughly 120-220ms is a starting point, not a hard limit); allow
  interruption.
- By default no scroll hijacking, custom cursor, forced entrance sequence or infinite decorative
  movement.
- Never delay a completed result to play an animation or show fake progress percentages. Reserve
  image, chart and loading geometry to avoid jumps.
- Add an animation library only for a demonstrated interaction CSS/browser tools cannot keep
  simple.

## Data-Heavy Screens

For tables, charts or dashboards.

- Start from the user's decision, not a wall of metrics. Reuse table/toolbar/empty-state patterns;
  no universal configurable grid.
- Simple table first; add sorting, selection, pagination or virtualization for actual requirements
  and measured scale. Keep essential row actions accessible on touch and keyboard.
- Align comparable numbers, use tabular numerals, show units, precision, date range, timezone and
  freshness where relevant. Format for the selected locale; missing is not zero, partial/stale is
  not live. Preserve filters and selection deliberately during updates.
- Charts: a useful question, honest scales, readable labels/legend, an accessible text summary or
  data alternative, more than color to distinguish important series/status. No 3D decoration,
  misleading truncation or tooltip-only values.
- Install a chart package only for real charts; use the selected shadcn chart conventions, not a
  second theme.

## AI Interfaces

For AI-assisted product UI only.

- Distinguish generated text, retrieved evidence, proposed operations and confirmed external
  effects. Show sources where available; never invent citations, certainty, tool completion or
  hidden reasoning. Offer concise visible rationale, not private chain-of-thought.
- Surface meaningful waiting, partial, failed, cancelled and completed states.
- Allow stopping generation; distinguish stopping the stream from cancelling a server operation.
  Keep partial work; offer scoped retry.
- No autoscroll away from a reader inspecting earlier content; offer return-to-latest.
- Consequential operations need the product's approval with the affected target visible. Chat must
  not hide the actual result or recovery.
- Render untrusted generated Markdown/links safely: no arbitrary HTML, scripts or automatic
  actions.

## Visual Acceptance

For a rendered UI change, inspect the affected screen and interaction in a browser before claiming
visual completion. A design image or JSX review is not a rendered-app check.

1. Compare with the agreed direction and sibling screens (hierarchy, spacing, typography, component
   reuse, principal action). Fix visible issues, then re-inspect.
2. Check a narrow and a wide viewport plus the breakpoint or dense-content case at risk. Start with
   390 and 1440 CSS pixels; include the 320px reflow case for changed layouts. Exercise the primary
   flow and relevant loading/empty/error states with safe fixtures.
3. Check keyboard/focus, resize/zoom, reduced motion for animation changes and all promised themes.
   Choose browsers from project risk; one Chromium capture is not Safari/mobile proof.
4. Save small before/after screenshots or traces in existing PR/test artifacts, labeled with route,
   viewport, state, theme, browser and tested revision (no fake before image for new screens).
   Exclude secrets and personal data; keep only useful evidence.

Use existing browser tools; Playwright is the default for new automation. Automate a few critical
interactions/visual baselines, not every permutation. Keep fonts, fixtures and environment
deterministic, review baseline changes, never mask the changed region or relax thresholds
([visual comparisons](https://playwright.dev/docs/test-snapshots),
[accessibility testing](https://playwright.dev/docs/accessibility-testing)). Add automated
accessibility checks where supported, plus manual interaction checks.

Missing preview/browser access leaves visual acceptance unverified, with an owner and next action;
it never becomes PASS. The local/CI split is in [quality-gate.md](quality-gate.md). A
documents-only standards change needs document checks, not a fabricated demo.

## Reference Use

Reviewed 2026-09-17. Linked sources inform these rules; adopt no external recommendation wholesale
and install nothing because of it. [Vercel's interface guidance](https://vercel.com/design/guidelines)
informs interaction polish only: never disable zoom, apply its brand copy rules universally or
replace WCAG contrast with another metric.

## Navigation

- [Documentation index](../INDEX.md)
- [Frontend implementation](frontend.md)
- [Quality gate](quality-gate.md)
- [Design note template](../templates/design-note.md)
