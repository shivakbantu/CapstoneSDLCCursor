/**
 * Display helpers — missing fields → "Not Found" / placeholders; never throw.
 */
(function (global) {
  "use strict";

  const NOT_FOUND = "Not Found";

  function text(value) {
    if (value === null || value === undefined || value === "") {
      return NOT_FOUND;
    }
    return String(value);
  }

  function number(value, fallbackLabel) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
    return fallbackLabel || NOT_FOUND;
  }

  function money(value) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return "$" + value.toFixed(0);
    }
    return NOT_FOUND;
  }

  function priceRange(range) {
    if (!range || typeof range.min !== "number" || typeof range.max !== "number") {
      return NOT_FOUND;
    }
    return money(range.min) + " – " + money(range.max);
  }

  function rating(value) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value.toFixed(1) + " ★";
    }
    return NOT_FOUND;
  }

  function amenities(list) {
    if (!Array.isArray(list) || list.length === 0) {
      return [NOT_FOUND];
    }
    return list.map(function (a) {
      return text(a);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.Display = {
    NOT_FOUND: NOT_FOUND,
    text: text,
    number: number,
    money: money,
    priceRange: priceRange,
    rating: rating,
    amenities: amenities,
    escapeHtml: escapeHtml,
  };
})(window);
