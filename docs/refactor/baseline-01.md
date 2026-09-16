# Stage 01 Baseline

Measured on 2026-09-16 from Git object `d22a9772c13da3699819f8b7648b1dc0fdd67b23`, before
audit approval/checkpoint edits. Reusable standards, templates, skills and scripts match
accepted main `e19acf6`; coordination files and index entries differ. Use this exact snapshot
to reproduce these numbers.

## Method And Limits

Count full selected files with Python `len(re.findall(r"\S+", text))`; lines use `splitlines()`.
This includes headings, examples, code and navigation. The result is whitespace-delimited units
(called words in the tables), not tokenizer output or billed tokens. Selection is a documented
scenario assumption; actual agents may load sections, reuse context or receive cached content.

Inventory groups exclude internal refactor records and generated/dependency folders by selecting
only tracked source paths. Scenario sets exclude target-local README/AGENTS/index and module docs,
task prompts, code/diffs, tool results and repeats between parent/child agents. Those vary by
project and execution. Do not add scenario rows together as if one task reads all three.

## Inventory

| Group | Files | Words | Lines |
|---|---:|---:|---:|
| `docs/standards/*.md` | 16 | 12873 | 2352 |
| `docs/templates/*.md` | 12 | 3593 | 779 |
| `.agents/skills/*/SKILL.md` | 3 | 3248 | 468 |
| `.agents/skills/*/references/*.md` | 13 | 10211 | 1704 |
| `scripts/validate.mjs` | 1 | 1000 | 406 |
| `scripts/validate.ps1` | 1 | 1151 | 373 |
| `scripts/install-skills.sh` | 1 | 288 | 91 |
| `scripts/install-skills.ps1` | 1 | 501 | 100 |

Validators share responsibilities, not necessarily identical lines. Installer differences may
be legitimate OS behavior. These counts do not justify merging every script into one runtime.

## Shared Reading Scenarios

Assume a target adopted from `project-AGENTS.md`, whose lines 13-16 explicitly require the
common workflow/change/quality documents before relevant task and stack standards. For review,
include the local-mode entrypoint and its authorization/routing/output/severity references.

| Scenario | Selected files | Words | Lines |
|---|---:|---:|---:|
| D: correction within existing documentation | 4 | 3434 | 658 |
| B: behavior change in an existing FastAPI service | 7 | 5141 | 1042 |
| R: local branch review of that backend area | 13 | 9629 | 1759 |

Common = `agent-workflow`, `change-protocol`, `quality-gate` under `docs/standards/`.
D = Common + `documentation`. Add the audit checklist if navigation/structure work requires it.
B = Common + `coding`, `architecture`, `backend`, `backend-testing`.
R = B + code-review `SKILL.md` and references `local-branch-mode`, `agent-authorization`,
`area-routing`, `output`, `severity-and-comments`. This is a selected-file union, not a claim
that every reviewer loads every reference or incurs the same token charge.

The common three files alone contain 2497 words. Review routing requires them for each agent,
but multiplying that count does not measure runtime input/cache cost.

Separate internal cold-resume record: plan 3492 words, STATUS 466, active stage 01 card 484;
total 4442. Exclude this coordination-only overhead from adopter comparisons.

## Reproduction

Run this read-only snippet at the VibeRails repository root. It reads Git objects, not working
files, and invokes no validation scripts or external services.

```python
import re
import subprocess

ref = "d22a9772c13da3699819f8b7648b1dc0fdd67b23"
tracked = subprocess.check_output(
    ["git", "ls-tree", "-r", "--name-only", ref], text=True
).splitlines()
std = lambda names: [f"docs/standards/{n}.md" for n in names.split()]
common = std("agent-workflow change-protocol quality-gate")
backend = common + std("coding architecture backend backend-testing")
review = [".agents/skills/code-review/SKILL.md"] + [
    f".agents/skills/code-review/references/{n}.md"
    for n in "local-branch-mode agent-authorization area-routing output severity-and-comments".split()
]
groups = {
    "standards": [p for p in tracked if p.startswith("docs/standards/") and p.endswith(".md")],
    "templates": [p for p in tracked if p.startswith("docs/templates/") and p.endswith(".md")],
    "skills": [p for p in tracked if p.startswith(".agents/skills/") and p.endswith("/SKILL.md")],
    "references": [p for p in tracked if p.startswith(".agents/skills/") and "/references/" in p and p.endswith(".md")],
    "D": common + std("documentation"), "B": backend, "R": backend + review,
    "internal-resume": ["docs/refactor-plan.md", "docs/refactor/STATUS.md", "docs/refactor/steps/01-audit.md"],
}
for p in ("scripts/validate.mjs", "scripts/validate.ps1", "scripts/install-skills.sh", "scripts/install-skills.ps1"):
    groups[p] = [p]
for label, paths in groups.items():
    texts = [subprocess.check_output(["git", "show", f"{ref}:{p}"], text=True) for p in sorted(set(paths))]
    print(label, len(texts), sum(len(re.findall(r"\S+", t)) for t in texts), sum(len(t.splitlines()) for t in texts))
```

## Runtime Evidence Still Needed

Actual tokens, cached/reasoning breakdown, billed cost, latency, task success and rework are
unknown for the hypothetical scenarios. They require later agreed executions. No model ranking
or percentage savings is inferred. Preserve the same scenarios and acceptance criteria for
comparison after refactor; record requested versus observed model/effort and any unavailable data.

## Navigation

- [Audit findings](audit-01.md)
- [Stage 01 card](steps/01-audit.md)
- [Documentation index](../INDEX.md)
