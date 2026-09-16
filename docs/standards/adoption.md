# Standards Adoption Standard

Use this standard when applying VibeRails to another repository. The goal is to make the
target repository self-documenting for humans and Codex while keeping VibeRails generic,
process-neutral, and useful across Windows, Linux, and macOS.

VibeRails is copied into a target repository as selected standards and templates. The target
repository owns its adopted copies. The source VibeRails checkout remains useful for audit,
upgrade, and optional Codex skill installation, but the target repository must not depend on a
runtime symlink back to VibeRails.

## Supported Scope

Current support is Codex-first:

| Area | Supported profiles |
|---|---|
| Agent runtime | Codex |
| Work tracking | Azure DevOps Boards, Jira |
| Code hosting | GitHub, Azure Repos |
| Script platform | PowerShell, POSIX shell, or both |
| Self-improvement reporting | Work-tracker ticket sink selected during adoption |

Integration profiles document what the target repository must decide and record. They do not
imply automation, credentials, live service access, or a required provider.

## Short Onboarding

Use [the shared adoption prompt](../templates/adopt-standards-prompt.md). Inspect first, suggest
the closer light/standard preset and confirm only unresolved consequential choices. The fields
below are the agent's evidence checklist, not a questionnaire the user must fill in. No tracker,
code host or optional skills need to be invented. Use existing commands and document missing
capabilities instead of installing tools or creating provider accounts.

For a first adoption, initialize the complete [configuration](configuration.md) explicitly.
For a refresh, retain current values; `initializedFrom` records history, not inheritance.
A partial/unknown configuration is an error, not permission to choose defaults. A legacy project
can remain unselected; do not claim it has adopted the new configuration/pin contract.

## Required Inputs

Before editing the target repository, identify or ask for:

- target repository root
- VibeRails source path or URL
- project type: single project or monorepo
- stack profile, or an explicit exception when no supplied profile matches
- work tracking profile: `azure-devops-work-tracking`, `jira-work-tracking`,
  `unsupported-provider`, or `none`
- code hosting profile: `github-code-hosting`, `azure-repos-code-hosting`,
  `unsupported-provider`, or `none`
- script platform profile: `powershell`, `posix-shell`, or `both`
- self-improvement ticket sink: tracker coordinates, issue type, labels/tags, dedupe rule,
  comment template, auth checks, write approval policy, and missing-auth behavior
- auth model for every selected integration, recorded as non-secret setup instructions
- base branch and branch naming rules
- documented quality gate, if one already exists

Sanitize remote URLs before recording them in `.viberails/adoption.json`: remove username,
password, token userinfo, query strings, and fragments. Use `null` instead of committing an
unsafe remote value.

Do not infer a provider from the VibeRails repository. Use target repository remotes, existing
docs, config files, and user confirmation.

## Adoption Steps

1. Follow the change protocol.
2. Select target/source context through [agent-workflow.md](agent-workflow.md); preserve all
   applicable project instructions and source pack/adoption metadata needed for this operation.
3. Run the target preflight and save the evidence for the adoption report.
4. Audit the target repository structure, remotes, existing docs, scripts, CI, and issue
   references.
5. Select stack, integration, platform, optional skill-linking, and self-improvement profiles.
   Ask before recording an uncertain profile. Use `unsupported-provider` when a provider exists
   but VibeRails has no first-class profile; use `none` only when the target intentionally has no
   provider.
6. Copy the relevant standards into `docs/standards/`, including `configuration.md` for the
   selected contract. Resolve each copied link: use a target-local counterpart, include the
   genuinely required reference, or use an immutable source URL for optional examples. Remove
   irrelevant source-pack navigation, not applicable rules. Never copy internal refactor records
   or make the target depend on links to a local VibeRails checkout.
7. Create or update root `README.md`, `AGENTS.md`, and `docs/INDEX.md`.
8. Create or merge `.viberails/adoption.json` with explicit configuration, immutable source
   references, the actual copied file list and unresolved adoption/migration decisions.
   The template contains placeholders, not a ready default manifest. Preserve unrelated fields.
9. Create `docs/viberails-adoption.md` from the human-readable adoption template, mirroring
   the manifest decisions for humans.
10. In monorepos, create a documentation root for each standalone app, service, worker, mobile
    app, or package.
