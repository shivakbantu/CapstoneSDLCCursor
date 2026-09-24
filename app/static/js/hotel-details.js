/**
 * Hotel details (B) — unknown hotel → in-page not-found; Select room seeds draft.
 */
(function () {
  "use strict";

  const page = document.querySelector(".details-page");
  if (!page || !window.HotelCatalog) return;

  const hotelId = page.getAttribute("data-hotel-id");
  const notFoundEl = document.getElementById("hotel-not-found");
  const detailsEl = document.getElementById("hotel-details");
  const roomList = document.getElementById("room-list");

  function showNotFound() {
    if (notFoundEl) notFoundEl.hidden = false;
    if (detailsEl) detailsEl.hidden = true;
  }

  function render() {
    const hotel = HotelCatalog.getHotelById(hotelId);
    if (!hotel) {
      showNotFound();
      return;
    }
    if (notFoundEl) notFoundEl.hidden = true;
    if (detailsEl) detailsEl.hidden = false;

    const nameEl = document.getElementById("hotel-name");
    const locEl = document.getElementById("hotel-location");
    const ratingEl = document.getElementById("hotel-rating");
    const priceEl = document.getElementById("hotel-price");
    const amenEl = document.getElementById("hotel-amenities");
    const imgEl = document.getElementById("hotel-image");

    if (nameEl) nameEl.textContent = Display.text(hotel.name);
    if (locEl) locEl.textContent = Display.text(hotel.location);
    if (ratingEl) ratingEl.textContent = Display.rating(hotel.rating);
    if (priceEl) priceEl.textContent = Display.priceRange(hotel.priceRange);
    if (imgEl) imgEl.setAttribute("data-label", Display.text(hotel.name));

    if (amenEl) {
      amenEl.innerHTML = "";
      Display.amenities(hotel.amenities).forEach(function (a) {
        const li = document.createElement("li");
        li.textContent = a;
        amenEl.appendChild(li);
      });
    }

    if (!roomList) return;
    roomList.innerHTML = "";
    const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
    if (rooms.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = Display.NOT_FOUND;
      roomList.appendChild(empty);
      return;
    }

    rooms.forEach(function (room) {
      const card = document.createElement("article");
      card.className = "room-card";
      card.setAttribute("data-room-id", room.id);

      const img = document.createElement("div");
      img.className = "placeholder-image";
      img.setAttribute("data-label", "Room");

      const info = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.textContent = Display.text(room.name);
      const cap = document.createElement("p");
      cap.textContent =
        "Sleeps " +
        (typeof room.capacity === "number" ? room.capacity : Display.NOT_FOUND);
      const tags = document.createElement("div");
      tags.className = "amenity-tags";
      Display.amenities(room.amenities).forEach(function (name) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = name;
        tags.appendChild(tag);
      });
      info.appendChild(h3);
      info.appendChild(cap);
      info.appendChild(tags);

      const actions = document.createElement("div");
      const price = document.createElement("div");
      price.className = "room-price";
      price.textContent = Display.money(room.price);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary";
      btn.textContent = "Select room";
      btn.setAttribute("data-testid", "select-room");
      btn.setAttribute("data-room-id", room.id);
      btn.addEventListener("click", function () {
        const prior = BookingState.read();
        const sameHotel = prior && prior.hotelId === hotel.id;
        BookingState.write({
          hotelId: hotel.id,
          roomId: room.id,
          guest: sameHotel ? prior.guest : undefined,
        });
        if (window.Feedback) Feedback.toast("Room selected — continue to booking", "ok");
        window.location.href = "/book/" + encodeURIComponent(hotel.id) + "/room";
      });
      actions.appendChild(price);
      actions.appendChild(btn);

      card.appendChild(img);
      card.appendChild(info);
      card.appendChild(actions);
      roomList.appendChild(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
