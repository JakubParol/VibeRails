# Stage 09 Controlled Pilot Report

## Decision Boundary

The user pre-authorized execution and automatic merge of 08 and 09, followed by a report and
STOP for review on a new repository. This report closes the controlled pilot only. It does not
approve stage 10, a production rollout, or changes to any other repository. No independent
reviewer/model or second developer was available; the existing solo exception remains explicit.

## Compared Inputs

| Version | Immutable source | Content tree |
|---|---|---|
| 0.4.0 general baseline | `a60dca9638bf12cd84244aedcf5fc8d2a9734baa` | `755ad38755dd378fa72e9cbb610c3d92964a9fd9` |
| 0.4.1 shared refinement | `d92f6fa34d1809997c2d9629d81ca382d00e9ff2` | `d43ac62e8743fdda44e7385b0d98078f9135e879` |

Local source snapshots matched those Git trees before the pilot. CI exports the fixed commits
without changing the PR checkout. The test also checks the selected review-entrypoint digest
and refuses missing snapshot inputs. This sentinel is not a substitute for the pinned archive.
The same source mapping, application task, assertions and correction are used for both versions.
The copied audit and fingerprint tools actually come from each selected source revision.

There are six deterministic scenarios, not six autonomous agent tasks. The author wrote both
the application fixtures and checks and has seen both instruction sets. No blinded allocation,
independent context reset, causal quality comparison or measured model cost is claimed.

## Projects And Tasks

**Small:** a local Python label CLI gains stable batch deduplication. Trimming, input order,
case and Unicode preservation, blank/non-text rejection, empty lists, input immutability and
validate-before-save behavior are checked. Eleven native cases include three retained legacy
cases and eight batch cases. No tracker, code host, optional skill or service is invented.

**Multi-root:** a root coordinates `packages/labels` and `services/cli`. The inner batch operation
receives a save port, the presentation receives a bound operation, and an outer composition
selects a JSON-file adapter. Fifteen native cases add real CLI/file integration, unchanged
output after invalid input and an AST import-boundary check. This is a larger structural fixture,
not evidence of a large production application, full Clean Architecture compliance or a team trial.
Local warnings and a named future remote verification requirement remain in its documents.

The local endpoint uses inherited model selection, adaptive review and local-focused checks.
The multi-root fixture explicitly chooses layered/standard documentation settings. No remote
CI or independent-human acceptance is silently inferred from these selections; an open question
persists throughout the audit, including after successful document refresh.

## Results

| Scenario | Executed result | What it establishes |
|---|---|---|
| 0.4.0 small | 11 native cases detect seeded duplicate bug; correction passes; clean clone passes. | Original general pack can be adopted alongside the bounded task. |
| 0.4.0 multi-root | 15 native cases detect seeded bug; correction and fresh clone pass. | Same bounded task across package/presentation/real-file boundaries. |
| 0.4.1 small | The same 11 cases, correction and clean-clone sequence pass. | No observed artifact compatibility regression in this scenario. |
| 0.4.1 multi-root | The same 15 cases, correction and clean-clone sequence pass. | No observed artifact compatibility regression in this scenario. |
| Actual 0.4.0 to 0.4.1 refresh | Four changed source files previewed through Git three-way merge; 18 unchanged source refs retained; custom rule preserved. Stale pins fail before explicit snapshot. Repeated checks change no bytes. Version-only rollback fails; matching files and receipt pass. | Controlled refresh, preservation, no-op checking and rollback work with actual version content. |
| Stale handoff | Old clean clone passes for its own commit; a later intentionally regressed commit fails; correction obtains fresh native evidence. | Old evidence is not evidence for a changed task head. No automatic workflow enforcement is claimed. |

Every successful native check verifies the expected executed case count and rejects skipped or
expected-failure summaries. An audit passes structurally with the explicit open question intact;
that is not code-compliance, provider capability or CI PASS. The pilot does not mark a live
feature accepted. Clone commit IDs in logs identify temporary local fixtures, not VibeRails PR
revisions or publicly retrievable commits. CI separately records the real PR source/tested SHA.

## Failures, Rework And Measurements

The first local pilot invocation passed two scenarios and failed the four matrix scenarios
before native execution because this author's assertion expected different wording for the
existing audit disclaimer. The audit correctly reported its structural limitation. Correcting
that test expectation made all four targeted scenarios pass; no pack implementation or quality
rule was weakened. A later skip-summary guard was checked on one selected small scenario.
A separate negative probe then confirmed that an exit-zero native run with three skipped cases
was rejected. Unchanged successful refresh/stale-handoff coverage was retained; CI runs all six
on final head.
The intentionally seeded duplicate regressions are negative controls, not accidental model errors.

The final local matrix check took 24.85 seconds: approximately 3.04/9.08 seconds for baseline
small/multi-root and 3.77/8.86 for candidate small/multi-root. These are single-invocation
fixture/check durations including copying, audits, processes and Git, not agent completion time,
model latency or a speed comparison. No repeated timing distribution was measured. CI timings
may differ and remain attached to its actual run, not substituted for these observations.

Model token usage, effort, task-generation time, parent/child cost and human productivity were
not observable. No subagents were run. Human involvement here was scope and advance authorization;
the test fixture's explicit merge resolution is an author-coded decision, not an observed user
interaction metric. No financial saving or provider/model ranking can be calculated from this.

## Findings And Remaining Validation

No VibeRails implementation defect was reproduced by these controlled scenarios. Stage 08
already corrected concrete authorization and mode-routing ambiguities; this pilot does not
prove that a different LLM follows the shorter instructions better. The initial pilot failure
was in this author's test expectation and remains recorded above, rather than deleted from
the denominator.

The next real-repository review should verify actual task execution and context selection,
local customization/pin maintenance, MCP capabilities, actual project CI, and whether another
developer can continue from the handoff without this conversation. Cross-model runs need a
runtime that exposes allowed model/effort pairs and trustworthy usage. Windows/PowerShell,
live database/HTTP behavior and provider-enforced concurrency were not tested here.

The useful result is a versioned, reproducible compatibility baseline and a clear list of
unproven claims. Keep `inherit` or existing explicitly allowed routes; do not promote a tuned
preset without measurements. Do not build central telemetry or another orchestration layer
merely to make the pilot appear broader.

## Reproduction And Evidence

See [pilot commands](../../scripts/README.md#controlled-pilot-reproduction) and
[six scenarios](../../scripts/tests/pilot.test.mjs). The fixed application fixtures and source
mapping are [pilot-apps.mjs](../../scripts/tests/pilot-apps.mjs) and
[pilot-fixtures.mjs](../../scripts/tests/pilot-fixtures.mjs). Existing repository CI retains
12 validator and 16 adoption cases plus architecture examples, with the six pilot cases added.
The stage PR records final source/tested/merge SHAs and actual logs after closing-doc publication.

## Navigation

- [Stage scope and closeout](steps/09-pilot.md)
- [Current status and stop boundary](STATUS.md)
- [Prompt comparison](prompt-evaluation-08.md)
- [Documentation index](../INDEX.md)