11. Document significant folders according to the explicitly selected
    [documentation bundle](documentation.md#documentation-bundles); preserve legacy coverage when unselected.
12. Add folder-level `AGENTS.md` only where local rules differ from the parent.
13. Do not copy skills into the target repository by default. Skills are optional Codex assets
    distributed at the Codex user scope from the VibeRails checkout. Vendor a pinned copy into
    the target `.agents/skills/` only on an explicit repository decision; never keep the same
    skill name in both scopes. Record the decision in `agentSkills`.
14. Define quality gates from existing scripts and stack profile defaults, including the
    path-to-scope map required by `quality-gate.md`.
15. Record `target.projectProfiles[]` for the repository root and every standalone app,
    service, worker, package, or infrastructure area.
16. Record the adopted pack version from the VibeRails `CHANGELOG.md` in the target
    `docs/INDEX.md`.
17. After reviewing changes, record the [prompt baseline](adoption-manifest.md#prompt-baseline),
    then run the minimum adoption audit and documentation checklist. Unknown runtime context
    remains explicitly unobserved; the baseline does not choose a model or effort.
18. Report verified scope, intentional exceptions and remaining migration/capability gaps.
    Do not call the whole project compliant merely because its documentation passes.

## Target Preflight Evidence

Run these commands or platform-equivalent commands before editing. Record output summaries in
`docs/viberails-adoption.md`; do not paste secrets, tokens, or long raw CI logs.

| Evidence | POSIX shell example | PowerShell example |
|---|---|---|
| Repository root | `git rev-parse --show-toplevel` | `git rev-parse --show-toplevel` |
| Branch and dirty state | `git status --short --branch` | `git status --short --branch` |
| Sanitized remotes | `git remote \| while read name; do url=$(git remote get-url "$name"); safe=$(printf '%s\n' "$url" \| sed -E 's#^([A-Za-z][A-Za-z0-9+.-]*://)[^/@]+@#\\1#; s#[?#].*$##'); printf '%s %s\n' "$name" "$safe"; done` | `git remote \| ForEach-Object { $url = git remote get-url $_; $safe = $url -replace '^([A-Za-z][A-Za-z0-9+.-]*://)[^/@]+@','$1' -replace '[?#].*$',''; "$_ $safe" }` |
| Default branch | `head=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true); if [ -n "$head" ]; then printf '%s\n' "${head#origin/}"; else printf 'unknown\n'; fi` | `$head = git symbolic-ref --short refs/remotes/origin/HEAD 2>$null; if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($head)) { $head -replace '^origin/','' } else { 'unknown' }` |
| Stack indicators | `find . \( -path './.git' -o -path './node_modules' -o -path './.venv' -o -path './.next' -o -path './dist' -o -path './build' \) -prune -o \( -name package.json -o -name pyproject.toml -o -name requirements.txt -o -name Dockerfile \) -print` | `Get-ChildItem -Recurse -File -Include package.json,pyproject.toml,requirements.txt,Dockerfile \| Where-Object { $_.FullName -notmatch '(\.git\|node_modules\|\.venv\|\.next\|dist\|build)' }` |
| Existing docs | `find . \( -path './.git' -o -path './node_modules' -o -path './.venv' -o -path './.next' -o -path './dist' -o -path './build' \) -prune -o \( -name README.md -o -name AGENTS.md -o -path '*/docs/INDEX.md' \) -print` | `Get-ChildItem -Recurse -File -Include README.md,AGENTS.md,INDEX.md \| Where-Object { $_.FullName -notmatch '(\.git\|node_modules\|\.venv\|\.next\|dist\|build)' }` |
| CI and gates | `find . \( -path './.git' -o -path './node_modules' -o -path './.venv' -o -path './.next' -o -path './dist' -o -path './build' \) -prune -o \( -path './.github/*' -o -path './.azuredevops/*' -o -name 'azure-pipelines*.yml' -o -name '*quality*' -o -name Makefile \) -print` | `Get-ChildItem -Recurse -File -Include '*pipeline*','*quality*',Makefile \| Where-Object { $_.FullName -notmatch '(\.git\|node_modules\|\.venv\|\.next\|dist\|build)' }` |

Skip generated and dependency folders during preflight: `.git`, `.venv`, `venv`,
`node_modules`, `.next`, `dist`, `build`, `coverage`, `.pytest_cache`, `.mypy_cache`,
`.ruff_cache`, `.turbo`, `.nx`, `bin`, and `obj`.

Do not run or report raw `git remote -v` output during adoption. Remote evidence must be
sanitized before it reaches reports, manifests, PR descriptions, or chat transcripts.

## Existing Repository Merge Policy

Adoption must preserve target repository knowledge. Do not replace existing docs wholesale
unless the user explicitly approves that replacement.

| Target file | Policy |
|---|---|
| Missing root `README.md`, `AGENTS.md`, or `docs/INDEX.md` | Create from the matching template and adapt placeholders immediately. |
| Existing root `README.md` | Merge VibeRails navigation, quality gate, and standards references into the existing project overview. Preserve product purpose, setup, architecture, and operational details. |
| Existing root `AGENTS.md` | Merge VibeRails required reading, change protocol, profile decisions, and local gate rules. Preserve target-specific constraints and warnings. |
| Existing `docs/INDEX.md` | Add required VibeRails standards, adoption record, and local docs without deleting existing entries. |
| Existing local docs | Link and reconcile them; do not duplicate their contents in global standards. |
| Conflicting instructions | Record the conflict in `docs/viberails-adoption.md` and `openQuestions`; ask before choosing behavior that changes project workflow. |

The preservation record below supports owner review and later migration. Keep it in
`docs/viberails-adoption.md`; the user handoff links it and surfaces decisions or unresolved
conflicts instead of repeating the table.

### Merge Algorithm

1. Read the existing file and list its headings.
2. Preserve product overview, setup, architecture, operations, security, and deployment
   sections unless the user explicitly approves replacement.
3. Add VibeRails navigation, required reading, selected profiles, quality gate, and adoption
   record sections under stable headings.
4. If a stable heading already exists, update or append a subsection instead of creating a
   duplicate heading.
5. Keep target-specific warnings closer to the top than generic standards links.
6. Record any conflict between existing behavior and VibeRails defaults in both
   `docs/viberails-adoption.md` and `.viberails/adoption.json`.
7. Before reporting complete, fill a preservation report.

Preservation report shape:

| File | Preserved sections | Changed sections | Conflicts or follow-up |
|---|---|---|---|
| `README.md` |  |  |  |
| `AGENTS.md` |  |  |  |
| `docs/INDEX.md` |  |  |  |

## Existing Project Refresh

Use the same adoption workflow, not a second migration system. Before changes:

1. Read the current manifest, instruction pins, local decisions and approved new source commit.
   Verify the requested source in Git; a branch/tag alone is not an immutable pin. Check the
   prior `copiedFiles` refs per file, not only the latest top-level ref.
2. Compare the prior source, actual local file and requested source. Classify unchanged files,
   source-only changes, local-only changes, changes on both sides and missing prior evidence.
   A pin mismatch is a review input, not an instruction to overwrite or repin it.
3. Show the proposed changes/conflicts before overwriting. Keep unchanged and locally customized
   files unless the scoped update is understood and authorized. Use ordinary diff/three-way merge
   tools; do not invent a general merge engine. Without a reliable prior source, preserve the
   local file and ask only for the affected decision.
4. Merge relevant source improvements while retaining local warnings, actual commands, stricter
   CI/permission boundaries and architecture decisions. An unresolved conflict stays unchanged
   with an owner/next action in existing `openQuestions` and the human preservation report.
5. Update only the records of actual changes. Keep unchanged per-file refs, settings and pins.
   Refresh the latest source/adoption time only for actual adoption changes; an unchanged second
   run is a no-op. Do not refresh source refs or fingerprints to conceal a failed merge.
6. Snapshot only after authorized reconciliation; verify structure, current digests, navigation
   and protected sections, then the smallest relevant native behavior checks. Preserve existing
   CI identities and use CI for required broad checks. Record incomplete code migration and
   unavailable live capabilities separately from document adoption.

The same explicit version-update path promotes later shared-prompt improvements without
re-running onboarding or silently changing model selection. For rollback use the target's
normal reviewed Git change to restore the matching instruction files AND their manifest pins;
never move only the version label or discard unrelated work. Missing source history is an
explicit refresh limitation, not permission to reconstruct or guess prior instructions.

## Self-Improve Completion

Adoption may finish with `selfImprove.enabled: false` only when the adoption record includes
an open question or explicit decision explaining why. In that state agents prepare local
self-improve ticket bodies but do not query, create, or comment sink tickets. Adoption is
complete for documentation purposes, but self-improve writes remain disabled until the target
repository records a concrete sink and auth checks.

## Context Discipline

Follow [agent-workflow.md](agent-workflow.md). Adoption additionally needs the source pack's
provenance and target profile/preservation evidence. In a monorepo inspect standalone roots
one at a time; do not infer their local constraints merely from repeated folder structure.

## What To Copy

Copy standards that apply to the target repository:

| Target | Standards |
|---|---|
| Every repo | `agent-workflow.md`, `change-protocol.md`, `documentation.md`, `configuration.md`, `adoption.md`, `adoption-manifest.md`, `documentation-audit.md`, `integration-profiles.md`, `platform-profiles.md`, `quality-gate.md`, `self-improve-loop.md` |
| Any code repo | `architecture.md`, `coding.md`, `stack-profiles.md` |
| Next.js | `frontend.md` |
| Python FastAPI | `backend.md`, `backend-testing.md` |

Do not copy standards that do not apply unless the target repository expects that stack soon.

Skills are not copied during adoption. Install them once per machine at the Codex user scope
from the VibeRails checkout only when the user wants those optional workflows. Vendor a pinned
copy only on explicit decision.

## Output Requirements

At the end of adoption, the target repository must have:

- root documentation trio: `README.md`, `AGENTS.md`, `docs/INDEX.md`
- `.viberails/adoption.json`
- `docs/viberails-adoption.md`
- relevant standards under `docs/standards/`
- selected integration, platform, and self-improvement decisions recorded
- project profiles for the root and standalone monorepo areas
- auth setup documented without secrets
- documentation roots for standalone monorepo projects
- significant-folder coverage required by the selected [documentation bundle](documentation.md#documentation-bundles), preserving legacy coverage when unselected
- documented quality gates with a path-to-scope map
- no orphan Markdown files
- a summary of gaps that need user decisions

## Minimum Adoption Audit

Before reporting adoption complete:

1. Inspect `git diff --name-only` and confirm every changed file belongs to the adoption.
2. Search for unresolved placeholders such as `<...>`, `TODO`, and `n/a` in adopted files.
3. Verify all Markdown files are reachable from `README.md`, `AGENTS.md`, or a `docs/INDEX.md`.
4. Verify relative Markdown links and anchors.
5. Parse `.viberails/adoption.json`.
   Its legacy Azure DevOps/Jira `*Command` fields must resolve to MCP operation references;
   see [provider sink semantics](adoption-manifest.md#provider-sink-shape). Confirm required
   operations in current MCP metadata under actual task authority. The structural audit does
   not perform this live check; record unavailable evidence as a gap rather than treating nonempty
   text as operational support. This does not require live provider writes to complete document adoption.
6. Confirm `docs/viberails-adoption.md` mirrors the manifest's selected profiles, auth checks,
   quality gate, and self-improve sink.
7. Exclude generated and dependency folders from documentation graph checks:
   `.git`, `.venv`, `venv`, `node_modules`, `.next`, `dist`, `build`, `coverage`,
   `.pytest_cache`, `.mypy_cache`, `.ruff_cache`, `.turbo`, `.nx`, `bin`, and `obj`.
8. Optionally run the source-owned Node audit with the target root argument, or copy
   `adoption-audit.mjs`, its `adoption-audit/` helper directory, `adoption-state.mjs` and
   `adoption-pins.mjs` together into target tooling.
   Run `node <path-to-adoption-audit.mjs> <target-root>`. The bundle has no third-party dependency,
   runs no recorded commands and writes nothing. It is a maintenance tool, not a project runtime
   dependency. Do not install Node solely to adopt a Python project; use available equivalent
   native checks and explicitly report any unautomated coverage.
9. Check exact manifest/configuration/pin versions, current instruction digests and unresolved
   questions. Audit exit zero means structural checks passed only; its output names whether
   configuration is selected or legacy/unselected. It does not prove architecture compliance,
   completed code migration, live MCP access, external skill contents or required CI.
10. Report every check not automated and the exact remaining action. Preserve the source commit
    and actual adopted content for later comparison; no model optimization is part of adoption.

## Navigation

- [Documentation index](../INDEX.md)
- [Adoption manifest](adoption-manifest.md)
- [Integration profiles](integration-profiles.md)
- [Platform profiles](platform-profiles.md)
- [Self-improve loop](self-improve-loop.md)
- [Stack profiles](stack-profiles.md)
- [Documentation audit](documentation-audit.md)
- [Quality gate](quality-gate.md)
