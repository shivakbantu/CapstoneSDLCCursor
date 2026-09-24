---
name: sdlc-verify
description: Verification for Agentic SDLC Step 7 — Playwright MCP test scripts, unit/integration tests, output document quality, Go/No-Go, stage response MD + stage PR. Use after code review fixes or when verify-agent runs.
---

# SDLC Verify

## Steps

1. Read acceptance criteria from `requirements.md`.
2. Confirm the product is a **Python web application**; note how to start it (e.g. `flask run`, `uvicorn`, `python app.py`).
3. Detect unit/integration test runner (prefer `pytest` for Python).
4. **Using Playwright MCP**, author E2E/browser test scripts under `tests/e2e/` (or `tests/playwright/`) that cover primary UI flows and acceptance criteria. Prefer committed `.spec.ts` / `.spec.js` (or Python Playwright) files the team can re-run.
5. Run unit/integration tests and Playwright scripts; capture commands and results as evidence.
6. Quality-check generated/synced docs (completeness, accuracy, no secrets).
7. Write `docs/sdlc/07-verify-response.md` and open/update the **Stage 7 stage PR**.
8. Emit Verification Report with Go / No-Go for the **final** Stage 8 PR.

## Playwright MCP expectations

- Use Playwright MCP to explore the running app and **generate durable test scripts** (not one-off manual clicks only).
- Cover happy path plus key edge cases visible in the UI (empty states, Not Found messaging, validation errors).
- Document how to run the scripts in the Verification Report.

## Scope

- Happy path
- Missing files, empty repos, missing fields, `Not Found`
- API/error paths
- No secrets in outputs
- Doc quality vs requirements
- Browser/E2E via Playwright MCP

## Report template

Produce `# Verification Report` with:

- `## Commands Run` — fenced shell transcript of what you ran
- `## Playwright Scripts Added` — paths to scripts authored via Playwright MCP
- `## Test Results Summary`
- `## Acceptance Criteria Traceability` — table: Criterion | Result | Evidence
- `## Output Document Quality Check`
- `## Failures / Gaps`
- `## Go / No-Go for Final PR`

Also write `docs/sdlc/07-verify-response.md` (see `doc-artifacts`) and create the stage PR.

## Rules

- Prefer actually running tests over claiming they pass.
- Stage 7 still creates a **stage PR**; the full-section **final PR** is Stage 8 via `pr-agent` / `sdlc-pr` only on Go (or user override).
