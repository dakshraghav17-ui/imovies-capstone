/**
 * server.js
 * IMovies API – Main Express entry point.
 *
 * Starts the HTTP server, wires up middleware and routes,
 * and logs all available endpoints on startup.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// ── Route modules ──────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const theatreRoutes = require("./routes/theatres");
const showRoutes = require("./routes/shows");
const seatRoutes = require("./routes/seats");
const bookingRoutes = require("./routes/bookings");

// ── Middleware modules ─────────────────────────────────────────────────────────
const { errorHandler } = require("./middleware/errorHandler");

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// CORS – allow requests from Vite dev server and production origins
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ─────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Static files (serves posters to frontend if requested from API server)
app.use(express.static(path.join(__dirname, "../client/public")));

// ── Health check ──────────────────────────────────────────────────────────────
app.get(["/api/health", "/health"], (_req, res) => {
  res.json({
    status: "OK",
    message: "IMovies API Running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
const API_BASE = "/api/v1";

[API_BASE, "/v1"].forEach((prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/movies`, movieRoutes);
  app.use(`${prefix}/theatres`, theatreRoutes);
  app.use(`${prefix}/shows`, showRoutes);
  app.use(`${prefix}/seats`, seatRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
});

// ── 404 handler for unknown routes ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Start server (only when not running on Vercel / serverless) ───────────────
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    const divider = "═".repeat(55);
    console.log(`\n${divider}`);
    console.log(`  🎬  IMovies API Server`);
    console.log(`${divider}`);
    console.log(`  ✅  Status   : Running`);
    console.log(`  🌐  Port     : ${PORT}`);
    console.log(`  🔧  Env      : ${process.env.NODE_ENV}`);
    console.log(`  🔗  Base URL : http://localhost:${PORT}${API_BASE}`);
    console.log(`${divider}`);
    console.log("  📋  Available Endpoints:\n");

    const routes = [
      ["GET",    "/api/health",                     "Health check"],
      ["POST",   `${API_BASE}/auth/register`,        "Register"],
      ["POST",   `${API_BASE}/auth/login`,           "Login"],
      ["GET",    `${API_BASE}/auth/me`,              "Current user (auth)"],
      ["GET",    `${API_BASE}/movies`,               "List/search movies"],
      ["GET",    `${API_BASE}/movies/:id`,           "Movie detail"],
      ["POST",   `${API_BASE}/movies`,               "Create movie (admin)"],
      ["PUT",    `${API_BASE}/movies/:id`,           "Update movie (admin)"],
      ["DELETE", `${API_BASE}/movies/:id`,           "Delete movie (admin)"],
      ["GET",    `${API_BASE}/theatres`,             "List theatres"],
      ["GET",    `${API_BASE}/theatres/:id`,         "Theatre detail"],
      ["GET",    `${API_BASE}/shows`,                "List/filter shows"],
      ["GET",    `${API_BASE}/shows/:id`,            "Show detail"],
      ["POST",   `${API_BASE}/shows`,                "Create show (admin)"],
      ["PUT",    `${API_BASE}/shows/:id`,            "Update show (admin)"],
      ["DELETE", `${API_BASE}/shows/:id`,            "Delete show (admin)"],
      ["GET",    `${API_BASE}/seats/:showId`,        "Seat layout for show"],
      ["POST",   `${API_BASE}/bookings`,             "Create booking (auth)"],
      ["GET",    `${API_BASE}/bookings/my`,          "My bookings (auth)"],
      ["GET",    `${API_BASE}/bookings`,             "All bookings (admin)"],
      ["GET",    `${API_BASE}/bookings/:id`,         "Booking detail (auth)"],
      ["PUT",    `${API_BASE}/bookings/:id/cancel`,  "Cancel booking (auth)"],
    ];

    const methodPad = 8;
    routes.forEach(([method, path, desc]) => {
      const colorCode =
        method === "GET" ? "\x1b[32m" :
        method === "POST" ? "\x1b[34m" :
        method === "PUT" ? "\x1b[33m" :
        method === "DELETE" ? "\x1b[31m" : "\x1b[37m";
      const reset = "\x1b[0m";
      console.log(
        `  ${colorCode}${method.padEnd(methodPad)}${reset}${path.padEnd(42)}${desc}`
      );
    });

    console.log(`\n${divider}\n`);
  });
}

module.exports = app;
