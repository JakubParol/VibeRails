# Web UI And UX Standard

Read when designing, implementing or reviewing rendered web interfaces. This document owns
visual and interaction quality; [frontend.md](frontend.md) owns React/Next.js implementation,
shadcn/ui and style placement. [Quality gate](quality-gate.md) owns execution and evidence.
Read the data/AI sections only when those features exist. These rules do not prescribe a brand.

**Keep it simple.** Aim for a distinctive, calm, fast interface: clear composition first,
polish second, decoration last. A component catalog is a foundation, not a finished design.
Do not add a design-system framework, animation library or reporting workflow for its own sake.

## Design Direction Before Expansion

For a new UI or a material redesign, establish a short direction in the existing design note,
task or owning README: primary user/job, key action, content density, navigation, supported
screens/themes and visual character. Reuse approved brand assets/references; ask only about
unresolved consequential choices. Without references, propose one coherent direction, not a
large moodboard exercise. A small fix inherits the existing direction, without a new document.

Use real or clearly labeled synthetic content, including long labels and sparse/dense data.
Build one representative page and its main interaction before multiplying screens. Review its
rendered narrow/wide views against the direction; obtain owner agreement for a new visual
language unless already covered by scope. Extend that same vocabulary, not a different design
per route. Record approved tokens/pattern locations once; code remains their value authority.

## Visual Composition

- Establish an obvious first point of attention and a clear primary action per task area.
  Group by user intent; separate primary content, supporting detail and secondary actions.
  Do not render every datum as an equally prominent card, badge or metric.
- Use an intentional grid, aligned edges and consistent vertical rhythm. Prefer whitespace,
  typography and restrained surface contrast over nested bordered boxes and heavy shadows.
- Choose a compact token set for surfaces, text, accents, semantic states, spacing, radius and
  elevation. Keep one primary accent family by default; status/chart colors have separate
  semantic purposes. Verify all interactive states, not only the resting palette.
- Use a small type scale and a readable body size; a practical starting point is 16px body text
  and 1-2 typefaces. Compact data labels may differ without shrinking controls or essential text
  into illegibility. Long prose and dense dashboards need different content widths.
- Use consistent icon family, size, stroke and optical alignment. Avoid emoji as a substitute
  for the application's icon system. Give symbols text alternatives when they carry meaning.
- Let brand and useful content create distinction. One restrained signature treatment can help;
  ubiquitous gradients, glass, glow, giant radii, animated backgrounds and decorative KPI rows
  are not defaults. Never sacrifice reading, contrast or performance for a screenshot effect.

These are VibeRails design defaults, not a mandatory palette or a claim that taste is testable
by a numeric score. The project may deliberately choose a different coherent direction.

## Layout And Responsiveness

Use one consistent application shell and reusable page/section patterns once repetition exists.
Navigation belongs in the shell; page identity, contextual actions and content stay predictable.
Do not create empty shell abstractions for a single screen. Use a document page for long,
linkable work; a side panel for contextual inspection; a dialog for short focused decisions.
Avoid nested modals and a mandatory drawer for every operation.

Prefer CSS grid/flex and intrinsic sizing over JavaScript measurements or fixed pixel layouts.
Define content-driven breakpoints, not a different app per device. Keep primary tasks reachable
on narrow screens; account for soft keyboards, safe areas, long text and persistent toolbars.
Wide screens should improve useful density, not stretch paragraphs or leave a tiny card adrift.

Keep page-level overflow intentional. A wide data table may have its own labeled scroll region;
this is not permission to make the whole page horizontally scroll. Reflow ordinary content at
320 CSS pixels and test 200% text resize plus the relevant 400% zoom/reflow case. Preserve browser
zoom. See [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) for legitimate
exceptions such as content that inherently needs two dimensions.

## Interaction And Content

Every visible control must work or honestly explain why it is unavailable; no decorative fake
buttons, placeholder links or invented success. Use links for navigation and buttons for actions.
Keep shareable navigation/filter state in the URL; do not put sensitive input or every transient
UI state there. Back, forward and refresh should preserve the intended context.

| Situation | Required experience |
|---|---|
| Initial load | A restrained placeholder sized to final content; no unnecessary full-page spinner. |
| Refresh with usable data | Keep the data visible and indicate updating/staleness without erasing the screen. |
| Empty or no matches | Distinguish first use from filtered-out results; explain the next step or reset. |
| Error or offline | Preserve useful input/data, explain the failed operation and offer safe recovery. |
| Saving or background work | Indicate the actual operation, prevent duplicate submission and keep layout stable. |
| Destructive action | Explain the target/consequence and confirm or provide a genuinely reversible undo. |
| Success | Confirm the actual outcome near its context; a transient toast is not the only durable result. |

