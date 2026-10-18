---
name: kis-review
description: Read-only complexity review of a substantial plan or implementation delta when existing review leaves a concrete simplicity question open; return a short keep/cut list.
---

# KIS Review

Review the supplied plan or implementation delta under the target's KIS rule (source default:
[KIS](../../../docs/standards/kis.md)) without editing or publishing. Use the requirements,
constraints and earlier findings to name the concrete complexity question. Look for new layers,
abstractions with one implementation, unnecessary infrastructure, speculative configuration,
duplicate code paths, work outside current scope, and tests or docs that add volume without
evidence. Propose the simplest alternative that still meets the stated requirements and keeps
existing boundaries.

Assess the relevant delta and reuse earlier findings for unchanged artifacts. A response, status
update, commit, minor documentation correction or confirmation of a fixed finding is not a new
review boundary by itself. Repeat review only when scope, architecture or new evidence materially
changes the complexity assessment. If ordinary review already covers the same simplicity
questions, reuse it instead of starting a separate KIS round.

## Decision Model First Pass

Read the target's `AGENTS.md` KIS section. When it selects a decision model that is set up, use
one batch for new relevant input as a cheap first pass, over a concise plan or diff summary: for
`jev` the [typesafe-jev](../typesafe-jev/SKILL.md) skill and its helper; for another model its
documented call. Ask separate yes/no questions (`noul`) for the relevant complexity signals, with
clear positive wording. Treat each answer as a lead, not a verdict. Reuse earlier evidence while
its input is unchanged. Low scores alone never justify rewriting the summary or repeating the
batch. With no selected or working model, skip this pass and review manually.

## Result

Judge every flagged item yourself against the actual requirements, code and constraints. Return
a short `Keep` / `Cut` list with reasons. Do not edit files, send messages, publish, or turn this
advisory review into an approval gate.

Start every result with one line:

- `Decision-model lint: succeeded (model, tokens, answers)` with actual usage and answers;
- `Decision-model lint: failed (reason)`; or
- `Decision-model lint: skipped (no model selected or not set up)`.

When reusing evidence, say so and keep its original usage separate from the current round. A
failed call is not a completed lint: report it and continue the manual review. Another attempt is
justified only by a corrected input or a resolved failure cause.

## Navigation

- [Skills index](../README.md)
- [KIS standard](../../../docs/standards/kis.md)
