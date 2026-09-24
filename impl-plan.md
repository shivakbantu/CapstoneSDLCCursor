# Implementation Plan

## Approach Summary

Stage 5 will implement a **thin Flask + Jinja2 Python web application** that serves multi-page HTML (screens A–F) and static CSS/JS for the Interactive Hotel Booking User Portal (EP-1 / EP-3–EP-14). Business data stays in **client-side mock JSON** (≥12 hotels × 3 rooms); filtering, sorting, validation, and booking draft state run in the browser using **vanilla JS** and **`sessionStorage`**. There is no database, auth, or real payment integration.

Locked product decisions from architecture / design review guide every task: dual price sort (`priceRange.min`), fixed amenity vocabulary, `HB-` reference ids, vanilla confetti helper, path-param routes, B→C room seeding with C still authoritative.

**Stage 7 verify path:** pytest smoke for Flask routes + **Playwright MCP** E2E (single-tab journey: browse → filter/sort → details → C/D/E → confirmation). This plan includes `data-testid` hooks and README run instructions so Verify can start without redesign. **No production application code in Stage 4.**

## Task List (dependency order)

| ID | Task | Depends On | Priority | Status | Notes |
|----|------|------------|----------|--------|-------|
| T01 | Scaffold Python project: `app/` package, `requirements.txt` (Flask, pytest), `.gitignore` for venv/`__pycache__`, app factory entry (`create_app` / `wsgi`) | — | P0 | Completed | Thin server only; pin Flask reasonably; no DB/ORM packages |
| T02 | Register GET-only Flask routes for screens A–F: `/` or `/results`, `/hotels/<hotel_id>`, `/book/<hotel_id>/room`, `/book/<hotel_id>/guest`, `/book/<hotel_id>/payment`, `/confirmation` | T01 | P0 | Completed | Path spelling locked in architecture; pass minimal Jinja context (title, hotel_id) |
| T03 | Jinja2 app shell: base layout, nav links across A–F, responsive CSS breakpoints, feedback region hooks, semantic HTML | T02 | P0 | Completed | EP-3 shell; shared `templates/base.html` + screen templates stubs |
| T04 | Static asset layout: `static/css/`, `static/js/`, placeholders (CSS/local images—no remote URL dependency) | T03 | P0 | Completed | Prefer CSS placeholders for hotel/room images |
| T05 | Mock catalog JS module: ≥12 hotels × 3 rooms; schema fields (id, name, location, rating, amenities, priceRange, images/placeholder, rooms); shared amenity constant list | T04 | P0 | Completed | Closed vocabulary: `WiFi`, `Parking`, `Pool`, `Gym`, `Spa`, `Breakfast`, `Air Conditioning`, `Pet Friendly` |
| T06 | Display helpers: missing/undefined fields → `"Not Found"` / graceful placeholder; never throw | T05 | P0 | Completed | FR15; used by cards, details, confirmation |
| T07 | UI feedback layer: toast/modal/animation utilities for primary actions; brief loading helper for pay sim | T04 | P0 | Completed | EP-13; target local feedback ≤200ms; pay load ~300–800ms |
| T08 | Results (A): render hotel cards from mock (name, rating, price indicator, key amenities, image/placeholder); card click → details | T05, T06, T03 | P0 | Completed | FR4–5; `data-testid` on list/cards |
| T09 | Results filters: price range, rating, amenities multi-select, Clear filters; empty-state UI when zero matches | T08, T07 | P0 | Completed | Dual number inputs; semantics match `priceRange` |
| T10 | Results sort: Price low→high and high→low on `priceRange.min`; visible feedback on change | T08, T07 | P0 | Completed | Both directions required |
| T11 | Hotel details (B): hotel info + 3 rooms; unknown `hotel_id` → in-page not-found + CTA to results; “Select room” seeds `sessionStorage` draft (`hotelId` + `roomId`) and navigates to C | T05, T06, T03 | P0 | Completed | Do not conflate Flask 404 with sparse-field `"Not Found"` |
| T12 | Booking state manager: read/write `hotelBookingDraft` in `sessionStorage`; restore on same-tab refresh; do not invent data if missing | T04 | P0 | Completed | Storage key `hotelBookingDraft`; tab-scoped |
| T13 | Booking shell (C/D/E): shared step indicator (1 of 3); Back/Continue navigation between steps | T02, T03, T12 | P0 | Completed | GET-only pages; client advances via links + draft |
| T14 | Room Selection (C): enforce exactly one room (pre-select from B or choose on C); block Continue until selected | T11, T13, T07 | P0 | Completed | B seeds optional room; C remains authoritative |
| T15 | Guest Details (D): fields first/last name, email, optional phone, guests ≥ 1; inline validation; Back preserves draft | T13, T12, T07 | P0 | Completed | Block Continue until valid |
| T16 | Dummy Payment (E): simulation / no-real-charge banner; Pay/Confirm → brief loading → generate `HB-` reference id → advance to F; no card PAN collection required | T13, T12, T07 | P0 | Completed | Reference: `HB-` + compact timestamp + short random suffix; ~400ms delay |
| T17 | Confirmation (F): read draft summary; vanilla JS confetti helper; CTAs (e.g. Back to results); clear/reset draft on leave | T12, T07, T06 | P0 | Completed | Cold `/confirmation` / missing draft → empty state + CTA; no invent |
| T18 | Graceful edge states polish: empty filters, unknown hotel, missing draft, blocked Continue on C—consistent copy and `data-testid`s | T09, T11, T14, T17 | P1 | Completed | Failure Modes table alignment |
| T19 | Add stable `data-testid` hooks across A–F (filters, sort, cards, select-room, step Back/Continue, pay, confirmation summary, empty states) | T08–T17 | P0 | Completed | Naming table in Notes / README for Stage 7; single-tab E2E assumption |
| T20 | README: venv, `pip install`, `flask run` / start command, routes overview, sessionStorage note, ≤200ms timing tip (`performance.now`), no secrets | T01, T02 | P0 | Completed | Document single-tab booking for demos/Playwright |
| T21 | pytest smoke: app factory creates; each GET route returns 200 (use valid sample `hotel_id` from documented mock ids) | T02, T05 | P1 | Completed | No DB fixtures; light integration only |
| T22 | Stage 7 prep checklist: Playwright journey outline (browse → filter/sort → details → C/D/E → F), single-tab rule, testid map reference—no E2E scripts yet | T19, T20 | P1 | Completed | Documented in README; actual Playwright MCP scripts authored in Stage 7 |

