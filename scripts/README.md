# Scripts

This folder contains repository maintenance commands for VibeRails.

## Commands

| Script | Purpose |
|---|---|
| [validate.ps1](validate.ps1) | Run the VibeRails documentation and skill quality gate. |
| [install-skills.ps1](install-skills.ps1) | Install the skills at the Codex user scope (`$HOME\.agents\skills`) as junctions to this checkout. `-Remove` deletes the junctions. Local machine state only; touches nothing outside `$HOME\.agents\skills`. |

## Rules

- Keep scripts deterministic and safe for read-only validation by default.
- Do not add commands that contact live services unless the script name and documentation make
  that behavior explicit.
- Keep generated credentials, tokens, and personal local paths out of scripts.

## Navigation

- [Repository README](../README.md)
- [Documentation index](../docs/INDEX.md)
