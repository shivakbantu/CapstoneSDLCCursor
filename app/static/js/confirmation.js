/**
 * Confirmation (F) — summary from draft; confetti; clear draft on leave.
 */
(function () {
  "use strict";

  const emptyEl = document.getElementById("confirmation-empty");
  const panelEl = document.getElementById("confirmation-summary");
  const refEl = document.getElementById("booking-reference");
  const fieldsEl = document.getElementById("summary-fields");
  const backBtn = document.getElementById("btn-back-to-results");
  const canvas = document.getElementById("confetti-canvas");

  function showEmpty() {
    if (emptyEl) emptyEl.hidden = false;
    if (panelEl) panelEl.hidden = true;
  }

  function addRow(dt, dd) {
    if (!fieldsEl) return;
    const dtEl = document.createElement("dt");
    dtEl.textContent = dt;
    const ddEl = document.createElement("dd");
    ddEl.textContent = dd;
    fieldsEl.appendChild(dtEl);
    fieldsEl.appendChild(ddEl);
  }

  function render() {
    const draft = BookingState.read();
    if (!draft || !draft.referenceId || !draft.hotelId || !draft.roomId) {
      showEmpty();
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (panelEl) panelEl.hidden = false;

    const hotel = HotelCatalog.getHotelById(draft.hotelId);
    const room = HotelCatalog.getRoom(draft.hotelId, draft.roomId);
    const guest = draft.guest || {};

    if (refEl) refEl.textContent = Display.text(draft.referenceId);

    if (fieldsEl) fieldsEl.innerHTML = "";
    addRow("Hotel", Display.text(hotel && hotel.name));
    addRow("Location", Display.text(hotel && hotel.location));
    addRow("Room", Display.text(room && room.name));
    addRow("Nightly rate", Display.money(room && room.price));
    addRow(
      "Guest",
      Display.text(guest.firstName) + " " + Display.text(guest.lastName)
    );
    addRow("Email", Display.text(guest.email));
    addRow(
      "Guests",
      typeof guest.guestsCount === "number" ? String(guest.guestsCount) : Display.NOT_FOUND
    );

    if (window.Confetti && canvas) {
      Confetti.burst(canvas, 2400);
    }
    if (window.Feedback) Feedback.toast("Booking confirmed!", "ok");
  }

  function bind() {
    render();
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        BookingState.clear();
        if (window.Feedback) Feedback.toast("Draft cleared");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