Prefer specific labels and useful inline help. Placeholders are examples, not labels. Group
form fields sensibly, supply autocomplete/input modes and preserve typed input after failure.
Do not validate aggressively during typing; show field and form errors at appropriate times,
associate them with controls and focus the first actionable error after submission. An edited
error may become stale, but an edit alone is not proof of validity. Allow paste and password
managers. Warn about real unsaved work, not every navigation. Use native form/keyboard behavior
without breaking textarea input or IME composition. See [WAI form guidance](https://www.w3.org/WAI/tutorials/forms/validation/).

## Accessibility Baseline

Target applicable [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) criteria; the points below are not
an exhaustive conformance checklist. A component library or an automated scan alone cannot
certify the completed application.

- Use semantic landmarks, ordered headings, labels and a skip link for repeated navigation.
  Keyboard users must reach and operate all functionality with visible, logical focus.
  No hover-only action, color-only status or tooltip-only essential instruction.
- Implement modal naming, initial focus, containment and focus return through the selected
  component's supported behavior. Preserve Escape/dismissal and an accessible close path.
  Follow the [dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), not a
  hand-written focus trap. Sticky UI must not obscure the active control; aim to keep it fully visible.
- Meet text contrast of 4.5:1, or 3:1 for qualifying large text, and applicable 3:1 non-text
  contrast. Check muted text, controls, charts and both selected themes. WCAG exceptions still
  apply; APCA or a subjective palette preview is not a replacement for the chosen AA criteria.
  [Contrast reference](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Meet the [24 by 24 CSS-pixel target/spacing criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
  with its stated exceptions. Prefer at least 44 by 44 for principal touch controls; this is
  our ergonomic default, not a claim that WCAG AA mandates 44 everywhere.
- Announce relevant asynchronous results/errors without moving focus unexpectedly or reading
  every streamed token aloud. Respect reduced motion, zoom and high-contrast/forced-color use.

## Motion And Perceived Speed

Motion should explain a state change or add a small, intentional moment of delight. Prefer
component-local CSS transitions for ordinary interactions; animate opacity/transform where
suitable, not `transition-all`. Use consistent short durations (roughly 120-220ms is a starting
point, not a hard accessibility limit). Respect reduced motion and allow interruption.

No scroll hijacking, custom cursor, forced entrance sequence or infinite decorative movement
by default. Never delay a completed result merely to play an animation, or use fake progress
percentages. Reserve image, chart and loading geometry to avoid jumps. Add an animation library
only for a demonstrated interaction that existing CSS/browser tools cannot keep simple.

## Data-Heavy Screens

Read when tables, charts or dashboards are in scope. Start from the user's decision, not a wall
of metrics. Reuse table/toolbar/empty-state patterns; a universal configurable grid is not needed.
Use a simple table first, adding sorting, selection, pagination or virtualization for actual
requirements and measured scale. Keep essential row actions accessible on touch and keyboard.

Align comparable numbers, use tabular numerals, and show units, precision, date range, timezone
and data freshness where relevant. Format for the selected locale; missing is not zero and
partial/stale is not live. Preserve filters and selection deliberately during updates.

Charts need a useful question, honest scales, readable labels/legend and an accessible textual
summary or data alternative. Use more than color to distinguish important series/status. Avoid
3D decoration, misleading truncation and tooltips as the sole source of values. Only install a
chart package for real charts; use the selected shadcn chart conventions rather than a second theme.

## AI Interfaces

Read only for AI-assisted product UI. Distinguish generated text, retrieved evidence, proposed
operations and confirmed external effects. Show sources where available; do not invent citations,
certainty, tool completion or hidden reasoning. Offer concise visible rationale, not private
chain-of-thought. Surface meaningful waiting, partial, failed, cancelled and completed states.

Allow stopping generation; distinguish stopping the stream from cancelling a server operation.
Keep partial work and offer scoped retry. Do not autoscroll away from a reader inspecting earlier
content; offer a return-to-latest control. Require the product's approval for consequential
operations, with the affected target visible. Chat must not hide the actual result or recovery.
Render untrusted generated Markdown/links safely; no arbitrary HTML, scripts or automatic actions.

## Visual Acceptance

For a rendered UI change, inspect the actual affected screen and interaction in a browser before
claiming visual completion. A design image or JSX review is not a rendered-app check.

1. Compare with the agreed direction and existing siblings: hierarchy, spacing, typography,
   component reuse and the principal action. Fix visible issues, then inspect the changed result.
2. Check a narrow and a wide viewport, plus the breakpoint or dense-content case at risk. Useful
   starting widths are 390 and 1440 CSS pixels; include the 320px reflow case for changed layouts.
   Exercise the primary flow and relevant loading/empty/error states using safe fixtures.
3. Check keyboard/focus, resize/zoom, reduced motion for animation changes and all promised themes.
   Select supported browsers from project risk; one Chromium capture is not Safari/mobile proof.
4. Save a small before/after screenshot or trace set in the existing PR/test artifacts, with
   route, viewport, state, theme, browser and source/tested revision. New screens need no fake
   before image. Exclude secrets and real personal data; retain only useful evidence.

Use existing browser tools; Playwright is the default when introducing automation. Automate a
few critical interactions/visual baselines, not every component permutation. Keep fonts, fixtures
and environment deterministic and review baseline changes; do not mask the changed region or
relax thresholds to hide defects. [Visual comparisons](https://playwright.dev/docs/test-snapshots)
and [accessibility testing](https://playwright.dev/docs/accessibility-testing) explain the limits.
Add automated accessibility checks where supported and combine them with manual interaction checks.

A targeted local browser check is not the full application gate: broad builds/matrices remain
in CI under [quality-gate.md](quality-gate.md). Missing preview/browser access leaves visual
acceptance unverified with an owner and next action; it never becomes PASS. A documents-only
standards change needs document checks, not a fabricated demo or claimed screen evaluation.

## Reference Use

Reviewed 2026-09-17. The linked primary sources inform these rules; not every recommendation in
an external guide is adopted. [Vercel's interface guidance](https://vercel.com/design/guidelines)
is useful for interaction polish, not a mandatory brand or installation script. Never disable
zoom, apply its brand copy rules universally or replace WCAG contrast with another metric.
Research is not permission to install tools or copy an external design wholesale.

## Navigation

- [Documentation index](../INDEX.md)
- [Frontend implementation](frontend.md)
- [Quality gate](quality-gate.md)
- [Design note template](../templates/design-note.md)
