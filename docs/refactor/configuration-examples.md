# Configuration Design Examples

Design revision 1, step 02. Follow the single [configuration contract](../standards/configuration.md).
These JSON excerpts show the complete new section and selected existing profiles. They are
**not complete v1 manifests, templates for immediate adoption, or evidence of runtime support**.
Existing target commands, coordinates/auth, history and other required manifest fields are
omitted for clarity, not removed. The legacy adoption audit does not validate the new section.

## Small Python Project

Scenario: a small existing Python CLI with no tracker or remote delivery requirement. The
project already uses POSIX commands. Minimum architecture still separates input/presentation,
application behavior and persistence where present; step 3 decides the exact form.

```json
{
  "configuration": {
    "version": 1,
    "initializedFrom": "light",
    "architecture": "minimal",
    "verification": "local-focused",
    "documentation": "essential",
    "workflow": "local",
    "review": "adaptive",
    "modelRouting": "inherit"
  },
  "profiles": {
    "agentRuntime": "codex",
    "stack": "python-cli",
    "workTracking": "none",
    "codeHosting": "none",
    "scriptPlatform": "posix-shell"
  }
}
```

Resolved intent: essential documentation, minimal Clean Architecture, relevant local checks
and risk-based review. No tracker, hosted PR or model switch is invented. `none` decisions still
need the existing manifest's explanations at actual adoption. The existing stack standard
treats CLI projects as a documented exception; this excerpt does not expand runtime support.

## Larger Next.js And FastAPI Project

Scenario: an existing Next.js/FastAPI project already uses Jira, GitHub, a full PR pipeline and
Windows/POSIX entrypoints. Those provider/platform facts are explicit example assumptions,
not implications of selecting standard. Reuse the target's real commands and auth instructions.

```json
{
  "configuration": {
    "version": 1,
    "initializedFrom": "standard",
    "architecture": "layered",
    "verification": "ci-first",
    "documentation": "standard",
    "workflow": "pull-request",
    "review": "independent",
    "modelRouting": "inherit"
  },
  "profiles": {
    "agentRuntime": "codex",
    "stack": "nextjs-python-fastapi",
    "workTracking": "jira-work-tracking",
    "codeHosting": "github-code-hosting",
    "scriptPlatform": "both"
  }
}
```

Resolved intent: explicit architecture boundaries, broader useful documentation, small local
checks plus full PR verification, and independent review with staffing chosen by risk. PR
delivery still requires the applicable user authorization; merge is not automatic. Jira capability
and access must be observed. `both` does not require two copies of all script logic.

## Independent Overrides

If the small project acquires a working PR pipeline, it can keep `architecture: minimal` and
`documentation: essential` while explicitly selecting `verification: ci-first` and
`review: independent`. Its `initializedFrom: light` remains truthful provenance. Selecting
PR delivery also requires updating its real code-host configuration; do not infer that change.

No hidden inheritance occurs. Changing `initializedFrom` alone changes no effective value.
To request a new preset, the agent presents the complete resulting diff, retains project guards,
and records the authorized choices. It must not infer unsupported values or rewrite integrations.

## Worked Contract Checks

| Case | Expected interpretation |
|---|---|
| Both excerpts as shown | All new fields are explicit and consistent with the chosen starting preset; still design-only. |
| Minimal architecture + CI-first + independent review | Valid independent choices when required verification is available; architecture need not become layered. |
| Missing configuration on an existing v1 manifest | Legacy/unselected; existing behavior is preserved. |
| Only initializedFrom is changed | No behavior change; it is provenance, not a preset resolver. |
| Missing architecture, unknown review value or unsupported section version | Do not silently fill from a preset or claim the configuration is supported. |
| PR workflow with codeHosting none | Readiness/configuration conflict; resolve the intended delivery path, do not silently select a provider. |
| CI-first without usable CI | Report the gap and handle independent work; no fake PASS, automatic full local run or hidden downgrade. |
| Legacy audit passes a manifest containing the new section | Does not establish validation or activation of this design. |

These are specification walkthroughs, not results of an implemented resolver or end-to-end
adoption. Automated activation, migration and model-specific route behavior remain later work.

## Navigation

- [Configuration contract](../standards/configuration.md)
- [Stage 02 card](steps/02-configuration.md)
- [Documentation index](../INDEX.md)
