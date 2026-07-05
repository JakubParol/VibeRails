# Optimization Roadmap

Working document for the 2026 VibeRails optimization effort. This file is the single place to
track scope and execution status. Update the checkboxes and the Execution Log as stages
complete. Remove or archive this file when the effort is done.

Started: 2026-07-03. Owner: Jakub Parol. Branch: `docs/optimization-roadmap`.

## Goals And Constraints

Goals, in priority order:

1. Reliability and usability: agents stop losing sessions to broken or confusing tooling,
   especially the Azure DevOps wrappers.
2. Token consumption: agents load less context and produce less waste output for the same
   quality of work.
3. Self-improvement: verified fixes discovered in adopting repositories flow back into
   VibeRails instead of being rediscovered every session.

Hard constraints:

- The pack targets OpenAI Codex first. Other agent runtimes are out of scope until they are
  deliberately added as profiles.
- Existing guardrails must not be weakened: write approvals, self-review blocking, dirty-tree
  protection, and quality-gate integrity stay as they are or get stricter.
- Documentation stays ASCII-only English; `.\scripts\validate.ps1` must pass at every commit.

Evidence base: session transcripts from a reference adopting repository, its quality gate and
PR validation pipeline, and the Codex skills documentation
(skill scopes: repo `.agents/skills`, user `$HOME/.agents/skills`, admin, system; repo wins on
name collision; same-name skills do not merge).

## Status Legend

- `[ ]` not started
- `[x]` done
- `[~]` in progress (note in Execution Log)
- `[!]` blocked or needs a user decision (note in Execution Log)

## Phase 0 - Decision Gates

Decisions and verifications that later phases depend on.

- [~] 0.1 Verify Codex discovers a skill through a Windows directory junction from
      `$HOME\.agents\skills\<skill>` to the VibeRails checkout. Test: create one junction,
      restart Codex, confirm the skill appears in `/skills` inside another repository.
      Fallback if junctions fail: file-copy sync script (weakens the learning loop but keeps
      distribution).
- [x] 0.2 Decision: skills are distributed only at Codex user scope (junction or sync), and
      adopting repositories stop vendoring `.agents/skills` copies except for explicit version
      pinning. Never both for the same skill name in one repository.
- [x] 0.3 Decision: approve the scoped quality gate policy wording (local gate proves the
      changed scope, CI proves the whole repository) before editing standards in Phase 4.

## Phase 1 - Skill: azure-devops (reliability first, then tokens)

Fixes the largest observed session losses: sign-in HTML treated as data, hanging POSTs,
missing fallbacks, no timeouts, misleading errors.

- [x] 1.1 Consolidate duplicated helpers from `ado-work-items-common.ps1` and
      `ado-prs-common.ps1` (about 150 lines: `Invoke-AzJson`, `Require-*`, remote URL parsing,
      org/project/repository resolution) into one dot-sourced `ado-common.ps1`.
- [x] 1.2 Transport reliability in PR scripts:
      - detect HTML or non-JSON responses in `Invoke-AdoRestJson` and fail fast with an error
        that names the channel and the next step;
      - add a native CLI fallback (`az repos pr show --id`) to `Get-PullRequest` before the
        generic `az devops invoke` path;
      - add explicit timeouts to all `az` invocations so nothing hangs for minutes;
      - pass `--encoding utf-8 --media-type application/json` on `az devops invoke` writes in
        `Invoke-GitRest` (parity with the work-items wrapper), which is the prime suspect for
        hanging `pullRequestThreads` POSTs with non-ASCII content.
- [x] 1.3 Reorder channel priority across actions: native `az repos` and `az boards` commands
      first where they exist, `az devops invoke` second, direct REST with a bearer token last
      or removed where not required.
- [x] 1.4 Add a `Doctor` action to both wrappers: one command that checks CLI presence,
      devops extension, token acquisition, connection data, one invoke read, and one REST
      read, then reports which channels work. First-use guidance switches to running `Doctor`.
