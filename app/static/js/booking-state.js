/**
 * Booking draft in sessionStorage (key: hotelBookingDraft).
 * Does not invent data when missing.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "hotelBookingDraft";

  function read() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function write(draft) {
    if (!draft || typeof draft !== "object") return false;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      return true;
    } catch (err) {
      return false;
    }
  }

  function update(partial) {
    const current = read() || {};
    const next = Object.assign({}, current, partial);
    if (partial && partial.guest) {
      next.guest = Object.assign({}, current.guest || {}, partial.guest);
    }
    write(next);
    return next;
  }

  function clear() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* ignore */
    }
  }

  /**
   * HB- + compact base36 timestamp + short random suffix.
   * Example shape: HB-m1k2n3-a7xq
   */
  function generateReferenceId() {
    const ts = Date.now().toString(36);
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let suffix = "";
    for (let i = 0; i < 4; i += 1) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return "HB-" + ts + "-" + suffix;
  }

  global.BookingState = {
    STORAGE_KEY: STORAGE_KEY,
    read: read,
    write: write,
    update: update,
    clear: clear,
    generateReferenceId: generateReferenceId,
  };
})(window);
