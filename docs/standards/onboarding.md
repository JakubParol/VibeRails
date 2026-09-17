# Guided Onboarding Rules

Use these rules with the [English question catalog](onboarding-questions.md) during
[guided adoption](adoption.md#guided-setup). The catalog owns question wording and options;
this document owns conversation behavior, applicability and decision mapping. Catalog approval
does not select settings for any project. No wizard runtime or new configuration schema is needed.

## Language

Keep VibeRails repository questions, answer options and instructions in English. Conduct the
conversation in the language the user uses for their own request, unless they explicitly ask
for another language. An English bootstrap prompt, quoted document or code snippet does not
override the user's conversational language. If the user switches languages, switch with them
from the next response; preserve existing answers and progress.

Translate the current question, options, recommendation, counter announcement and summary
faithfully. Preserve choices, permissions and distinctions; keep identifiers such as `minimal`,
model names, paths and commands unchanged. Do not create a second translated source catalog or
translate repository files merely because the conversation is in another language.

## One Question And A Real Wait

Inspect the project read-only before asking. Reuse explicit answers and observable facts;
the source repository, an installed skill or a recommendation is not an answer. Preserve
existing decisions and constraints. Ask only unresolved, applicable questions.

Before the first question say, in the conversation language: "I will ask you X questions,
one at a time. After each one, I will wait for your answer." Explain that X is the current
plan and that choices requiring follow-ups can change it, which you will announce before the
next question. Do not claim that every project needs 21 questions.

Use "Question n/X: [question text]" in the conversation language. Show one question with its
options and short explanation, then yield the turn. Do not configure, install, ask another
question or keep working on adoption while waiting. A tool accepting a question card is not a
user answer. Silence, closing a card, timeout or a preselected recommendation is not consent.
If a question tool supports fewer choices than the catalog, use a normal message with the
complete options. Never collapse or preselect an answer to fit the tool.

Resolve unclear answers with one focused question and another wait. A real answer resolves
only what it explicitly addresses. If the user volunteers several decisions, record all clear
ones and remove their unasked questions; do not treat assent to one question as assent to others.

## Honest Progress

Keep a small conversation ledger in current context or the existing authorized task record:
known answers with their source, questions actually sent, and the ordered remaining questions.
No new persistent file or database is required before approval. Mark items known, answered,
pending, not applicable or deferred; never count known, skipped or deferred items as asked.

- Catalog IDs identify topics, not displayed sequence numbers. Each actual question occurrence
  counts once, including a clarification, comparison choice or repeated final confirmation.
- Before sending a question, let A be the number already sent and R the remaining planned
  question occurrences, including the one about to be sent. Display `n = A + 1`, `X = A + R`.
  Sending adds one to A and removes one from R. Waiting or receiving an answer adds nothing.
- Schedule a conditional question only when evidence or an answer makes it applicable.
  Undecided branches are not silently counted as guaranteed questions. Explain this provisional
  scope in the opening announcement; X is exact for the current plan, not a final prediction.
- After every answer, reconcile the remaining list. Before the next question, announce any
  change to X and its reason, including questions added, removed or deferred. Keep sent history;
  do not rewrite earlier counters, restart numbering, or count skipped topics as asked.
- A changed earlier answer invalidates only its dependent decisions and any previous approval
  of a materially different plan. Reuse unaffected answers, describe the change, and ask only
  the needed follow-up(s) plus final approval of the revised summary. Count each actual prompt.
- A pending question is not a completed onboarding. Final approval is an actual question in
  the remaining list unless a prior explicit approval covers this exact concrete plan. A
  rejection can extend a previously displayed `X/X`; announce that extension before continuing.

## Conditional Questions And Follow-Ups

These IDs refer to the catalog. Follow-ups use the same one-question/counting/wait rules.

| IDs | When to ask and how to interpret |
|---|---|
| 1 | Future-task Git policy, separate from this adoption. A selected action still needs actual capabilities and required checks. No remote means a requested push/PR is a readiness gap, not permission to create hosting. |
| 2-3 | Ask separately. Automatic review timing does not select staffing. Staffing applies both to automatic and user-requested review; it does not request review after review. Existing required reviews remain effective. |
| 4-5 | Coding/testing delegation is separate from review delegation. Ask model/effort policy whenever either can use additional agents and it is unresolved, even if automatic review is off. For a user-specified pool, ask which supported models/efforts before final approval. |
| 6-7 | Preserve architecture boundaries and existing useful documentation. These choices concern internal structure and documentation coverage, not creating or merging frontend/backend/AI components. |
| 8-9 | Ask only if unknown. Do not infer task tracking from the code host, or assume a new project needs no tracker. An unsupported provider remains selected with an explicit capability gap; never migrate it implicitly. |
| 10 | Ask for a browser link only when the selected tracker/project is unresolved. Discover IDs through scoped reads if available; clarify meaningful ambiguity without requesting credentials. Skip for conversation-only tasks. |
| 11 | Substitute the selected service name. Ask only if its connection is absent or does not work. This chooses connect now versus later; actual setup waits for the concrete final plan. Deferral retains the tracker. Connection/read permission does not grant writes. |
| 12 | Use the selected service name. Skip when no task tracker is used or the policy is known. Applies only to that project and requested work; deletion needs separate permission. It does not select self-improvement reporting. |
| 13 | Choose task/review instructions, not an MCP connection. Show concrete differences for "compare", then ask for the actual selection. Comparison alone authorizes neither use nor installation. Do not adopt personal skills because they are present. Skills do not override answers about review or delegation. |
| 14 | Ask only when selected skills need adding. Project-only means a pinned copy in that repository; all projects means one Codex user-scope installation, including future projects, not copies in every repository. Reuse a working selected installation; resolve collisions before replacing anything. No-skills skips this question, not review or test policies. |
| 15 | Select agent test cadence, not CI creation or tests after push. Apply the [test cadence](quality-gate.md#agent-test-cadence) and [progress-commit rules](change-protocol.md#commit-protocol). |
| 16 | Only for a project with planned/present UI and unresolved appearance. Preserve existing design/materials. Ask for available references for option 1; for option 2 propose one coherent direction and wait for feedback. Neither authorizes screen implementation. |
| 17-18 | Only for UI with unresolved device/theme requirements and design being settled now. Deferring appearance also defers these questions until before the first screen, preserving any already-known requirements. A custom device set is valid; it does not imply native mobile apps. Both themes require visual/readability proof in both, not just a switch. |
| 19 | Ask even without a task tracker if reporting policy is unresolved. Summary-only is a complete choice. For ticket proposals/automatic creation, retain that choice and resolve or explicitly defer a concrete sink; never create a tracker/project automatically. Reuse a separately selected sink. Deduplicate and exclude private data; surface proposals at handoff without interrupting every minor task. |
| 20 | This adoption's Git actions only. The catalog's commit-and-push wording is an example: substitute the actual chosen future-task actions in both question and option 1, naming them explicitly. For no Git actions, ask whether to leave this adoption uncommitted. If the user chooses differently, show the five actions from question 1 as a separately counted follow-up. Keep future-task policy unchanged. Skip only if these adoption actions are already explicit. |
| 21 | First show actual choices, files/settings to change, preserved decisions, deferred items, any installations/settings outside the project, and this adoption's exact Git actions. Ask for approval of that summary. "Change something" means discuss only the requested correction and reapprove the revised plan. Prior question/catalog approval is not setup approval. |

Do not add a hidden second questionnaire for technical fields. Infer only observable facts;
for a material unresolved decision, explain why it matters and add one plainly worded question
with an announced counter change. Inspect shell, current CI and available tools; do not ask
the user to choose a preset, write a manifest, find an internal ID or select source files.

## Decision Storage Without False Equivalences

Use existing manifest fields only for their actual [contract meanings](configuration.md).
For decisions v1 cannot express, place one concise named section in target `AGENTS.md` (or its
existing linked workflow policy). Link that owner from `docs/viberails-adoption.md`; record any
deliberate deviation in `exceptions` and unresolved capability in `openQuestions`. Include the
policy file in reviewed instruction pins. Do not add unknown enum values, a parallel JSON
configuration or a second authoritative copy of each decision.

| Decision | Canonical storage and interpretation |
|---|---|
| Future-task Git actions (1) | Target workflow policy explicitly lists allowed commit, push, PR and merge actions for requested work. `configuration.workflow` describes only local versus PR delivery: first three choices use `local`, last two `pull-request`. It cannot distinguish no-commit/commit/push or grant merge. An explicit standing user grant recorded in the policy retains its task scope and checks. |
| Review timing (2) | Target workflow policy: automatic after implementation/testing, or on request, preserving required project gates. No v1 field expresses this; do not map it to `configuration.review`. |
| Review staffing (3) | `configuration.review: adaptive` for agent choice, `independent` for required additional review, plus an explicit target policy requiring at least one additional agent for option 2. The enum alone does not specify an agent count or automatic timing. |
| Coding/testing delegation (4) | Target workflow policy explicitly allows bounded agent choice or solo execution, separate from the review policy. |
| Model and effort (5) | Target runtime policy: agent choice from the allowed available pool, an explicit user pool, or same as main. Keep `modelRouting: inherit` as the v1 compatibility value, not an encoding of these three answers. Reconcile current dispatch support and higher-priority restrictions; record requested versus observable settings and any blocked route. Never claim prose switches a model or invent main-agent settings that are not exposed. |
| Architecture/documentation (6-7) | `configuration.architecture: minimal/layered`; `configuration.documentation: essential/standard`. Keep all selected fields explicit. `initializedFrom` is initialization provenance only; disclose effective values in the summary. Existing CI determines the proposed verification responsibility, not question 15. |
| Hosting/tracker/resource/access (8-11) | Existing `profiles`, `integrations` and `auth`, with deferrals in readiness/open questions. Unsupported providers are not `none`; missing credentials are not an absent tracker. |
| Tracker writes (12) | Selected provider's existing `writeApprovalPolicy`: scoped automatic writes, ask each time, or read-only. This is distinct from `selfImprove.writeApprovalPolicy`. |
| Skills and scope (13-14) | `agentSkills` selected names/provenance and `mode: none/vendored/user-scope`, matching actual distribution. Preserve private skills; inspect only the relevant sources needed for an authorized comparison. No-skills is valid and retains project rules. |
| Tests (15) | Target workflow/quality-gate policy records after-story or before-each-task cadence. Neither `local-focused` nor `ci-first` means test frequency. CI and mandatory safeguards stay intact. |
| UI (16-18) | Existing design/requirements document records direction, devices, themes or the explicit pre-first-screen deferral. No new manifest fields or component-library switch. |
| Improvements (19) | `selfImprove.enabled: false` with a deliberate reason for summary-only, not an unresolved error. Ticket modes use the selected sink and `writeApprovalPolicy` for ask-first versus scoped automatic creation. If a sink is deferred, keep reporting intent in the target policy and the gap in `openQuestions`; do not fake configured access. |
| Adoption Git actions (20) | This adoption's task/approval record only; never overwrite future-task rules. |
| Final approval (21) | Evidence of an actual user response approving the concrete summary; not a manifest boolean or an earlier answer. |

If the chosen skills cannot honor these policies, explain the conflict before approval and
resolve only the affected choice. Do not install a conflicting workflow and claim it is ready.
The v1 skill record has one source ref. Personal skills without a verifiable immutable source,
or a selection from multiple sources that cannot fit that record faithfully, remain an explicit
provenance limitation in target policy/readiness. Preserve the selection and existing files;
do not invent a shared VibeRails ref, record `none` for selected skills, or claim complete pins.
The bundled installers currently install the whole pack at user scope; do not run them for a
smaller selected set or a project-local choice. Use only the approved selected installation
path, preserve collisions and disclose any client reload needed.

## Navigation

- [Question catalog](onboarding-questions.md)
- [Adoption](adoption.md)
- [Configuration](configuration.md)
- [Documentation index](../INDEX.md)
