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

When posting Azure DevOps PR comments in ElitMind repositories, write them in Polish by default
with a severity prefix unless the repository or user explicitly requests English:

```text
P1: Ten endpoint zwraca surowy wyjatek poza standardowa koperta bledow. Prosze mapowac blad
aplikacyjny przez wspolny handler, zeby zachowac kontrakt API i nie ujawnic szczegolow
implementacji.
```

Comment rules:

- Start with `P0:`, `P1:`, `P2:`, or `P3:`.
- Be concise, technical, and actionable.
- Prefer one concrete recommendation over a broad explanation.
- Use "Prosze" or an imperative technical instruction; keep tone professional.
- For Azure DevOps PRs, follow [pr-mode.md](pr-mode.md#pr-comment-posting): inline comments are the
  required default for review findings when PR publishing is authorized.
- Include path and line evidence in the comment text when helpful.
- Use the `azure-devops-elitmind` wrapper so PR iteration context and `changeTrackingId` are
  verified before posting.
- Do not mention internal agent names in PR comments unless the user explicitly asks.
- Do not paste long code blocks into PR comments. Use short snippets only when necessary.
- Do not publish "No findings" comments. Cast an approve vote only when PR publishing is
  authorized, the PR review has no actionable findings, and `SelfReviewStatus.isSelfReview` is
  `false`; self-created PR reviews report the clean result locally.

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
