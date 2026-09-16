---
name: code-review
description: Orchestrate repository code reviews for local branches and pull requests. Use for review, code review, PR review, current PR review, pre-PR review, multi-agent review, independent agent review, review loop, or review-and-fix requests in adopting repositories. Supports local branch mode, GitHub PR local-diff mode, and Azure DevOps PR mode, including generic specialist routing for apps, services, packages, infrastructure, docs, tests, scripts, and .agents assets.
---

# Code Review

## Overview

Use this skill to run a structured repository review with coverage matched to the actual change.
It supports three modes:

- Local branch mode: no PR URL is provided. Review the current branch and local changes
  read-only by default. Apply fixes only when the user explicitly asks for review-and-fix or
  approves proposed fixes, then run the relevant gates and repeat the focused loop.
- GitHub PR local-diff mode: a GitHub PR URL is provided. Fetch and review the PR diff locally
  or with read-only GitHub metadata. Keep findings local unless a repository-specific GitHub
  publishing workflow is later added.
- Azure DevOps PR mode: an Azure DevOps PR URL selects the Azure DevOps procedure. Review the PR
  as a reviewer and run proportionate passes. Publish findings or cast a vote only when the
  current request explicitly authorizes normal PR review output and the mode conditions permit
  it. If MCP confirms self-review, or cannot establish reviewer/author identity, keep the
  outcome local.

This skill is reusable across repositories. It must adapt to the current repository instead of
assuming a specific product topology. Match reviewer independence and specialist coverage to
scope, risk, repository policy, and the value of another perspective; do not require a stock
pair or fleet.

## Context, Staffing, And Authorization

