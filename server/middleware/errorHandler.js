/**
 * middleware/errorHandler.js
 * Centralized error-handling middleware for IMovies API.
 * Must be registered LAST in the Express middleware chain.
 */

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Build response payload
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * createError – Convenience factory for HTTP errors.
 * Usage: throw createError(404, "Movie not found");
 */
const createError = (status, message) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

module.exports = { errorHandler, createError };
