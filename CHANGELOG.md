# Changelog

All notable changes to the VibeRails standards pack. Adopting repositories record the version
they adopted in their `docs/INDEX.md` so standard copies can be diffed and upgraded later.

## 0.5.0 - Web UI Quality Contract

- Require project-owned shadcn/ui for React web components, with no raw Radix in feature code;
  prefer shadcn Base UI for new foundations without auto-migrating existing shadcn internals.
- Keep styles at their owning components; reserve global CSS for tokens, reset and document base.
- Add a shared web UI/UX standard for visual direction, composition, responsive/accessibility
  behavior, data/AI states, restrained motion and actual browser acceptance evidence.
- Reconcile feature colocation, public boundaries, interactive primitives, compound exports,
  server reads and the difference between pure-unit and rendered interaction testing.
- Route adoption, stack profiles, context selection, review and templates to the same owners.

This tightens the earlier optional shadcn and visual-check guidance. Existing adopters keep their
pinned policy until an authorized refresh; record necessary UI migration rather than claiming
compliance from new documentation. The delivery PR identifies the verified source and merge.
No application, package installation, release tag or completed 08/09 runtime evaluation is implied.

## 0.4.4 - Guided Adoption Onboarding

- Put a ready-to-paste setup prompt before optional skill installation in the root README.
- Guide configuration through conditional, small question groups and one scoped approval;
  preserve existing knowledge and distinguish planned applications from implemented roots.
- Help configure selected Azure DevOps/Jira MCP connections, guide safe login and verify scoped
  reads; record deferral and missing capabilities separately from intended provider selection.
- Resume after login/reload without repeating onboarding. No provider wrappers, new manifest
  schema, wizard runtime or automatic product implementation is introduced.

This documentation delivery has advance scoped merge authority, subject to final-head checks.
The delivery PR identifies its actual merge; this entry is not a release tag or evidence of
live MCP setup, fresh-session success, cross-model improvement or completed 08/09 experiments.

## 0.4.3 - 2026-09-16 - Audit Corrections

- Preserve unrelated user-scope skill links during installation and removal; replacing another
  checkout requires an explicit collision resolution, not automatic repair.
- Reject empty gate maps, non-string paths/commands and undefined project gate scopes.
- Compare the human configuration table by key and value, including version; unrelated text,
  duplicates and examples cannot conceal a mismatch. Legacy/unselected records are preserved.
- Require a concrete rationale for a documented stack exception. Keep audits read-only.
- Add targeted record and POSIX installer regressions. PowerShell ownership changes are
  statically reviewed only; original 08/09 model/handoff criteria remain in Verification.

This entry closes only the user-authorized audit corrections after confirmed PR merge.
It is not a new model evaluation, release tag or automatic change to adopter settings.

## 0.4.2 - Instruction Inventory Corrections

- Fingerprint explicitly configured standard files outside conventional folders, so their
  changes cannot pass with stale instruction pins.
- Validate selected vendored skill entrypoints and reject duplicate/path-like selections and
  symlinked vendored content instead of silently omitting it from the snapshot.
- Resolve repository-root aliases before checking link containment; legitimate local links
  stay local while external links still fail.
- Add focused negative regressions and platform-scoped adoption checks. Earlier frozen
  comparison revisions remain unchanged; this entry makes no model-performance claim.

## 0.4.1 - 2026-09-16 - Shared Instruction Refinement

- Shorter review/E2E routers and precise provider/activation boundaries in one general set.
- Advance task-scoped merge authority retained without redundant permission questions; current
  evidence and approved scope still gate the operation. Azure identity rules stay in Azure mode.
- Public/synthetic instruction review distinguished from protected private prompts and payloads.
- All 15 research leads assessed, including six unavailable originals. Documentary model support,
  author semantic checks and executed verification are separated; no tuned route or measured
  cross-model/cost improvement is claimed. The 0.4.0 comparison baseline remains unchanged.

This entry is pre-merge closeout under the user's advance stage 08 authorization. The stage PR's
final source and confirmed merge identify this version; an open PR is not a completed release.
No tag or automatic update of adopting project pins is created.

## 0.4.0 - 2026-09-16 - General Baseline

- Complete agent-guided adoption and refresh with explicit version-1 configuration; legacy
  manifests remain unselected. No implicit presets, runtime loader or model-specific prompt fork.
- Optional read-only configuration/version and instruction-pin audit, preserving existing
  manifest/document checks. Unsupported versions and changed instruction bytes cannot pass.
- Stable source/path identities, immutable Git refs and actual adopted-byte fingerprints;
  local decisions, partial-refresh provenance and unobserved runtime context stay explicit.
- Controlled fresh and multi-root update evidence, preserved native commands and small regression
  tests. Structural checks do not claim code compliance, live provider access or all-client support.

