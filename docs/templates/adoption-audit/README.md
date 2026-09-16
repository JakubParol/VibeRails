# Adoption Audit Internals

These modules preserve the existing optional target-side audit checks, split by responsibility
so each source stays below the 400-line limit. They are not separate commands or a new runner.
Run [adoption-audit.mjs](../adoption-audit.mjs) with the explicit target root. When copying the
optional audit, include this directory alongside [adoption-state.mjs](../adoption-state.mjs)
and [adoption-pins.mjs](../adoption-pins.mjs). Node is an optional maintenance prerequisite, not
an adopted application's runtime dependency. No checks execute manifest commands or call providers.

| Module | Responsibility |
|---|---|
| [values.mjs](values.mjs) | Concrete values, placeholders, enums and safe remote syntax. |
| [providers.mjs](providers.mjs) | Existing integration, skill, auth, PR and self-improve record checks. |
| [records.mjs](records.mjs) | Project roots, commands, copied files, questions and report mirrors. |
| [navigation.mjs](navigation.mjs) | Local Markdown links, headings and reachability; not a full CommonMark parser. |

Selected configuration and pins add strict checks without claiming full schema completeness,
real MCP access, executed project checks or behavioral compliance. Legacy manifests remain
explicitly unselected. See [the adoption contract](../../standards/adoption.md).

## Navigation

- [Documentation index](../../INDEX.md)
- [Audit entrypoint](../adoption-audit.mjs)
