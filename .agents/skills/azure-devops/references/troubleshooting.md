# Azure DevOps Troubleshooting

Use this reference the moment an Azure DevOps wrapper call, Azure CLI command, or REST call
fails or times out. Find the symptom, apply the next step. Do not start free-form
experimentation before checking this table; it burns tokens rediscovering known causes.

Start every investigation with the diagnostic action:

```powershell
.\.agents\skills\azure-devops\scripts\ado-prs.ps1 -Action Doctor -Project <project> -Repository <repository>
.\.agents\skills\azure-devops\scripts\ado-work-items.ps1 -Action Doctor -Project <project>
```

`Doctor` reports each transport channel (native CLI, `az devops invoke`, REST bearer) as ok or
fail with the next step. A failed REST bearer channel is degraded but not fatal: the wrappers
prefer the CLI channels.

## Symptom Table

| Symptom | Likely cause | Next step |
|---|---|---|
| Error says a response "returned HTML instead of JSON" or output starts with `<` | The channel received a sign-in page. The bearer token or CLI session is broken for that channel (wrong tenant, expired login, conditional access). | Run `Doctor`. Use the wrapper as-is (it prefers CLI channels). Fix the broken channel with `az login` (matching tenant) or `az devops login` only when `Doctor` shows the CLI channels failing too. |
| `could not convert string to float: '7.1.4'` (or similar) from `az devops invoke` | azure-devops CLI extension 1.0.3 rejects preview API versions with a revision suffix such as `7.1-preview.4`. | Use the suffix-free form `7.1-preview`. The wrappers already pin this; do not "correct" it back to a documented revision when calling `az devops invoke`. |
| `--area is not present in current organization` from `az devops invoke` | The resource area (for example `Location`/`ConnectionData`) is not listed in the organization resource areas, so the extension refuses the call. | Do not retry with case or version variants. Use a different channel: the wrappers resolve identity through REST or `az account show` automatically. |
| Wrapper call fails with "Azure CLI timed out after N seconds" | The az call hung (network, proxy, broken auth handshake) and the wrapper cut it off. | Run `Doctor`. Do not blind-retry in a loop. Raise `AZURE_DEVOPS_TIMEOUT_SECONDS` only when the operation is genuinely slow, not to wait out a hang. |
| A POST through raw `az devops invoke --in-file` hangs until timeout and the resource is never created | Missing `--encoding utf-8 --media-type application/json` with non-ASCII body content. | Use the wrapper actions; they pass both flags. If a raw invoke is unavoidable, always pass both flags. After any timeout, read the resource back before retrying so you do not double-post. |
| `SelfReviewStatus` or reviewer identity fails, but `az repos pr show` works | Identity channels (invoke `ConnectionData`, REST) are broken on this machine; only the UPN from `az account show` is available. | The wrapper falls back to UPN comparison automatically. For reviewer votes, pass `-ReviewerId <current-user-id>` after verifying the id from a trusted source such as the PR reviewers list. |
| `az devops user show` fails with `Access Denied ... ReadExtended Users` | The account lacks member entitlement read permission. This is normal for non-admin accounts. | Do not request permissions for this. Use `-ReviewerId` for votes; self-review detection works without it. |
| Reviewer vote rejected on a draft PR | Azure DevOps does not accept votes on drafts. | Report the clean review, ask whether to publish the PR, then vote. |
| PR description or comment stores only the first line | Multiline text passed inline on the command line. | Pass content through `-DescriptionPath` / `-CommentPath` files. |
| Polish text breaks a hand-written PowerShell hash literal | Apostrophes end single-quoted strings. | Put the content in a temporary Markdown file and pass the file path parameter. |
| Work item Description or Acceptance Criteria saved empty or truncated | Raw multiline `az boards work-item create/update` arguments. | Use the wrapper with `-DescriptionPath` / `-AcceptanceCriteriaPath`; it normalizes, writes, and verifies the saved fields. |

## Escalation Rule

If two different next steps from this table both fail, stop. Report a blocker with: the exact
failing command class, the sanitized error, the `Doctor` output, and what was already tried.
Do not compose raw REST payloads by hand to work around a broken wrapper path; that bypasses
the guardrails and duplicates logic the wrapper already owns. If the wrapper itself has a bug,
record it through the failure learning loop in
[context-and-learning.md#failure-learning-update-pattern](context-and-learning.md#failure-learning-update-pattern).

## Navigation

- Skill guide: [../SKILL.md](../SKILL.md)
- Context and learning: [context-and-learning.md](context-and-learning.md)
- Boards reference: [boards.md](boards.md)
- Pull request reference: [prs.md](prs.md)
- Skills index: [../../README.md](../../README.md)
