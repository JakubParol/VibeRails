# Documentation Audit Standard

Use this checklist before reporting documentation adoption or documentation restructuring as
complete.

## Required Checks

| Check | Pass condition |
|---|---|
| Root trio | Repository root has `README.md`, `AGENTS.md`, and `docs/INDEX.md`. |
| Standards | Required standards are present under `docs/standards/`. |
| Monorepo roots | Each standalone app, service, worker, mobile app, or package has its own trio. |
| Folder docs | Significant non-root folders have `README.md`. |
| Local agent rules | Folder `AGENTS.md` files exist only where local rules differ from parent rules. |
| No extra docs folders | Ordinary feature and module folders do not contain `docs/`. |
| Navigation | Markdown files are reachable from an index, parent README, or parent AGENTS file. |
| Back links | Documents link back to their parent index or documentation root. |
| Quality gates | Root and child project quality gates are documented. |
| Stack profile | Selected stack profile is documented in README or docs index. |

## Required Report

Report:

- checks that passed
- missing files created
- missing files intentionally skipped
- broken or unknown links
- user decisions still needed

## Navigation

- [Documentation index](../INDEX.md)
- [Documentation standard](documentation.md)
- [Adoption standard](adoption.md)
