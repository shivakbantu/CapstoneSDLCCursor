/**
 * Booking step E — Dummy payment simulation (~400ms), then HB- reference → confirmation.
 */
(function () {
  "use strict";

  const page = document.querySelector('.booking-page[data-step="3"]');
  if (!page || !window.HotelCatalog) return;

  const hotelId = page.getAttribute("data-hotel-id");
  const summaryEl = document.getElementById("payment-summary");
  const payBtn = document.getElementById("pay-confirm");
  const PAY_DELAY_MS = 400;

  function renderSummary() {
    const draft = BookingState.read();
    if (!draft || draft.hotelId !== hotelId || !draft.roomId) {
      if (summaryEl) {
        summaryEl.innerHTML =
          "<p>Missing booking draft. <a href=\"/book/" +
          encodeURIComponent(hotelId) +
          "/room\">Select a room</a> first.</p>";
      }
      if (payBtn) payBtn.disabled = true;
      return;
    }

    const hotel = HotelCatalog.getHotelById(hotelId);
    const room = HotelCatalog.getRoom(hotelId, draft.roomId);
    const guest = draft.guest || {};

    if (summaryEl) {
      summaryEl.innerHTML =
        "<p><strong>Hotel:</strong> " +
        Display.escapeHtml(Display.text(hotel && hotel.name)) +
        "</p><p><strong>Room:</strong> " +
        Display.escapeHtml(Display.text(room && room.name)) +
        " · " +
        Display.escapeHtml(Display.money(room && room.price)) +
        "</p><p><strong>Guest:</strong> " +
        Display.escapeHtml(Display.text(guest.firstName)) +
        " " +
        Display.escapeHtml(Display.text(guest.lastName)) +
        "</p><p><strong>Email:</strong> " +
        Display.escapeHtml(Display.text(guest.email)) +
        "</p><p><strong>Guests:</strong> " +
        Display.escapeHtml(
          typeof guest.guestsCount === "number" ? String(guest.guestsCount) : Display.NOT_FOUND
        ) +
        "</p>";
    }
  }

  async function onPay() {
    const draft = BookingState.read();
    if (!draft || !draft.roomId || !draft.guest) {
      if (window.Feedback) Feedback.toast("Complete earlier steps first", "warn");
      return;
    }
    if (payBtn) payBtn.disabled = true;
    await Feedback.withLoading(PAY_DELAY_MS, "Processing payment…");
    const referenceId = BookingState.generateReferenceId();
    BookingState.update({ referenceId: referenceId });
    if (window.Feedback) Feedback.toast("Payment simulated — confirmed", "ok");
    window.location.href = "/confirmation";
  }

  function bind() {
    renderSummary();
    if (payBtn) payBtn.addEventListener("click", onPay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
