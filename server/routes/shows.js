/**
 * routes/shows.js
 * Show (showtime) CRUD and filter endpoints.
 */

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { shows, movies, theatres } = require("../data/mockData");
const { authenticate, isAdmin } = require("../middleware/auth");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

/** Enrich a show with embedded movie title/poster and theatre name/location */
function enrichShow(show) {
  const movie = movies.find((m) => m.id === show.movieId);
  const theatre = theatres.find((t) => t.id === show.theatreId);
  return {
    ...show,
    movie: movie
      ? { id: movie.id, title: movie.title, posterUrl: movie.posterUrl, duration: movie.duration, genre: movie.genre }
      : null,
    theatre: theatre
      ? { id: theatre.id, name: theatre.name, location: theatre.location, address: theatre.address }
      : null,
  };
}

// ─── GET /api/v1/shows ────────────────────────────────────────────────────────
// Query: movieId, theatreId, date
router.get("/", (req, res, next) => {
  try {
    const { movieId, theatreId, date } = req.query;
    let filtered = [...shows];

    if (movieId) filtered = filtered.filter((s) => s.movieId === movieId);
    if (theatreId) filtered = filtered.filter((s) => s.theatreId === theatreId);
    if (date) filtered = filtered.filter((s) => s.date === date);

    res.json({
      success: true,
      shows: filtered.map(enrichShow),
      total: filtered.length,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/shows/:id ────────────────────────────────────────────────────
router.get("/:id", (req, res, next) => {
  try {
    const show = shows.find((s) => s.id === req.params.id);
    if (!show) throw createError(404, "Show not found.");
    res.json({ success: true, show: enrichShow(show) });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/shows  (admin only) ────────────────────────────────────────
router.post("/", authenticate, isAdmin, (req, res, next) => {
  try {
    const { movieId, theatreId, date, startTime, price } = req.body;
    if (!movieId || !theatreId || !date || !startTime || !price) {
      throw createError(400, "movieId, theatreId, date, startTime and price are required.");
    }

    const movie = movies.find((m) => m.id === movieId);
    if (!movie) throw createError(404, "Movie not found.");
    const theatre = theatres.find((t) => t.id === theatreId);
    if (!theatre) throw createError(404, "Theatre not found.");

    // Calculate end time based on movie duration
    const calcEndTime = (start, duration) => {
      const [time, mer] = start.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (mer === "PM" && h !== 12) h += 12;
      if (mer === "AM" && h === 12) h = 0;
      const total = h * 60 + m + duration;
      let eh = Math.floor(total / 60) % 24;
      const em = total % 60;
      const emer = eh >= 12 ? "PM" : "AM";
      if (eh > 12) eh -= 12;
      if (eh === 0) eh = 12;
      return `${eh}:${String(em).padStart(2, "0")} ${emer}`;
    };

    const newShow = {
      id: `show-${uuidv4()}`,
      movieId,
      theatreId,
      date,
      startTime,
      endTime: calcEndTime(startTime, movie.duration),
      price: Number(price),
    };

    shows.push(newShow);
    console.log(`[SHOWS] Added show for movie ${movieId} on ${date}`);

    res.status(201).json({ success: true, message: "Show created.", show: enrichShow(newShow) });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/v1/shows/:id  (admin only) ─────────────────────────────────────
router.put("/:id", authenticate, isAdmin, (req, res, next) => {
  try {
    const idx = shows.findIndex((s) => s.id === req.params.id);
    if (idx === -1) throw createError(404, "Show not found.");

    const updatable = ["movieId", "theatreId", "date", "startTime", "endTime", "price"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) shows[idx][field] = req.body[field];
    });

    console.log(`[SHOWS] Updated show: ${shows[idx].id}`);
    res.json({ success: true, message: "Show updated.", show: enrichShow(shows[idx]) });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/shows/:id  (admin only) ──────────────────────────────────
router.delete("/:id", authenticate, isAdmin, (req, res, next) => {
  try {
    const idx = shows.findIndex((s) => s.id === req.params.id);
    if (idx === -1) throw createError(404, "Show not found.");

    const [removed] = shows.splice(idx, 1);
    console.log(`[SHOWS] Deleted show: ${removed.id}`);

    res.json({ success: true, message: "Show deleted.", show: removed });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
