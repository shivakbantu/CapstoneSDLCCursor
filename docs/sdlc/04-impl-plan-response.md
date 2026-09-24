# Stage 4 Response — Implementation Planning

## Summary

Stage 4 implementation planning for EP-1 (Interactive Hotel Booking User Portal) is complete. Approved `requirements.md`, post–design-review `architecture.md`, and `design-review.md` were broken into a dependency-ordered task list (T01–T22) for a **Flask + Jinja2** Python web app with client-side mock JSON, `sessionStorage` booking draft, dual price sort, vanilla confetti, and Playwright-ready `data-testid` hooks. **No production application code was written.** Stage 5 must not start until a human explicitly approves this plan.

## Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation plan | `impl-plan.md` | Created |
| Stage response | `docs/sdlc/04-impl-plan-response.md` | Created |

## Key Decisions

1. **Scaffold first:** App factory + GET-only routes + Jinja shell before feature JS (T01–T04).
2. **Mock + helpers before UI:** Catalog (≥12×3), `"Not Found"` helpers, feedback layer, and booking draft manager unlock Results/Details/booking (T05–T07, T12).
3. **Feature order:** Results (cards → filters/sort) ‖ Details → booking shell C→D→E → Confirmation F.
4. **Locked contracts preserved:** Path-param routes; amenity vocabulary; sort on `priceRange.min` both directions; `HB-` reference ids; sessionStorage; vanilla confetti; B seeds room, C enforces selection.
5. **Verify prep in-plan:** `data-testid` naming table, README run steps, pytest smoke, Stage 7 Playwright outline (single-tab)—E2E scripts deferred to Stage 7.
6. **No blockers:** Design review closed prior open trade-offs; residual UX widget choices are non-blocking.

## Open Questions / Blockers

**Open questions:** None blocking. Non-blocking implementer choices: price-range widget shape; exact pay-sim delay (~300–800ms); CSS styling details.

**Blockers:** None for Stage 4 documentation. Human approval of `impl-plan.md` is required before Stage 5 implementation.

## PR

**pending** (parent opens Stage 4 PR via GitHub REST API)

## Ready for Human Approval

**Yes.** Please review `impl-plan.md` (Approach Summary, Task List T01–T22, Critical Path, Blocked Tasks, Test Strategy Preview, Definition of Done). Reply with approval (e.g., “approved” / “proceed to implementation”) before Stage 5. Do **not** start production coding until approved.
