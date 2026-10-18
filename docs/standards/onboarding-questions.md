# Onboarding Question Catalog

Canonical English wording for guided VibeRails onboarding, catalog version 2. These are
questions and recommendations, not selected settings. Topic numbers are stable IDs; the displayed
"Question n/X" counter comes from the actual conversation under the [onboarding rules](onboarding.md).
Lettered items are follow-ups, asked only when their condition applies.

Present only the current question, its options and a short explanation, in the user's language.
A recommendation never substitutes for an answer.

## 1. What should I do in Git after completing and checking a task?

1. **Do nothing.**
2. **Create a commit.**
3. **Create a commit and push.**
4. **Create a commit, push, and open a PR.**
5. **Create a commit, push, open a PR, and merge the PR.**

**I recommend 3** - your changes are saved and pushed to a separate branch, but not added to the
project's main version yet.

## 2. When and how should code review run?

1. **Automatically after implementing and testing; the agent decides whether it needs additional
   agents.**
2. **Automatically, always with at least one additional agent.**
3. **Only when I ask; the agent decides whether it needs additional agents.**
4. **Only when I ask, always with at least one additional agent.**

**I recommend 1** - review always happens, and a small change does not have to start another
agent. Every review also checks whether the solution is as simple as it can be (KIS).

## 3. May the agent use additional agents for coding and testing, and how should their model be chosen?

Effort is the model's reasoning level.

1. **Yes - the agent chooses the model and effort to suit each task.**
2. **Yes - but only with the models and efforts I specify.**
3. **Yes - with the same model and effort as the main agent.**
4. **No - it codes and tests on its own.** Review agents from question 2 choose their model as
   in option 1.

**I recommend 1** - from the models available and allowed in your environment. It can still work
alone on a simple task.

**3a.** (Only for option 2.) Which models and efforts may the agent use?

## 4. How much structure and documentation should we start with?

**Example:** an application receives an order, calculates a discount and saves the result.

- **Simple structure (`minimal`):** order handling and discount rules can stay together while the
  code is short; database access stays separate. The agent proposes splitting when rules grow.
- **Separated structure (`layered`):** order handling, discount rules and database access each
  have their own part from the start. More files, but easier when rules are many and complex.
- **Concise documentation:** the essentials in a few shared documents.
- **Detailed documentation:** the same, plus a short description of each major code area.

1. **Simple structure and concise documentation.**
2. **Separated structure and detailed documentation.**
3. **I want to choose structure and documentation separately.**

**I recommend 1** - start simple and add structure when it is needed.

Both structures keep tests and keep the screen separate from calculations and data storage.
This is not a choice between worse and better code, and it does not change whether the
frontend, backend or AI parts are separate. Existing requirements and decisions are kept.

**4a.** (Only for option 3.) Simple (`minimal`) or separated (`layered`) structure?

**4b.** (Only for option 3.) Concise or detailed documentation?

## 5. Where do you keep the project's code?

Asked only when it cannot be detected.

1. **GitHub.**
2. **Azure Repos (Azure DevOps).**
3. **Somewhere else - I will specify where.**
4. **Only on my computer.**

## 6. Where do you keep tasks to be done?

1. **Jira.**
2. **Azure Boards (Azure DevOps).**
3. **Somewhere else - I will specify where.**
4. **Nowhere - I will give tasks to the agent in conversation.**

**6a.** Which project or board should I take tasks from? **Paste a browser link.** You do not need
technical identifiers. Do not share passwords or login details.

**6b.** Should we connect [Jira / Azure DevOps] now so I can read your tasks?

1. **Yes - help me connect it.** (recommended) You sign in yourself; I never ask for your password.
2. **No - I will connect it later.**

**6c.** During work, may I create tasks, add comments and change their status in [Jira / Azure Boards]?

1. **Yes, automatically within the work I request.** (recommended)
2. **Yes, but ask me before each change.**
3. **No - only read tasks.**

This covers only the selected project and requested work. Deleting tasks needs separate
permission.

## 7. Which skills should guide tasks and code review, and where should they be added?

Skills are ready-made instructions that guide an agent through a task or a review.

1. **VibeRails skills, only in this project.**
2. **VibeRails skills, in all my Codex projects.**
3. **Compare VibeRails skills with mine first - then I will choose.**
4. **No skills - use the rules recorded in the project.**

**I recommend 1** - it does not change how you work in other projects.

The agent never adopts your own skills just because it found them, and never removes or
replaces them without permission.

**7a.** (Only for option 3, after showing the differences.) Which skills should we use, and where?

## 8. Should tests run before committing and pushing each task?

1. **No - run tests after all tasks in the User Story, before the final commit and push.**
2. **Yes - run tests before committing and pushing each task.**

**I recommend 1.** Option 2 means running and analyzing tests more often, which can noticeably
increase token usage; no specific saving is promised.

With option 1 the agent carries out the tasks in order and may commit and push earlier work under
your Git choice. After the last task it runs tests for the whole change, fixes failures and checks
the fixes, and only then makes the final commit and push.

## 9. What should happen to problems and ideas for improving the agent's work?

1. **Only describe them in the summary.**
2. **Propose tasks and ask before creating them.**
3. **Automatically create tasks in the selected tool.**

**I recommend 2** - you decide what is worth recording. This covers recurring problems with tools
or instructions; ordinary fixes stay within the requested task.

## 10. Which decision model should KIS use for quick simplicity judgments?

KIS means Keep It Simple: agents always choose the simplest solution that is enough. A decision
model can quickly answer narrow questions such as "is the simpler option enough?". Its answer is
advice; the agent still checks the result. Only short, cleaned-up summaries are sent - never
secrets or personal data.

1. **TypeSafe Jev.** Needs an API key from the TypeSafe console.
2. **Microsoft-Decision-1 (Azure Foundry).** Needs an Azure subscription and a model deployment.
3. **None - the agent decides on its own.**

**I recommend 1** - it is the simplest to start. Choose 2 if the project already uses Azure
Foundry.

**10a.** (Only for options 1-2 when the model is not already set up.) Should we set it up now?

1. **Yes - help me set it up.** (recommended) You create the key or sign in yourself; never paste
   keys into the conversation.
2. **No - I will set it up later.** Until then the agent decides on its own.

## 11. May I add VibeRails according to this summary?

1. **Yes - add it, then [this adoption's Git actions, for example: commit and push].**
2. **Yes - add it, but leave the changes uncommitted.**
3. **No - I want to change something.**

## Navigation

- [Conversation rules and decision storage](onboarding.md)
- [Adoption procedure](adoption.md#guided-setup)
- [Documentation index](../INDEX.md)
