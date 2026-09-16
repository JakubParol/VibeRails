# Azure DevOps PR Review Mode

Use this reference when the user provides an Azure DevOps PR URL.

## Contents

- [Purpose](#purpose)
- [Discovery](#discovery)
- [Review Scope](#review-scope)
- [Pass Count](#pass-count)
- [Write Behavior](#write-behavior)
- [MCP Inline Comment Capability](#mcp-inline-comment-capability)
- [PR Fix Subflow](#pr-fix-subflow)
- [PR Mode Output](#pr-mode-output)
- [Navigation](#navigation)

## Purpose

- review the PR as a reviewer;
- focus on PR diff and changed files;
- produce concise findings and publish them as inline PR comments only when the current request
  explicitly authorizes normal PR review output, target policy permits it, and MCP can confirm
  the authenticated identity differs from the PR author;
- cast an approve vote only when no actionable findings remain and those same conditions permit
  it;
- if the authenticated identity matches the PR author, or either identity cannot be established
  through MCP, complete the review locally without PR comments, summary substitutes, or votes;
- in approved review-and-fix mode, fix, verify, and rerun focused review until clean, blocked,
  or the loop limit is reached.

## Discovery

1. Load root repository context and the target's selected Azure DevOps MCP profile. Use only
   operations actually exposed in the active MCP session; do not invent tool names.
2. Confirm the MCP can read the identified PR's metadata and changed content. Record the
   repository/project identity, source and target revisions, current iteration/version when
   exposed, changed paths, PR state, and existing active review threads. If metadata or changed
   content cannot be read through MCP, report exactly that limited review scope and stop before
   any review output write.
3. Obtain the authenticated identity and the PR author only from MCP results. If either is
   unavailable, mark self-review status unknown; do not infer it from a name, URL, local
   checkout, or prior session. Unknown or matching identity means local-only review.
4. Treat the source revision and iteration/version returned by MCP as the review boundary.
   Re-read them through MCP before reporting or writing. A `reviewedSHA` or test result for
   an earlier source revision cannot cover a newer head.
5. Before an inline comment, confirm that MCP exposes the current changed-file anchor required
   by the operation. If the MCP cannot read anchors or changed content, report the missing
   capability and keep findings local. Do not use a wrapper, CLI, REST/API, local Git, or a
   summary-comment substitute.
6. Avoid duplicating an unresolved comment when the MCP read operation can show it. If the
   operation is absent, state that limitation rather than assuming no duplicate exists.

## Review Scope

- Comment only on code changed in the PR.
- Bind review and cited test evidence to the verified source commit. A successful process with
  zero executed cases, stale results, skipped coverage, cancellation, or no report is not PASS.
- Use surrounding context to understand behavior, but do not file findings on unrelated old
  code.
- When a finding spans several files, anchor the comment to the changed file that introduced
  the risk. If no changed-line anchor can be defended, report the blocker instead of posting a
  summary substitute.

## Pass Count

- Default to one full pass.
- Run a second pass when the first pass produced fixes, conflicting findings, unclear severity,
  or broad cross-area changes.
- Run additional passes only when the user asks or when an approved review-and-fix loop is still
  within the five-cycle limit.

## Write Behavior

- If MCP identifies the reviewer as the PR author, or identity/author data is unavailable, do
  not publish finding comments, summary substitutes, or reviewer votes.
- If the current request does not explicitly authorize normal PR review output, or target policy
  does not permit it, keep findings local. A PR URL, profile, configuration, tool, or MCP
  connection is not write authority.
- If output is explicitly authorized, identity is confirmed non-self-review, and MCP exposes a
  valid inline-comment operation and current anchor, publish valid findings as inline comments
  after triage.
- If output is explicitly authorized, identity is confirmed non-self-review, no actionable
  findings remain, and MCP exposes a reviewer-vote operation, cast an approve vote.
- When an MCP read, inline-comment, or vote operation is missing, report that named capability
  gap and keep the affected outcome local. Do not substitute a wrapper, CLI, REST/API call,
  local Git operation, or another write.
- Ask before making fixes, pushing commits, updating PR metadata, resolving existing threads,
  completing, or merging the PR.

## MCP Inline Comment Capability

Use an MCP inline-comment operation only after the current request explicitly authorizes normal
PR review output, target policy permits it, MCP confirms a non-self-review identity, and the
operation exposes a current changed-file anchor.

Before writing, use MCP reads to confirm the current PR source revision and anchor. Use an MCP
revision/iteration precondition when the actual operation exposes one. If it does not, record
that limitation and re-read the PR immediately before the write; do not invent concurrency
protection. After an ambiguous write result, read the remote PR state through MCP before any
retry so a duplicate comment is not created.

If inline comments, their required anchors, the readback, or the reviewer vote are unavailable
through MCP, report the missing operation/capability and keep that result local. Do not post a
summary substitute or use a wrapper, CLI, REST/API, local Git, or another provider write.

## PR Fix Subflow

Use only after explicit user approval to fix a PR. This reference governs MCP review state, not
working-tree changes. Before a fix cycle, read the current source revision through MCP; after an
authorized target-repository fix workflow changes it, repeat the focused review against the new
MCP revision. Keep review/output writes local if any required MCP capability is unavailable.

## PR Mode Output

PR mode reports must include:

- PR URL and reviewed source/target branches;
- reviewed source commit/iteration and current source head/iteration at reporting time;
- observed MCP read/identity/inline-comment/vote capabilities, self-review status, and whether
  PR publishing was enabled or skipped;
- triaged findings and compact review coverage per [output.md](output.md);
- inline comments posted through MCP, including identifiers when returned, or the named missing
  MCP capability that kept them local;
- approve vote cast through MCP when available, or the named missing MCP capability that kept it
  local;
- verification checked locally or from PR status;
- blockers or requested user decisions.

## Navigation

- Agent authorization: [agent-authorization.md](agent-authorization.md)
- Local branch mode: [local-branch-mode.md](local-branch-mode.md)
- Skill: [../SKILL.md](../SKILL.md)
- Skills index: [../../README.md](../../README.md)
