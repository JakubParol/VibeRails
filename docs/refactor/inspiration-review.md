# Scoped External Inspiration Review

Reviewed on 2026-09-16. Research notes, not approved implementation or executable instructions.

Sources:

- [Kacper Trzepiecinski - Vibe coding article](https://x.com/kacpertrzepiec1/status/2096872982383628777)
- [claude-code-starter snapshot](https://github.com/AIBiz-Automatyzacje/claude-code-starter/tree/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058)

The article was read in the browser; code was inspected statically at the pinned revision.
External framework/tests were not executed. Earlier Hermes/Codex observations were research
leads, not proof of defects in VibeRails.

## Claims And Observed Mechanisms

- JS really stops declared E2E work without its environment, but an agent supplies readiness
  facts. See [precheck/STOP](https://github.com/AIBiz-Automatyzacje/claude-code-starter/blob/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058/.claude/workflows/dev-autopilot-wf.js#L1231-L1269).
- State is serialized by JS, written by an agent, retried once, then only warned about on
  failure. See [state write](https://github.com/AIBiz-Automatyzacje/claude-code-starter/blob/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058/.claude/workflows/dev-autopilot-wf.js#L1198-L1214).
- The merge gate evaluates an agent report, with missing CI treated as green in its prompt.
  See [merge control](https://github.com/AIBiz-Automatyzacje/claude-code-starter/blob/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058/.claude/workflows/dev-pr-wf.js#L371-L416).
- Missed-review closeout and scoped refresh are called in code; reasoning and knowledge changes
  remain agent work, not a guarantee mistakes never recur. See
  [closeout](https://github.com/AIBiz-Automatyzacje/claude-code-starter/blob/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058/.claude/workflows/dev-pr-wf.js#L421-L451) and
  [refresh](https://github.com/AIBiz-Automatyzacje/claude-code-starter/blob/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058/.claude/workflows/dev-autopilot-wf.js#L1694-L1720).
- UI comparison/manual acceptance are agent instructions, not independent proof of visual
  correctness. See [tester contract](https://github.com/AIBiz-Automatyzacje/claude-code-starter/blob/e5ce4eace7e63db8da5bd253e0e0d6bfa0c6e058/.claude/agents/feature-tester-e2e.md#L52-L82).

## Fit And Candidate Refinements

VibeRails already describes start audits, blockers, review and verified learning. The proposed
refactor already covers one entry point, durable status/resume, parent ownership, versioned
prompts/routing, central telemetry and user acceptance. These are not new gaps.

| Refinement | Stage | Benefit / cost | Verification |
|---|---|---|---|
| Short readiness record for needed access, provider, data, QA and proof path | 4, 6, 8 | Earlier blockers; a few existing-card fields | Missing prerequisite blocks dependent work only; no silent PASS. |
| Requirement/design -> scenario -> tested-build evidence; Figma optional | 4, 6, 9 | Clear UI acceptance; small record cost | Screenshot or unit-test result alone cannot close an unproven criterion. |
| Important misses of own review/QA, cause and targeted prevention | Closeout, 10-11 | Improves the process; only meaningful incidents | Reproduce the defect and show the test/control detects it. |
| Applicability, last verification and replacement/archive of stale lessons | 11 | Less contradictory context; scoped upkeep | Obsolete advice leaves active guidance, history remains traceable. |

Reject wholesale copying, default reviewer fleets, mandatory Figma/Supabase, automatic global
rule accumulation, and missing CI as success. Keep simple records/existing controls first;
consider a small programmatic guard only when a repeated failure demonstrates its value.
Preserve user acceptance, explicit merge decisions and evidence for the actual revision.

## Navigation

- [Refactor plan](../refactor-plan.md)
- [Record structure](README.md)
- [Documentation index](../INDEX.md)
