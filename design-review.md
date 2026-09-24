# Design Review

## Summary

Stage 3 design review of the human-approved `architecture.md` for EP-1 (Interactive Hotel Booking User Portal) against `requirements.md`. The thin **Flask + Jinja2** server + **client-side mock JSON** approach remains fit for purpose: it satisfies “no DB/auth/real payments,” screens A–F, filters/sort, 3-step booking, confetti, ≤200ms local interactions, and a Playwright-ready verify path.

The review found **no open critical blockers** after architecture updates. Design-blocking ambiguities (booking draft storage, sort directions, confetti approach, amenity vocabulary, reference-id format, B→C room handoff, refresh mid-flow behavior) were closed with concrete defaults in `architecture.md`. Residual items are non-blocking UX/impl details for Stage 4.

## Findings

### Critical

None open. The following were design-blocking gaps at review start and were **remediated in `architecture.md`**:

1. **Booking draft persistence unspecified / conflicting** — Architecture Open Trade-offs left in-memory vs `sessionStorage` open, while Failure Modes implied refresh loses state and returns to Results. That conflicted with Back/Continue, Confirmation summary, and same-tab Playwright flows (`architecture.md` Data Flow / Failure Modes vs Open Trade-offs; `requirements.md` FR9–13, Clarification #7).
   - **Fix applied:** Prefer **`sessionStorage`**; restore draft on same-tab refresh; graceful empty CTA if draft missing (new tab / cleared storage / cold `/confirmation`).

2. **Confirmation data path ambiguous** — `GET /confirmation` had no hotel id; summary source (“client state or query/hash”) was underspecified (`architecture.md` Interfaces / Data Flow; `requirements.md` FR13).
   - **Fix applied:** Confirmation reads `BookingDraft` from `sessionStorage`; reference id set at successful dummy pay.

3. **Amenity filter consistency not locked** — Requirements Open Questions left amenity vocabulary open; without a closed list, multi-select filters can mismatch seed strings (`requirements.md` Open Questions; FR5; `architecture.md` Open Trade-offs #3).
   - **Fix applied:** Fixed vocabulary documented in architecture Interfaces.

### Warnings

1. **Details (B) vs Room Selection (C) double-select risk** — EP-8 requires “Select room” on details; EP-9 requires a dedicated Room Selection step (`requirements.md` FR8–10). Without an explicit handoff, implementers might skip C or force re-selection awkwardly.
   - **Mitigation (documented):** B seeds `hotelId` + optional `roomId` into `sessionStorage` and navigates to C; C still enforces exactly one selected room (confirm or change) before Continue.

2. **Sort key must be consistent** — Cards may show a price “indicator” while hotels have `priceRange { min, max }` (`requirements.md` FR4–6; schema). Sorting by inconsistent fields would fail acceptance and E2E.
   - **Mitigation (documented):** Sort key = `priceRange.min`; both **low→high** and **high→low** required.

3. **Playwright / multi-tab limitation** — Draft is tab-scoped (`sessionStorage`). E2E or demos that open Confirmation in a new context will see empty state.
   - **Mitigation (documented):** Stage 7 journeys must stay in a **single tab**; document empty-state behavior for cold Confirmation.

4. **Payment simulation UX** — Success-only pay with loading is required (`requirements.md` FR12), but loading duration was unspecified. Overlong artificial delay risks NFR feel; zero feedback risks missing “every action has a response” (FR14).
   - **Guidance:** Brief simulated loading (e.g. ~300–800ms) plus clear “simulation / no real charge” banner; no card PAN collection required.

5. **Unknown hotel id vs missing mock fields** — Both must fail gracefully (`requirements.md` FR15; architecture Failure Modes). Implementers should not conflate template 404 with in-page `"Not Found"` for sparse hotel fields.

### Suggestions

1. Publish a small `data-testid` naming table in Stage 4 (filters, cards, steps, pay, confirmation) to speed Stage 7.
2. Prefer CSS placeholders / simple static images over remote image URLs so Verify does not depend on external networks.
3. Measure filter/sort with `performance.now()` in a short README note to evidence the ~200ms NFR (`requirements.md` NFR2).
4. On “Back to results” from Confirmation, clear or reset `hotelBookingDraft` to avoid stale summary if the guest re-enters booking.
5. Keep Flask surface GET-only; do not add POST booking APIs that would contradict “no persistent backend.”

## Decisions Agreed

| Topic | Decision |
|-------|----------|
| Booking draft storage | **`sessionStorage`** (same-tab refresh OK; clears when tab closes); not `localStorage`; not server session |
| Price sort | **Both** low→high and high→low; key = `priceRange.min` |
| Confetti | **Small vanilla JS helper** — no heavy confetti/npm dependency |
| Amenity vocabulary | Closed list: `WiFi`, `Parking`, `Pool`, `Gym`, `Spa`, `Breakfast`, `Air Conditioning`, `Pet Friendly` |
| Reference id | Client-generated **`HB-` + timestamp/random** (e.g. `HB-m1k2n3-a7xq`) on successful dummy pay |
| Client stack | Vanilla JS; multi-page Flask + Jinja2 unchanged |
| Routes | Path-param style (`/hotels/<id>`, `/book/<hotel_id>/room|guest|payment`, `/confirmation`) confirmed |
| B → C handoff | Select room on B seeds draft and opens C; C remains authoritative for “exactly one room” |
| Stack / scope | Flask thin server; mock JSON in JS; no DB/auth/real payments — affirmed |

## Architecture Updates Made

Updates applied to `architecture.md` during this review:

1. Goals & Constraints — sessionStorage booking draft; dual price sort; vanilla confetti; reference-id note.
2. Components — filter/sort, booking state manager, UI feedback, B/C responsibilities aligned with handoff.
3. Data Flow — B→C seeding, sessionStorage read/write, reference id at pay, Confirmation from draft.
4. Technology Choices — vanilla confetti helper; sessionStorage vs none/localStorage clarified.
5. Interfaces — fixed amenity vocabulary; sort contract; `BookingDraft` + reference-id format; Playwright single-tab note; route spelling locked for planning.
6. Failure Modes — refresh restores draft; missing draft → graceful empty (not invent data).
7. Sequence diagram — sessionStorage + Confirmation shell/JS summary.
8. Open Trade-offs — marked resolved; left only non-blocking UX widget residuals.

## Residual Risks

| Risk | Likelihood | Impact | Notes |
|------|------------|--------|-------|
| Stale draft if Confirmation CTA does not clear storage | Low | Low | Suggest clear on “Back to results” |
| Amenity string typo in seed vs filter list | Low | Medium | Use shared JS constant for vocabulary |
| E2E flake if tests assume cross-tab state | Low | Medium | Single-tab journeys only |
| Over-scoping payment UI (real card fields) | Low | Medium | Keep simulation messaging; placeholders only |
| ≤200ms missed if large DOM re-renders | Low | Low | ≤12×3 dataset; sync filter/sort should stay under budget |

No secrets, credentials, or `api-conf.properties` content appear in these artifacts.

## Approval Status

**Awaiting human approval.**  

Please review `design-review.md` and the updated `architecture.md`. Reply with explicit acceptance (e.g., “approved” / “proceed to implementation planning”) before Stage 4. Do **not** treat this document as final human approval.
