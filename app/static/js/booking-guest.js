/**
 * Booking step D — Guest Details with inline validation.
 */
(function () {
  "use strict";

  const page = document.querySelector('.booking-page[data-step="2"]');
  if (!page) return;

  const hotelId = page.getAttribute("data-hotel-id");
  const continueBtn = document.getElementById("btn-continue");
  const fields = {
    firstName: document.getElementById("guest-first-name"),
    lastName: document.getElementById("guest-last-name"),
    email: document.getElementById("guest-email"),
    phone: document.getElementById("guest-phone"),
    guestsCount: document.getElementById("guest-count"),
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, message) {
    if (!input) return;
    const err = document.querySelector('[data-error-for="' + input.id + '"]');
    if (err) {
      err.textContent = message || "";
      err.hidden = !message;
    }
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(name) {
    const input = fields[name];
    if (!input) return true;
    const value = (input.value || "").trim();

    if (name === "firstName" || name === "lastName") {
      if (!value) {
        showError(input, "Required");
        return false;
      }
      showError(input, "");
      return true;
    }
    if (name === "email") {
      if (!value) {
        showError(input, "Required");
        return false;
      }
      if (!EMAIL_RE.test(value)) {
        showError(input, "Enter a valid email");
        return false;
      }
      showError(input, "");
      return true;
    }
    if (name === "phone") {
      showError(input, "");
      return true;
    }
    if (name === "guestsCount") {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1) {
        showError(input, "Must be at least 1");
        return false;
      }
      showError(input, "");
      return true;
    }
    return true;
  }

  function validateAll() {
    return ["firstName", "lastName", "email", "guestsCount"].every(validateField);
  }

  function readGuest() {
    return {
      firstName: (fields.firstName && fields.firstName.value.trim()) || "",
      lastName: (fields.lastName && fields.lastName.value.trim()) || "",
      email: (fields.email && fields.email.value.trim()) || "",
      phone: (fields.phone && fields.phone.value.trim()) || "",
      guestsCount: Number(fields.guestsCount && fields.guestsCount.value),
    };
  }

  function restore() {
    const draft = BookingState.read();
    // Require a draft for this hotel with a room; do not keep a stale roomId from another hotel.
    if (!draft || draft.hotelId !== hotelId || !draft.roomId) {
      if (window.Feedback) Feedback.toast("Select a room first", "warn");
      window.location.href = "/book/" + encodeURIComponent(hotelId) + "/room";
      return;
    }
    const g = draft.guest || {};
    if (fields.firstName && g.firstName) fields.firstName.value = g.firstName;
    if (fields.lastName && g.lastName) fields.lastName.value = g.lastName;
    if (fields.email && g.email) fields.email.value = g.email;
    if (fields.phone && g.phone) fields.phone.value = g.phone;
    if (fields.guestsCount && g.guestsCount) fields.guestsCount.value = g.guestsCount;
  }

  function persistGuest() {
    BookingState.update({ hotelId: hotelId, guest: readGuest() });
  }

  function onContinue() {
    if (!validateAll()) {
      if (window.Feedback) Feedback.toast("Fix guest details to continue", "warn");
      return;
    }
    persistGuest();
    if (window.Feedback) Feedback.toast("Continuing to payment", "ok");
    window.location.href = "/book/" + encodeURIComponent(hotelId) + "/payment";
  }

  function bind() {
    restore();
    Object.keys(fields).forEach(function (key) {
      const input = fields[key];
      if (!input) return;
      input.addEventListener("blur", function () {
        validateField(key);
        persistGuest();
      });
      input.addEventListener("change", persistGuest);
    });
    if (continueBtn) continueBtn.addEventListener("click", onContinue);

    const back = document.querySelector('[data-testid="btn-back"]');
    if (back) {
      back.addEventListener("click", function () {
        persistGuest();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
