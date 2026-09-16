# Stage 07 - Adoption And Migration

## Agreement And Scope

Scope revision: `adoption-1`, agreed on 2026-09-16 under plan 1.4. The user requested
`Zrealizuj kolejny etap prosze` and explicitly chose single-agent execution after disclosure
that this session cannot dispatch independent agents. The request authorizes implementation,
focused checks, commits, push and a ready PR, not acceptance, merge or stage 08 research.
This intentional solo exception covers this delivery; self-review is not independent review.

Deliver the complete general baseline through agent-guided adoption and refresh, not a new
migration engine. Preserve model-neutral prompt content, MCP-only Azure DevOps/Jira,
project-owned knowledge and commands, and the selected local/CI responsibility split.

- Activate the existing small configuration contract through explicit adoption: version 1,
  materialized light/standard choices, no deep inheritance, missing configuration stays legacy.
- Extend the existing adoption audit with strict configuration/version checks and safe, read-only
  prompt fingerprints. Retain legacy validation; do not turn structural success into live
  capability, completed code migration or required-CI success.
- Pin reusable instruction identities to immutable source revisions and actual adopted content;
  include local instructions and disclose unobserved runtime/dynamic layers. Model routing stays
  inherited or explicitly authorized by task/runtime policy. No model-specific prompt fork.
- Shorten the adoption entrypoint; handle fresh and existing projects through one canonical
  preservation/refresh procedure. Present conflicts before changes, preserve local decisions,
  and record remaining migrations separately from the selected target policy.
- Demonstrate fresh adoption and a locally modified multi-root refresh on isolated synthetic
  projects, including real native commands, repeatability, stale pins and unsupported versions.

No live adopter/account writes, installs, PowerShell execution, history rewrite, telemetry,
model benchmarks, deferred source analysis, new providers or reusable CI/CD packages.

## Acceptance And Proof Path

A fresh small project and an existing multi-root project must retain their behavior and local
warnings while gaining usable documentation, explicit choices, a valid manifest and reproducible
instruction pins. A second unchanged refresh must be a no-op; a conflicting edit must remain
unmodified until explicitly reconciled. Unknown versions/settings and changed pinned content
must fail clearly rather than default or silently refresh. Pending migration/capability evidence
must stay visible and cannot be reported as completed compliance.

Use the existing Node audit and test runner with temporary filesystem/Git fixtures, plus the
fixtures' own small native behavior tests. Preserve existing CI checks and add the scoped
adoption regressions to repository CI. Full local repository validation is not authorized.
Results, actual revisions and limitations will be recorded below and in the PR.

## Environment And Delivery

