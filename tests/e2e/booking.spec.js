/**
 * HarborStay E2E — primary booking journey + edge cases.
 * Run (Flask must be up on BASE_URL):
 *   npx playwright test tests/e2e/booking.spec.js
 * Or via Python twin: pytest tests/e2e/test_booking_e2e.py -q
 */
const { test, expect } = require("@playwright/test");

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5000";

test.describe.configure({ mode: "serial" });

test("happy path: browse → filter/sort → book → confirm", async ({ page }) => {
  await page.goto(`${BASE}/results`);
  await expect(page.getByTestId("results-list")).toBeVisible();
  const cards = page.getByTestId("hotel-card");
  await expect(cards).toHaveCount(12);

  await page.getByTestId("filter-rating").selectOption("4");
  await page.getByTestId("sort-price").selectOption("desc");
  await expect(cards.first()).toBeVisible();

  await page.getByRole("link", { name: /Harbor Lights Inn/i }).click();
  await expect(page.getByTestId("hotel-details")).toBeVisible();
  await page.getByTestId("select-room").first().click();

  await expect(page.getByTestId("booking-step-indicator")).toBeVisible();
  await page.getByTestId("btn-continue").click();

  await page.getByTestId("guest-first-name").fill("Ada");
  await page.getByTestId("guest-last-name").fill("Lovelace");
  await page.getByTestId("guest-email").fill("ada@example.com");
  await page.getByTestId("guest-count").fill("2");
  await page.getByTestId("btn-continue").click();

  await expect(page.getByTestId("payment-sim-banner")).toBeVisible();
  await page.getByTestId("pay-confirm").click();

  await expect(page.getByTestId("confirmation-summary")).toBeVisible();
  await expect(page.getByTestId("booking-reference")).toHaveText(/HB-/);
  await expect(page.getByTestId("confetti-canvas")).toBeVisible();
});

test("empty filter state and clear", async ({ page }) => {
  await page.goto(`${BASE}/results`);
  await page.getByTestId("filter-price-min").fill("9000");
  await page.getByTestId("filter-price-max").fill("9100");
  // trigger input event if needed
  await page.getByTestId("filter-price-max").dispatchEvent("input");
  await expect(page.getByTestId("empty-state")).toBeVisible();
  await page.getByTestId("empty-clear").click();
  await expect(page.getByTestId("results-list")).toBeVisible();
  await expect(page.getByTestId("hotel-card").first()).toBeVisible();
});

test("unknown hotel shows not-found UI", async ({ page }) => {
  await page.goto(`${BASE}/hotels/does-not-exist`);
  await expect(page.getByTestId("hotel-not-found")).toBeVisible();
});

test("cold confirmation shows empty state", async ({ page }) => {
  await page.goto(`${BASE}/confirmation`);
  await expect(page.getByTestId("confirmation-empty")).toBeVisible();
});

test("guest validation blocks continue", async ({ page }) => {
  await page.goto(`${BASE}/hotels/hotel-01`);
  await page.getByTestId("select-room").first().click();
  await page.getByTestId("btn-continue").click();
  await page.getByTestId("btn-continue").click();
  await expect(page).toHaveURL(/\/book\/hotel-01\/guest/);
  await page.getByTestId("guest-first-name").fill("Ada");
  await page.getByTestId("guest-last-name").fill("Lovelace");
  await page.getByTestId("guest-email").fill("not-an-email");
  await page.getByTestId("guest-count").fill("1");
  await page.getByTestId("guest-email").blur();
  await page.getByTestId("btn-continue").click();
  await expect(page).toHaveURL(/\/book\/hotel-01\/guest/);
  await expect(page.locator('[data-error-for="guest-email"]')).toBeVisible();
});
