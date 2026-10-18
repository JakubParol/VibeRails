# Standards Adoption Standard

How an agent applies VibeRails to a repository, fresh or as a refresh. This document, the
[onboarding rules](onboarding.md), the [question catalog](onboarding-questions.md), the
[manifest reference](adoption-manifest.md) and the [configuration contract](configuration.md)
are source-only: read them from the pinned VibeRails source; never copy them into the target.
The target owns its adopted copies and never depends on a link back to a VibeRails checkout.

Current support: Codex runtime; Azure Boards, Jira or no tracker; GitHub, Azure Repos or no code
host; PowerShell, POSIX shell or both. A profile records a choice, not automation or access.

## Guided Setup

The user starts from the [README prompt](../../README.md#start-here---adopt-viberails), which
routes through the [shared prompt](../templates/adopt-standards-prompt.md) to here.

### 1. Inspect Before Asking

- Confirm the target and its applicable instructions. Inspect files, Git state, stack, commands,
  CI and any existing manifest. Tell planned components from existing ones; never create empty
  services or invent commands to fit a profile. A documentation-only root may use a documented
  stack exception with a concrete rationale.
- Resolve the source and requested ref (default: the remote default branch) to one immutable
  commit, and use it for both the procedure and the copies. An uncommitted source cannot claim
  that commit. Never edit the source. Without source or target access, name the gap; never
  reconstruct contents from memory.
- Give a short read-only summary of facts, proposals and uncertainties. Inspect existing client
  connections without dumping configuration or credentials.

### 2. Ask

Follow the [onboarding rules](onboarding.md). Collect a browser link for a selected tracker, never
credentials. With no tracker, skip tracker questions but still settle improvement reporting.

### 3. Approve One Plan

Show the [final summary](onboarding.md#final-summary) and ask for approval (topic 11) before any
edit, installation or login. Approval covers only what the summary lists: no global client
configuration, remote writes, product startup or paid service beyond it. When a conflict cannot be
resolved, leave those files unchanged and name the blocked part. A required independent reviewer
who is unavailable is a readiness gap, never self-review relabeled.

### 4. Configure, Adopt And Resume

Run the [MCP and decision model setup](#mcp-connection-setup) for approved connections, then the
[adoption steps](#adoption-steps) or the [refresh](#existing-project-refresh). Before a login or
restart, record non-secret choices, the source ref, completed actions and the next check in the
task or adoption record. On resume, reread the actual state and continue at the next unfinished
step; never repeat questions or installations.

Documentation adoption may finish with explicitly deferred access when required values are valid
and the gap is recorded. Unknown coordinates or operation bindings stay open; never invent values
to pass the audit.

### 5. Verify And Hand Off

Run the [minimum audit](#minimum-adoption-audit) and meaningful target checks, then read required
CI for the delivered revision. Repeating an unchanged setup changes nothing. Report readiness
separately in the record's Migration And Readiness section:

- documents, configuration and pins versus unresolved migration;
- each selected skill: available, conflicting or awaiting a client reload;
- each integration and the KIS decision model: intended resource, actual read result, unverified
  operations;
- the actual local, PR or merge state and remaining user actions.

A configuration entry is not a connection, a read is not write permission and a draft PR is not a
merge. Do not start product implementation.

## MCP Connection Setup

For an approved Azure DevOps or Jira connection, or the KIS decision model:

1. **Discover** the client's actual connections and tools. Reuse a suitable connection; confirm
   the selected organization, project or site.
2. **Choose a supported route.** Verify the client and server edition against the current
   official guide. Prefer the official hosted MCP when supported; a local stdio server needs
   approved prerequisites. Never derive an endpoint from a project URL or build a proxy or wrapper.
3. **Preview the scope:** which entry, project or user scope, login and installs. Preserve other
   servers, security settings and skills; never disable sandbox or trust checks.
4. **Configure after approval** through the client's settings, connector UI or MCP command, for
   example `codex mcp add <name> --url <verified-endpoint>` and `codex mcp login <name>`. If the
   runtime cannot do it, give the exact next step and do not claim it ran.
5. **Authenticate** through the supported browser or OAuth flow; the user signs in. Never ask for
   tokens, cookies or codes in chat. Secrets stay in client credential storage or a protected
   environment outside Git.
6. **Verify** by rediscovering operations and reading the selected resource. Never create, change
   or delete data as a smoke test.
7. **Record** client, scope, resource, the performed read, its result and the next action in the
   existing auth instructions and open questions.

| Component | Reference (checked 2026-09-17 and 2026-10-18; recheck at use) |
|---|---|
| Codex MCP client | [Codex MCP guide](https://developers.openai.com/codex/mcp/) |
| Azure DevOps MCP | [Microsoft project](https://github.com/microsoft/azure-devops-mcp) and [getting started](https://github.com/microsoft/azure-devops-mcp/blob/main/docs/GETTINGSTARTED.md) |
| Jira MCP | [Atlassian Rovo MCP setup](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/) |
| Jev (KIS) | [TypeSafe docs](https://docs.typesafe.ai/introduction): the user creates a key and exports `TYPESAFE_API_KEY`; optional [agent skill](https://docs.typesafe.ai/agent-skill). |
| Microsoft-Decision-1 (KIS) | [Foundry how-to](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-microsoft-decision): a deployment in the user's Foundry project, Entra ID sign-in preferred. |

Verify a decision model with one synthetic, sanitized `choice` question and record the model
version or deployment name. Record "not connected yet" honestly; the agent decides meanwhile.

## Adoption Steps

1. Complete the guided setup and its approval.
2. Collect the [preflight evidence](#target-preflight-evidence) for the adoption record.
3. Select profiles from target evidence or user answers; ask before recording an uncertain one.
4. Copy the [runtime standards](#what-to-copy) into `docs/standards/`. Point each link at a local
   copy, or at an immutable source URL for source-only references. Never copy refactor records.
5. Create or merge the root `README.md`, `AGENTS.md` (with its VibeRails Decisions and KIS
   sections) and `docs/INDEX.md` (with the adopted pack version).
6. Create or merge `.viberails/adoption.json` with explicit configuration, immutable refs, the
   actual copied files and open questions, and mirror it in `docs/viberails-adoption.md`.
7. In a monorepo, give each standalone project a documentation root and a `projectProfiles` entry.
8. Document significant folders per the selected bundle; add folder AGENTS only for differences.
9. Add only the selected skills at the chosen scope: a pinned copy in `.agents/skills/` or one
   user-scope installation. Never keep a name in both scopes; preserve unrelated skills.
10. Define quality gates and the path-to-scope map from existing commands and CI.
11. After review, record the [prompt baseline](adoption-manifest.md#prompt-baseline), then run the
    minimum audit.
12. Report verified scope, exceptions and remaining migration or capability gaps. Passing
    documentation is not project compliance.

### Target Preflight Evidence

Record summaries, never secrets or long raw logs. Never print raw `git remote -v`.

| Evidence | POSIX shell | PowerShell |
|---|---|---|
| Root, branch, dirty state | `git rev-parse --show-toplevel; git status --short --branch` | Same commands. |
| Sanitized remotes | `git remote \| while read n; do printf '%s %s\n' "$n" "$(git remote get-url "$n" \| sed -E 's#^([A-Za-z][A-Za-z0-9+.-]*://)[^/@]+@#\\1#; s#[?#].*$##')"; done` | `git remote \| % { "$_ " + ((git remote get-url $_) -replace '^([A-Za-z][A-Za-z0-9+.-]*://)[^/@]+@','$1' -replace '[?#].*$','') }` |
| Default branch | `git symbolic-ref --short refs/remotes/origin/HEAD` (else `unknown`) | Same command. |
| Stack, docs, CI | `git ls-files \| grep -E '(package.json\|pyproject.toml\|requirements.txt\|Dockerfile\|README.md\|AGENTS.md\|docs/INDEX.md\|\.github/\|azure-pipelines)'` | `git ls-files \| Select-String -Pattern '(package.json\|pyproject.toml\|README.md\|AGENTS.md\|\.github/\|azure-pipelines)'` |

Skip generated and dependency folders in every check: `.git`, `.venv`, `venv`, `node_modules`,
`.next`, `dist`, `build`, `coverage`, `.pytest_cache`, `.mypy_cache`, `.ruff_cache`, `.turbo`,
`.nx`, `bin`, `obj`.

## What To Copy

| Target | Runtime standards |
|---|---|
| Every repo | `kis.md`, `agent-workflow.md`, `change-protocol.md`, `documentation.md`, `quality-gate.md`, `integration-profiles.md`, `self-improve-loop.md` |
| Any code repo | `architecture.md`, `coding.md`, `stack-profiles.md` |
| Web UI | `web-ui.md`; plus `frontend.md` for Next.js/React |
| Python FastAPI | `backend.md`, `backend-testing.md` |

Copy only what applies. For React, propose the shadcn component and browser-proof path, keep
existing libraries until an authorized migration, and record remaining work. A documentation-only
target may defer the first screen; copying rules never authorizes building an application.

Older adoptions may hold copies of source-only documents. Leave them until a refresh, then
propose removing them as an ordinary reviewed change.

## Existing Repository Merge Policy

Preserve target knowledge. Never replace existing documents wholesale without explicit approval.

1. Read each existing file and its headings. Keep product overview, setup, architecture,
   operations, security and deployment sections.
2. Add VibeRails navigation, decisions and quality gates under stable headings; extend an
   existing heading instead of duplicating it. Keep target warnings above generic links.
3. Record each conflict with VibeRails defaults in `openQuestions` and the adoption record, and
   ask before choosing behavior that changes the project's workflow.
4. Fill the preservation report in `docs/viberails-adoption.md` (preserved and changed sections,
   conflicts) for root `README.md`, `AGENTS.md` and `docs/INDEX.md`.

## Existing Project Refresh

Use the same workflow, not a second migration system.

1. Read the manifest, pins, local decisions and the approved new source commit. Check each
   file's prior `copiedFiles` ref, not only the latest top-level ref.
2. Classify each file: unchanged, source-only change, local-only change, changed on both sides,
   or missing prior evidence. A pin mismatch is a review input, never a reason to overwrite.
3. Show proposed changes and conflicts before overwriting. Use ordinary diff or three-way merge
   tools (`git merge-file -p`). Without a reliable prior source, keep the local file and ask.
4. Merge source improvements while keeping local warnings, real commands, stricter CI or
   permission rules and architecture decisions. An unresolved conflict stays unchanged with an
   owner and next action.
5. Update only records of actual changes; keep unchanged refs, settings and pins. An unchanged
   repeat is a no-op. Never refresh refs or fingerprints to hide a failed merge.
6. Snapshot pins after reconciliation, run the audit and the smallest relevant native checks,
   and record incomplete migration or capabilities separately.

The same path promotes later shared-prompt improvements without repeating onboarding or changing
model selection. Roll back through a reviewed Git change that restores the instruction files AND
their pins, never only the version label.

## Minimum Adoption Audit

1. `git diff --name-only` lists only adoption files.
2. No unresolved placeholders (`<...>`, `TODO`, `n/a`) in adopted files.
3. The root trio exists, each standalone project has its trio, required standards are present,
   folder coverage matches the bundle, feature folders have no `docs/` and folder AGENTS exist
   only where rules differ.
4. Every Markdown file is reachable from `README.md`, `AGENTS.md` or a `docs/INDEX.md`, and
   relative links and anchors resolve (generated folders excluded).
5. The manifest parses. Azure DevOps/Jira `*Command` fields hold MCP operation references
   ([provider sink shape](adoption-manifest.md#provider-sink-shape)); confirm required operations
   live under task authority or record the gap. No live writes are needed for documentation.
6. `docs/viberails-adoption.md` mirrors the manifest's profiles, auth checks, quality gate, sink
   and configuration table.
7. Optionally run `node <source>/docs/templates/adoption-audit.mjs <target>`, or copy the audit
   with its `adoption-audit/` folder, `adoption-state.mjs` and `adoption-pins.mjs`. It is
   read-only, dependency-free and runs no recorded commands. Never install Node only for this;
   use equivalent native checks and report what was not automated.
8. Audit success is structural only: not code compliance, migration, live MCP access, external
   skill contents or CI.

## Self-Improve Completion

Adoption may finish with `selfImprove.enabled: false` only with a `disabledReason` or an open
question. Summary-only is complete; deferred ticket reporting keeps the intent and the missing
sink as a readiness gap. See the [self-improve loop](self-improve-loop.md#reporting-policy).

## Navigation

- [Documentation index](../INDEX.md)
- [Onboarding rules](onboarding.md)
- [Adoption manifest](adoption-manifest.md)
- [Integration profiles](integration-profiles.md)
