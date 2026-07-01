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

### Triggers — control when your workflow actually runs
By default a workflow fires on every push to every branch, which is wasteful. You can narrow that with filters: only pushes to `main`, only when non-doc files change, only on pull requests. Adding `workflow_dispatch` lets anyone kick off a run from the GitHub UI without pushing a commit. The result is that expensive jobs (like a full E2E suite) fire only when they're actually needed.

### Caching — stop re-downloading the same packages every run
Every runner starts completely blank, so without caching it reinstalls all your npm packages from scratch on every run. Caching saves the `~/.npm` folder between runs, keyed on your `package-lock.json`. When the lockfile hasn't changed, the cache is restored in seconds and `npm install` becomes nearly instant. The same idea applies to browser binaries: Playwright downloads Chromium, Firefox, and WebKit on first install, and the cache keeps them for every run after that.

### Artifacts and outputs — get data out of a run
Artifacts are files you save from a run so you can download them afterward — JUnit XML, Playwright HTML reports, screenshots. They're most useful when tests fail: instead of re-running the suite locally you download the artifact and open the report directly. Outputs are different: they're small values (a version number, a test count) that one job produces so a downstream job can read them. Both are about making information from a run available somewhere useful.

### Environment variables and secrets — keep credentials out of your code
Environment variables let you inject config into steps without hardcoding it. Secrets are the encrypted version — stored in GitHub, masked in logs, never visible in plaintext. Named environments (`staging`, `production`) go a step further: they scope secrets per environment and let you add an approval gate so a production deployment requires a human to click "approve" before the job proceeds.

### Conditional execution — don't run everything every time
Not every step needs to run every time. `if: always()` makes a step run even after a failure — useful for uploading a test report when the suite fails. `if: failure()` runs only when something went wrong — good for a Slack alert. `continue-on-error` lets a step fail without killing the whole job, handy for a known-flaky browser. These conditions make pipelines smarter about what they skip and what they always do.

### Matrix builds — one job definition, many parallel runs
A matrix tells GitHub Actions to run the same job multiple times in parallel with different inputs. Instead of three copy-pasted E2E job definitions for three browsers, you write one job with `matrix: browser: [chromium, firefox, webkit]` and GitHub creates three parallel jobs automatically. `fail-fast: false` keeps the other browsers running even if one fails — you want all results, not just the first failure.

### Reusable workflows and composite actions — write once, call everywhere
When the same setup logic (checkout → install Node → npm install) repeats across workflows, you package it into a composite action. It lives in `.github/actions/` and any workflow can call it with a single `uses:` line. Reusable workflows go further: an entire workflow can be called by another with `workflow_call`, useful when multiple repos share the same CI pipeline. Both cut copy-paste and keep things consistent across the board.

### Service containers — run tests against real infrastructure
Some tests need real dependencies — a database, a cache, a queue. Service containers let you spin up Docker images (like `postgres:15`) alongside a job. GitHub starts the container, waits for the health check to pass, and makes it reachable via `localhost`. Your tests connect to it exactly like a real database — no mocks, same image every run, no "works on my machine" surprises.

### Security — three patterns every workflow author should know
**Least privilege**: the built-in `GITHUB_TOKEN` has broad permissions by default — scope it down with `permissions: contents: read` so a compromised workflow can't push or delete things it shouldn't touch. **Script injection**: never put `${{ github.event.pull_request.title }}` directly in a `run:` step — the expression is substituted before the shell runs, so a crafted PR title becomes executable code. Route untrusted input through an `env:` var instead. **OIDC**: instead of storing a static cloud secret, use OpenID Connect to request a short-lived token at runtime — nothing to rotate, nothing to accidentally leak.

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
