# Quality Gate

Run from: `<project-root>`

## Canonical Command

Use this command before creating a PR:

```bash
<single-quality-gate-command>
```

## Command Details

```bash
# format or auto-fix

# lint

# type check

# test

# build
```

## Path-To-Scope Map

| Changed path | Scope | Commands | Required before PR |
|---|---|---|---|
| `<path-prefix-or-glob>` | `<scope>` | `<command>` | yes |

## Required Before PR

- All commands above pass.
- Documentation is updated when behavior, setup, architecture, or local rules changed.
- Known limitations are listed in the PR.

## Navigation

- Documentation index: `INDEX.md`
