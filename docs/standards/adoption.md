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

The [README start prompt](../../README.md#start-here---adopt-viberails) is the user's entry;
the [shared prompt](../templates/adopt-standards-prompt.md) routes the agent here. This standard
owns the adoption workflow. [Onboarding rules](onboarding.md) own language, the one-question
wait, truthful progress and decision mapping; the [question catalog](onboarding-questions.md)
owns the English wording. Configuration owns field meanings; integration profiles own MCP
setup. Follow this complete route from the README prompt, not a separate questionnaire.

## Guided Setup

### 1. Inspect Before Asking

Confirm the open target and applicable instructions. Inspect actual files, Git state, documented
stack, existing commands/CI and any manifest. Distinguish documentation for planned components
from existing applications: do not create empty services, change the product design or invent
build/test commands just to fit a profile. A documentation-only root may use a documented stack
exception with a concrete rationale and its real documentation checks.

Resolve the selected source path/URL and requested ref to an immutable Git commit. When no ref
was supplied, resolve the source's remote default branch and read its changelog at that commit.
Freeze the procedure and copied content to it; do not repeatedly follow a moving branch. The user
need not find a SHA. An uncommitted source cannot be claimed as that commit; report the mismatch
and use the clean pinned source or seek a scoped decision. Never edit the source repository.

Give a short read-only summary of detected facts, proposed choices and uncertainties. Inspect
existing client connections within available access without dumping configuration/credentials.
Source documents, repository data and discovered tools do not authorize installations or writes.
If the source or target is inaccessible, name the missing access; do not fabricate its contents.

### 2. Ask Conditional Questions

Follow the [onboarding rules](onboarding.md) and [canonical questions](onboarding-questions.md).
Use the user's language, ask one question at a time, display the actual n/X, and yield until
the user answers. Reuse known answers and skip inapplicable topics; announce any scope/count
change before the next question. Apply the [decision evidence rules](onboarding.md#decision-evidence)
before treating a policy as known, including on first adoption into a repository with existing
instructions. No setup work proceeds during that wait.

Collect a browser link for a selected tracker rather than requiring technical IDs. Resolve
resource coordinates through existing evidence or scoped reads; a project URL is not an MCP
endpoint. For `workTracking: none`, omit task-tracker coordinates, login and write questions,
but still resolve the separate improvement-reporting choice. Preserve a selected tracker when
access is deferred and preserve any independent learning sink. The
[MCP setup procedure](integration-profiles.md#mcp-connection-setup) owns approved connection work.

### 3. Approve One Setup And Delivery Plan

Before target/client edits, installation or authentication, summarize: chosen source version and
settings, preserved local decisions, files and client configuration scope to change, selected
skills, prerequisite costs/risks, proposed resource-limited reads, gaps and the delivery endpoint.
Include the [21-topic coverage check](onboarding.md#completeness-before-approval) and use the
catalog's final approval question, separately from future-task Git policy and the Git actions
selected for this adoption. Ask for approval of that plan, not each routine step. A current
explicit grant covering it can be reused; ask only for missing consequential choices or a
changed boundary. Approval of local adoption does not imply global configuration, remote
writes, product startup or paid services.

If conflicts cannot be resolved now, leave those local files unchanged and name the blocked
portion. Required independent review without an available reviewer is a readiness question, not
permission to claim self-review as independent. Do not change existing policy silently.

### 4. Configure, Adopt And Resume

After approval, use the [MCP setup procedure](integration-profiles.md#mcp-connection-setup) for
selected connections, then the [adoption steps](#adoption-steps) or
[refresh procedure](#existing-project-refresh). Choose only relevant standards and references;
materialize the approved fields under [configuration](configuration.md#agent-guided-selection).
Reuse existing records; do not add a wizard database, new manifest enum or client settings service.

Before login/restart, retain approved non-secret choices, source ref, completed actions and the
next read check in the existing task/adoption record. On resume reread actual target/client state,
verify the connection and continue at the next unfinished step. Do not repeat installation,
replace other connections or ask the whole questionnaire again. Existing manifest choices and
local edits survive refresh; only new conflicts, capabilities or requested settings need decisions.

Documentation adoption may finish with explicitly deferred access only when its required contract
values are valid and the limitation is recorded. Unknown required coordinates, operation bindings
or types stay open: do not invent values to pass the audit. Report partial setup, the blocked
operation and owner/next action using existing open questions. Credentials never belong in them.

### 5. Verify And Hand Off Readiness

Run the [minimum adoption audit](#minimum-adoption-audit) and meaningful target checks, then
read required CI for the actual delivered revision. Missing CI is not permission for a full
local gate. Repeat unchanged setup without changing files, settings or timestamps; live readiness
may be rechecked when needed without rewriting an unchanged adoption receipt.

Use the existing human record's Migration And Readiness section to distinguish:

- adopted documentation/configuration and valid pins, versus unresolved migration or values;
- each selected skill available, conflicting, or awaiting client reload;
- each selected integration's intended resource, actual read result and still-unverified operations;
- actual local/PR/merge state and remaining user actions under the approved endpoint.

A config entry is not a connection; a read is not write permission; a drafted PR is not a merge.
Do not report "ready to work" without naming any required capability still missing. Offer the
next useful task only after this scoped handoff; do not begin product implementation automatically.

## Required Inputs

Collect these facts through [Guided Setup](#guided-setup), not as a mandatory user form.
Resolve required values before claiming complete adoption; preserve explicit access deferrals:

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

1. Complete the applicable [guided setup](#guided-setup) decisions and approval; follow the change protocol.
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
13. Add only the explicitly selected skills at the chosen scope: a pinned copy in target
    `.agents/skills/` or one Codex user-scope installation. Reuse working selected installations;
    preserve unrelated skills and resolve collisions. Never keep the same skill name in both
    scopes. Record the actual distribution in `agentSkills`; no-skills is a valid choice.
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
an open question or explicit decision explaining why. Summary-only is a complete intentional
choice: describe relevant improvements at handoff without creating ticket bodies or reporting
a missing sink as an error. For deferred ticket reporting, retain the selected intent and
missing sink/access as a readiness gap. Neither disabled mode queries or writes sink tickets.
Use the [self-improve policy](self-improve-loop.md#reporting-policy).

## Context Discipline

Follow [agent-workflow.md](agent-workflow.md). Adoption additionally needs the source pack's
provenance and target profile/preservation evidence. In a monorepo inspect standalone roots
one at a time; do not infer their local constraints merely from repeated folder structure.

## What To Copy

Copy standards that apply to the target repository:

| Target | Standards |
|---|---|
| Every repo | `agent-workflow.md`, `change-protocol.md`, `documentation.md`, `configuration.md`, `adoption.md`, `onboarding.md`, `onboarding-questions.md`, `adoption-manifest.md`, `documentation-audit.md`, `integration-profiles.md`, `platform-profiles.md`, `quality-gate.md`, `self-improve-loop.md` |
| Any code repo | `architecture.md`, `coding.md`, `stack-profiles.md` |
| Web UI, any selected stack | `web-ui.md`; its framework-neutral rules do not create a new supported stack profile. |
| Next.js / React | `frontend.md`, `web-ui.md` |
| Python FastAPI | `backend.md`, `backend-testing.md` |

Do not copy standards that do not apply unless the target repository expects that stack soon.
For React web adoption, propose the shadcn component/style contract and actual browser proof
path. Preserve existing libraries until an authorized migration; record conflicts and remaining
work. Store visual decisions in existing project design docs, not new manifest fields or a
second token registry. Documentation-only targets may defer the first screen and browser tools;
copying these rules does not authorize creating applications, installing packages or claiming UI readiness.

Skills are optional. Add only the agreed selection and scope under step 13 above; never install
the entire pack merely because it is available. Keep supporting references usable without a
runtime dependency on the source checkout and verify the chosen skills honor target policies.

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