Follow the target repository's context router and its documentation index before selecting
reviewers. If the target has adopted VibeRails, resolve lifecycle, authorization, handoff,
evidence, routing, and operation rules through that target index. The links below are
source-pack maintainer/reference defaults for reviewing this repository; they are not target
paths or a replacement for target customization:
[task lifecycle](../../../docs/standards/change-protocol.md#task-lifecycle),
[authorization and delivery](../../../docs/standards/change-protocol.md#authorization-and-delivery),
[handoff and acceptance](../../../docs/standards/change-protocol.md#handoff-and-acceptance),
[evidence validity](../../../docs/standards/quality-gate.md#evidence-validity),
[delegation and runtime routing](../../../docs/standards/agent-workflow.md#delegation-and-runtime-routing),
and [operation readiness and recovery](../../../docs/standards/integration-profiles.md#operation-readiness-and-recovery).
For a native repository, use its applicable `AGENTS.md`, review, delivery, and verification
rules instead; do not require missing VibeRails files.

Read [agent-authorization.md](references/agent-authorization.md) before dispatching. Independent
review is required only when the user, repository policy, delivery gate, or change risk calls for
it. When it is not required and proportionate local review is sufficient, continue locally
without asking the user to opt out of agents. If an independent pass is needed but has no standing
authorization, ask only for that dispatch. An unavailable or declined independent pass is a
reported limitation when it was required or already agreed.

Keep already authorized review, verification, and publishing actions in scope; do not ask again
for the same action. A link, available tool, profile, or skill does not grant implementation or
write authority. Reviewers do not fix or publish unless separately authorized. A repository may
explicitly set reviewers to static-only. Otherwise, a reviewer may run the target's selected,
focused checks when they are needed to assess the review, unless target rules or task scope
expressly exclude execution.

## Guardrails

- Start from the repository root and follow root `AGENTS.md` before reviewing or editing.
- Inspect `git status --short --branch` before changing files, switching branches, committing,
  pushing, or posting comments.
- Protect unrelated user work. Never revert, stash, stage, commit, or overwrite unrelated
  changes without explicit approval.
- In PR mode, do not push fixes, update PR metadata, resolve threads, complete the PR, or merge
  without explicit user approval. A PR URL, profile, configuration, or link chooses a procedure;
  it does not authorize inline comments or reviewer votes. Use those writes only when the current
  request explicitly covers normal PR review output (a named workflow may cover several
  operations), target policy permits it, and MCP confirms non-self-review. Unknown identity
  keeps the result local.
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
   - Azure DevOps PR URL: read [Azure DevOps PR mode](references/pr-mode.md).
   - GitHub PR URL: read [GitHub PR local-diff mode](references/github-pr-mode.md).
   - Other PR URL: obtain the provider profile or confirm source/target refs before using local
     branch mode.
   - No PR URL: read [local branch mode](references/local-branch-mode.md).
2. Load the applicable target rules, then resolve review-agent authority with
   [agent-authorization.md](references/agent-authorization.md).
3. Establish the review boundary: base/source and target refs, changed paths, the current review
   head, and any existing review or test evidence with the revision it actually covers. A stale
   `reviewedSHA` cannot cover a newer head.
4. Build the inventory. Local mode includes relevant committed, staged, unstaged, and untracked
   work; PR mode includes only PR changes.
5. Route review lenses and specialists with [area-routing.md](references/area-routing.md).
   Select only the number and expertise that the scope and required independence justify.
6. Give each independent reviewer a bounded scope, relevant rules, the exact diff/revision,
   any permitted focused check, and the required output. Do not give one reviewer another
   reviewer's conclusions before it finishes.
7. Aggregate with [output.md](references/output.md): retain independent attribution in the
   existing review record, triage once, and classify actionable findings with
   [severity-and-comments.md](references/severity-and-comments.md).
8. In local mode, stay read-only unless review-and-fix authority exists. Run only focused checks
   selected by the task or target policy, including a check needed to resolve an actionable
   finding unless static-only is explicit. A successful process with zero executed cases, a
   stale report, or skipped coverage is not test PASS. In review-and-fix mode, repeat the
   focused review/fix/check loop until clean, blocked, a user decision is needed, or five
   cycles complete.
9. In PR mode, follow the URL-selected reference for MCP capability discovery and self-review
   status. Publish findings or a vote only when the current request explicitly covers normal PR
   review output, target policy permits it, and MCP confirms the required capability and
   non-self-review. Re-read current PR state before publishing. A missing MCP capability keeps
   that outcome local; it does not permit a wrapper, CLI, REST/API, or another write.

## Required Agent Prompts

Every review agent prompt must include:

- mode and source of truth: local branch diff or PR URL;
- assigned responsibility and owned path scope;
- exact changed files or sanitized diff snippets, reviewed revision, and current-head boundary;
- required docs from [area-routing.md](references/area-routing.md);
- whether review is static-only or which focused check is permitted and needed;
- instruction not to reproduce secrets, raw personal data, PII, raw customer data, raw OCR
  text, prompts, credentials, request bodies, headers, or authorization values;
- instruction to review changed lines only unless a surrounding unchanged line explains a
  changed-line issue;
- instruction to produce evidence-backed findings with path and line references;
- instruction to report "No findings" when there are no actionable issues;
- severity scale from [severity-and-comments.md](references/severity-and-comments.md).

For an Azure DevOps PR, use only the active MCP capabilities discovered through the target
profile. The source-pack [`azure-devops`](../azure-devops/SKILL.md) link is maintainer
reference, not a wrapper, CLI, or REST/API fallback. Read-only MCP discovery is allowed; review
output writes follow the PR mode rules above.

For GitHub PRs, keep review findings local unless the adopting repository explicitly documents
a GitHub review publishing profile. Do not use Azure DevOps MCP operations for GitHub URLs.

## References And Read When

Skill and target-repository instructions are applicable rules. Mode references are operational
detail: read only the one selected by the review source, then the references needed for the next
decision. Historical knowledge is neither a rule nor an authority grant.

| Reference | Read when |
|---|---|
| [agent authorization](references/agent-authorization.md) | Deciding whether an independent reviewer is required or permitted. |
| [local branch mode](references/local-branch-mode.md) | No PR URL is provided. |
| [GitHub PR mode](references/github-pr-mode.md) | A GitHub PR URL is provided. |
| [Azure DevOps PR mode](references/pr-mode.md) | An Azure DevOps PR URL is provided and active MCP capabilities must be checked. |
| [area routing](references/area-routing.md) | Selecting coverage from changed paths. |
| [severity and comments](references/severity-and-comments.md) | Triaging findings or preparing an authorized Azure DevOps inline comment. |
| [output](references/output.md) | Recording evidence or handing off a review result. |
| [LEARNINGS.md](LEARNINGS.md) | A directly relevant, verified recurring gap needs historical context. It does not replace current rules or grant authority. |

When a review exposes a verified, reusable improvement to this skill, record it only through the
repository's authorized learning workflow. Do not record one-off issues, unverified workarounds,
or content from a real diff or finding.

## Navigation

- Source-pack maintainer navigation: [skills index](../README.md) and
  [repository docs](../../../docs/INDEX.md).
