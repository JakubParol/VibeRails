# Severity And PR Comments

Use this severity scale for findings and PR comments.

## Severity Scale

| Prefix | Label | Use when |
|---|---|---|
| `P0` | Critical | The change can leak secrets or personal data, corrupt data, break deployment, create a serious security issue, or make the app/service unusable. |
| `P1` | High | The change likely causes an incorrect behavior, failed request, broken user flow, missing authorization, import-boundary violation, or failing required gate. |
| `P2` | Medium | The change is plausibly wrong in an edge case, weakens maintainability, misses important tests, introduces avoidable coupling, or creates operational risk. |
| `P3` | Low | The change is a minor maintainability, readability, naming, documentation, or low-risk consistency issue worth fixing before merge. |

Use `P3` sparingly. Do not publish nit-only comments unless they point to a repeated pattern or
prevent future mistakes.

Map to user-facing labels when needed:

- High: `P0` or `P1`
- Medium: `P2`
- Low: `P3`

## Finding Requirements

A valid finding must include:

- severity prefix and label;
- concise title;
- evidence from a changed file and line; for local-only reviews a changed-file summary finding
  is acceptable when no single line owns the risk;
- risk or failure mode;
- actionable recommendation;
- whether it should be fixed locally, posted as an inline PR comment, or discussed first.

Reject findings that are:

- outside the PR/local diff;
- speculative without a credible failure mode;
- style preferences not backed by project standards;
- duplicates of another unresolved PR comment;
- demands for broad refactors unrelated to the change.

## PR Comment Policy

When posting Azure DevOps PR comments, use the language requested by the repository or user.
If no language is specified, match the surrounding PR discussion and repository documentation.
Always include a severity prefix:

```text
P1: Ten endpoint zwraca surowy wyjatek poza standardowa koperta bledow. Prosze mapowac blad
aplikacyjny przez wspolny handler, zeby zachowac kontrakt API i nie ujawnic szczegolow
implementacji.
```

Comment rules:

- Start with `P0:`, `P1:`, `P2:`, or `P3:`.
- Be concise, technical, and actionable.
- Prefer one concrete recommendation over a broad explanation.
- Use a direct, professional technical instruction.
- For Azure DevOps PRs, follow [pr-mode.md](pr-mode.md#mcp-inline-comment-capability): inline comments are
  the required default for review findings only when the current request explicitly authorizes
  normal PR review output and MCP exposes a valid inline-comment operation with the required
  current anchor.
- Include path and line evidence in the comment text when helpful.
- Use only the actual MCP read and inline-comment operations. If the required MCP operation or
  anchor is unavailable, report the scoped limitation and keep the finding local; do not use a
  wrapper, CLI, REST/API, or summary substitute.
- Do not mention internal agent names in PR comments unless the user explicitly asks.
- Do not paste long code blocks into PR comments. Use short snippets only when necessary.
- Do not publish "No findings" comments. Cast an approve vote only when the current request
  explicitly authorizes normal PR review output, the PR review has no actionable findings, and
  MCP confirms a non-self-review identity and exposes a vote operation; self-review or unknown
  identity reports the clean result locally.

## Inline Comment Format

When reporting published inline comments or a read-only exception, use this shape:

```markdown
- `P1` `<repo-relative-path>:42`
  Comment: P1: ...
  Reason: ...
```

After publishing, report the PR thread/comment IDs when available.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
