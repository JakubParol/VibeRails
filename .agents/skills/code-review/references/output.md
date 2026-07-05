# Review Output

Use this output structure for user-facing reports. Keep it concise and evidence based.

## Contents

- [Agent Sections](#agent-sections)
- [Orchestrator Triage](#orchestrator-triage)
- [Local Fix Report](#local-fix-report)
- [Review-And-Fix Loop Report](#review-and-fix-loop-report)
- [PR Comment Publishing](#pr-comment-publishing)
- [Self-Review Publishing](#self-review-publishing)
- [Final Report Checklist](#final-report-checklist)
- [Navigation](#navigation)

Do not include secrets, credential-bearing URLs, raw customer data, raw personal data, PII, raw
OCR text, or prompt content in reports, PR comments, or loop summaries.

## Agent Sections

Do not merge feedback inside the agent sections. Preserve the independent review result:

```markdown
## Agent 1 - Diff Content Review

### Findings
- `P1` Title
  Evidence: `path/to/file.ext:42`
  Risk: ...
  Recommendation: ...

### No Findings
- State "No findings" only when the agent found no actionable issue.

## Agent 2 - Standards And Infrastructure Review

### Findings
- ...
```

For specialists, add a separate section per specialist:

```markdown
## Specialist - Frontend
## Specialist - API Service
## Specialist - Infrastructure
```

## Orchestrator Triage

After the agent sections, add a separate triage section:

```markdown
## Orchestrator Triage

- Keep: `P1` Finding title - reason.
- Merge duplicate: Agent 2 and Frontend Specialist both reported the same boundary issue;
  use Agent 2 wording.
- Reject: `P3` Finding title - outside diff / not actionable / already covered.
- Needs user decision: ...
```

This is the only section where duplicate findings may be merged or rejected.

## Local Fix Report

When fixes were made, report:

```markdown
## Fixes Applied

- Fixed ...
- Added/updated tests ...

## Verification

- Ran `.\scripts\lint.ps1 api` - passed.
- Not run: `<documented e2e command>` - not applicable; no rendered UI behavior changed.

## Remaining

- No remaining actionable findings.
```

If a fix requires a commit and the user authorized commits, commit only the files belonging to
that logical step. If no commit was made, state that explicitly.

## Review-And-Fix Loop Report

When running review-and-fix, include one concise status block per cycle:

```markdown
## Review-And-Fix Loop

### Cycle 1
- Findings fixed: ...
- Verification: Ran `...` - passed / failed / not run because ...
- Rerun review: clean / findings remain.
- Remaining: no actionable findings / ... blockers or user decisions.
```

After the last cycle, state whether the loop stopped clean, stopped on remaining findings that
need a user decision, hit a blocker, or reached the five-cycle limit.

## PR Comment Publishing

In PR mode, review findings should be posted as inline PR comments after orchestrator triage when
`SelfReviewStatus.isSelfReview` is `false`:

```markdown
## Published PR Comments

- `P1` `path/to/file.ext:42`
  Thread: <thread-id>
  Comment: P1: ...
  Internal source: Diff Content Review finding title.
```

Keep internal review source metadata outside the PR comment text. If a valid finding cannot be
anchored inline, report the blocker instead of posting a summary substitute. PR comment wording
and publishing policy stay in [severity-and-comments.md](severity-and-comments.md).

When no actionable findings remain and `SelfReviewStatus.isSelfReview` is `false`, report the
approve vote:

```markdown
## Reviewer Vote

- Cast `approve` on PR <id>.
```

Ask before fixing findings, pushing commits, updating PR metadata, resolving existing threads,
completing, or merging the PR.

## Self-Review Publishing

When `SelfReviewStatus.isSelfReview` is `true`, do not publish PR finding comments, summary
substitutes, or reviewer votes. Report the local result instead:

```markdown
## Self-Review Publishing

- Skipped PR comments and reviewer vote because the authenticated Azure DevOps user created PR <id>.
- Local result: findings reported below / no actionable findings.
```

## Final Report Checklist

Every final response must include:

- changed files or areas reviewed;
- review-agent usage: how many, which roles, and whether each returned clean or with findings;
  if none, identify the explicit user opt-out, missing repository policy, or blocker and state
  whether a required independent review-agent pass was satisfied;
- review-and-fix loop outcome, when applicable: cycle count, findings fixed, verification run,
  rerun review result, and remaining findings or blockers;
- PR self-review status, when reviewing an Azure DevOps PR;
- fixes made, if any;
- commits made, if any;
- verification run;
- verification not run and why;
- inline comments posted, if any;
- reviewer vote cast, if any;
- intentional exceptions;
- unresolved blockers or follow-up questions.

## Navigation

- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
- Repository docs: [../../../../docs/INDEX.md](../../../../docs/INDEX.md)
