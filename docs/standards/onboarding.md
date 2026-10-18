# Guided Onboarding Rules

Use these rules with the [question catalog](onboarding-questions.md) during
[guided adoption](adoption.md#guided-setup). The catalog owns wording; this document owns the
conversation and where each decision is stored. Both stay in the VibeRails source; they are not
copied into target repositories.

## Language

Keep repository files in English. Talk in the language of the user's own messages (an English
bootstrap prompt or quoted text does not change it) and switch when they switch, keeping answers
and progress. Translate the question, options, recommendation and summary faithfully; keep
identifiers such as `minimal`, paths and model names unchanged.

## One Question And A Real Wait

- Inspect the project read-only first. Ask only unresolved, applicable topics.
- Open with, in the user's language: "I will ask you X questions, one at a time, and wait for
  each answer. Some answers can add a follow-up; I will tell you when X changes."
- Show "Question n/X: [question]", its options and the recommendation, then stop and wait. Do no
  setup work while waiting. An accepted question card, silence, a timeout or a preselected option
  is not an answer. If a question tool cannot show all options, use a plain message.
- An answer settles only what it addresses. Record every clear decision the user volunteers and
  drop those questions. Resolve an unclear answer with one focused follow-up.
- Counting: n is the number of questions already sent plus one; X is questions sent plus those
  still planned, follow-ups included. Before the next question, announce any change to X and why.
  Never renumber questions already sent.
- A changed answer reopens only the decisions that depend on it and any approval of a different
  plan.

## Decision Evidence

| Evidence | What it can settle |
|---|---|
| Observable fact (remote, existing CI, a working connection) | Facts such as the code host. Never a policy or a write permission. |
| Explicit user answer, or a recorded project decision that answers the topic unambiguously | That policy. |
| Recommendation, preset, generic preference or similarity | Nothing; explain it alongside the question. |

"Keep it simple", vertical slices, plain functions or "no speculative layers" do not choose
`minimal` or `layered`: both satisfy [KIS](kis.md). Ask topic 4 on first adoption unless the user
or an existing decision explicitly chose both structure and documentation; if only one is
explicit, ask 4a or 4b alone. Apply the same test to documentation, review, delegation, models,
Git, tests, reporting and the KIS model. A refresh keeps explicit adopted choices and asks only
about new or conflicting topics.

## Topic Conditions

| Topic | When to ask and how to read the answer |
|---|---|
| 1 Git | Policy for future requested work, separate from this adoption's Git actions (11). Without a remote, push or PR becomes a readiness gap, never permission to create hosting. |
| 2 Review | Timing and staffing in one answer. Staffing applies to automatic and requested reviews. Existing required reviews stay in force. |
| 3 Agents and models | Coding/testing delegation and the model policy for every additional agent, reviewers included. Option 2 adds 3a. Writing a model name does not switch models. |
| 4 Structure and docs | First adoption, unless explicit. Option 3 adds 4a and 4b. It concerns internal structure, not creating or merging services. |
| 5 Code host | Only without remote or host evidence. |
| 6 Tracker | When unknown; never inferred from the code host. 6a only if the project is unresolved, 6b only if the connection is absent or broken, 6c only if the write policy is unknown. "Later" keeps the tracker selected. A working read does not grant writes. |
| 7 Skills | Selection and scope together. Reuse a working selected installation. For option 3 show concrete differences, then ask 7a. |
| 8 Tests | Agent test cadence, not CI. |
| 9 Improvements | Even without a tracker. Summary-only is complete. A ticket mode needs a sink: resolve it or defer it as an open question; never create a tracker. |
| 10 KIS model | First adoption, unless explicit. Options 1-2 already say now or later for Jev; 10a only for Microsoft-Decision-1 that is not already working. "Later" keeps the choice with a readiness gap; the agent decides meanwhile. |
| 11 Approval | After the final summary. Option 1 names this adoption's exact Git actions. An existing explicit grant covering this exact plan counts as approval. "Change something" discusses only that change, then asks approval of the revised summary. |

UI direction (appearance, devices, themes) is not an onboarding topic. Settle it before the
first screen under [web UI](web-ui.md); preserve existing design materials and requirements.

## Final Summary

Before topic 11 show, in the user's language: every topic with its decision and source (answer,
recorded decision or detected fact) or why it was skipped or deferred; the structure as
`minimal` or `layered`; files and client settings to change; installations outside the project;
prerequisite costs, risks and any data sent to third-party services; proposed access checks;
remaining gaps; and this adoption's exact Git actions. Ask any unresolved
applicable topic first instead of hiding it in the summary.

## Decision Storage

Use manifest fields only for their meaning in the [manifest reference](adoption-manifest.md).
Record the other decisions in one "VibeRails Decisions" section of the target `AGENTS.md` and link
it from `docs/viberails-adoption.md`. Never add enum values or a parallel configuration file.

| Topic | Stored as |
|---|---|
| 1 Git | AGENTS.md: allowed commit, push, PR and merge actions. `configuration.workflow`: `local` for options 1-3, `pull-request` for 4-5. |
| 2 Review | AGENTS.md: timing and staffing. `configuration.review`: `adaptive` for agent choice, `independent` for at least one additional agent. |
| 3 Agents and models | AGENTS.md: delegation and model policy, with actual runtime limits. `modelRouting` stays `inherit`. |
| 4 Structure and docs | `configuration.architecture` and `configuration.documentation` (`essential` = concise, `standard` = detailed). `initializedFrom`: `light` for option 1, `standard` for option 2, the closer preset for option 3. |
| 5-6 Host and tracker | `profiles`, `integrations` and `auth`; tracker writes in the provider's `writeApprovalPolicy`; deferrals in `openQuestions`. |
| 7 Skills | `agentSkills`: mode, selected names and an immutable source ref. |
| 8 Tests | AGENTS.md test cadence. Never `configuration.verification`. |
| 9 Improvements | `selfImprove`. Summary-only is `enabled: false` with a `disabledReason`. |
| 10 KIS model | AGENTS.md KIS section: model, pinned version or deployment, last verification, fallback. A KIS reviewer skill is recorded only when topic 7 selected it. |
| 11 Approval | The adoption task record only. |

Propose `configuration.verification` from existing CI (`ci-first` when a full PR pipeline exists)
and show it in the summary; approval of the summary confirms it.

Personal skills without an immutable source, or selections from several sources, stay a recorded
provenance limitation; never invent a VibeRails ref for them. The bundled installers install the
whole pack at user scope; never run them for a subset or a project-only choice.

## Navigation

- [Question catalog](onboarding-questions.md)
- [Adoption](adoption.md)
- [Documentation index](../INDEX.md)
