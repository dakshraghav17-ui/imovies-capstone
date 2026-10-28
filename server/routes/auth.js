/**
 * routes/auth.js
 * Authentication routes: register, login, me
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { users } = require("../data/mockData");
const { authenticate } = require("../middleware/auth");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_key_2024";
const JWT_EXPIRES_IN = "7d";

/** Strip passwordHash before returning user data */
const sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

/** Sign a JWT for a given user object */
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// ─── POST /api/v1/auth/register ───────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw createError(400, "Name, email and password are required.");
    }

    if (password.length < 6) {
      throw createError(400, "Password must be at least 6 characters.");
    }

    // Check for duplicate email
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw createError(409, "An account with this email already exists.");
    }

    // Hash password & create user
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${uuidv4()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = signToken(newUser);
    console.log(`[AUTH] New user registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Email and password are required.");
    }

    // Find user
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw createError(401, "Invalid email or password.");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw createError(401, "Invalid email or password.");
    }

    const token = signToken(user);
    console.log(`[AUTH] User logged in: ${user.email}`);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/auth/me ──────────────────────────────────────────────────────
router.get("/me", authenticate, (req, res, next) => {
  try {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      throw createError(404, "User not found.");
    }
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
