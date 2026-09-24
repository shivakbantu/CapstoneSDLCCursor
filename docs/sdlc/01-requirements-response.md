# Stage 1 Response — Requirements

## Summary

Stage 1 requirements for Jira epic **EP-1 (Interactive Hotel Booking User Portal)** and child stories **EP-3–EP-14** are captured in `requirements.md`. The epic’s “no backend / JS mock” wording is reconciled with the capstone default: a **Python web app (Flask + Jinja2)** serves pages and static assets, while **hotel/booking data stays client-side mock JSON** (≥12 hotels × 3 rooms). Scope covers anonymous browse → filter/sort → details → 3-step simulated booking → confetti confirmation, with responsive UI, ≤200ms local interaction feedback, graceful empty/validation/`Not Found` handling, and no auth/payments/DB.

## Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Requirements | `requirements.md` | Created |
| Stage response | `docs/sdlc/01-requirements-response.md` | Created |

## Key Decisions

1. **Delivery:** Python web app serves the portal — **Flask + Jinja2** + static CSS/JS.
2. **“No backend”:** No persistent API/DB/auth — not absence of a Python server.
3. **Data:** Hardcoded client-side mock JSON only (≥12 hotels × 3 rooms per EP-4); no database or live hotel APIs.
4. **Actor:** Anonymous potential hotel guest only.
5. **Filters/sort:** Price range, rating, amenities (multi-select), Clear filters; sort by price (EP-6, EP-7).
6. **Flow:** Results (A) → Details (B) → Room Selection (C) → Guest Details (D) → Dummy Payment (E) → Confirmation (F) + confetti.
7. **Guest form:** First/Last name, Email, optional Phone, Guests count (≥1) with inline validation (EP-10).
8. **Payment:** Success-only simulation with explicit “no real charge” messaging (EP-11).
9. **UX NFRs:** Responsive breakpoints; visual feedback on actions; ≤200ms local mock interactions; Playwright E2E in Stage 7.
10. **Out of scope:** Real payments, auth/SSO, admin CMS, email, live APIs, WCAG certification.

## Open Questions / Blockers

**Open questions:** None blocking. Residual non-blocking preferences: optional high→low sort; amenity vocabulary; booking reference-id format.

**Blockers:** None. Ready for human approval of `requirements.md`.

## PR

https://github.com/shivakbantu/CapstoneSDLCCursor/pull/1

## Ready for Human Approval

**Yes.** Please review `requirements.md` and reply with approval (e.g., “approved” / “proceed to architecture”) before Stage 2.
