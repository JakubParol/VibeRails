# Agent Assets

This folder contains repository-scoped assets for AI agents working with VibeRails standards.

## Structure

| Path | Purpose |
|---|---|
| [skills](skills/README.md) | Versioned Codex skills that capture repeatable ElitMind workflows. |

## Rules

- Keep agent assets free of secrets, tokens, credentials, and personal data.
- Keep skills generic enough to be copied into many ElitMind repositories.
- Prefer reusable scripts or concise references when agents repeatedly make the same tool calls.
- Put repository-specific decisions in the adopting repository's local docs or `AGENTS.md`, not
  in this standards repository.
- Run skill validation and a documentation/navigation check before reporting skill changes as
  complete.

## Navigation

- Up: [../README.md](../README.md)
- Up: [../AGENTS.md](../AGENTS.md)
