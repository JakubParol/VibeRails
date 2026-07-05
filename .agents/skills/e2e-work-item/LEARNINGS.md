# Learnings Inbox - e2e-work-item

Append a structured entry here when an E2E run uncovers a reusable improvement to this skill
(runbook gap, state-flow pitfall, planning rule) and there is no time or approval to author the
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

- Symptom: <what went wrong or was missing during an E2E run>
- Root cause: <runbook gap, work item process mismatch, tooling issue, or unknown>
- Verified fix: <what worked, plus how it was verified; mark "hypothesis" when not verified>
- Proposed durable update: <SKILL.md | references/<file> | adopting repo docs>
```

Rules: no secrets, personal data, identity objects, or customer content. Work item process
facts specific to one project belong in that repository's docs, not here. Keep entries short;
the durable patch carries the detail.

## Entries

None.

## Navigation

- Skill guide: [SKILL.md](SKILL.md)
