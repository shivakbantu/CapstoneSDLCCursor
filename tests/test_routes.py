"""Smoke tests for Flask page routes (Stage 5 T21)."""

import pytest

from app import create_app

SAMPLE_HOTEL_ID = "hotel-01"


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as test_client:
        yield test_client


def test_create_app():
    app = create_app()
    assert app is not None
    assert app.name == "app"


@pytest.mark.parametrize(
    "path",
    [
        "/",
        "/results",
        f"/hotels/{SAMPLE_HOTEL_ID}",
        f"/book/{SAMPLE_HOTEL_ID}/room",
        f"/book/{SAMPLE_HOTEL_ID}/guest",
        f"/book/{SAMPLE_HOTEL_ID}/payment",
        "/confirmation",
        "/hotels/unknown-hotel-id",
    ],
)
def test_get_routes_return_200(client, path):
    response = client.get(path)
    assert response.status_code == 200
    assert b"HarborStay" in response.data
