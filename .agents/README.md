# Agent Assets

This folder contains repository-scoped assets for AI agents working with VibeRails standards.

## Structure

| Path | Purpose |
|---|---|
| [skills](skills/README.md) | Optional versioned Codex skills that capture repeatable repository workflows. |

## Rules

- Keep agent assets free of secrets, tokens, credentials, and personal data.
- Keep skills generic enough to be used across many adopting repositories.
- Keep skills opt-in. Adoption does not copy `.agents/skills/` by default.
- Prefer reusable scripts or concise references when agents repeatedly make the same tool calls.
- Put repository-specific decisions in the adopting repository's local docs or `AGENTS.md`, not
  in this standards repository.
- Run skill validation and a documentation/navigation check before reporting skill changes as
  complete.

## Navigation

- Up: [../README.md](../README.md)
- Up: [../AGENTS.md](../AGENTS.md)
