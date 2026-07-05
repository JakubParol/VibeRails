---
name: code-review
description: Orchestrate repository code reviews for local branches and pull requests. Use for review, code review, PR review, current PR review, pre-PR review, multi-agent review, independent agent review, review loop, or review-and-fix requests in adopting repositories. Supports local branch mode without a PR URL and Azure DevOps PR mode with a PR URL, including generic specialist routing for apps, services, packages, infrastructure, docs, tests, scripts, and .agents assets.
---

# Code Review

## Overview

Use this skill to run a structured repository review using independent review perspectives. It
supports two modes:

- Local branch mode: no PR URL is provided. Review the current branch and local changes
  read-only by default. Apply fixes only when the user explicitly asks for review-and-fix or
  approves proposed fixes, then run the relevant gates and repeat the focused loop.
- PR mode: an Azure DevOps PR URL is provided. Review the PR as a reviewer, run one or two
  passes, publish valid findings as inline PR comments, and cast an approve vote when no
  actionable findings remain. If the authenticated Azure DevOps user created the PR, run the
  review but keep the outcome local.

This skill is reusable across repositories. It must adapt to the current repository instead of
assuming a specific product topology. Load repository docs first, then route specialists from
changed paths and available local standards.

## First Use Policy

Before spawning independent review agents, check whether the current repository documents a
review-agent policy in root `AGENTS.md`, `.agents/README.md`, or another local instruction file.

If policy exists, follow it.

If policy is missing and the user requested review work:

1. Ask whether independent read-only review agents are allowed for this repository by default.
2. Explain that read-only review agents do not authorize fixes, commits, pushes, PR creation,
   PR completion, or merges.
3. If the user wants the answer saved, update the repository's canonical agent instructions
   such as root `AGENTS.md` or `.agents/README.md` after approval. Do not create hidden local
   policy files or commit personal preferences.
4. If the user declines agents, report the intentional exception and perform only the approved
   local review scope.

Local self-review does not satisfy a repository policy that requires independent review agents.
If subagent tooling is unavailable or blocked by tool policy, report that blocker or explicit
exception before final reporting.

## Guardrails

- Start from the repository root and follow root `AGENTS.md` before reviewing or editing.
- Inspect `git status --short --branch` before changing files, switching branches, committing,
  pushing, or posting comments.
- Protect unrelated user work. Never revert, stash, stage, commit, or overwrite unrelated
  changes without explicit approval.
- In PR mode, do not push fixes, update PR metadata, resolve threads, complete the PR, or merge
  without explicit user approval. Inline finding comments and reviewer votes are part of the
  requested PR review outcome unless the user explicitly asks for a read-only review or the
  authenticated Azure DevOps user created the PR.
- In local branch mode, do not make fixes unless the user asked for review-and-fix or approved
  proposed fixes.
- Review only changed code for diff-based findings. Mention pre-existing code only when it is
  necessary to explain a changed-line issue.
- Do not weaken lint, type, test, security, import-boundary, or quality-gate rules.
- Never expose secrets, tokens, raw customer data, raw personal data, PII, raw OCR text,
  prompts, credentials, request bodies, headers, or authorization values in findings, comments,
  agent prompts, or prompt drafts. Redact sensitive diff excerpts before sending them to review
  agents.

## Workflow

1. Detect the mode:
   - PR URL present: use [PR mode](references/pr-mode.md).
   - No PR URL: use [local branch mode](references/local-branch-mode.md).
2. Load repository context from root `AGENTS.md`, `README.md`, `docs/INDEX.md`, and required
   local standards.
3. Resolve review-agent authorization with
   [agent-authorization.md](references/agent-authorization.md).
4. Build the changed-path inventory:
   - identify base branch and changed files;
   - include committed, staged, unstaged, and relevant untracked files in local mode;
   - include only PR changes in PR mode.
