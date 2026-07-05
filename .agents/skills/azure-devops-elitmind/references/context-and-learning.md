# Azure DevOps Context And Learning

Use this reference for ElitMind Azure DevOps context resolution, API version discipline, and
durable failure-learning updates.

## Contents

- [Context Resolution](#context-resolution)
- [API Version Discipline](#api-version-discipline)
- [Failure Learning Update Pattern](#failure-learning-update-pattern)
- [Navigation](#navigation)

## Context Resolution

Default organization:

```text
https://dev.azure.com/Elitmindvs
```

Project and repository values vary by ElitMind project. Resolve them in this order:

1. Explicit wrapper parameters: `-Org`, `-Project`, `-Repository`.
2. Environment variables: `ELITMIND_ADO_ORG`, `ELITMIND_ADO_PROJECT`,
   `ELITMIND_ADO_REPOSITORY`.
3. Azure Repos remote URL from `origin` or `upstream`, for example:

   ```text
   https://dev.azure.com/Elitmindvs/<project>/_git/<repository>
   git@ssh.dev.azure.com:v3/Elitmindvs/<project>/<repository>
   ```

4. If the context is still unknown, ask the user. Do not guess a project or repository.

Check the resolved context without contacting Azure DevOps APIs:

```powershell
.\.agents\skills\azure-devops-elitmind\scripts\ado-work-items.ps1 -Action Context
.\.agents\skills\azure-devops-elitmind\scripts\ado-prs.ps1 -Action Context
```

Local persistence options:

```powershell
$env:ELITMIND_ADO_ORG = "https://dev.azure.com/Elitmindvs"
$env:ELITMIND_ADO_PROJECT = "<project>"
$env:ELITMIND_ADO_REPOSITORY = "<repository>"
az devops configure --defaults organization=https://dev.azure.com/Elitmindvs project=<project>
```

Do not commit local context values, tokens, credentials, or generated Azure DevOps responses to
the repository.

## API Version Discipline

Do not infer Azure DevOps REST API versions from memory or from a different resource family.
Before adding or changing `az devops invoke` calls, check the Microsoft Learn page for the
specific resource and pin the exact documented `api-version`.

Defaults:

| Resource | API version | Notes |
|---|---|---|
| Work item create/update and metadata | `7.1` | Stable Work Item Tracking endpoints. |
| Work item comments | `7.1-preview` | Preview resource. With `az devops invoke`, use the suffix-free form: extension 1.0.3 rejects revision suffixes such as `7.1-preview.4` with a float parse error. |
| Pull request threads | `7.1` | Stable Git pull request thread creation endpoint. |
| Connection data | `7.1-preview` via invoke, `7.1-preview.1` via REST | On some organizations `az devops invoke --area Location` fails with "--area is not present"; the wrappers then resolve identity through REST or `az account show`. |

With `az devops invoke`, never pass a preview version with a revision suffix (`-preview.N`).
The extension strips `-preview` and fails parsing the remainder as a float. Documented
Microsoft revisions still apply to direct REST calls.

If Microsoft documentation and observed Azure CLI behavior disagree, prefer a wrapper fallback:
record the sanitized failure, the endpoint documentation checked, the successful replacement
command, and the read-back verification. Update `scripts/` only after the replacement works.

## Failure Learning Update Pattern

When an agent resolves a new Azure DevOps failure, convert it into reusable skill knowledge only
when all criteria are true:

| Check | Required evidence |
|---|---|
| Reproducible symptom | Failing wrapper action or command and sanitized error class. |
| Root cause | CLI gap, REST version mismatch, quoting issue, process metadata mismatch, or wrapper bug. |
| Verified fix | Successful replacement command plus read-back verification. |
| Reuse value | Applies across ElitMind projects or prevents repeated token burn. |
| Safe content | No secrets, raw customer data, raw personal data, PII, prompts, OCR text, private payloads, Azure DevOps identity objects, user names, email addresses, or identity-related fields. Use redacted placeholders or non-personal IDs when identity context is necessary. |

Update target:

| Finding type | Update |
|---|---|
| Approval gate, learning rule, or durable workflow decision | `../SKILL.md` |
| Endpoint version, known pitfall, or command example | this reference, [troubleshooting.md](troubleshooting.md), or the operation-specific reference |
| Repeated fragile command, JSON payload, quoting, pagination, or verification logic | `../scripts/` |
| Project-specific area path, iteration, process field, default branch, or repository rule | adopting repository docs |
| Verified fix without time or approval for a durable patch mid-task | append to [../LEARNINGS.md](../LEARNINGS.md) |

Distribution note: this skill reaches sessions through a user-scope junction, so these files
are the standards repository working tree. Durable patches happen on a standards-repository
branch with user approval; the inbox in [../LEARNINGS.md](../LEARNINGS.md) is the mid-task
path. A consolidation session in the standards repository periodically turns inbox entries
into durable updates and clears them.

Use this mini-report in the final response after updating the skill:

```text
Skill learning recorded:
- Symptom:
- Root cause:
- Durable fix:
- Files updated:
- Verification:
- Not recorded:
```

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Boards reference: [boards.md](boards.md)
- Pull request reference: [prs.md](prs.md)
- Troubleshooting: [troubleshooting.md](troubleshooting.md)
- Skills index: [../../README.md](../../README.md)