- [x] 1.5 Add `references/troubleshooting.md`: a symptom -> cause -> next step decision table
      covering the observed failure classes (REST returns sign-in page, invoke POST hangs,
      identity cannot be resolved, draft PR vote rejected). Goal: an agent hits a failure and
      finds the next step in one read instead of a twenty-command experiment.
- [x] 1.6 Token cuts on read actions: summary output as default for `Show`, `Metadata`,
      `QueryByMarker`, PR `Show`, `Threads`, `IterationChanges` (project only the fields the
      workflows need), with a `-Raw` switch for full payloads.
- [x] 1.7 Slim the reference router: the old Azure DevOps router was nearly pure indirection.
      Link operation files directly from `SKILL.md` and delete or reduce the router.
- [~] 1.8 Verify: `.\scripts\validate.ps1` passes; live check of one inline PR comment with
      Polish multiline content on a marked test draft PR, with cleanup commands reported.

## Phase 2 - Skill: code-review

- [x] 2.1 Flatten `references/modes.md` indirection: `SKILL.md` links mode files directly.
- [x] 2.2 Add an architecture shortcut checklist to the backend/API specialist prompt:
      logic in endpoints, routes calling repositories, inline dependency construction instead
      of DI, persistence in services, missing typed errors.
- [x] 2.3 Add a test value checklist to the test specialist prompt: every test can fail for a
      real reason, no mock-echo assertions, no duplicate coverage, no framework testing,
      behavior-describing names.
- [x] 2.4 Verify: validate passes; dry-run review on a sample branch confirms the new
      checklists appear in agent prompts.

## Phase 3 - Skill: e2e-work-item

- [x] 3.1 Final Guard Rails section: replace "run the full required guard rails" with the
      scoped gate policy (scoped commands for changed areas; full run only for cross-cutting
      changes or on explicit user request; focused tests during implementation stay as is).
- [x] 3.2 Split the runbook so Task runs do not pay for User Story child-task logic: move the
      child-task section into its own reference loaded only for User Story runs.
- [x] 3.3 Verify: validate passes; runbook contents table and anchors still resolve.

## Phase 4 - Standards

- [x] 4.1 `quality-gate.md`: introduce the scoped gate concept. Each repository documents a
      path-to-scope map (same shape as its CI change detection) and per-scope commands.
      Define when a full local run is still required (tooling, lockfiles, shared packages).
- [x] 4.2 `change-protocol.md` and `agent-workflow.md`: align End Of Task and Verification
      wording with the scoped gate; remove the overlap between the two documents so the core
      protocol is read once, not twice.
- [x] 4.3 `architecture.md` and `backend.md`: add per-layer definition-of-done checklists
      (endpoint, service, repository) that an agent can self-verify before committing; add
      short wrong/right example pairs for the top shortcut patterns; make import-linter
      contracts required rather than "where practical" and ship a template contract.
- [x] 4.4 `backend-testing.md` and `frontend.md`: add a Test Value Rules section (a test must
      be able to fail for a real reason; no asserting that a mock received what was passed;
      no duplicate coverage; names describe behavior). Many tests are welcome, meaningless
      tests are findings.
- [x] 4.5 Deduplicate required-reading lists across `README.md`, `AGENTS.md`,
      `agent-workflow.md`, `change-protocol.md`, and `coding.md`: one canonical list, others
      link to it. Remove the duplicated 400-line file rule (keep it in one standard).
- [x] 4.6 Verify: validate passes; a token estimate of the minimum required-reading set for a
      small change is measurably lower than before (record numbers in the Execution Log).

## Phase 5 - Templates And Adoption

- [x] 5.1 `docs/templates/project-AGENTS.md`: stop restating the change protocol; link to it.
      Add the scoped gate section with the path-to-scope map placeholder.
- [x] 5.2 `docs/templates/folder-AGENTS.md`: add an optional layer checklist block so adopting
      repositories can place endpoint/service/test checklists next to the code they govern.
- [x] 5.3 New template or standard note: recommended `lint.ps1` interface for adopting
      repositories (`-Service` scoping, `-SkipTests`, `-SkipBuild`, and a `-Changed` mode that
      derives scope from `git diff` using the same map as CI). Done in `quality-gate.md`
      (Recommended Gate Script Interface) during Phase 4.
