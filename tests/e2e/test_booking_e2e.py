"""HarborStay Playwright E2E (Python). Requires Flask on PLAYWRIGHT_BASE_URL.

  pip install playwright
  playwright install chromium
  pytest tests/e2e/test_booking_e2e.py -q
"""

from __future__ import annotations

import os
import re

import pytest
from playwright.sync_api import Page, expect, sync_playwright

BASE = os.environ.get("PLAYWRIGHT_BASE_URL", "http://127.0.0.1:5000").rstrip("/")

pytestmark = pytest.mark.e2e


@pytest.fixture()
def page():
    """Fresh browser context per test (sessionStorage must not leak)."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        pg = context.new_page()
        yield pg
        context.close()
        browser.close()


def test_happy_path_booking(page: Page):
    page.goto(f"{BASE}/results")
    expect(page.get_by_test_id("results-list")).to_be_visible()
    cards = page.get_by_test_id("hotel-card")
    expect(cards).to_have_count(12)

    page.get_by_test_id("filter-rating").select_option("4")
    page.get_by_test_id("sort-price").select_option("desc")
    expect(cards.first).to_be_visible()

    page.get_by_role("link", name=re.compile("Harbor Lights Inn", re.I)).click()
    expect(page.get_by_test_id("hotel-details")).to_be_visible()
    page.get_by_test_id("select-room").first.click()

    expect(page.get_by_test_id("booking-step-indicator")).to_be_visible()
    page.get_by_test_id("btn-continue").click()

    page.get_by_test_id("guest-first-name").fill("Ada")
    page.get_by_test_id("guest-last-name").fill("Lovelace")
    page.get_by_test_id("guest-email").fill("ada@example.com")
    page.get_by_test_id("guest-count").fill("2")
    page.get_by_test_id("btn-continue").click()

    expect(page.get_by_test_id("payment-sim-banner")).to_be_visible()
    page.get_by_test_id("pay-confirm").click()
    page.wait_for_url("**/confirmation", timeout=10_000)

    expect(page.get_by_test_id("confirmation-summary")).to_be_visible()
    expect(page.get_by_test_id("booking-reference")).to_have_text(re.compile(r"HB-"))
    expect(page.get_by_test_id("confetti-canvas")).to_be_visible()


def test_empty_filter_state(page: Page):
    page.goto(f"{BASE}/results")
    page.get_by_test_id("filter-price-min").fill("9000")
    page.get_by_test_id("filter-price-max").fill("9100")
    page.get_by_test_id("filter-price-min").dispatch_event("input")
    page.get_by_test_id("filter-price-max").dispatch_event("input")
    expect(page.get_by_test_id("empty-state")).to_be_visible()
    page.get_by_test_id("empty-clear").click()
    expect(page.get_by_test_id("hotel-card").first).to_be_visible()


def test_unknown_hotel_not_found(page: Page):
    page.goto(f"{BASE}/hotels/does-not-exist")
    expect(page.get_by_test_id("hotel-not-found")).to_be_visible()


def test_cold_confirmation_empty(page: Page):
    page.goto(f"{BASE}/confirmation")
    expect(page.get_by_test_id("confirmation-empty")).to_be_visible()


def test_guest_validation_blocks_continue(page: Page):
    page.goto(f"{BASE}/hotels/hotel-01")
    page.get_by_test_id("select-room").first.click()
    page.get_by_test_id("btn-continue").click()
    # Empty form: Continue click is blocked (stay on guest step)
    page.get_by_test_id("btn-continue").click()
    expect(page).to_have_url(re.compile(r"/book/hotel-01/guest"))
    page.get_by_test_id("guest-first-name").fill("Ada")
    page.get_by_test_id("guest-last-name").fill("Lovelace")
    page.get_by_test_id("guest-email").fill("not-an-email")
    page.get_by_test_id("guest-count").fill("1")
    page.get_by_test_id("guest-email").blur()
    page.get_by_test_id("btn-continue").click()
    expect(page).to_have_url(re.compile(r"/book/hotel-01/guest"))
    expect(page.locator('[data-error-for="guest-email"]')).to_be_visible()
