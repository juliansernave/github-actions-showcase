# GitHub Actions — Intermediate Showcase

Real, runnable workflows for QA and test automation. Each file focuses on one concept. Numbered filenames reflect suggested reading order in the Actions tab.

---

## Getting started

```bash
npm install
git add package-lock.json
git push
```

---

## Workflows

### Cluster A — Pipeline Fundamentals

| # | Workflow | Concept |
|---|----------|---------|
| 02 | [Artifacts & Test Reports](/.github/workflows/02-artifacts-test-reports.yml) | `upload/download-artifact`, `if: always()` so reports survive red builds |
| 03 | [Caching](/.github/workflows/03-caching.yml) | Built-in `cache: 'npm'` vs manual `actions/cache`, `hashFiles()`, `restore-keys` |
| 04 | [Job Outputs](/.github/workflows/04-job-outputs.yml) | `$GITHUB_OUTPUT`, step→job output mapping, downstream job consuming values |

### Cluster B — Test Execution

| # | Workflow | Concept |
|---|----------|---------|
| 01 | [Matrix Strategy](/.github/workflows/01-matrix-strategy.yml) | Cross-browser/OS matrix, `fail-fast: false`, `exclude`, `max-parallel` |
| 06 | [Conditionals](/.github/workflows/06-conditionals.yml) | `continue-on-error`, `outcome` vs `conclusion`, `failure()` / `always()` |
| 11 | [Manual Test Run](/.github/workflows/11-workflow-dispatch.yml) | `workflow_dispatch` with `choice`, `boolean`, `string` inputs |
| 12 | [Scheduled Regression](/.github/workflows/12-scheduled-regression.yml) | Cron schedule (UTC), `github.event_name == 'schedule'` guard |

### Cluster C — Architecture

| # | Workflow | Concept |
|---|----------|---------|
| 05 | [Reusable Workflow](/.github/workflows/05-reusable-workflow-caller.yml) | `workflow_call`, typed inputs, `secrets: inherit`, outputs |
| 07 | [Service Containers](/.github/workflows/07-service-containers.yml) | Postgres + Redis sidecars, health checks, `localhost` access |
| 08 | [Composite Action](/.github/workflows/08-composite-action-consumer.yml) | Local action at `.github/actions/`, inputs/outputs |

### Cluster D — Security & Platform

| # | Workflow | Concept |
|---|----------|---------|
| 09 | [Security Patterns](/.github/workflows/09-oidc-security.yml) | Script injection safe pattern, least-privilege `permissions`, OIDC reference |
| 10 | [Environments & Gates](/.github/workflows/10-environments-and-secrets.yml) | `environment:` on jobs, env-scoped secrets, required reviewer for production |

---

## Notes

**Workflow 10** — create `staging` and `production` environments in **Settings → Environments** before pushing. Add yourself as a required reviewer on `production` to see the approval gate.

**Workflow 12** — add a `SLACK_WEBHOOK_URL` secret and uncomment the `curl` block to enable Slack notifications.
