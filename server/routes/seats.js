/**
 * routes/seats.js
 * Seat layout and availability for a given show.
 */

const express = require("express");
const { getSeatsForShow, shows } = require("../data/mockData");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

// ─── GET /api/v1/seats/:showId ────────────────────────────────────────────────
// Returns all 80 seats grouped by row: { A: [...], B: [...], ... }
router.get("/:showId", (req, res, next) => {
  try {
    const { showId } = req.params;

    // Validate show exists
    const show = shows.find((s) => s.id === showId);
    if (!show) throw createError(404, "Show not found.");

    const allSeats = getSeatsForShow(showId);

    // Group by row
    const grouped = {};
    allSeats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push({
        id: seat.id,
        label: seat.label,
        row: seat.row,
        seatNumber: seat.seatNumber,
        isBooked: seat.isBooked,
        price: seat.price,
      });
    });

    // Summary stats
    const total = allSeats.length;
    const booked = allSeats.filter((s) => s.isBooked).length;
    const available = total - booked;

    res.json({
      success: true,
      showId,
      summary: { total, booked, available },
      seats: grouped,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
