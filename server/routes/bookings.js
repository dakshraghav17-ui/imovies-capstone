/**
 * routes/bookings.js
 * Booking creation, retrieval, cancellation endpoints.
 */

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { bookings, shows, movies, theatres, getSeatsForShow, seatsStore } = require("../data/mockData");
const { authenticate, isAdmin } = require("../middleware/auth");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

/** Generate a short alphanumeric booking reference (e.g. IMV3K7X) */
function generateReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "IMV";
  for (let i = 0; i < 4; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

/** Enrich a booking with movie, theatre and show details */
function enrichBooking(booking) {
  const show = shows.find((s) => s.id === booking.showId);
  const movie = show ? movies.find((m) => m.id === show.movieId) : null;
  const theatre = show ? theatres.find((t) => t.id === show.theatreId) : null;

  return {
    ...booking,
    show: show
      ? { id: show.id, date: show.date, startTime: show.startTime, endTime: show.endTime }
      : null,
    movie: movie
      ? { id: movie.id, title: movie.title, posterUrl: movie.posterUrl, duration: movie.duration }
      : null,
    theatre: theatre
      ? { id: theatre.id, name: theatre.name, location: theatre.location, address: theatre.address }
      : null,
  };
}

// ─── POST /api/v1/bookings ────────────────────────────────────────────────────
// Body: { showId, seatIds: string[] }
router.post("/", authenticate, (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;

    if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
      throw createError(400, "showId and a non-empty seatIds array are required.");
    }

    // Validate show
    const show = shows.find((s) => s.id === showId);
    if (!show) throw createError(404, "Show not found.");

    // Get seats for show (lazily created if needed)
    const showSeats = getSeatsForShow(showId);

    // Validate seat ids and check availability
    const targetSeats = seatIds.map((sid) => {
      const seat = showSeats.find((s) => s.id === sid);
      if (!seat) throw createError(404, `Seat with id "${sid}" not found for this show.`);
      if (seat.isBooked) throw createError(409, `Seat "${seat.label}" is already booked.`);
      return seat;
    });

    // Create booking
    const bookingId = `booking-${uuidv4()}`;
    const seatLabels = targetSeats.map((s) => s.label);
    const totalAmount = targetSeats.reduce((sum, s) => sum + s.price, 0);

    // Mark seats as booked
    targetSeats.forEach((seat) => {
      seat.isBooked = true;
      seat.bookingId = bookingId;
    });

    const newBooking = {
      id: bookingId,
      userId: req.user.id,
      showId,
      movieId: show.movieId,
      theatreId: show.theatreId,
      seats: seatLabels,
      totalAmount,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
      bookingReference: generateReference(),
    };

    bookings.push(newBooking);
    console.log(`[BOOKINGS] New booking ${newBooking.bookingReference} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: "Booking confirmed!",
      booking: enrichBooking(newBooking),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/bookings/my ──────────────────────────────────────────────────
// Returns all bookings for the logged-in user
router.get("/my", authenticate, (req, res, next) => {
  try {
    const myBookings = bookings
      .filter((b) => b.userId === req.user.id)
      .map(enrichBooking);

    res.json({ success: true, bookings: myBookings, total: myBookings.length });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/bookings  (admin only) ──────────────────────────────────────
// Returns ALL bookings in the system
router.get("/", authenticate, isAdmin, (req, res, next) => {
  try {
    const all = bookings.map(enrichBooking);
    res.json({ success: true, bookings: all, total: all.length });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/bookings/:id ─────────────────────────────────────────────────
router.get("/:id", authenticate, (req, res, next) => {
  try {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (!booking) throw createError(404, "Booking not found.");

    // Users can only see their own bookings; admins can see any
    if (booking.userId !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "You do not have permission to view this booking.");
    }

    res.json({ success: true, booking: enrichBooking(booking) });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/v1/bookings/:id/cancel ──────────────────────────────────────────
router.put("/:id/cancel", authenticate, (req, res, next) => {
  try {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (!booking) throw createError(404, "Booking not found.");

    // Ownership check (admins can cancel any booking)
    if (booking.userId !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "You do not have permission to cancel this booking.");
    }

    if (booking.status === "cancelled") {
      throw createError(400, "This booking is already cancelled.");
    }

    // Un-book the seats
    const showSeats = seatsStore[booking.showId] || [];
    showSeats.forEach((seat) => {
      if (booking.seats.includes(seat.label)) {
        seat.isBooked = false;
        seat.bookingId = null;
      }
    });

    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();

    console.log(`[BOOKINGS] Cancelled booking ${booking.bookingReference} by user ${req.user.email}`);

    res.json({
      success: true,
      message: "Booking cancelled successfully.",
      booking: enrichBooking(booking),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
