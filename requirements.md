# Requirements

## User Story

**Jira:** EP-1 (Epic) — Backlog — Priority: Medium  

**Summary:** Interactive Hotel Booking User Portal  

**As a** potential hotel guest,  
**I want** to browse hotels, apply filters, view room options, and go through a simulated booking process,  
**so that** I can experience the full booking journey without needing any backend or authentication.

**Epic-level acceptance criteria (source):**

1. All pages are fully responsive (desktop, tablet, mobile)
2. No backend or authentication is required
3. All data is hardcoded in JavaScript (mock JSON)
4. Every user action triggers a visual response (animation, toast, modal)
5. The booking flow has 3 steps (Room Selection → Guest Details → Dummy Payment)
6. Success state shows confirmation with confetti animation
7. Performance: All interactions happen within 200ms

**Child stories in scope (EP-3–EP-14):** App shell; mock dataset (12 hotels × 3 rooms); results listing; filters (price, rating, amenities); sort by price; hotel details; booking steps 1–3; confirmation with confetti; global feedback; ≤200ms interaction guardrails.

## Clarifications (Q&A summary)

| # | Topic | Decision |
|---|--------|----------|
| 1 | Delivery shape | Capstone delivers a **Python web application** that **serves** the interactive portal. **Flask + Jinja2** for multi-page HTML UI with static CSS/JS. Business data remains **client-side mock JSON** (hardcoded in JavaScript). No database, no real payment gateway, no user accounts/auth. |
| 2 | “No backend” meaning | Means **no persistent API/DB/auth services** — not “no Python server.” Static assets and pages are served by the Python app. |
| 3 | Actors | Potential hotel guest (anonymous). No admin role in scope. |
| 4 | Primary flows | Browse hotels → filter/sort → hotel details → 3-step booking (Room Selection → Guest Details → Dummy Payment) → confirmation with confetti. Screens: Results (A), Details (B), Steps C/D/E, Confirmation (F). |
| 5 | Filters & sort | Per EP-6/EP-7: **price range**, **rating**, **amenities** (multi-select), plus **Clear filters**; **sort by price** (low→high, optionally high→low). Location/city may appear on cards as display data from the mock model. |
| 6 | Mock catalog | Per EP-4: **at least 12 hotels**, each with **3 room types**; fields include hotel name, location, rating, amenities, images/placeholders, price range; room name/type, capacity, price, amenities, image/placeholder. |
| 7 | Guest details | Per EP-10: First name, Last name, Email (required + format), Phone (optional), Guests count (required, integer ≥ 1); inline validation; Back preserves selections. |
| 8 | Dummy payment | Per EP-11: **success-only simulation** — clear “simulation / no real charge” messaging; Pay/Confirm with brief loading feedback; no real card gateway required. |
| 9 | Edge cases | Empty filter results → clear empty state; invalid form fields → inline validation; missing mock fields → `"Not Found"` / graceful placeholder — never crash; no secrets in UI or docs. |
| 10 | NFRs | Responsive breakpoints (EP-3); local UI feedback ≤ **200ms** (EP-14); consistent toasts/modals/animations (EP-13); Stage 7 Playwright E2E covers browse / filter / book / confirm. |
| 11 | Out of scope | Real payments, auth/SSO, live hotel APIs, admin CMS, email confirmations, multi-currency beyond display mock, WCAG certification (basic semantics OK). |

## Functional Requirements

