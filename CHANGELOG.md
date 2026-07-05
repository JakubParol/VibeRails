# Changelog

All notable changes to the VibeRails standards pack. Adopting repositories record the version
they adopted in their `docs/INDEX.md` so standard copies can be diffed and upgraded later.

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
  review checklists in `code-review-elitmind`.
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
