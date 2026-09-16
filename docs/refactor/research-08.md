# Stage 08 Research Assessment

Assessed on 2026-09-16 against the [original register](../astra-refactor-reading-list.md).
All 15 entries were attempted. Nine were readable; six were unavailable through the reader.
Unavailable means not verified here, not nonexistent. Original URLs, numbering and descriptions
are preserved. This is internal evidence, not another document adopters must load.

## Source Disposition

| ID | Source and evidence read | Decision for VibeRails |
|---|---|---|
| 01 | [Official model guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practice), prompting and migration sections. | Clarify completion and authority; retain meaningful scoped checks. Do not copy broad autonomy examples over stricter project gates. |
| 02 | Original Provencher X URL returned an error; exact-ID search did not recover it. | No claim about the post. A separate official article by the same author is assessed below, not mislabeled as this source. |
| 03 | Original Kundel X URL returned an error; no recovered original text. | Treat the registration description as an unverified lead. No rule removed on that basis. |
| 04 | Original Scarlet X URL returned an error; no recovered original text. | Same limitation; use readable primary guidance, not attributed social claims. |
| 05 | [Writing for agents](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md), blob `a37608daf6e835e767deecfb498facecaaba82ba`. | Make context pointers conditional; keep completion criteria and rule owners explicit. Retain hard prohibitions where authorization/security needs them. |
| 06 | [OpenAI skill creator](https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md), existing-skill authoring, frontmatter, disclosure and validation guidance. | Shorten repeated descriptions and router bodies; preserve required references. No new creator scripts, dependencies or copied tutorial scaffolding. |
| 07 | [Build skills](https://learn.chatgpt.com/docs/build-skills), activation, metadata and disclosure sections. | Front-load actual triggers. Keep existing invocation policy; do not claim host auto-selection was tested. |
| 08 | [Skill evals](https://developers.openai.com/blog/eval-skills), outcome/process checks and captured-run comparison. | Separate author walkthroughs, deterministic checks and actual agent traces. Do not score document inspection as an agent benchmark. |
| 09 | [Models and experimental context](https://learn.chatgpt.com/docs/models#experimental-context-management). | Treat history tools as runtime capabilities, not universal prompt instructions. Keep ordinary durable task records and expose unsupported capability. |
| 10 | [Codex PR 42385](https://github.com/openai/codex/pull/42385), metadata and full diff at `cff76fa96f70f9f3b63d221446fd02cfd87e6d2e`. | Eligibility/backend checks corroborate conditional availability. No enablement, installation or assumption of experimental tools in this session. |
| 11 | Official usage-help URL and short article-ID retry both failed to load. | No quota, price or account-entitlement conclusion. Actual usage remains unknown. |
| 12 | [ARC Prize assessment](https://arcprize.org/blog/astra), published 2026-09-03, results and harness comparison. | Cost depends on harness and task; game results do not establish VibeRails coding costs or an effort ranking. |
| 13 | Norsica original and non-www retry failed; source-specific search did not recover the report. | Do not reproduce its claimed effort comparison or select a default from the registration summary. |
| 14 | Original Rajath X URL failed; no original text recovered. | Keep the cost claim unverified; no universal higher-effort savings rule. |
| 15 | [DSPy GEPA](https://dspy.ai/api/optimizers/GEPA/overview/), feedback, candidate selection and train/validation distinction. | Preserve a baseline and use concrete failure feedback; later automated optimization stays in 10-11. No DSPy install or optimizer in the core. |

The independent supplemental [official Provencher article](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)
was published on 2026-09-11. Its activation/disclosure and completion-boundary guidance informs
the router changes. It explicitly discusses other contributors using different models; it does
not justify an Astra-only instruction edition. Its examples are not transplanted verbatim.

## Model And Effort Evidence

The [official model page](https://learn.chatgpt.com/docs/models) documents these CLI identifiers:
`gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`. These are documentary candidates,
not a verified account catalog. The same page distinguishes model choice, reasoning and host
modes; UI labels must not be copied blindly into dispatch parameters. In particular, Ultra is
an orchestration mode, not evidence of a model's reasoning-effort enum.

| Candidate | Documented identity | This session can dispatch it? | Tuned preset promoted? |
|---|---|---|---|
| Astra | `gpt-6-astra` | No independent dispatch; current execution settings unobserved. | No. |
| Sol | `gpt-5.6-sol` | No. | No. |
| Terra | `gpt-5.6-terra` | No. | No. |
| Luna | `gpt-5.6-luna` | No. | No. |

Read-only tool discovery from this workflow and the earlier capability check exposed no model
execution/dispatch operation. Local `codex` is absent. This stage does not install a runtime,
extract credentials or call a paid API. No candidate effort pair was executed or benchmarked.
Before a future controlled run, read the actual client's allowed pairs, pass exact runtime
arguments and retain observed settings where exposed. The API guidance excludes Astra `none`;
a label in a third-party benchmark does not make that a supported runtime choice.

The only current routing recommendation is to retain `inherit` or an already explicitly allowed
project/runtime route. This is a compatibility default, not a measured optimum. Role-specific
rankings, cross-model generalization, latency and cost gains remain unestablished.

## Applied And Deferred Conclusions

Apply precise entrypoint triggers, shorter mode routers and a clear distinction between advance
merge authority and missing authority. Preserve target-owned rules, privacy, MCP-only calls,
valid review, revision checks and the local/CI split. A hypothetical token gain never justifies
removing a required safeguard. Public/synthetic instruction snippets can be reviewed; private
prompts and payloads remain excluded from reports and delegate packets.

For later 10-11 design retain: failed/interrupted attempts in the denominator, attributable
prompt/routing versions, measured rather than guessed usage, and separate held-out tasks.
Do not build that infrastructure now. See [evaluation](prompt-evaluation-08.md) for the actual
scope of the checks; there is no claim of experimental model superiority.

## Navigation

- [Stage agreement](steps/08-prompts.md)
- [Source register](../astra-refactor-reading-list.md)
- [Documentation index](../INDEX.md)
