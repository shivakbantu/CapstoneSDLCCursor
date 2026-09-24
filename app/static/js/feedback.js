/**
 * UI feedback — toasts and brief loading overlay for pay simulation.
 */
(function (global) {
  "use strict";

  function toast(message, variant) {
    const region = document.getElementById("toast-region");
    if (!region) return;
    const el = document.createElement("div");
    el.className = "toast" + (variant ? " is-" + variant : "");
    el.setAttribute("role", "status");
    el.textContent = message;
    region.appendChild(el);
    window.setTimeout(function () {
      el.remove();
    }, 2200);
  }

  function showLoading(label) {
    const overlay = document.getElementById("loading-overlay");
    if (!overlay) return;
    const text = overlay.querySelector(".loading-text");
    if (text && label) text.textContent = label;
    overlay.hidden = false;
  }

  function hideLoading() {
    const overlay = document.getElementById("loading-overlay");
    if (!overlay) return;
    overlay.hidden = true;
  }

  /**
   * Simulate async work with a brief delay (pay ~400ms).
   */
  function withLoading(ms, label) {
    showLoading(label || "Processing…");
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        hideLoading();
        resolve();
      }, ms);
    });
  }

  global.Feedback = {
    toast: toast,
    showLoading: showLoading,
    hideLoading: hideLoading,
    withLoading: withLoading,
  };
})(window);
