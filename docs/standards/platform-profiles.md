# Platform Profiles Standard

Platform profiles describe how scripts and commands should be documented for Windows, Linux,
and macOS adopting repositories.

## Profiles

| Profile | Use when |
|---|---|
| `powershell` | The repository standardizes on PowerShell scripts. |
| `posix-shell` | The repository standardizes on POSIX shell scripts. |
| `both` | The repository supports both PowerShell and POSIX shell entrypoints. |

## Rules

- Record the selected profile in `.viberails/adoption.json`.
- Document canonical commands in `README.md`, `AGENTS.md`, and quality gate docs.
- When `both` is selected, either keep commands behaviorally equivalent or document which
  command is canonical.
- Prefer repository scripts over long inline commands in documentation.
- Do not require PowerShell for adoption on Linux/macOS unless the target repository already
  requires it.
- Do not require POSIX shell for adoption on Windows unless the target repository already
  requires it.

## Recommended Command Shape

| Purpose | PowerShell example | POSIX shell example |
|---|---|---|
| Install dependencies | `./scripts/setup.ps1` | `./scripts/setup.sh` |
| Quality gate | `./scripts/quality-gate.ps1` | `./scripts/quality-gate.sh` |
| Scoped gate | `./scripts/quality-gate.ps1 -Changed` | `./scripts/quality-gate.sh --changed` |

The target repository decides exact script names. VibeRails only requires the commands to be
documented and repeatable.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption standard](adoption.md)
- [Quality gate](quality-gate.md)
