# incwebsite

Website for **GJH Inc.** (`gjh-inc.com`) — an independent consulting firm helping organizations put AI and their data to practical use.

This repo is a static site, but it is no longer just static. It carries a small self-improving content pipeline (the **content loop**) that audits, grades, and — when given permission — evolves the site's copy over time. This README documents that architecture and the current operational flow.

---

## Table of contents
- [Site layout](#site-layout)
- [Content loop — overview](#content-loop--overview)
- [Runtime environments](#runtime-environments)
- [Pipeline anatomy](#pipeline-anatomy)
  - [Loop 1 — fetch](#loop-1--fetch)
  - [Loop 2 — grade](#loop-2--grade)
  - [Loop 3 — trend / prerequisites](#loop-3--trend--prerequisites)
  - [Loop 4 — harness improvement](#loop-4--harness-improvement)
- [scoring rubric](#scoring-rubric)
- [GitHub Actions workflow](#github-actions-workflow)
- [Email notifications](#email-notifications)
- [Human-in-the-loop approval](#human-in-the-loop-approval)
- [Model provider](#model-provider)
- [Configuration files](#configuration-files)
- [Local development & testing](#local-development--testing)
- [Adding a new audited page](#adding-a-new-audited-page)
- [Repo hygiene](#repo-hygiene)

---

## Site layout

| Path | Purpose |
|---|---|
| `index.html` | Home — the current audit target. Editorial single-pager. |
| `about.html`, `services.html` | Legacy pages (older copy, not linked from the new homepage). |
| `privacy.html`, `terms.html`, `404.html` | Legal / error pages. |
| `llms.txt` | Machine-readable summary for AI crawlers. |
| `sitemap.xml` | Site index. |
| `robots.txt` | Crawl rules. |
| `assets/` | Static images / css / js. |

The current homepage is the **inspirational focus** of the content loop; legacy pages exist but are not audit targets yet.

---

## Content loop — overview

The loop is an **agentic audit-improve cycle**. Each cycle:

1. **Fetches** each target page.
2. **Scores** it with both a deterministic static pre-grader and a language model grader against a rubric.
3. **Trends** results in `history/scores.jsonl`.
4. On an OK audit it **auto-ships** the report/trace to `main`. On regression/threshold failure it **escalates**. It never silently lowers its own standards.
5. Monthly, it **proposes harness improvements** (rubric / grader context) as a *pull request* — always human-gated.

The whole thing runs on **GitHub-hosted Ubuntu runners** (`ubuntu-latest`) — zero cost — with the model calls executed through the **headless opencode CLI** pointed at a **free DeepSeek model** (no API key).

```
                  ┌────────────────────────────────────────────┐
       fetch      │               GitHub Actions               │
  page ───────────▶│  smoke test ▸ audit ▸ auto-ship ▸ email      │
  (Loop 1)        │                                            │
   inspect        │  static pre-grade + model grade (Loop 2)      │
   (Loop 2a/2b)   └────────────────────────────────────────────┘
                        │                    │
                history/scores.jsonl   reports/<date>-audit.md
                        │                    │
                        └───────── trends span Loop 4 (improve.py)
```

---

## Runtime environments

| Environment | Where | Used for |
|---|---|---|
| **Production** | GitHub hosted `ubuntu-latest` runner | Scheduled cron (daily + first-of-month); email + auto-ship live. |
| **Local** | Your machine | `loop/audit.py --dry-run` etc. — fast, no network, no tokens. |

No self-hosted machine is required. The hosted runners are always online, so the daily schedule always has a place to run, at no cost.

---

## Pipeline anatomy

### Loop 1 — fetch

`loop/audit.py` fetches each `targets[].url` (config: `loop/config.yaml`). In dry-run mode it loads a fixture from `loop/fixtures/<id>.html` instead, exercising grading without the network. Text extraction keeps only real (server-rendered) text — an AI crawler must be able to read the page.

### Loop 2 — grade

Two independent graders:
- **2a — deterministic static pre-grader** (`loop/audit.py`): objective checks with no tokens — word count ≥ `min_rendered_words`, `<title>`, meta description, schema.org JSON-LD, banned-words scan, required positioning signals `[consulting, ai, data, assessment, own]`. Trends cleanly / deterministically.
- **2b — model grader** (`loop/audit.py`, via `call_model`): LLM reads the rubric + intent + pre-grader findings + rendered text and returns a JSON score object. Validation plus auto-retry (up to `max_grader_retries`) on malformed / incomplete / out-of-range output. Fails closed if it can never parse.
- Scores: `problem_first, falsifiability, differentiation, buyer_fit, proof_density, machine_legibility, voice_discipline`, each 0–5, weighted in `RUBRIC_WEIGHTS`. Weighted overall is the page score.

### Loop 3 — trend / minimal trace

Every run is **appended** to the append-only `history/scores.jsonl` (never overwritten). This gives the system a memory so it can see whether a criterion is a one-off or systemic, and compute movement (last-3 vs first-3 mean).

### Loop 4 — harness improvement

`loop/improve.py` reads the trace, finds criteria that keep failing across runs, and — only if there are ≥ `MIN_RUNS` (3) runs and a criterion recurs ≥ `RECURRENCE` (3) — writes a **proposal** to `reports/<date>-harness-proposal.md`. It never edits the harness directly; it produces a PR for a human to review and merge.

---

## Scoring rubric

The rubric (`loop/rubric.md`) defines seven weighted criteria:

| Criterion | Weight | Ideas it guards |
|---|---|---|
| `problem_first` | 1.0 | copy starts from the buyer's problem |
| `falsifiability` | 1.5 | claims are verifiable, never invented metrics/clients |
| `differentiation` | 1.5 | clearly distinct from bulky tech/franchise competitors |
| `buyer_fit` | 1.0 | speaks to commercial / non-profit buyers |
| `proof_density` | 1.0 | tenure, partnerships, named deliverables |
| `machine_legibility` | 1.0 | schema markup, headings, real keys for AI crawlers |
| `voice_discipline` | 0.5 | no buzzwords / hype / "transformative" language |

---

## GitHub Actions workflow

**File:** `.github/workflows/content-loop.yml`

- **Triggers:**
  - `schedule: cron "0 12 * * *"` (daily ≈ 07:00 America/Chicago)
  - `schedule: cron "0 14 1 * *"` (monthly harness review)
  - `workflow_dispatch` (manual, with a `dry_run` boolean input)
- **Concurrency:** `content-loop` group, `cancel-in-progress: false` — scheduled runs never overlap.
- **Permissions:** `contents: write`, `pull-requests: write`, `issues: write`.

### Jobs

1. **`audit`** (daily): checkout → setup python/node → install `opencode-ai` → verify it works → smoke test (`audit.py --dry-run`) → **Audit** → **Auto-ship** (if `status == ok`) → build email body → email daily summary → escalate failures/regressions.
2. **`improve`** (monthly or manual only, `needs: audit`): analyze trends → open harness proposal **PR** → email notification.
3. **`notify-failure`** (`needs: [audit, improve]`, `if: failure()`): any job dying before its own summary still emails you a failure alert with a run link.

**Auto-ship behavior:** on a clean audit (status `ok`), the report + trace are committed directly to `main` (auto-merged). **Anything that could change how future audits are scored (harness via `improve`) is never auto-merged** — it becomes a `needs-human-reviewparent PR`.

---

## Email notifications

All mail goes to the account set in `SMTP_USERNAME` (e.g. `georjero@gmail.com`) via the `dawidd6/action-send-mail` action against Gmail SMTP.

| Email | When |
|---|---|
| **Daily summary** | Only when the audit actually auto-shipped a material change (`changed=true`). No churn → no email. |
| **Harness proposal notification** | Only when `has_proposal == 'true'`. |
| **Workflow failure** | Any job ended in failure (via `notify-failure`). Always on, fails soft. |

All mail steps use `continue-on-error: true` so a transient SMTP outage never fails the run.

---

## Human decision-in-the-loop approval

- **Auto-shipped (no approval needed):** daily audit report + trace — these record *what is happening*, they don't alter the site's copy or the scoring rules.
- **Needs your approval (via PR merge):** every **harness** change (rubric, grader context, config). The loop writes a proposal `md`; the workflow opens a PR labeled `needs-human-review`; merging that PR is the approval.

---

## Model provider

No API key is required. Model work runs through the **headless `opencode` CLI**:

```
opencode run -m opencode/deepseek-v4-flash-free --format json --pure --auto "<system>...\n\n<prompt>"
```

- `call_model()` (in `loop/audit.py`) shells out to `opencode`, parses the JSON event stream, and returns the model's `text`.
- Model IDs live in `loop/config.yaml` under `models:` (`grader`, `improver`).

This removes the old Anthropic HTTP dependency entirely.

---

## Configuration files

| File | Purpose |
|---|---|
| `loop/config.yaml` | Targets, competitors, models, thresholds, static checks, content loop parameters. |
| `loop/rubric.md` | The seven human-written scoring criteria the model grader reads. |
| `loop/audit.py` | Loop 1+2 — fetch, static check, LLM grade, weighted score, report, trace, `call_model` → opencode. |
| `loop/improve.py` | Loop 4 — trend analysis + harness proposal generation. |
| `loop/fixtures/<id>.html` | Dry-run fixtures for each audited target. |
| `.github/workflows/content-loop.yml` | The CI/CD job wiring (see above). |
| `loop/requirements.txt` | Python deps (`requests`, `pyyaml`). |

---

## Local development & testing

```bash
# dry-run against fixtures (no network, no model, deterministic)
python loop/audit.py --dry-run

# live against the config's URLs (needs only the opencode CLI ^. It will call the free
# DeepSeek model headlessly; no API key.)
opencode run -m opencode/deepseek-v4-flash-free --format json "smoke"
python loop/audit.py

# trend analysis / harness proposal (dry)
python loop/improve.py --dry-run
python loop/improve.py --dry-run --include-dry-runs   # include dry-run traces in the trend
```

To install opencode locally:

```bash
npm i -g opencode-ai@latest
```

To serve the site locally:

```bash
python3 -m http.server 5000 --bind 0.0.0.0
# then http://localhost:5000/
```

---

## Adding a new audited page

1. Add a new target in `loop/config.yaml` under `targets:` with a unique `id`, `url`, and `intent`.
2. Optionally add static checks / signals relevant to that page.
3. Add/re-cross-sync a fixture at `loop/fixtures/<id>.html` so dry-run works offline.
4. Add the page to `llms.txt` and `sitemap.xml` if it should be crawled.
5. Push. The loop will fetch + grade it, and add the page to the report + trace automatically.

---

## Repo layout

```
.
├── .github/workflows/content-loop.yml   # GH Actions orchestration
├── loop/                                # the content-loop harness
│   ├── audit.py, improve.py, rubric.md, config.yaml, requirements.txt, fixtures/
├── history/                            # scores trace (jsonl, append-only)
├── reports/                            # generated audit / proposal markdown
├── index.html, about.html, services.html, ...   # pages
├── llms.txt, sitemap.xml, robots.txt
└── attached_assets/                    # source/design reference docs
```

> `history/`, `reports/`, and `loop/config-live.yaml` (local test config) are gitignored but now `reports`/`history` are committed by the loop's auto-ship so trends persist across runs.