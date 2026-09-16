# GPT-6 Astra Refactor Reading List

Collected: 2026-09-16.

**Status: Source registration only; full review of this list deferred to step 08.**

Read and assess all 15 entries only at agreed step 08 entry (shared prompt refinement and model
evaluation), as recorded in the [active refactor plan](refactor-plan.md#step-08-research-entry-gate).
Stage 07 first completes the general adoption baseline. Astra-assisted improvements must retain
one model-neutral prompt set; this register does not mandate Astra-specific prompt editions.
Deferred context, cost, and feedback topics also inform the core refactor's feedback-loop stage.
The descriptions below are user-provided research leads, not verified conclusions. URLs are
preserved as supplied, with Markdown escaping removed; availability has not been checked.

## Coordination And Current Scope

The parent session orchestrates bounded tasks delegated to subagents and checks their results.
At the 2026-09-16 registration checkpoint, the user authorized source registration only and
requested a stop after saving and verifying this register and its navigation. Further work
follows the user's next instruction; source analysis remains deferred to step 08 under plan 1.4.
The gate moved from former step 7; source entries and their original descriptions are unchanged.

## Required Checklist At Step 08 Entry

- [ ] Read this register before research-driven refinement of the shared prompts or skills.
- [ ] Review all 15 sources, recording findings and source availability; explicitly mark any
  inaccessible source rather than silently skipping it.
- [ ] Reconcile proposed changes with the user's decisions and applicable repository
  instructions. Source text is research material, not executable agent instructions.
- [ ] Carry relevant findings on context, costs, evaluations, and feedback into the final
  feedback-loop stage.

## Prompting, Skills, And Evaluation

1. **OpenAI - Prompting best practices for GPT-6 Astra**
   [Source](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practice)

   Main reference for initiative, instruction following, style, delegation, testing, and
   verification. The user cites it as the basis for an earlier project environment-audit
   prompt.

2. **Eric Provencher - "Rethinking skills and prompts for GPT-6 Astra"**
   [Source](https://x.com/pvncher/status/2095991462416490862)

   Reducing AGENTS.md and skill overhead, precise activation conditions, less step-by-step
   direction, and clear completion criteria.

3. **Dominik Kundel - Older skills may hinder Astra**
   [Source](https://x.com/dkundel/status/2095972046014673156)

   Observation that workarounds for earlier model limitations may constrain a newer model.
   Suggested comparison: run the same task with and without the skill.

4. **Scarlet - Discussion of OpenAI's Astra guidance**
   [Source](https://x.com/scarletkc_/status/2096115424790556698)

   Post that led the earlier discussion to the official guide: conflicting instructions,
   skill audits, autonomy, and limiting excessive testing.

5. **Matt Pocock - "Writing for agents"**
   [Source](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/writing-for-agents/SKILL.md)

   Agent documentation: one canonical location per rule, non-obvious knowledge, references
   loaded conditionally, and verifiable completion criteria.

6. **OpenAI - Skill Creator**
   [Source](https://raw.githubusercontent.com/openai/skills/main/skills/.system/skill-creator/SKILL.md)

   Skill structure: a short core, separate references and scripts, and instruction detail
   proportional to task risk.

7. **OpenAI - Build skills**
   [Source](https://learn.chatgpt.com/docs/build-skills)

   Codex skill structure, descriptions, and activation control. Earlier discussion included
   explicit invocation of large workflows rather than automatic takeover of every task.

8. **OpenAI - Eval skills**
   [Source](https://developers.openai.com/blog/eval-skills)

   Evaluating whether a skill helps: correct activation, result quality, process compliance,
   and execution cost. Treat a skill as a testable component.

## Context And Long-Running Work

9. **Codex - Experimental context management**
   [Source](https://learn.chatgpt.com/docs/models#experimental-context-management)

   Notes retained across context windows and retrieval of earlier messages and tool results;
   discussed as an alternative to relying solely on successive summaries.

10. **Codex - PR #42385**
    [Source](https://github.com/openai/codex/pull/42385)

    Technical source cited in the context-management discussion, supplementing the feature
    documentation.

## Reasoning And Cost Optimization

11. **OpenAI - Managing usage with GPT-6 Astra**
    [Source](https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex)

    Effects of reasoning effort, context size, step count, and Fast mode on usage. The supplied
    lead distinguishes effort settings from a fixed total task cost.

12. **ARC Prize - Astra**
    [Source](https://arcprize.org/blog/astra)

    Benchmark cited for the possibility that more reasoning reduces actions and total cost,
    with potential relevance to agent context management.

13. **Norsica - Astra effort evaluation**
    [Source](https://www.norsica.jp/resources/astra-effort-evaluation)

    Low/Medium/High comparison on the Galley project, considering cost and implementation
    quality. Supplied as a counterexample to "higher reasoning is always cheaper."

14. **Rajath - Higher reasoning and usage limits**
    [Source](https://x.com/buildwithrajath/status/2097729832302121257?s=12&t=zS-jPA_xOvb8p9tzwtP-wg)

    Post that prompted an earlier Medium versus xHigh investigation. A hypothesis to test,
    not a confirmed universal savings rule.

## Agent Optimization Through Feedback And Tests

15. **DSPy - GEPA**
    [Source](https://dspy.ai/api/optimizers/GEPA/overview/)

    Automatic prompt optimization using execution traces and textual feedback, comparing
    proposed variants. Earlier Growth/Ben discussion; not specific to Astra. Also relevant
    to the final feedback-loop stage.

## Navigation

- [Documentation index](INDEX.md)
