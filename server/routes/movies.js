/**
 * routes/movies.js
 * Movie CRUD + search/filter endpoints.
 */

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { movies } = require("../data/mockData");
const { authenticate, isAdmin } = require("../middleware/auth");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

// ─── GET /api/v1/movies ───────────────────────────────────────────────────────
// Query params: genre, language, search, page, limit
router.get("/", (req, res, next) => {
  try {
    let { genre, language, search, page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    let filtered = [...movies];

    // Filter by genre (case-insensitive)
    if (genre) {
      filtered = filtered.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    // Filter by language
    if (language) {
      filtered = filtered.filter(
        (m) => m.language.toLowerCase() === language.toLowerCase()
      );
    }

    // Search by title (case-insensitive, partial match)
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((m) => m.title.toLowerCase().includes(q));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIdx = (page - 1) * limit;
    const paginated = filtered.slice(startIdx, startIdx + limit);

    res.json({
      success: true,
      movies: paginated,
      total,
      page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/movies/:id ───────────────────────────────────────────────────
router.get("/:id", (req, res, next) => {
  try {
    const movie = movies.find((m) => m.id === req.params.id);
    if (!movie) throw createError(404, "Movie not found.");
    res.json({ success: true, movie });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/movies  (admin only) ───────────────────────────────────────
router.post("/", authenticate, isAdmin, (req, res, next) => {
  try {
    const { title, genre, language, duration, rating, description, posterUrl, releaseDate, cast, director, price } =
      req.body;

    if (!title || !genre || !language || !duration || !price) {
      throw createError(400, "title, genre, language, duration and price are required.");
    }

    const newMovie = {
      id: `movie-${uuidv4()}`,
      title,
      genre: Array.isArray(genre) ? genre : [genre],
      language,
      duration: Number(duration),
      rating: rating ? Number(rating) : 0,
      description: description || "",
      posterUrl: posterUrl || `https://picsum.photos/seed/${uuidv4()}/300/450`,
      releaseDate: releaseDate || new Date().toISOString().split("T")[0],
      cast: Array.isArray(cast) ? cast : [],
      director: director || "",
      price: Number(price),
    };

    movies.push(newMovie);
    console.log(`[MOVIES] Added new movie: ${newMovie.title}`);

    res.status(201).json({ success: true, message: "Movie created.", movie: newMovie });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/v1/movies/:id  (admin only) ────────────────────────────────────
router.put("/:id", authenticate, isAdmin, (req, res, next) => {
  try {
    const idx = movies.findIndex((m) => m.id === req.params.id);
    if (idx === -1) throw createError(404, "Movie not found.");

    const updatable = [
      "title", "genre", "language", "duration", "rating",
      "description", "posterUrl", "releaseDate", "cast", "director", "price",
    ];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        movies[idx][field] = req.body[field];
      }
    });

    console.log(`[MOVIES] Updated movie: ${movies[idx].title}`);
    res.json({ success: true, message: "Movie updated.", movie: movies[idx] });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/movies/:id  (admin only) ─────────────────────────────────
router.delete("/:id", authenticate, isAdmin, (req, res, next) => {
  try {
    const idx = movies.findIndex((m) => m.id === req.params.id);
    if (idx === -1) throw createError(404, "Movie not found.");

    const [removed] = movies.splice(idx, 1);
    console.log(`[MOVIES] Deleted movie: ${removed.title}`);

    res.json({ success: true, message: "Movie deleted.", movie: removed });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
