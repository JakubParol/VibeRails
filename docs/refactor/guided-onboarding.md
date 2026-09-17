# Guided Onboarding Delivery

Internal task record, not a file to copy into an adopter. Live state belongs in
[STATUS](STATUS.md); earlier stage cards and frozen evaluations are unchanged.

## Agreement

Scope `guided-onboarding-1`, agreed 2026-09-17. The user approved the proposed README-led
onboarding with: "No to dzialaj - branch, zmiany i merge". This covers one branch/PR, the
shared documentation changes, focused verification, local closing-record commit, publication
and merge after current-head CI. It does not authorize configuring an actual adopter/client,
provider writes, runtime installation or stage 10. The standing solo-execution exception applies:
self-review is disclosed, never described as independent agents or multiple-model evidence.

Base: `6960a2d806178ed4ad78fe16c35f2482b0e1966a` (0.4.3).
Branch: `codex/guided-adoption-onboarding`. Candidate pack: 0.4.4.

## Scope And Acceptance

- One ready-to-paste root README prompt, before optional skill installation, with no user-filled
  project, manifest, file-list or SHA fields. The agent resolves an immutable source revision.
- The existing shared prompt routes to one guided conversation in adoption.md: inspect, ask
  small conditional groups, approve the setup/delivery, configure/adopt, verify and hand off.
- Existing settings, documentation-only targets, optional skills and independent tracker/host
  choices are preserved. No new wizard runtime, manifest shape, provider client or wrapper.
- Selected ADO/Jira connections have actionable client setup, safe user login, scoped MCP reads
  and honest deferred/capability states. Missing access never becomes a successful connection.
- Known answers and approvals survive login/restart and refresh. No source-repo mutation or
  product implementation is implied by the bootstrap prompt.
- Deliver documentation with focused checks and current repository CI. A fresh independent
  first-user session and live MCP setup remain explicit runtime validation, not claims made
  by this documentation-only delivery or substitutes for original 08/09 experiments.

## Review Cases

These are single-agent semantic walkthroughs of the candidate instructions, not scripted or
live model/provider test results. Inputs are synthetic; no adopter or client setting was changed.

| Input | Reviewed next action and boundary |
|---|---|
| Documentation-only target, no tracker selected | Read local authority/checks, propose relevant rules, ask unresolved policy choices; do not create planned applications or ask for Jira coordinates. |
| Jira tracker and GitHub host, missing MCP | Keep choices separate; collect only missing site/key; approve actual configuration scope before setup, then sign-in and a resource-limited read. No provider REST fallback. |
| Azure Boards and Azure Repos in different projects | Identify both resources; do not silently reuse tracker project as repository project. |
| User defers selected Jira access | Retain intended provider, record gap/owner; valid documentation may finish, unknown required values keep setup partial. No fake tool binding or none downgrade. |
| Existing connection, OAuth/reload interruption | Reuse connection and known decisions; retain next read in existing record, rediscover tools and continue after user login. No token request or second installation. |
| Refresh with local edits, skill-name conflict, inherited model | Preserve choices and local changes; isolate collision, use ordinary source/local comparison and authorized resolution. No global overwrite or implicit model choice. |
| Source unavailable or dirty source differs from its commit | Report access/provenance gap; use a verifiable clean source or seek a scoped decision. Do not reconstruct content from memory. |

The codeblock in README routes to the shared prompt, which explicitly routes to Guided Setup;
Guided Setup routes connection operations to integration profiles. Backlinks do not restart the
wizard. The legacy README anchor remains a pointer for existing links, not a second prompt.
Review also checks that client MCP management commands are setup, not an alternate provider
transport, and that the core contract remains the owner of required field meanings.

## Verification And Limits

Official Codex, Microsoft and Atlassian guides were read on 2026-09-17 for client configuration,
authentication and provider setup. Integration profiles link those live references and require
rechecking selected endpoints/versions rather than freezing a possibly stale server URL.
No documentation lookup is presented as an actual login, client installation or live MCP trial.

Local edits use a retained source snapshot; every existing changed path is verified by Git blob
identity against the pinned base. Only those files are published over the actual remote base
through GitHub Git objects because local Git network transport is unavailable. Untouched remote
files are retained. The unchanged Node validator supplies focused file/link checks; broad checks
belong to current-head CI. No temporary transfer workflow or source-history rewrite is needed.

Focused validation of all nine changed Markdown files passed with the existing Node validator;
`git diff --check` passed. The first local check encountered a stale scripts/README.md reference
in the retained snapshot; refreshing that unmodified dependency to its verified main blob fixed
the local context, not the product or validator. No application/installer suite was run locally.
The seven cases above received semantic self-review; no live provider or fresh agent run is claimed.
[PR #19](https://github.com/JakubParol/VibeRails/pull/19) contains exactly nine scoped Markdown
files; its published diff and all nine blob identities match the reviewed local content. No
code, workflow, schema or installer changes are included. Implementation source
`5c6d46bebe36cd34e15fd6c2f7fe87fdb6ec92fb` passed all three jobs of
[run 35198162490](https://github.com/JakubParol/VibeRails/actions/runs/35198162490); actual
step outcomes were read. This is existing repository verification, not fresh-session evidence.

This closing record and STATUS are edited and committed locally before publication in the same
PR. Their focused document and whitespace checks must pass; the resulting final head must pass
all current required jobs before the already-authorized merge. Read the actual logs/revisions,
merge with expected-head protection, and confirm remote main and post-merge checks. The PR/check
record owns final source/tested/merge identities; no post-merge checkpoint PR is needed. While
PR #19 remains open this is prepared closeout, not a completed merge.

After confirmed merge the 0.4.4 documentation delivery is closed. 08/09 remain Verification for
their original model/independent-handoff criteria; this change does not waive them. The next
runtime acceptance is a fresh session starting with only a target and the README prompt, plus
actual selected MCP checks under separately scoped authority. It has not been run here. Report
the README entry and stop before another repository or stage 10.

## Navigation

- [Documentation index](../INDEX.md)
- [Plan](../refactor-plan.md)
- [Guided setup](../standards/adoption.md#guided-setup)
- [Original evaluation gaps](verification-08-09.md)
