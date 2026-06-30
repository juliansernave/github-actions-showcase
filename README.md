# GitHub Actions — Advanced Showcase

A collection of real, runnable workflows covering the features that matter most for QA and test automation engineers. Each file focuses on one concept; the numbered filenames give a suggested reading order in the GitHub UI.

> **Who this is for** — you already know triggers, jobs, steps, and `actions/checkout`. This repo goes beyond the basics.

---

## Getting started

```bash
npm install          # generates package-lock.json
git add package-lock.json
git push
```

Push to a GitHub repo and the workflows will appear in the **Actions** tab.

---

## Workflow reference

### Cluster A — Pipeline Fundamentals

| # | Workflow | What it teaches |
|---|----------|-----------------|
| 02 | [Artifacts & Test Reports](/.github/workflows/02-artifacts-test-reports.yml) | `upload-artifact` / `download-artifact`, `if: always()` so reports survive red builds |
| 03 | [Caching](/.github/workflows/03-caching.yml) | Built-in `cache: 'npm'` vs manual `actions/cache`; `hashFiles()`; `restore-keys` |
| 04 | [Job Outputs](/.github/workflows/04-job-outputs.yml) | `$GITHUB_OUTPUT` (modern API), step→job output mapping, data-driven conditional jobs |

### Cluster B — Test Execution Patterns

| # | Workflow | What it teaches |
|---|----------|-----------------|
| 01 | [Matrix Strategy](/.github/workflows/01-matrix-strategy.yml) | Cross-browser/OS matrix, `fail-fast: false`, `exclude`, `max-parallel` |
| 06 | [Conditionals](/.github/workflows/06-conditionals.yml) | `continue-on-error`, `outcome` vs `conclusion`, `failure()` / `always()` |
| 11 | [Manual Test Run](/.github/workflows/11-workflow-dispatch.yml) | `workflow_dispatch` with `choice`, `boolean`, `string` inputs — a real form in the UI |
| 12 | [Scheduled Regression](/.github/workflows/12-scheduled-regression.yml) | Cron schedule (UTC), `github.event_name == 'schedule'` guard |

### Cluster C — Architecture Patterns

| # | Workflow | What it teaches |
|---|----------|-----------------|
| 05 | [Reusable Workflow](/.github/workflows/05-reusable-workflow-caller.yml) | `workflow_call`, typed inputs, `secrets: inherit`, outputs — DRY at the job level |
| 07 | [Service Containers](/.github/workflows/07-service-containers.yml) | Postgres + Redis as Docker sidecars, health checks, `localhost` access |
| 08 | [Composite Action](/.github/workflows/08-composite-action-consumer.yml) | Local action in `.github/actions/`, inputs/outputs, step-level DRY |

### Cluster D — Platform & Security

| # | Workflow | What it teaches |
|---|----------|-----------------|
| 09 | [Security Patterns](/.github/workflows/09-oidc-security.yml) | Script injection safe pattern, least-privilege `permissions`, OIDC keyless auth |
| 10 | [Environments & Gates](/.github/workflows/10-environments-and-secrets.yml) | `environment:` on jobs, env-scoped secrets, required reviewer approval for production |

---

## Repo structure

```
.github/
  actions/
    setup-test-env/   ← composite action (shared setup steps)
  workflows/
    01-matrix-strategy.yml
    02-artifacts-test-reports.yml
    03-caching.yml
    04-job-outputs.yml
    05-reusable-workflow-definition.yml
    05-reusable-workflow-caller.yml
    06-conditionals.yml
    07-service-containers.yml
    08-composite-action-consumer.yml
    09-oidc-security.yml
    10-environments-and-secrets.yml
    11-workflow-dispatch.yml
    12-scheduled-regression.yml
app/
  src/
    calculator.js     ← pure functions (unit tests)
    api.js            ← Express server (API + E2E tests)
tests/
  unit/               ← jest
  api/                ← jest + supertest (no running server needed)
  e2e/                ← Playwright (API request context)
  integration/        ← jest + pg (needs Postgres — see workflow 07)
playwright.config.ts
jest.config.js
```

---

## Notable patterns to look for

**`if: always()` on artifact upload** (workflow 02)
The single most useful QA pattern. Reports upload even when the test step fails.

**`fail-fast: false` on matrix** (workflow 01)
Without this, one failing browser cancels the other 5 matrix cells mid-run.

**`outcome` vs `conclusion`** (workflow 06)
When `continue-on-error: true`, the step's `conclusion` is always `success` — GHA considers it passing. But `outcome` tells you what actually happened. Use `outcome` to react to real failures.

**`$GITHUB_OUTPUT` not `::set-output::`** (workflow 04)
The old `::set-output::` syntax was deprecated in 2022. This repo uses only the current env-file API.

**Script injection — env var intermediary** (workflow 09)
Never write `run: echo "${{ github.event.pull_request.title }}"`. Always route untrusted data through an `env:` variable first.

**Reusable vs composite** (workflows 05 & 08)
Composite actions = shared *steps* (same runner, same job).
Reusable workflows = shared *jobs* (own runner, own context, cross-repo).
