/**
 * Results (A) — filter, sort, render hotel cards.
 */
(function () {
  "use strict";

  const listEl = document.getElementById("results-list");
  const emptyEl = document.getElementById("empty-state");
  const amenityGroup = document.getElementById("amenity-filters");
  const priceMinEl = document.getElementById("filter-price-min");
  const priceMaxEl = document.getElementById("filter-price-max");
  const ratingEl = document.getElementById("filter-rating");
  const sortEl = document.getElementById("sort-price");
  const clearBtn = document.getElementById("filter-clear");
  const emptyClearBtn = document.getElementById("empty-clear");

  if (!listEl || !window.HotelCatalog) return;

  function buildAmenityFilters() {
    if (!amenityGroup) return;
    amenityGroup.innerHTML = "";
    HotelCatalog.AMENITIES.forEach(function (name) {
      const label = document.createElement("label");
      label.className = "amenity-chip";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = name;
      input.setAttribute("data-testid", "filter-amenity");
      input.setAttribute("data-amenity", name);
      label.appendChild(input);
      label.appendChild(document.createTextNode(name));
      amenityGroup.appendChild(label);
    });
  }

  function selectedAmenities() {
    if (!amenityGroup) return [];
    return Array.prototype.slice
      .call(amenityGroup.querySelectorAll('input[type="checkbox"]:checked'))
      .map(function (el) {
        return el.value;
      });
  }

  function getFilters() {
    const minRaw = priceMinEl && priceMinEl.value !== "" ? Number(priceMinEl.value) : null;
    const maxRaw = priceMaxEl && priceMaxEl.value !== "" ? Number(priceMaxEl.value) : null;
    const ratingRaw = ratingEl && ratingEl.value !== "" ? Number(ratingEl.value) : null;
    return {
      priceMin: Number.isFinite(minRaw) ? minRaw : null,
      priceMax: Number.isFinite(maxRaw) ? maxRaw : null,
      ratingMin: Number.isFinite(ratingRaw) ? ratingRaw : null,
      amenities: selectedAmenities(),
      sort: (sortEl && sortEl.value) || "asc",
    };
  }

  function matches(hotel, filters) {
    const min = hotel.priceRange && typeof hotel.priceRange.min === "number" ? hotel.priceRange.min : null;
    const max = hotel.priceRange && typeof hotel.priceRange.max === "number" ? hotel.priceRange.max : null;

    if (filters.priceMin !== null) {
      if (max === null || max < filters.priceMin) return false;
    }
    if (filters.priceMax !== null) {
      if (min === null || min > filters.priceMax) return false;
    }
    if (filters.ratingMin !== null) {
      if (typeof hotel.rating !== "number" || hotel.rating < filters.ratingMin) return false;
    }
    if (filters.amenities.length) {
      const set = hotel.amenities || [];
      for (let i = 0; i < filters.amenities.length; i += 1) {
        if (set.indexOf(filters.amenities[i]) === -1) return false;
      }
    }
    return true;
  }

  function sortHotels(hotels, direction) {
    return hotels.slice().sort(function (a, b) {
      const amin = a.priceRange && typeof a.priceRange.min === "number" ? a.priceRange.min : Number.POSITIVE_INFINITY;
      const bmin = b.priceRange && typeof b.priceRange.min === "number" ? b.priceRange.min : Number.POSITIVE_INFINITY;
      return direction === "desc" ? bmin - amin : amin - bmin;
    });
  }

  function renderCard(hotel) {
    const a = document.createElement("a");
    a.className = "hotel-card";
    a.href = "/hotels/" + encodeURIComponent(hotel.id);
    a.setAttribute("data-testid", "hotel-card");
    a.setAttribute("data-hotel-id", hotel.id);

    const img = document.createElement("div");
    img.className = "placeholder-image";
    img.setAttribute("data-label", "Photo");
    img.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");
    body.className = "hotel-card-body";

    const title = document.createElement("h2");
    title.textContent = Display.text(hotel.name);

    const meta = document.createElement("div");
    meta.className = "meta-row";
    const loc = document.createElement("span");
    loc.textContent = Display.text(hotel.location);
    const rating = document.createElement("span");
    rating.textContent = Display.rating(hotel.rating);
    meta.appendChild(loc);
    meta.appendChild(rating);

    const price = document.createElement("div");
    price.className = "price-badge";
    price.textContent = "From " + (hotel.priceRange ? Display.money(hotel.priceRange.min) : Display.NOT_FOUND);

    const tags = document.createElement("div");
    tags.className = "amenity-tags";
    Display.amenities(hotel.amenities)
      .slice(0, 4)
      .forEach(function (name) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = name;
        tags.appendChild(tag);
      });

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(price);
    body.appendChild(tags);
    a.appendChild(img);
    a.appendChild(body);
    return a;
  }

  function apply() {
    const t0 = performance.now();
    const filters = getFilters();
    let hotels = HotelCatalog.getHotels().filter(function (h) {
      return matches(h, filters);
    });
    hotels = sortHotels(hotels, filters.sort);

    listEl.innerHTML = "";
    if (hotels.length === 0) {
      listEl.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
    } else {
      if (emptyEl) emptyEl.hidden = true;
      listEl.hidden = false;
      hotels.forEach(function (h) {
        listEl.appendChild(renderCard(h));
      });
    }
    const elapsed = performance.now() - t0;
    if (elapsed > 200) {
      console.warn("Filter/sort exceeded 200ms:", elapsed.toFixed(1) + "ms");
    }
  }

  function clearFilters(showToast) {
    if (priceMinEl) priceMinEl.value = "";
    if (priceMaxEl) priceMaxEl.value = "";
    if (ratingEl) ratingEl.value = "";
    if (sortEl) sortEl.value = "asc";
    if (amenityGroup) {
      Array.prototype.forEach.call(
        amenityGroup.querySelectorAll('input[type="checkbox"]'),
        function (el) {
          el.checked = false;
        }
      );
    }
    apply();
    if (showToast && window.Feedback) {
      Feedback.toast("Filters cleared", "ok");
    }
  }

  function bind() {
    buildAmenityFilters();
    [priceMinEl, priceMaxEl, ratingEl].forEach(function (el) {
      if (el) el.addEventListener("input", apply);
      if (el) el.addEventListener("change", apply);
    });
    if (amenityGroup) {
      amenityGroup.addEventListener("change", function () {
        apply();
        if (window.Feedback) Feedback.toast("Amenities updated");
      });
    }
    if (sortEl) {
      sortEl.addEventListener("change", function () {
        apply();
        if (window.Feedback) {
          Feedback.toast(
            sortEl.value === "desc" ? "Sorted: price high → low" : "Sorted: price low → high",
            "ok"
          );
        }
      });
    }
    if (clearBtn) clearBtn.addEventListener("click", function () {
      clearFilters(true);
    });
    if (emptyClearBtn) emptyClearBtn.addEventListener("click", function () {
      clearFilters(true);
    });
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
