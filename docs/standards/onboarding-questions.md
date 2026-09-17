# Onboarding Question Catalog

This is the canonical English wording for guided VibeRails onboarding. These are questions
and recommendations, not selected settings. Catalog IDs stay stable; the displayed question
number comes from the actual conversation under [onboarding rules](onboarding.md).

Present only the current question, its choices and relevant explanation in the user's language.
Keep agent-only conditions and storage rules in [onboarding.md](onboarding.md), not in the
user-facing question. A recommendation never substitutes for an answer.

## 1. What should I do in Git after completing and checking a task?

1. **Do nothing.**
2. **Create a commit.**
3. **Create a commit and push.**
4. **Create a commit, push, and open a PR.**
5. **Create a commit, push, open a PR, and merge the PR.**

**I recommend 3** - your changes will be saved and pushed to a separate branch, but will not
be added to the project's main version yet.

## 2. Should I automatically run code review after implementing and testing a task?

1. **Yes, automatically.**
2. **No, only when I ask.**

**I recommend 1.**

## 3. How should code review be performed?

1. **The agent decides whether it needs additional agents, how many, and which ones.**
2. **Always use at least one additional agent.** The agent leading the review chooses any
   others when needed.

**I recommend 1** - code review still takes place, but a small change does not have to start
another agent. For a larger change, the agent chooses suitable helpers.

## 4. May the agent use additional agents for coding and testing?

1. **Yes - it decides when to start them, how many, and what for.**
2. **No - it codes and tests on its own.**

**I recommend 1** - it can still work alone on a simple task.

This applies to carrying out the task. Code review has separate rules.

## 5. How should the AI model and effort be chosen for additional agents?

Effort is the model's reasoning level.

1. **The agent chooses the model and effort to suit the task.**
2. **Use only the models and efforts I specify.**
3. **Use the same model and effort as the main agent.**

**I recommend 1** - from the models available and allowed in your environment.

This applies to coding, testing, and code review.

## 6. Should we start with a simple code structure or a more detailed separation?

**Example:** an application receives an order, calculates a discount, and saves the result
to a database. This code can be organized in two ways:

**1. Start simple (`minimal`).**
Order handling and discount calculation can stay together while the code is short and clear.
Database access stays separate. As discount rules grow, the agent will propose separating them.

**Fewer files and fewer things to maintain. We add structure when it is needed.**

**2. Separate things more carefully from the start (`layered`).**
Order handling, discount rules, and database access each have their own part. When we change
how discounts are calculated, we work in the part dedicated to those rules.

**More files and connections between them, but this structure can help when an application
has many complex rules.**

**I recommend 1** - start simple, without creating extra parts in advance.

Both options maintain order, tests, and separation of the screen from calculations and data
storage. **You are not choosing between "worse" and "better" code. This also does not change
whether the frontend, backend, or AI component are separate - it concerns the organization
of code inside each of them.**

## 7. How detailed should the agent's documentation be?

1. **Concise.** The essential project and component information, how to run and test it, and
   working rules - in a few shared documents.
2. **More detailed.** The same information, plus a separate description for each major code
   area: its purpose, how to use it, and how to check it.

**I recommend 1** - fewer documents to maintain. Add separate descriptions where they help.

The agent updates documentation with changes in both options. **Existing requirements and
project decisions are not removed or shortened.**

## 8. Where do you keep the project's code?

1. **GitHub.**
2. **Azure Repos (Azure DevOps).**
3. **Somewhere else - I will specify where.**
4. **Only on my computer.**

## 9. Where do you keep tasks to be done?

1. **Jira.**
2. **Azure Boards (Azure DevOps).**
3. **Somewhere else - I will specify where.**
4. **Nowhere - I will give tasks to the agent in conversation.**

## 10. Which project or board should I take tasks from?

**Paste a browser link** - for example, to a Jira project or an Azure Boards board.
You do not need to find technical identifiers. Do not provide passwords or login credentials.

## 11. Should we connect [Jira / Azure DevOps] now so I can read your tasks?

1. **Yes - help me connect it.**
2. **No - I will connect it later.**

**I recommend 1.** If sign-in is needed, the agent will show you where to sign in, without
asking you to provide your password in the conversation.

## 12. During work, may I create tasks, add comments, and change their status in [Jira / Azure Boards]?

1. **Yes, automatically within the work I request.**
2. **Yes, but ask me before each such change.**
3. **No - only read tasks.**

**I recommend 1** - for example, the agent will mark a task as started and add a comment with
the result of the work.

This applies only to the specified project and requested work. Deleting tasks requires
separate permission.

## 13. Which skills should be used to carry out tasks and review code?

Skills are ready-made instructions that guide an agent through a task or code review.

1. **Use VibeRails skills.**
2. **Compare VibeRails skills with mine - then I will choose.**
3. **No skills - use the rules recorded in the project.**

**I recommend 1.**

The agent does not choose your skills just because it found them on your computer. It does
not remove or replace them without permission.

## 14. Where should the selected skills be added?

1. **Only in this project.**
2. **In all my projects in Codex.**

**I recommend 1** - this does not change how you work in other projects.

## 15. Should tests run before committing and pushing each task?

1. **No - run tests after all tasks in the User Story, before the final commit and push.**
2. **Yes - run tests before committing and pushing each task.**

**I recommend 1.** Option 2 means the agent runs tests and analyzes their results more often,
which can noticeably increase token usage. Tokens are used by the agent's work, not by the
test program itself; no specific savings are promised without measurement.

With option 1, the agent splits the User Story into tasks and carries them out in order.
After earlier tasks, it may commit and push under the selected Git rules, without automatically
repeating tests each time. After the last task, it first runs tests for the whole change,
fixes any failures, and checks the fixes. Only then does it make the final commit and push,
if those actions are allowed.

## 16. Have you already decided how the application should look?

1. **Yes - I will show you a design or examples.**
2. **No - propose a design.**
3. **We will decide later, before building the first screen.**

**I recommend 3** - finish setting up VibeRails first, then decide on the design before
working on the first screen.

## 17. On which devices should the application be comfortable to use?

1. **Computer.**
2. **Computer and phone.**
3. **Computer, phone, and tablet.**

**I recommend 3** - the same browser application, with a layout adapted to the screen size.

## 18. Should the application have a light or dark theme?

1. **Light.**
2. **Dark.**
3. **Both - the user can switch.**

**I recommend 3** - everyone can choose the appearance they find more comfortable.

## 19. What should happen to problems and ideas for improving the agent's work?

1. **Only describe them in the summary.**
2. **Propose tasks and ask before creating them.**
3. **Automatically create tasks in the selected tool.**

**I recommend 2** - you decide what is worth recording.

For example, this covers a recurring problem with a tool or instructions. The agent handles
ordinary fixes within the requested task under the agreed working rules.

## 20. After adding and checking VibeRails, should I create a commit and push?

1. **Yes - create a commit and push.**
2. **No - I will choose differently this time.**

**I recommend 1.**

## 21. May I add VibeRails according to this summary?

1. **Yes - start.**
2. **No - I want to change something.**

## Navigation

- [Conversation, conditions and decision mapping](onboarding.md)
- [Adoption procedure](adoption.md#guided-setup)
- [Documentation index](../INDEX.md)
