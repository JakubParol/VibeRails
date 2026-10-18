# KIS - Keep It Simple

**IF A SIMPLE SOLUTION IS ENOUGH, KEEP IT SIMPLE.**

This is the canonical simplicity rule. Every agent applies it when planning, implementing,
verifying and reviewing. Other standards link here instead of restating it.

## Rule

- Choose the simplest solution that meets the agreed requirements and can be verified.
- Add complexity only for a demonstrated need: a stated requirement, a reproduced failure or
  real repetition. This covers code layers, abstractions, configuration, dependencies, tools,
  agents, checks, documents and reports.
- Prefer existing code, tools and workflows. Prefer removing or reusing over adding.
- Defer speculative and niche cases. Record them only when someone needs the record.
- Simplicity never removes agreed behavior, minimum architecture boundaries, required checks,
  authorization limits or honest evidence.

## Applying KIS

| Moment | What KIS means |
|---|---|
| Plan | Start from the simplest viable option. Justify anything heavier in one sentence. |
| Implement | Smallest coherent diff. No unused flags, generic engines, pass-through layers or one-use abstractions. |
| Verify | The smallest checks that prove the change; broad suites stay in CI. |
| Process | Load only needed context, start agents only when they help, report only what the reader needs. |

## KIS Review

- Every review checks simplicity as well as correctness: unnecessary code, layers, dependencies,
  configuration and process.
- Use a dedicated KIS reviewer (for example the `kis-review` skill, when selected) only for a
  substantial plan or implementation delta that leaves a concrete simplicity question open.
- A KIS finding names the simpler alternative and shows it meets the same criteria. Use normal
  review severity; "could be shorter" without a concrete benefit is not a finding.
- Reuse findings for unchanged work. Repeat the assessment only when scope, architecture or new
  evidence materially changes the complexity judgment. Status updates, commits, small
  documentation fixes and confirmation of fixed findings need no new round; review the delta.

## Decision Model

A project may select a decision model for narrow, typed KIS judgments. The choice is made during
onboarding and recorded in the project's `AGENTS.md` (KIS section): model, pinned version or
deployment, the last verification (date and check) and fallback. No recorded choice means
`none`; an available key or deployment never selects a model. Re-check access at use; never
store a permanent "connected" flag.

| Choice | Provider and access |
|---|---|
| `jev` (onboarding recommendation) | TypeSafe Jev, `https://api.typesafe.ai/v1/systemone`. API key in `TYPESAFE_API_KEY`. Pin a model such as `jev-1.13.0`. |
| `microsoft-decision-1` | Microsoft-Decision-1 in Azure Foundry. Needs a subscription and deployment; Entra ID (preferred) or API key. Record the deployment name. |
| `none` | The main agent decides. |

Both providers expose the same question types: yes/no probability (`noul`), choice among
options (`choice`) and ordered score (`score`). Check the vendor documentation at use; versions,
availability and endpoints change.

- Ask only bounded questions with concrete options, for example "Does simpler option A meet
  criteria X? A / B / cannot tell". Always offer an abstain option. Do arithmetic and ordering in
  code first. Do not use the model for design, code generation or explanations.
- Send a small sanitized state: options, criteria and an evidence summary. It leaves the project
  for a third-party service and may cost usage. Never send secrets, credentials, `.env` contents,
  tokens, personal data or private customer data. Run an available content-check helper first.
- The answer is advisory. It is not acceptance, permission or proof. Treat confidence as a
  routing signal, not correctness.
- Record the model, question, answer with probabilities and the chosen action in the existing
  task record. Do not repeat a question to obtain a better score.
- If the model is unavailable, unconfigured or returns an invalid or ambiguous answer, the main
  agent decides and continues.
- Keep credentials in the client's credential store or protected environment, never in Git,
  prompts, skill text or logs.

## Navigation

- [Documentation index](../INDEX.md)
- [Agent workflow](agent-workflow.md)
- [Change protocol](change-protocol.md)
