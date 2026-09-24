# HarborStay — Interactive Hotel Booking User Portal

Python **Flask + Jinja2** web app that serves a multi-page hotel booking UI. Catalog data, filters, sorting, validation, and booking draft state run in the browser (vanilla JS + `sessionStorage`). No database, authentication, or real payments.

## Quick start

```bash
# From the repo root
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt

# Run the app
set FLASK_APP=wsgi:app          # PowerShell: $env:FLASK_APP = "wsgi:app"
flask run
```

Open http://127.0.0.1:5000/

Alternative: `python -m flask --app wsgi:app run`

## Routes

| Path | Screen |
|------|--------|
| `/` or `/results` | A — Results (filter / sort) |
| `/hotels/<hotel_id>` | B — Hotel details |
| `/book/<hotel_id>/room` | C — Room selection (step 1/3) |
| `/book/<hotel_id>/guest` | D — Guest details (step 2/3) |
| `/book/<hotel_id>/payment` | E — Dummy payment (step 3/3) |
| `/confirmation` | F — Confirmation + confetti |

Sample mock hotel ids: `hotel-01` … `hotel-12`.

## Booking draft

- Storage key: `hotelBookingDraft` in **`sessionStorage`** (same-tab only).
- Survives refresh in the same tab; clears when the tab closes.
- Confirmation “Back to results” clears the draft.
- Demos and Playwright E2E must stay in a **single browser tab**.

## Performance tip (≤200 ms)

Filter/sort runs synchronously against the in-memory mock catalog. In DevTools console on Results:

```js
performance.now(); // wrap around filter changes; results.js also warns if >200ms
```

Dummy payment uses a brief ~400 ms loading simulation (not a real gateway).

## Tests

```bash
pytest
```

Smoke tests assert the app factory and GET routes return HTTP 200 (including unknown hotel ids, which render an in-page not-found UI).

## Stage 7 prep (Playwright)

Happy path (single tab): Results → filter + sort → open details → Select room → C Continue → D valid guest → E Pay/Confirm → F summary + `HB-` reference + confetti.

Prefer `data-testid` selectors (see `impl-plan.md` naming table).

## Security

- No secrets in source or docs. Do not commit `api-conf.properties` or `.env`.
- Payment is simulation-only; no card PAN collection.
