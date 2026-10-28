/**
 * routes/theatres.js
 * Theatre listing and detail endpoints.
 */

const express = require("express");
const { theatres } = require("../data/mockData");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

// ─── GET /api/v1/theatres ─────────────────────────────────────────────────────
router.get("/", (req, res, next) => {
  try {
    res.json({ success: true, theatres, total: theatres.length });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/theatres/:id ─────────────────────────────────────────────────
router.get("/:id", (req, res, next) => {
  try {
    const theatre = theatres.find((t) => t.id === req.params.id);
    if (!theatre) throw createError(404, "Theatre not found.");
    res.json({ success: true, theatre });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