Base: accepted merge `418980e59b77327cbc63a3aa67728bba6bb09523` (PR #13).
Branch: `codex/refactor-07-adoption`. No open PR existed at entry.
Local Node 22/POSIX is available, but local Git network access fails DNS. The GitHub connector
owns remote operations. A temporary, branch-only source-transfer workflow exported tracked files
from that exact base (no Git history/credentials); its downloaded tree matched Git tree
`9f3a6f5fb56f61ef2359037dbf51290a6d70b656`. Remove that transfer workflow before delivery.
Local snapshot commits are not remote source revisions. No independent agent or measured model
usage is claimed. The parent owns all implementation, semantic review, verification and handoff.

## Implementation And Review Evidence

The adoption entrypoint now inspects existing context, proposes only unresolved choices, and
routes both fresh adoption and refresh through the preservation contract. Configuration remains
one optional section of the existing manifest: explicit values, numeric supported versions and
`inherit` routing. Missing configuration is legacy/unselected; unsupported or partial selections
fail without defaulting. No autonomous file migration or provider action was added.

Instruction pins use immutable source/path identities and actual adopted-byte SHA-256 hashes.
Project-owned rules are fingerprinted separately; unchanged partial-refresh records retain their
original source refs. Runtime/dynamic and external user-scope content remain unobserved. The
snapshot helper emits a candidate only; it never writes the manifest or executes its commands.
The 0.4.0 general baseline is a candidate until user acceptance and confirmed stage merge; the
final accepted source/merge record will identify the frozen baseline for 08/09.

The former 1,151-line audit was split into bounded value, provider, record and navigation modules.
Existing checks were retained rather than replaced with a new engine. Mechanical comparison
verified 45 original helper bodies during the split. Deliberate changes add strict state/version
and safe-path checks, pin validation, safe malformed-JSON diagnostics and Markdown code handling.
Optional audit distribution is now an explicit bundle; no Node runtime is required in an adopted
application solely for VibeRails.

Single-agent semantic review found and corrected three concrete gaps before publication:
code-formatted link labels could disappear during code masking; configured external skill refs
needed immutable validation; and folder README instructions needed inventory coverage alongside
AGENTS. Focused regressions cover the affected behavior. This is self-review under the user's
explicit exception, not an independent review or an LLM compatibility evaluation.

## Controlled Results

Local environment: Node 22.16.0, Python 3.13.5, Git 2.47.3, POSIX. The scoped command
`node --test scripts/tests/adoption.test.mjs scripts/tests/adoption-refresh.test.mjs` passed
16/16 cases, with zero skipped or cancelled. No full local repository gate was run.

| Scenario | Observed evidence | Boundary |
|---|---|---|
| Fresh general adoption | Actual selected source standards and optional audit bundle copied into an isolated target; source-side and copied audits pass; native Python cases pass. | Explicit fixture assembly, not an autonomous agent or live adopter. |
| Existing multi-root refresh | Root plus two child documentation roots, local warnings/commands/auth/configuration and unchanged source pins preserved through an approved rule delta. | Synthetic profiles and Git IDs exercise structure; not proof of remote source availability. |
| Conflict and repeatability | Real `git merge-file -p` reports the seeded conflict without changing target bytes; explicit resolution keeps the pending migration visible. Unchanged snapshot/audit leaves the manifest byte-identical. | Agent-guided procedure, not an automatic merge engine. |
| Version and pin failures | Unknown/partial/null configuration, wrong schema/pin versions, floating refs, stale/missing/duplicate pins and unsafe paths fail. | Read-only contract checks, not semantic equivalence or instruction-following proof. |
| Rollback | Restoring the old manifest alone fails; matching restored instruction bytes and receipt pass. | Controlled filesystem rollback, no remote history rewrite. |
| Remaining work | Open-question count is visible; audit success explicitly excludes code compliance, live capability and CI PASS. | Required project acceptance remains separate. |
| Navigation | Real missing targets fail; fenced examples and complete inline-code spans are ignored while code-formatted link labels remain checked. | Repository inline-link/heading conventions, not full CommonMark support. |

Each native Python invocation executed three behavior assertions, not a zero-test success.
Focused changed-file validation, syntax checks and whitespace checks passed. Repository CI will
run existing 12 validator regressions, these 16 adoption cases, the full documentation/skill gate
and unchanged architecture examples. Final source/tested SHA and actual run outcomes belong in
the PR, not an invented self-reference in this commit.

No independent agents, live adopter migration, Azure/Jira operations, Windows/PowerShell checks,
model measurements, package installation or deferred research were performed. Equivalent native
verification remains possible when the optional Node audit is unavailable; that limitation must
be disclosed rather than converted into a complete-gate claim.

## Acceptance Walkthrough

Inspect the short [adoption prompt](../../templates/adopt-standards-prompt.md), the
[configuration contract](../../standards/configuration.md), [refresh procedure](../../standards/adoption.md#existing-project-refresh)
and [prompt baseline](../../standards/adoption-manifest.md#prompt-baseline). Confirm that existing
local decisions take precedence over blind preset application, conflicts remain explicit, and
pins cannot be silently refreshed to hide drift. The two scoped test files reproduce fresh,
multi-root, conflict, no-op and rollback cases; the PR's current `Repository checks` run must
cover its actual head. Neither a candidate version nor passing fixtures marks the stage Done.

## Handoff And Closeout

Finish on a current-head verified PR and `Awaiting acceptance`, with a practical acceptance
walkthrough. Do not mark this stage Done now. After the user's later acceptance and explicit
merge instruction: locally update STATUS and this card with closing evidence, commit and push
on the same branch, verify final-head CI, then merge only that head and read back remote main.
A prepared closing record is not evidence that merge already occurred. Do not create a routine
post-merge checkpoint PR or start stage 08. Final self-referential SHAs belong in the PR/report.

## Navigation

- [Current state](../STATUS.md)
- [Plan](../../refactor-plan.md#step-07-adoption-and-migration)
- [Adoption standard](../../standards/adoption.md)
- [Configuration contract](../../standards/configuration.md)
- [Documentation index](../../INDEX.md)
