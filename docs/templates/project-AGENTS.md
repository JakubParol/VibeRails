# AGENTS.md - <Project Name>

Root instruction file for agents working in this project.

## Context

Follow `agent-workflow.md` from the owning standards path (see `docs/INDEX.md`); it routes all
task context. Apply `kis.md`: if a simple solution is enough, keep it simple.
Additional required reading for this project: `<none unless needed>`.

Project purpose, main applications, services and boundaries: `<short description or link>`.
Stack profile: `<profile, or see .viberails/adoption.json target.projectProfiles>`.

## Adopted Configuration

`.viberails/adoption.json` holds selected configuration and instruction pins; do not repeat its
values here. Without `configuration`, the project's existing policy applies. Local architecture
decisions or exceptions: `<links or none>`.

## VibeRails Decisions

Filled from the user's onboarding answers only, never from recommendations:

- Git after a requested task: `<allowed actions and scope, including "nothing">`.
- Code review: `<automatic or on request>`; staffing `<agent decides or at least one additional agent>`.
- Additional agents and models: `<allowed with agent choice, user-specified pool, same as main, or solo>`.
- Test cadence: `<after all story tasks before the final commit/push, or before each task>`.
- Deferred decisions: `<owner and next action, for example UI direction before the first screen, or none>`.

These record a standing grant for requested work; filling the template grants nothing.

## KIS

- Decision model: `<jev | microsoft-decision-1 | none>`; version or deployment `<jev-1.13.0 or deployment name>`.
- Connection: `<working | not connected yet: next action>`. Credentials stay outside Git.
- Fallback: the main agent decides when the model is unavailable or unclear.
- KIS reviewer: `<kis-review skill or none>`, used only for substantial changes with an open
  simplicity question.

## Change Protocol Deltas

Follow `change-protocol.md`. Project-specific differences only:

- Base branch `<main>`; branch naming `<convention>`; commit convention `<convention>`.
- Preferred handoff and owner: `<local result | draft PR | project workflow>`.

## Quality Gate

Follow `quality-gate.md`. Actual commands and required CI checks:

| Path prefix | Scope | Working directory | Focused local command | Required CI check |
|---|---|---|---|---|
| `<services/api/**>` | `<api>` | `<services/api>` | `<scoped command>` | `<ci check>` |
| `<shared tooling>` | shared | `<repo root>` | `<small regression>` | `<full required coverage>` |

## Local Rules And Hazards

`<project-specific constraints, warnings and documentation differences, or none>`
