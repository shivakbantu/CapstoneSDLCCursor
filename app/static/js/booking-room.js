/**
 * Booking step C — Room Selection (exactly one room required).
 */
(function () {
  "use strict";

  const page = document.querySelector('.booking-page[data-step="1"]');
  if (!page || !window.HotelCatalog) return;

  const hotelId = page.getAttribute("data-hotel-id");
  const optionsEl = document.getElementById("room-options");
  const summaryEl = document.getElementById("booking-hotel-summary");
  const continueBtn = document.getElementById("btn-continue");
  const errorEl = document.getElementById("room-error");

  const hotel = HotelCatalog.getHotelById(hotelId);

  function ensureDraftHotel() {
    const draft = BookingState.read();
    if (!draft || draft.hotelId !== hotelId) {
      BookingState.write({
        hotelId: hotelId,
        roomId: draft && draft.hotelId === hotelId ? draft.roomId : undefined,
        guest: draft && draft.hotelId === hotelId ? draft.guest : undefined,
      });
    }
  }

  function selectedRoomId() {
    const checked = optionsEl && optionsEl.querySelector('input[name="room"]:checked');
    return checked ? checked.value : null;
  }

  function render() {
    ensureDraftHotel();
    if (!hotel) {
      if (summaryEl) {
        summaryEl.innerHTML =
          "<p>Hotel not found in catalog.</p><p><a class=\"btn btn-primary\" href=\"/results\">Back to results</a></p>";
      }
      if (continueBtn) continueBtn.disabled = true;
      return;
    }

    if (summaryEl) {
      summaryEl.innerHTML =
        "<strong>" +
        Display.escapeHtml(Display.text(hotel.name)) +
        "</strong> · " +
        Display.escapeHtml(Display.text(hotel.location));
    }

    if (!optionsEl) return;
    optionsEl.innerHTML = "";
    const draft = BookingState.read() || {};
    const preselect = draft.hotelId === hotelId ? draft.roomId : null;

    (hotel.rooms || []).forEach(function (room) {
      const label = document.createElement("label");
      label.className = "room-option-label";

      const card = document.createElement("article");
      card.className = "room-card";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "room";
      radio.value = room.id;
      radio.setAttribute("data-testid", "room-option");
      if (preselect === room.id) {
        radio.checked = true;
        card.classList.add("is-selected");
      }

      const img = document.createElement("div");
      img.className = "placeholder-image";
      img.setAttribute("data-label", "Room");

      const info = document.createElement("div");
      info.innerHTML =
        "<h3>" +
        Display.escapeHtml(Display.text(room.name)) +
        "</h3><p>Sleeps " +
        Display.escapeHtml(
          typeof room.capacity === "number" ? String(room.capacity) : Display.NOT_FOUND
        ) +
        "</p>";

      const price = document.createElement("div");
      price.className = "room-price";
      price.textContent = Display.money(room.price);

      card.appendChild(radio);
      card.appendChild(img);
      card.appendChild(info);
      card.appendChild(price);
      label.appendChild(card);
      optionsEl.appendChild(label);

      radio.addEventListener("change", function () {
        Array.prototype.forEach.call(optionsEl.querySelectorAll(".room-card"), function (c) {
          c.classList.remove("is-selected");
        });
        card.classList.add("is-selected");
        if (errorEl) errorEl.hidden = true;
        if (window.Feedback) Feedback.toast("Room selected");
      });
    });
  }

  function onContinue() {
    const roomId = selectedRoomId();
    if (!roomId) {
      if (errorEl) errorEl.hidden = false;
      if (window.Feedback) Feedback.toast("Select a room to continue", "warn");
      return;
    }
    BookingState.update({ hotelId: hotelId, roomId: roomId });
    if (window.Feedback) Feedback.toast("Continuing to guest details", "ok");
    window.location.href = "/book/" + encodeURIComponent(hotelId) + "/guest";
  }

  function bind() {
    render();
    if (continueBtn) continueBtn.addEventListener("click", onContinue);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
