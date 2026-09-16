# Repository Automation

[PR Verification](workflows/pr-verification.yml) runs on pull requests, pushes to `main`, and
manual dispatch. It uses Node 24 on Linux for validator regression tests and full documentation/
skill validation, then runs the standard-library Python architecture example checks.

The job summary records the source head, actual checkout revision and each check's outcome.
For a pull request, checkout normally tests a merge revision; it is not the source head.
Read the failed step when a check fails. Missing, skipped or cancelled evidence is not PASS.
The workflow does not configure branch protection or prove PowerShell, Windows, real HTTP or
database behavior. It deploys nothing.

These are VibeRails' own repository checks. Reusable provider CI/CD profiles belong to refactor
stage 12; adopting repositories should keep their existing relevant verification.

## Navigation

- [Repository README](../README.md)
- [Documentation index](../docs/INDEX.md)
- [Local commands and coverage](../scripts/README.md)
- [Verification policy](../docs/standards/quality-gate.md)
