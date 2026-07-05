# Learnings Inbox - azure-devops-elitmind

Append a structured entry here when a run uncovers a reusable Azure DevOps fix and there is no
time or approval to author the full durable patch mid-task. This file lives in the standards
repository; through the user-scope junction it is writable from any repository, and every
entry lands in the standards checkout as an uncommitted change. Commit inbox entries promptly
on any branch so they are not lost.

Consolidation: a periodic session in the standards repository reviews the entries, turns
accepted ones into durable updates (SKILL.md, `references/`, or `scripts/`), and removes the
consumed entries. Follow the criteria and sanitization rules in
[references/context-and-learning.md#failure-learning-update-pattern](references/context-and-learning.md#failure-learning-update-pattern).

## Entry Format

```markdown
## <YYYY-MM-DD> <short-slug>

- Symptom: <failing action or command class and sanitized error>
- Root cause: <CLI gap, API version mismatch, quoting, encoding, wrapper bug, or unknown>
- Verified fix: <replacement command or change, plus how it was verified; mark "hypothesis"
  when not verified>
- Proposed durable update: <SKILL.md | references/<file> | scripts/<file> | adopting repo docs>
```

Rules: no secrets, tokens, personal data, identity objects, or customer content. Keep entries
short; the durable patch carries the detail.

## Entries

None.

## Navigation

- Skill guide: [SKILL.md](SKILL.md)
- Failure learning pattern: [references/context-and-learning.md](references/context-and-learning.md)
