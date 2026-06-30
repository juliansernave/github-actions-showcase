# GitHub Actions — Intermediate Showcase

Real, runnable workflows for QA and test automation. Each workflow represents a realistic scenario and combines multiple concepts naturally — caching, artifacts, outputs, and conditionals appear where they're actually useful, not in isolation.

---

## Getting started

```bash
npm install
git add package-lock.json
git push
```

---

## Workflows

| # | Workflow | Scenario | Concepts |
|---|----------|----------|---------|
| 01 | [Pull Request](/.github/workflows/01-pull-request.yml) | Main CI — runs on every push/PR | Matrix, caching, artifacts, job outputs, conditionals |
| 02 | [Integration Tests](/.github/workflows/02-integration.yml) | Tests against real Postgres + Redis | Service containers, health checks, artifacts |
| 03 | [Reusable Test Runner](/.github/workflows/03-reusable-test-runner.yml) | Parameterized runner called by other workflows | `workflow_call`, inputs, outputs, composite action |
| 04 | [Deploy Pipeline](/.github/workflows/04-deploy-pipeline.yml) | Smoke → staging → regression → production | Reusable workflow, environments, approval gate |
| 05 | [Manual Test Run](/.github/workflows/05-manual-run.yml) | On-demand run from the GitHub UI | `workflow_dispatch` inputs, composite action, conditionals |
| 06 | [Nightly Regression](/.github/workflows/06-nightly-regression.yml) | Full suite every weekday at 02:00 UTC | Schedule, matrix, composite action, Slack guard |
| 07 | [Security](/.github/workflows/07-security.yml) | Security patterns reference | Least privilege, script injection, OIDC |

---

## Shared composite action

`.github/actions/setup-test-env` — handles Node.js setup, npm install, and step summary in one step. Used by workflows 03, 05, and 06.

---

## Notes

**Workflow 04** — create `staging` and `production` environments in **Settings → Environments** before pushing. Add yourself as a required reviewer on `production` to see the approval gate.

**Workflow 06** — add a `SLACK_WEBHOOK_URL` secret and uncomment the `curl` block to enable Slack notifications.