The user accepted this general baseline and authorized merge on 2026-09-16. The final source
and confirmed merge of [PR #14](https://github.com/JakubParol/VibeRails/pull/14) identify the
frozen baseline for 08/09. While that PR is open, this entry is prepared closeout, not a
completed merge or published release. No release tag is created by this entry.

## 0.3.0 - 2026-07-05

- Generic adoption contract: Codex-first, process-neutral adoption across Windows, Linux, and
  macOS with explicit stack, work tracking, code hosting, and script platform profiles.
- New adoption manifest standard and templates for `.viberails/adoption.json` and
  `docs/viberails-adoption.md`.
- New integration and platform profile standards for Azure DevOps Boards, Jira, GitHub, Azure
  Repos, PowerShell, and POSIX shell decisions.
- First-stage self-improve loop: adopting repositories now record where agents should search,
  create, or comment tickets for reusable Azure DevOps, Jira, Git, and GitHub CLI failures.
- Agent skills renamed away from source-specific names and documented as optional assets, not
  files copied by default during adoption.
- Follow-up hardening: Codex skill installers now target `$CODEX_HOME/skills` or
  `$HOME/.codex/skills`, POSIX skill installation is documented, GitHub PR review falls back to
  local-diff mode instead of Azure DevOps publishing, self-improve manifest fields are
  structured for auth/dedupe/comment behavior, template indexes include the new required
  standards, and validation now rejects CRLF/trailing whitespace and source-specific terms
  outside an explicit validator allowlist.
- Adoption review hardening: self-improve writes now gate on read auth, dedupe, write auth, and
  task approval in that order; manifests include PR target branch, copied-file shapes,
  path-to-scope map shapes, alternate self-improve clients, and open-question taxonomy; target
  adoption gets a repeatable preflight, merge preservation report, generated-folder audit
  exclusions, optional target-side audit script, and BOM rejection in validators.
- Audit follow-up: target-side adoption audit now defaults to the current working directory,
  ignores placeholders inside copied standards and fenced examples, validates profile enums
  and key auth/self-improve fields, and documentation now distinguishes provider profile
  support from bundled automation coverage.
- Multi-root hardening: adoption manifests now include `target.projectProfiles[]`, target audit
  checks documented project roots, quality gate templates preserve working directories and CI
  context, unsupported real providers are distinct from `none`, and repository validators skip
  generated/dependency folders.
- Validator cleanup: source-specific leakage terms now live in a small denylist file instead
  of being hard-coded in validator logic.
- Final audit polish: target adoption audit discovers likely monorepo roots, requires an
  explicit self-improve disabled decision, catches embedded manifest placeholders, and
  self-improve templates now include custom ticket and local file sinks.
- Code-hosting policy polish: adoption now records draft PR defaults, allowed PR writes, and
  review publishing behavior separately from the selected code-hosting profile.
- Audit strictness polish: target adoption audit now requires a root project profile, validates
  selected self-improve sink coordinates, treats discovered roots as covered only by matching
  documentation roots, expands likely monorepo containers, and avoids false positives for
  ordinary Markdown HTML tags and autolinks.
- Manifest consistency polish: target adoption audit now requires `exceptions` and
  `openQuestions`, and the human adoption record uses `none` instead of `n/a` for local-only PR
  targets.
- Final review polish: project templates list the full per-root profile set, the target audit
  validates required source/target manifest fields, PR write operation enums, actionable open
  question fields, and common top-level project-root folders, while placeholder scanning now
  ignores fenced examples and ordinary HTML/autolinks but still catches unresolved inline
  adoption tokens.
- Contract consistency polish: target adoption audit now validates self-improve labels,
  provider labels, dedupe metadata, and comment templates; PR write permissions must match the
  selected code-hosting profile; copy-ready adoption-record links are allowed in source
  templates without introducing broken target links.
- Adoption routing polish: manifests now record provider-specific integration coordinates and
  Codex skill-linking decisions; the target audit checks copied-file existence and mirrors key
  manifest values into the human adoption report.
- Final review polish: copied project docs now use real Markdown link templates, adoption
  templates avoid `n/a` placeholder conflicts, preflight avoids raw remote inspection, and Azure
  DevOps REST failures no longer throw raw response bodies.
- Copy-template polish: target audits now reject leftover replacement-instruction prose in
  adopted Markdown, and project documentation index templates use link placeholders for the
  adoption record and repository index.
- Validator polish: project documentation template links that use `<relative-path-to-repo>` now
  verify copied standards by real source file existence instead of accepting every standards
  prefix.

## 0.2.0 - 2026-07-03

- Azure DevOps wrappers hardened: shared `ado-common.ps1`, hang-proof az calls with timeouts,
  HTML sign-in detection, native-CLI-first channel order, `Doctor` diagnostics, summary
  outputs with `-Raw`, comments API pinned to `7.1-preview` (extension 1.0.3 compatibility),
  identity fallback through `az account show`.
- New `references/troubleshooting.md` with a symptom-to-next-step table; indirection-only
  reference routers removed from the Azure DevOps and code review skills.
- Scoped quality gate policy: local gate proves the changed scope, CI proves the repository;
  path-to-scope map and recommended gate script interface in `quality-gate.md`.
- Anti-shortcut standards: layer definition-of-done checklists and wrong/right examples in
  `backend.md`, required import-linter contracts, test value rules in both test standards,
  review checklists in `code-review`.
- E2E runbook split: User Story child-task logic moved to a reference loaded only for User
  Story runs; final guard rails follow the scoped gate.
- Distribution model: skills install once per machine at the Codex user scope via
  `scripts/install-skills.ps1` junctions; adoption no longer copies skills.
- Self-improvement loop: per-skill `LEARNINGS.md` inbox plus junction-based durable patch
  routing; failure learning extended to all three skills.

## 0.1.0 - 2026-07-03

- State of the pack before the optimization effort tracked in `ROADMAP.md`.

## Navigation

- [Repository README](README.md)
- [Documentation index](docs/INDEX.md)
