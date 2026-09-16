# Repository Automation

[PR Verification](workflows/pr-verification.yml) runs on pull requests, pushes to `main`, and
manual dispatch. It uses Node 24 on Linux for validator regression tests and full documentation/
skill validation, adoption/configuration/pin regressions on isolated synthetic targets, and the
standard-library Python architecture example checks. Adoption regressions also run a small
Python target's real behavior tests and a local Git three-way conflict; no provider is contacted.

The job summary records the source head, actual checkout revision and each check's outcome.
For a pull request, checkout normally tests a merge revision; it is not the source head.
Read the failed step when a check fails. Missing, skipped or cancelled evidence is not PASS.
The workflow does not configure branch protection or prove PowerShell, full production-stack,
real HTTP or database behavior. It deploys nothing.

These are VibeRails' own repository checks. Reusable provider CI/CD profiles belong to refactor
stage 12; adopting repositories should keep their existing relevant verification.

## Pinned Pilot

The pilot step fetches the immutable 0.4.0 and 0.4.1 commits into temporary source snapshots
without changing the checked-out PR head. Six controlled compatibility cases use those actual
standards and audit tools, native Python behavior and clean local Git clones. No model API or
live adopter/provider is called. A fetch or test failure is a failed step, not a skipped pass.
This is reproducible artifact evidence, not a model-cost or team-productivity benchmark.

## Adoption Portability Scope

The existing Linux `Repository checks` job is preserved. Separate Windows and macOS jobs run
only adoption, refresh and instruction-boundary regressions with Node 24 and Bash. All three
jobs must pass on the current source/tested revision before delivery. Read actual test counts;
a selected OS or a skipped job is not coverage. No `.ps1` file is executed. These checks cover
filesystem/path, snapshot/audit, native Python and local Git examples, not production stacks,
LLM behavior, live MCP or every user's shell. Branch-protection settings are not changed.

## Navigation

- [Repository README](../README.md)
- [Documentation index](../docs/INDEX.md)
- [Local commands and coverage](../scripts/README.md)
- [Verification policy](../docs/standards/quality-gate.md)