1. The system shall provide a Python web app (**Flask + Jinja2**) that serves all portal pages and static assets (HTML/CSS/JS), including a responsive app shell with navigation across screens (EP-3).
2. The system shall present a browsable list of hotels sourced from client-side mock JSON (hardcoded JavaScript), with **no database or remote hotel API** (EP-4, EP-5).
3. The mock dataset shall include **at least 12 hotels**, each with **3 room types**, and fields needed for filtering, sorting, details, and booking summaries (EP-4).
4. The results screen shall display hotel cards with at least: name, rating, price indicator, key amenities, and image/placeholder; selecting a card navigates to Hotel Details (EP-5).
5. The system shall allow the guest to filter hotels by **price range**, **rating**, and **amenities** (multi-select), and to **clear filters** back to the default state (EP-6).
6. The system shall allow sorting hotels by **price** (at least low→high; optionally high→low) with visible feedback on change (EP-7).
7. The system shall show a clear empty state when filters match no hotels.
8. The hotel details screen shall show hotel name, rating, amenities, image/placeholder gallery, and the list of 3 room types with name/type, capacity, price, and amenities; each room shall offer a “Select room” action (EP-8).
9. The system shall support a simulated **3-step** booking flow with a step indicator (1 of 3): (1) Room Selection → (2) Guest Details → (3) Dummy Payment (EP-9–EP-11).
10. Room Selection shall require exactly one room before Continue; Continue advances to Guest Details only when a room is selected (EP-9).
11. Guest Details shall collect First name, Last name, Email, optional Phone, and Guests count; validate inline on blur and/or submit; block Continue until required fields are valid; Back returns to Room Selection preserving selections (EP-10).
12. Dummy Payment shall be clearly labeled as a simulation (no real charge); Pay/Confirm shows loading feedback then advances to Confirmation; no backend payment calls (EP-11).
13. Confirmation shall show booking summary (hotel, room, guest name, guests count, optional reference id), play a **confetti** animation, and offer CTA(s) such as “Back to results” (EP-12).
14. The system shall give every primary user action a visual response (animation, toast, and/or modal), with consistent feedback patterns (EP-13).
15. The system shall render missing or undefined mock fields as `"Not Found"` or an equivalent graceful placeholder without crashing the UI.
16. The system shall not require authentication, user accounts, or session-based login.
17. The system shall not expose secrets, API keys, or credentials in the UI, client assets, or documentation artifacts.

## Non-Functional Requirements

1. **Responsive UI:** Layouts shall work at common mobile, tablet, and desktop breakpoints without broken overflow; navigation remains usable across breakpoints (EP-3).
2. **Interaction latency:** Filtering, sorting, and step transitions against the mock dataset shall complete within ~**200ms** on a typical modern browser; document a basic measurement approach (e.g., console timing / README notes) (EP-14).
3. **No persistent backend services:** No database, no authenticated APIs, and no real payment or email services in scope.
4. **Security / secrets:** No secrets in source, mock data, UI, or generated docs.
5. **Reliability / resilience:** Empty results, validation errors, and missing mock fields fail gracefully (empty state, inline errors, `"Not Found"`).
6. **Delivery stack:** Python web application (Flask + Jinja2) serving the portal; client-side mock JSON for business data.
7. **Verification (Stage 7):** Playwright E2E shall cover browse → filter/sort → details → 3-step book → confirmation; unit/integration tests as appropriate for the Python app shell.
8. **Accessibility (lightweight):** Use basic semantic HTML; full WCAG certification is out of scope.

## Acceptance Criteria

- [ ] Portal is served by a Flask + Jinja2 Python web app without requiring a separate auth/DB backend.
- [ ] Guest can browse ≥12 hotels (3 rooms each) rendered from hardcoded client-side mock JSON.
- [ ] Results cards show name, rating, price indicator, key amenities, and image/placeholder; click opens details.
- [ ] Guest can filter by price range, rating, and amenities; Clear filters resets; empty matches show a clear empty state.
- [ ] Guest can sort by price (at least low→high) with visible feedback.
- [ ] Hotel details show hotel info and 3 room types with Select room actions.
- [ ] Booking flow has exactly three steps with step indicator: Room Selection → Guest Details → Dummy Payment.
- [ ] Guest Details validates required fields (name, email format, guests ≥ 1); Back preserves selections.
- [ ] Dummy Payment is clearly a simulation; Pay/Confirm succeeds with loading feedback then confirmation.
- [ ] Confirmation shows booking summary and confetti; CTA returns to results (or book another).
- [ ] Every primary user action produces a visible response (animation, toast, or modal).
- [ ] Missing mock fields display `"Not Found"` / placeholder; UI does not crash.
- [ ] Layouts are responsive on desktop, tablet, and mobile.
- [ ] Local mock-driven filter/sort/step interactions provide feedback within ~200ms.
- [ ] No authentication, real payments, live hotel APIs, or secrets appear in the delivered UI/docs.
- [ ] Stage 7 Playwright E2E can exercise browse → filter → 3-step book → confirm.

## Out of Scope

- Real payment processing or payment-gateway integration
- Authentication, SSO, user accounts, or role-based access (including admin)
- Live hotel inventory / third-party booking APIs
- Database or server-side persistence of bookings
- Admin CMS or content management
- Email / SMS booking confirmations
- Multi-currency conversion beyond simple mock display values
- Formal WCAG accessibility certification
- Production ops concerns beyond a local/dev-runnable Python web app
- Date-range / occupancy search beyond Guests count on the booking form (not in EP-3–EP-14)

## Open Questions (if any remain)

None blocking. Residual preferences (non-blocking): optional high→low sort; exact amenity vocabulary in the seed dataset; optional booking reference-id format.
