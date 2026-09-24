/**
 * Mock hotel catalog — ≥12 hotels × 3 rooms.
 * Amenity vocabulary is closed; use AMENITIES for filters and seed data.
 */
(function (global) {
  "use strict";

  const AMENITIES = Object.freeze([
    "WiFi",
    "Parking",
    "Pool",
    "Gym",
    "Spa",
    "Breakfast",
    "Air Conditioning",
    "Pet Friendly",
  ]);

  function room(id, name, capacity, price, amenities) {
    return {
      id,
      name,
      capacity,
      price,
      amenities,
      placeholder: true,
    };
  }

  function hotel(id, name, location, rating, amenities, priceRange, rooms) {
    return {
      id,
      name,
      location,
      rating,
      amenities,
      priceRange,
      images: [],
      placeholder: true,
      rooms,
    };
  }

  const HOTELS = [
    hotel(
      "hotel-01",
      "Harbor Lights Inn",
      "Seattle, WA",
      4.6,
      ["WiFi", "Parking", "Breakfast", "Air Conditioning"],
      { min: 129, max: 289 },
      [
        room("h01-r1", "Standard Queen", 2, 129, ["WiFi", "Air Conditioning"]),
        room("h01-r2", "Harbor View King", 2, 189, ["WiFi", "Breakfast", "Air Conditioning"]),
        room("h01-r3", "Family Suite", 4, 289, ["WiFi", "Parking", "Breakfast"]),
      ]
    ),
    hotel(
      "hotel-02",
      "Cedar Ridge Lodge",
      "Denver, CO",
      4.2,
      ["WiFi", "Parking", "Gym", "Pet Friendly"],
      { min: 99, max: 249 },
      [
        room("h02-r1", "Mountain Twin", 2, 99, ["WiFi", "Parking"]),
        room("h02-r2", "Ridge King", 2, 159, ["WiFi", "Gym", "Air Conditioning"]),
        room("h02-r3", "Pet Suite", 3, 249, ["WiFi", "Pet Friendly", "Parking"]),
      ]
    ),
    hotel(
      "hotel-03",
      "Palm Court Resort",
      "Miami, FL",
      4.8,
      ["WiFi", "Pool", "Spa", "Breakfast", "Air Conditioning"],
      { min: 179, max: 420 },
      [
        room("h03-r1", "Garden Double", 2, 179, ["WiFi", "Pool", "Air Conditioning"]),
        room("h03-r2", "Ocean King", 2, 279, ["WiFi", "Pool", "Spa", "Breakfast"]),
        room("h03-r3", "Cabana Suite", 4, 420, ["WiFi", "Pool", "Spa", "Breakfast", "Air Conditioning"]),
      ]
    ),
    hotel(
      "hotel-04",
      "Metro Central Hotel",
      "Chicago, IL",
      3.9,
      ["WiFi", "Gym", "Air Conditioning", "Breakfast"],
      { min: 110, max: 260 },
      [
        room("h04-r1", "City Twin", 2, 110, ["WiFi", "Air Conditioning"]),
        room("h04-r2", "Business King", 2, 165, ["WiFi", "Gym", "Breakfast"]),
        room("h04-r3", "Corner Suite", 3, 260, ["WiFi", "Gym", "Breakfast", "Air Conditioning"]),
      ]
    ),
    hotel(
      "hotel-05",
      "Lakeside Retreat",
      "Madison, WI",
      4.4,
      ["WiFi", "Parking", "Pool", "Pet Friendly", "Breakfast"],
      { min: 118, max: 275 },
      [
        room("h05-r1", "Lake Twin", 2, 118, ["WiFi", "Parking"]),
        room("h05-r2", "Dockside King", 2, 175, ["WiFi", "Breakfast", "Pool"]),
        room("h05-r3", "Cottage Suite", 5, 275, ["WiFi", "Parking", "Pet Friendly", "Breakfast"]),
      ]
    ),
    hotel(
      "hotel-06",
      "Canyon View Hotel",
      "Phoenix, AZ",
      4.1,
      ["WiFi", "Pool", "Gym", "Spa", "Air Conditioning"],
      { min: 95, max: 230 },
      [
        room("h06-r1", "Desert Queen", 2, 95, ["WiFi", "Air Conditioning", "Pool"]),
        room("h06-r2", "Canyon King", 2, 145, ["WiFi", "Gym", "Pool"]),
        room("h06-r3", "Spa Suite", 3, 230, ["WiFi", "Spa", "Pool", "Air Conditioning"]),
      ]
    ),
    hotel(
      "hotel-07",
      "Bayfront Suites",
      "San Francisco, CA",
      4.7,
      ["WiFi", "Gym", "Breakfast", "Air Conditioning", "Parking"],
      { min: 210, max: 480 },
      [
        room("h07-r1", "Bay Twin", 2, 210, ["WiFi", "Breakfast"]),
        room("h07-r2", "Golden Gate King", 2, 320, ["WiFi", "Gym", "Breakfast", "Air Conditioning"]),
        room("h07-r3", "Penthouse Suite", 4, 480, ["WiFi", "Parking", "Gym", "Breakfast"]),
      ]
    ),
    hotel(
      "hotel-08",
      "Maple Street B&B",
      "Portland, OR",
      4.3,
      ["WiFi", "Breakfast", "Parking", "Pet Friendly"],
      { min: 89, max: 195 },
      [
        room("h08-r1", "Cozy Twin", 2, 89, ["WiFi", "Breakfast"]),
        room("h08-r2", "Garden King", 2, 135, ["WiFi", "Breakfast", "Parking"]),
        room("h08-r3", "Attic Suite", 3, 195, ["WiFi", "Breakfast", "Pet Friendly"]),
      ]
    ),
    hotel(
      "hotel-09",
      "Skyline Tower Stay",
      "New York, NY",
      4.5,
      ["WiFi", "Gym", "Spa", "Air Conditioning", "Breakfast"],
      { min: 240, max: 520 },
      [
        room("h09-r1", "Sky Twin", 2, 240, ["WiFi", "Air Conditioning"]),
        room("h09-r2", "Empire King", 2, 350, ["WiFi", "Gym", "Breakfast"]),
        room("h09-r3", "Skyline Suite", 4, 520, ["WiFi", "Spa", "Gym", "Breakfast", "Air Conditioning"]),
      ]
    ),
    hotel(
      "hotel-10",
      "Riverbend Inn",
      "Austin, TX",
      3.8,
      ["WiFi", "Parking", "Pool", "Pet Friendly"],
      { min: 85, max: 210 },
      [
        room("h10-r1", "River Queen", 2, 85, ["WiFi", "Parking"]),
        room("h10-r2", "Live Oak King", 2, 140, ["WiFi", "Pool", "Air Conditioning"]),
        room("h10-r3", "Family Loft", 5, 210, ["WiFi", "Parking", "Pet Friendly", "Pool"]),
      ]
    ),
    hotel(
      "hotel-11",
      "Coastal Breeze Hotel",
      "San Diego, CA",
      4.0,
      ["WiFi", "Pool", "Parking", "Breakfast", "Air Conditioning"],
      { min: 135, max: 310 },
      [
        room("h11-r1", "Surf Twin", 2, 135, ["WiFi", "Pool"]),
        room("h11-r2", "Pacific King", 2, 205, ["WiFi", "Breakfast", "Air Conditioning"]),
        room("h11-r3", "Breeze Suite", 4, 310, ["WiFi", "Parking", "Pool", "Breakfast"]),
      ]
    ),
    hotel(
      "hotel-12",
      "Summit Peak Lodge",
      "Salt Lake City, UT",
      4.9,
      ["WiFi", "Parking", "Gym", "Spa", "Pet Friendly", "Breakfast"],
      { min: 150, max: 390 },
      [
        room("h12-r1", "Trail Twin", 2, 150, ["WiFi", "Parking", "Breakfast"]),
        room("h12-r2", "Summit King", 2, 245, ["WiFi", "Gym", "Spa"]),
        room("h12-r3", "Alpine Suite", 4, 390, ["WiFi", "Parking", "Gym", "Spa", "Pet Friendly"]),
      ]
    ),
  ];

  function getHotels() {
    return HOTELS.slice();
  }

  function getHotelById(id) {
    if (!id) return null;
    return HOTELS.find(function (h) {
      return h.id === id;
    }) || null;
  }

  function getRoom(hotelId, roomId) {
    const hotel = getHotelById(hotelId);
    if (!hotel || !hotel.rooms) return null;
    return (
      hotel.rooms.find(function (r) {
        return r.id === roomId;
      }) || null
    );
  }

  global.HotelCatalog = {
    AMENITIES: AMENITIES,
    getHotels: getHotels,
    getHotelById: getHotelById,
    getRoom: getRoom,
  };
})(window);