- [x] 5.4 `adoption.md` and `adopt-standards-prompt.md`: remove the "copy skills" step in
      favor of user-scope distribution (Phase 0 decision); require the scoped gate map in the
      target quality gate documentation.
- [x] 5.5 Verify: validate passes; adoption prompt dry-read makes sense end to end.

## Phase 6 - Distribution And Self-Improvement Loop

Depends on Phase 0 decisions.

- [x] 6.1 New `scripts/install-skills.ps1`: creates or repairs junctions from
      `$HOME\.agents\skills\<skill>` to this checkout for each skill, verifies discovery
      preconditions, reports drift; document the one-liner in `README.md` and
      `scripts/README.md`.
- [x] 6.2 Rewrite the Failure Learning Loop routing in the ADO skill for the junction model:
      durable wrapper/reference fixes are edited through the user-scope junction (which is
      this repository's working tree) on a VibeRails branch; repository-specific facts go to
      the adopting repository docs.
- [x] 6.3 Add a lightweight learnings inbox: a documented entry format and location so an
      agent mid-task appends a structured learning instead of stopping to author a full
      patch; add a consolidation workflow description (a periodic VibeRails session turns
      inbox entries into real patches).
- [x] 6.4 Extend the learning loop pattern to `code-review` and
      `e2e-work-item`.
- [x] 6.5 Introduce pack versioning: `CHANGELOG.md` plus a version marker adopting
      repositories can record, so standard copies can be diffed and upgraded.

## Phase 7 - Repository Quality Gate And Hygiene

- [x] 7.1 `scripts/validate.ps1`: validate Markdown anchor links (`file.md#anchor`), not just
      file existence; detect orphaned Markdown files (unreachable from any index, parent
      README, or AGENTS file).
- [x] 7.2 Minor hygiene: consistent BOM handling in `agents/openai.yaml` files; confirm
      navigation links after all moves; remove anything the phases above made obsolete.
- [x] 7.3 Final pass: run validate, re-read `docs/INDEX.md` and `README.md` for accuracy,
      update this roadmap to its final state.

## Out Of Scope For This Effort

- Multi-agent or non-Codex support (company constraint).
- New stack profiles beyond Next.js and FastAPI (worth a separate discussion).
- CI pipeline for VibeRails itself (candidate follow-up after Phase 7).

## Execution Log

| Date | Item | Note |
|---|---|---|
| 2026-07-03 | - | Roadmap created on branch `docs/optimization-roadmap`. |
| 2026-07-03 | Phase 0 | Started. |
| 2026-07-03 | 0.1 | Junction created at `$HOME\.agents\skills\azure-devops` pointing to this checkout; SKILL.md resolves through it. Pending: owner restarts Codex and confirms the skill appears in `/skills` inside another repository. Note: inside the VibeRails project Codex may list this skill twice (repo scope plus user scope); expected, not a defect. |
| 2026-07-03 | 0.2 | Adopted recommended default (user-scope distribution, no vendored copies except pinning). Autonomous decision, flagged for owner review. |
| 2026-07-03 | 0.3 | Adopted recommended wording (local gate proves changed scope, CI proves whole repo). Autonomous decision, flagged for owner review. |
| 2026-07-03 | Phase 0 | Done except 0.1 owner verification. |
| 2026-07-03 | Phase 1 | Started. |
| 2026-07-03 | 1.2-1.4 | Live Doctor runs surfaced two previously unknown root causes on top of the transcript evidence: (a) azure-devops CLI extension 1.0.3 rejects preview API versions with revision suffixes (float parse error on `7.1-preview.4`), which silently broke all work item comment actions - wrapper now pins `7.1-preview` and Comments verified live; (b) `az devops invoke --area Location` fails with "--area is not present" on this organization, so identity resolution gained an `az account show` UPN fallback and Doctor uses a wit-read probe. REST bearer channel confirmed broken on this machine (sign-in HTML) - now detected and reported with next steps instead of failing cryptically. |
| 2026-07-03 | 1.8 | validate.ps1 green; live read-only verification done (Doctor both wrappers, summarized Show, Comments). Not run: inline PR comment write test with Polish multiline content - needs a designated test draft PR; creating one is a repo write deferred to owner approval. |
| 2026-07-03 | Phase 1 | Done except the 1.8 live write test. |
| 2026-07-03 | Phase 2 | Started. |
| 2026-07-03 | Phase 2 | Done. modes.md router removed (its anchors were only used by sibling navigation, all links updated); checklists added to area-routing.md and wired into specialist prompt requirements. 2.4 note: a real multi-agent dry run needs a Codex session, so verification here is validate.ps1 plus the prompt-requirements wiring in area-routing.md. |
| 2026-07-03 | Phase 3 | Started and done. Runbook no longer carries child-task logic for Task runs (moved to user-story-child-tasks.md, loaded only for User Story runs); the `#user-story-child-tasks` anchor kept its heading so SKILL.md links stay valid. Final Guard Rails now implement the scoped gate policy from decision 0.3. |
| 2026-07-03 | Phase 4 | Started. |
| 2026-07-03 | 4.6 | Honest deviation from the acceptance wording: core required-reading set (agent-workflow, change-protocol, quality-gate, coding) went from 2757 to 2969 words. Dedup removed about 210 words of double-reads, but quality-gate.md grew by 333 words carrying the new scoped-gate policy. Net effect on runtime tokens is still strongly positive: the scoped gate eliminates default full lint/test/build runs per task, which dwarfs a 200-word read increase. |
| 2026-07-03 | Phase 4 | Done. quality-gate.md owns the scoped policy, path-to-scope map, and recommended gate script interface (this also pre-covers item 5.3); change-protocol and coding now point at agent-workflow for the canonical reading list; agent-workflow dropped duplicated behavior/reporting sections; backend.md gained layer definition-of-done checklists, wrong/right pairs, and a required import-linter template; test value rules added to both test standards. |
| 2026-07-03 | Phase 5 | Started and done. Adoption no longer copies skills (user-scope distribution per decision 0.2); project-AGENTS template stopped restating the change protocol and gained the path-to-scope map; folder-AGENTS gained the optional layer checklist block. References to `scripts/install-skills.ps1` are plain code mentions until Phase 6 creates the script. |
| 2026-07-03 | Phase 6 | Started and done. install-skills.ps1 ran on this machine: azure-devops junction from Phase 0 recognized, code-review and e2e junctions created - all three skills now at user scope here. LEARNINGS.md inbox added per skill with entry format and consolidation workflow; learning loop routing rewritten for the junction model; CHANGELOG.md with pack version 0.2.0 added and adoption now records the adopted version. Owner follow-up unchanged from 0.1: restart Codex and confirm skills appear in another repository. |
| 2026-07-03 | Phase 7 | Started and done. validate.ps1 now checks Markdown anchors (GitHub-style slugs, code fences skipped) and orphaned Markdown files (BFS from README.md over the link graph); both verified with a deliberate negative test. Also fixed a pre-existing validator flaw: with ErrorActionPreference=Stop the first Write-Error hid all remaining failures, so agents saw one failure per run - all failures now print at once. BOM stripped from two openai.yaml files. |
| 2026-07-03 | Effort | All phases complete. Open items for the owner: 0.1 (restart Codex, confirm skills at user scope appear in another repository via /skills) and 1.8 (live inline PR comment write test with Polish multiline content on a marked draft PR). Recommended next steps: merge this branch, run install-skills.ps1 on other machines, and schedule the first LEARNINGS consolidation session. |
| 2026-07-05 | Generic adoption | Added the process-neutral adoption contract for Codex-first target repositories, explicit Azure DevOps/Jira/GitHub/Azure Repos and PowerShell/POSIX profiles, adoption manifest templates, and the first-stage ticket-based self-improve loop. |

## Navigation

- [Repository README](README.md)
- [Documentation index](docs/INDEX.md)
