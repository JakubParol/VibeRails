# Learnings Inbox - code-review

Append a structured entry here when a review run uncovers a reusable improvement to this skill
(routing gap, checklist gap, publishing pitfall) and there is no time or approval to author the
full durable patch mid-task. This file lives in the standards repository; through the
user-scope junction it is writable from any repository, and every entry lands in the standards
checkout as an uncommitted change. Commit inbox entries promptly on any branch so they are not
lost.

Consolidation: a periodic session in the standards repository reviews the entries, turns
accepted ones into durable updates (SKILL.md or `references/`), and removes the consumed
entries.

## Entry Format

```markdown
## <YYYY-MM-DD> <short-slug>

- Symptom: <what went wrong or was missing during a review run>
- Root cause: <routing gap, checklist gap, unclear rule, tooling issue, or unknown>
- Verified fix: <what worked, plus how it was verified; mark "hypothesis" when not verified>
- Proposed durable update: <SKILL.md | references/<file>>
```

Rules: no secrets, personal data, identity objects, diff content, or finding text from real
reviews. Keep entries short; the durable patch carries the detail.

## Entries

None.

## Navigation

- Skill guide: [SKILL.md](SKILL.md)
