# GitHub Actions — Course Showcase

Lightweight, runnable repo summarizing key concepts from a GitHub Actions course. Two focused workflows cover the full topic list; each file is heavily commented to explain the *why* behind each feature.

---

## Workflows

| # | Workflow | Scenario | Concepts |
|---|----------|----------|---------|
| 01 | [CI](/.github/workflows/01-ci.yml) | Runs on every push / PR | Triggers, caching, matrix, artifacts, conditionals, job outputs |
| 02 | [Features Demo](/.github/workflows/02-features.yml) | Integration tests + security patterns | Service containers, composite action, env vars, secrets, named environments, security |

---

## Concept coverage

| Doc topic | Where to find it |
|-----------|-----------------|
| **Smarter triggers** — branch/path filters, `workflow_dispatch` | `01-ci.yml` → `on:` block |
| **Caching** — npm deps keyed on lockfile | `01-ci.yml` → `cache: "npm"` in both jobs |
| **Artifacts & outputs** — upload reports, pass values between jobs | `01-ci.yml` → `upload-artifact`, `outputs:`, `$GITHUB_OUTPUT` |
| **Conditional execution** — `if: always()`, `if: failure()`, `continue-on-error` | `01-ci.yml` → artifact upload steps + e2e job guard |
| **Matrix builds** — 3 browsers in parallel, `fail-fast: false` | `01-ci.yml` → `e2e-tests` job strategy |
| **Step summary** — markdown table on the run page | `01-ci.yml` → `summary` job (`$GITHUB_STEP_SUMMARY`) |
| **Custom / composite action** — shared setup packaged once | `02-features.yml` → `uses: ./.github/actions/setup-test-env` |
| **Service containers** — real Postgres, no mocks | `02-features.yml` → `services:` block in `integration` job |
| **Env vars & secrets** — step-level env, named environment, encrypted secret | `02-features.yml` → `env:` steps + `environment: staging` |
| **Security** — least-privilege, script-injection-safe pattern, OIDC reference | `02-features.yml` → `security` job |

---

## Shared composite action

`.github/actions/setup-test-env` — handles Node.js setup, npm install, and step summary in one reusable step. Called by workflow 02.

---

## Getting started

```bash
npm install
npm test          # unit + API tests
npm run test:e2e  # Playwright E2E (auto-starts the Express server)
```

Push to GitHub to see the workflows run live.

**Workflow 02 security job** — create a `staging` environment in **Settings → Environments** and add `EXAMPLE_TOKEN` as an environment secret to see the masked-secret step fully populated.
