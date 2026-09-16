# Stage 08 Prompt Evaluation

## Boundary And Method

Baseline: accepted 0.4.0, Git `a60dca9638bf12cd84244aedcf5fc8d2a9734baa`.
Candidate: the shared instruction changes delivered in the stage 08 PR. Its final source and
actually tested revision are recorded in that PR. The components below identify the bytes
without a self-referential commit. Other changed rule owners are included in the same diff.

This is a single-author semantic comparison plus executed document/adoption checks. It is not
a blinded A/B experiment, independent review, host skill-activation test or multi-model run.
The author has seen both versions; no independent context reset, model/effort switching or usage
measurement was available. The user explicitly retained solo execution. No model ranking,
causal quality gain or token/cost/latency saving is inferred.

Compare meaning first: required authority, code-host separation, evidence, privacy and target
customization must remain intact. Shortening alone is not acceptance. Native checks validate
metadata/navigation and copying the actual standards, not a model's compliance with the prose.

## Entrypoint Size Proxy

Counts use Python whitespace splitting over whole files, including frontmatter. They are not
model tokens or the effective task context; linked references still cost context when needed.
Only these entrypoints are measured, not a claim that the entire pack became smaller.

| Component | Baseline words | Candidate words |
|---|---:|---:|
| `.agents/skills/code-review/SKILL.md` | 1496 | 758 |
| `.agents/skills/e2e-work-item/SKILL.md` | 788 | 465 |
| `.agents/skills/azure-devops/SKILL.md` | 976 | 945 |
| `docs/templates/adopt-standards-prompt.md` | 337 | 357 |

## Scenario Review

The same ten situations were checked against both versions. These rows are an author review
of the written contract, NOT ten successful model executions. No numeric pass rate is assigned.

| Situation | Baseline assessment | Candidate assessment |
|---|---|---|
| A request only asks what a work-item link means. | E2E body excludes lookup; broad reference wording adds noise. | Frontmatter explicitly excludes lookup/explanation/planning. No mutation is authorized. |
| An authorized task has no tracker. | Common runbook supports a brief. | Same behavior; no extra tracker setup or provider references. |
| The requested endpoint is a draft PR. | Publication/merge remain separate. | Preserved; a named human retains those actions. |
| Merge was explicitly authorized in advance, after checks. | Common owner carries authority forward; E2E table additionally requires an instruction after evidence readback. | One rule: retain scoped authority and recheck current evidence/head; no duplicate permission question. |
| Reviewing a GitHub PR through an available read-only connection. | Mode asks for gh; global skill step also mentions Azure-style MCP identity conditions. | Selected GitHub connection or approved gh; Azure identity/voting constraints apply only to Azure. |
| ADO actor identity is unknown or matches the author. | Keep review local. | Preserved; no publication/vote or substitute summary. |
| A create operation times out with uncertain outcome. | Authoritative MCP readback precedes safe retry. | Preserved in canonical recovery and provider references; no CLI/REST fallback. |
| Review is for an older SHA; tests are zero/stale/all-skipped. | No current review/test PASS may be claimed. | Preserved; inspect the missing delta, retain unaffected evidence. |
| Reviewer must inspect an approved public/synthetic prompt. | Broad prohibition includes all prompts, obstructing instruction review. | Private prompts/payloads remain protected; approved sanitized public snippets can be reviewed. |
| A required independent model route is absent. | Report unavailable dispatch; actual settings unknown. | Preserved; no model switch inferred from text, no fabricated independent review. |

The changes remove specific cross-file contradictions and reduce repeated routing prose. They
do not relax a stricter target policy or convert this author's opinion into measured model gains.

## Executed Evidence

Focused validation covers all changed Markdown and affected skill metadata. The existing
fresh-adoption regression copies the actual candidate standards and the optional audit bundle
into a temporary target and executes native behavior checks. The source and result of these
checks are recorded in the [stage card](steps/08-prompts.md) and current-head CI.

The local and CI checks are not external MCP or client compatibility proof. All 16 existing
adoption cases and 12 repository regressions remain in CI; no unchanged full suite is repeated
locally. Stage 09 exercises the integrated pack on bounded controlled projects. Multi-model
execution, usage measurement and independent developer handoff remain work for an environment
that actually exposes them, not a reason to promote an untested preset here.

## Instruction Fingerprints

- `.agents/skills/code-review/SKILL.md`: baseline `3c547567ac896eef5261d3483736ed9a14c088b111e22b2b50da2e695842c051`; candidate `27e9d1ba4c37a2b92471ec60c62929f609447d657bf2444ec65f6e5926002191`.
- `.agents/skills/e2e-work-item/SKILL.md`: baseline `6ff344d3761635f570f9959176319ddd0970afdc44e33982604696d8ce6119e7`; candidate `d8aa46149e73ae2eef77a2b55ca567f6e9172e276eb54bf04c03d128971d85ee`.
- `.agents/skills/azure-devops/SKILL.md`: baseline `01ecae85aca4d38ef5b11650f2901b926fcb26a594014ad404a86e2fd7cb273a`; candidate `5ef37129e4b3f5eda48908b9e379ac3f95a62c7d8d4eb4b6aa07419cf66dd42d`.
- `docs/templates/adopt-standards-prompt.md`: baseline `4dc9eabc1c88b2b8c2addbe7d16366bd093bbd46d8657e8d06347caa26d284a1`; candidate `44b21c6d4b91c9046667191f1b412f0b1a10e156ca39be413904dad4795d2812`.

## Navigation

- [Research and capability evidence](research-08.md)
- [Stage agreement](steps/08-prompts.md)
- [Documentation index](../INDEX.md)
