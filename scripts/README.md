# Scripts

This folder contains repository maintenance commands for VibeRails.

## Commands

| Script | Purpose |
|---|---|
| [validate.mjs](validate.mjs) | Cross-platform VibeRails documentation and skill quality gate. |
| [validate.ps1](validate.ps1) | PowerShell quality gate with the same checks plus `.ps1` syntax parsing. |
| [install-skills.sh](install-skills.sh) | POSIX installer for optional skills at the Codex user scope (`$CODEX_HOME/skills` or `$HOME/.codex/skills`) as symlinks to this checkout. `--remove` deletes only the symlinks. |
| [install-skills.ps1](install-skills.ps1) | PowerShell installer for optional skills at the Codex user scope (`$env:CODEX_HOME\skills` or `$HOME\.codex\skills`) as Windows junctions or Unix symlinks. `-Remove` deletes only the links. |

## Rules

- Keep scripts deterministic and safe for read-only validation by default.
- Do not add commands that contact live services unless the script name and documentation make
  that behavior explicit.
- Keep generated credentials, tokens, and personal local paths out of scripts.

## Navigation

- [Repository README](../README.md)
- [Documentation index](../docs/INDEX.md)
