/**
 * middleware/auth.js
 * JWT authentication middleware for IMovies API.
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_key_2024";

/**
 * authenticate – Required auth middleware.
 * Extracts and verifies the Bearer token; attaches decoded payload to req.user.
 * Rejects with 401 if token is missing/invalid.
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name, role, iat, exp }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

/**
 * optionalAuth – Does NOT reject if no token is present.
 * Attaches req.user if a valid token is provided, otherwise leaves it undefined.
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      req.user = jwt.verify(token, JWT_SECRET);
    }
  } catch {
    // Silently ignore invalid tokens in optional auth
  }
  next();
};

/**
 * isAdmin – Must be used AFTER authenticate.
 * Rejects with 403 if the authenticated user is not an admin.
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden. Admin access required.",
    });
  }
  next();
};

module.exports = { authenticate, optionalAuth, isAdmin };
