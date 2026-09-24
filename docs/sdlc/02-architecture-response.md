# Stage 2 Response — Architecture

## Summary

Stage 2 architecture for Jira epic **EP-1 (Interactive Hotel Booking User Portal)** is documented in `architecture.md`. The design is a thin **Flask + Jinja2** Python web app that serves multi-page screens (Results → Details → Room Selection → Guest Details → Dummy Payment → Confirmation) and static CSS/JS. Hotel/booking catalog data remains **client-side mock JSON** (≥12 hotels × 3 rooms). Filtering, sorting, validation, booking draft state, UI feedback, and confetti run in the browser to meet responsive UX and ~**200ms** local interaction goals. No database, auth, live hotel APIs, or real payments. Stage 7 **Playwright** E2E is planned against stable routes and test hooks.

## Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Architecture | `architecture.md` | Created |
| Stage response | `docs/sdlc/02-architecture-response.md` | Created |

## Key Decisions

1. **Stack:** Flask + Jinja2 (not FastAPI/Django) — multi-page HTML shell; no ORM/API-first backend needed.
2. **Server role:** Serve routes A–F and static assets only; no persistent write APIs.
3. **Data:** Hardcoded client-side mock catalog; filter/sort/booking logic in JS.
4. **Screens:** A Results, B Details, C/D/E three-step booking with indicator, F Confirmation + confetti.
5. **State:** Client-side booking draft (sessionStorage vs in-memory left as open trade-off).
6. **Feedback:** Shared toast/modal/animation layer; simulated pay loading; confetti on success.
7. **Resilience:** Empty filter state, inline validation, `"Not Found"` for missing mock fields, graceful unknown hotel id.
8. **Security:** No auth/secrets; Jinja auto-escape; simulation-only payment messaging.
9. **Verify path:** Playwright E2E browse → filter/sort → book → confirm; light Flask smoke tests later.

## Open Questions / Blockers

**Open questions:** None blocking. Residual trade-offs in `architecture.md`: booking draft storage, optional high→low sort, amenity vocabulary, reference-id format, vanilla JS vs small confetti helper.

**Blockers:** None. Ready for human approval of `architecture.md`.

## PR

pending

## Ready for Human Approval

**Yes.** Please review `architecture.md` and reply with approval (e.g., “approved” / “proceed to design review”) before Stage 3. Do not start Design Review or implementation until approved.