**Suggested `data-testid` naming (Stage 5 implement; Stage 7 consume):**

| Area | Example testids |
|------|-----------------|
| Results | `results-list`, `hotel-card`, `filter-price-min`, `filter-price-max`, `filter-rating`, `filter-amenity`, `filter-clear`, `sort-price`, `empty-state` |
| Details | `hotel-details`, `room-list`, `select-room`, `hotel-not-found` |
| Booking | `booking-step-indicator`, `room-option`, `btn-continue`, `btn-back`, `guest-first-name`, `guest-last-name`, `guest-email`, `guest-phone`, `guest-count`, `pay-confirm`, `payment-sim-banner` |
| Confirmation | `confirmation-summary`, `booking-reference`, `confetti-canvas`, `btn-back-to-results`, `confirmation-empty` |

## Critical Path

```text
T01 Scaffold
  → T02 Routes
  → T03 App shell + T04 Static layout
  → T05 Mock catalog + T06 Display helpers + T07 Feedback + T12 Booking draft
  → T08 Results cards
  → T09 Filters + T10 Sort  ‖  T11 Details
  → T13 Booking shell
  → T14 Room (C) → T15 Guest (D) → T16 Payment (E) → T17 Confirmation (F)
  → T18 Edge polish + T19 data-testid
  → T20 README + T21 pytest smoke + T22 Verify prep
```

**Longest dependency chain (must finish before feature-complete demo):** T01 → T02 → T03/T04 → T05 → T08 → T11 → T13 → T14 → T15 → T16 → T17 → T19.

Filters/sort (T09–T10), feedback (T07), and display helpers (T06) can proceed in parallel once static/mock foundations exist, but Results and booking flows are blocked until mock + shell are ready.

## Blocked Tasks

| Task | Blocked by | Unblock when |
|------|------------|--------------|
| — | — | **None.** Design review closed storage, sort, amenities, confetti, routes, and B→C handoff. All tasks can start once Stage 4 is human-approved and Stage 5 begins. |

Non-blocking choices deferred to implementer (do not block coding):

- Price-range control widget (dual number inputs vs range slider)
- Exact simulated pay delay within ~300–800ms
- Visual CSS styling details within responsive/semantic constraints

## Test Strategy Preview

### Unit / integration (Stage 5–7)

- **pytest:** App factory creates successfully; GET routes for A–F return HTTP 200 with valid path params; unknown hotel route still returns a page (200 with not-found UI or documented 404—prefer graceful template per architecture).
- No DB, payment, or auth tests (out of scope).
- Optional light pure-JS checks are not required if Playwright covers filter/sort/booking; keep Python tests focused on server shell.

### Playwright MCP E2E (Stage 7)

- Start Flask locally per README; run E2E in a **single browser tab**.
- Happy path: Results → apply filter and sort → open details → Select room → C confirm/Continue → D valid guest → E Pay/Confirm → F summary + confetti visible / reference `HB-` pattern.
- Edge coverage (as time allows): Clear filters; empty filter state; Guest validation blocks Continue; cold Confirmation empty state.
- Prefer `data-testid` selectors from T19; avoid brittle CSS-only selectors.
- Do not open Confirmation in a new context/tab (sessionStorage will be empty).

### Output / doc quality

- README run steps work from a clean clone (no secrets, no `api-conf.properties`).
- Missing mock fields show `"Not Found"`; no crashes in primary flows.

## Definition of Done (per task / overall)

### Per task

- Implements only the stated scope; matches architecture contracts (routes, schema, amenities, sessionStorage, reference id).
- No secrets, credentials, or `api-conf.properties` content in code or docs.
- Primary UI actions wired through feedback layer where applicable.
- Relevant `data-testid`s added when the UI control exists (or noted for T19 sweep).
- Independently verifiable (manual click-path or pytest assertion listed in Notes).

### Overall (Stage 5 exit → ready for Stage 6 review)

- [x] Flask app serves all screens A–F without DB/auth/real payments.
- [x] ≥12 hotels × 3 rooms from client mock JSON; fixed amenity vocabulary.
- [x] Filter (price, rating, amenities) + Clear + empty state; sort low→high and high→low.
- [x] Details + 3-step booking with step indicator; draft in `sessionStorage`.
- [x] Dummy payment simulation + `HB-` reference; Confirmation summary + vanilla confetti.
- [x] `"Not Found"` / empty / unknown-hotel / missing-draft handled gracefully.
- [x] Responsive shell; README run instructions; pytest smoke green.
- [x] `data-testid` hooks present for Stage 7 Playwright MCP E2E.
- [x] No production scope creep (no SPA framework, no POST booking APIs, no live hotel APIs).

**Stage 4 DoD:** This `impl-plan.md` and `docs/sdlc/04-impl-plan-response.md` exist with all required headings; human approval required before any Stage 5 coding.