5. Route specialists with [area-routing.md](references/area-routing.md).
6. Spawn independent read-only review agents when authorized:
   - Agent 1 - Diff Content Review;
   - Agent 2 - Standards and Infrastructure Review;
   - area specialists when changed paths require them.
7. Give each agent only its scope, changed paths, required docs, review rules, and output
   format. Do not give one agent another agent's conclusions before it finishes.
8. Aggregate results with [output.md](references/output.md):
   - keep agent sections separate;
   - remove duplicates only in a separate orchestrator triage section;
   - classify severity with [severity-and-comments.md](references/severity-and-comments.md).
9. Local mode:
   - stay read-only unless the user asked for review-and-fix or approves proposed fixes;
   - in read-only review, report expected gates and run them only when requested;
   - in review-and-fix mode, repeat the review, fix, gate, and focused-review loop until no
     actionable findings remain, a blocker or user decision is required, or five cycles
     complete.
10. PR mode:
   - before publishing review output, check whether the authenticated Azure DevOps user created
     the PR:

     ```powershell
     .\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action SelfReviewStatus -PrId <pr-id>
     ```

   - run one or two review passes with read-only review agents when authorized;
   - when `isSelfReview` is `false`, publish each valid finding as an inline PR comment through
     the Azure DevOps wrapper;
   - when `isSelfReview` is `false`, cast an approve vote when no actionable findings remain;
   - when `isSelfReview` is `true`, do not publish finding comments, summary substitutes, or
     reviewer votes; report local findings or a local clean result instead;
   - ask before fixing, pushing, updating PR metadata, completing, or merging.

## Required Agent Prompts

Every review agent prompt must include:

- mode and source of truth: local branch diff or PR URL;
- assigned responsibility and owned path scope;
- exact changed files or sanitized diff snippets it should review;
- required docs from [area-routing.md](references/area-routing.md);
- instruction not to reproduce secrets, raw personal data, PII, raw customer data, raw OCR
  text, prompts, credentials, request bodies, headers, or authorization values;
- instruction to review changed lines only unless a surrounding unchanged line explains a
  changed-line issue;
- instruction to produce evidence-backed findings with path and line references;
- instruction to report "No findings" when there are no actionable issues;
- severity scale from [severity-and-comments.md](references/severity-and-comments.md).

For any Azure DevOps PR read or write operation, load and follow
[`azure-devops`](../azure-devops/SKILL.md) before calling Azure DevOps tools.
Read-only discovery is allowed in PR mode. Review-output writes follow the PR mode publishing
rules above; other PR writes still require explicit user approval.

## Failure Learning

When a review run uncovers a reusable improvement to this skill (routing gap, checklist gap,
publishing pitfall) with a verified fix, append a structured entry to
[LEARNINGS.md](LEARNINGS.md) using the format documented there. These files reach sessions
through a user-scope junction, so entries land in the standards repository working tree.
Author durable patches only with user approval on a standards-repository branch. Do not record
one-off issues, unverified workarounds, or any content from real diffs and findings.

## References

- [references/agent-authorization.md](references/agent-authorization.md) - review-agent
  authorization and policy discovery.
- [references/local-branch-mode.md](references/local-branch-mode.md) - local branch review and
  review-and-fix workflow.
- [references/pr-mode.md](references/pr-mode.md) - Azure DevOps PR review, publishing, and fix
  workflow.
- [references/area-routing.md](references/area-routing.md) - specialist routing, required docs,
  and expected gates by changed path.
- [references/severity-and-comments.md](references/severity-and-comments.md) - P0-P3 severity
  model and PR comment policy.
- [references/output.md](references/output.md) - required report structure and loop reporting.
- [LEARNINGS.md](LEARNINGS.md) - mid-task learnings inbox; consolidated into durable updates
  in the standards repository.

## Navigation

- Skills index: [../README.md](../README.md)
- Repository docs: [../../../docs/INDEX.md](../../../docs/INDEX.md)
