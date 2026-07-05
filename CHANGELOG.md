# Changelog

All notable changes to the VibeRails standards pack. Adopting repositories record the version
they adopted in their `docs/INDEX.md` so standard copies can be diffed and upgraded later.

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
