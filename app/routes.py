"""GET-only page routes for screens A–F."""

from flask import Blueprint, render_template

bp = Blueprint("pages", __name__)


@bp.get("/")
@bp.get("/results")
def results():
    """Screen A — hotel results listing."""
    return render_template("results.html", title="Find Hotels", active="results")


@bp.get("/hotels/<hotel_id>")
def hotel_details(hotel_id: str):
    """Screen B — hotel details (unknown id handled in-page by client JS)."""
    return render_template(
        "hotel_details.html",
        title="Hotel Details",
        hotel_id=hotel_id,
        active="results",
    )


@bp.get("/book/<hotel_id>/room")
def booking_room(hotel_id: str):
    """Screen C — room selection (step 1 of 3)."""
    return render_template(
        "booking_room.html",
        title="Select Room",
        hotel_id=hotel_id,
        step=1,
        active="booking",
    )


@bp.get("/book/<hotel_id>/guest")
def booking_guest(hotel_id: str):
    """Screen D — guest details (step 2 of 3)."""
    return render_template(
        "booking_guest.html",
        title="Guest Details",
        hotel_id=hotel_id,
        step=2,
        active="booking",
    )


@bp.get("/book/<hotel_id>/payment")
def booking_payment(hotel_id: str):
    """Screen E — dummy payment (step 3 of 3)."""
    return render_template(
        "booking_payment.html",
        title="Payment",
        hotel_id=hotel_id,
        step=3,
        active="booking",
    )


@bp.get("/confirmation")
def confirmation():
    """Screen F — booking confirmation."""
    return render_template(
        "confirmation.html",
        title="Booking Confirmed",
        active="confirmation",
    )
