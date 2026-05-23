// ========================================
// Auth Routes
// Handles:
// - user registration
// - user login
// ========================================

const express = require("express");
const router = express.Router();

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");

// Temporary in-memory users array
// Later this will become a real database
const users = [];

/*
========================================
POST /auth/register
Purpose:
Create a new user account
========================================
*/


// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    // Get user data from request body
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password before saving
    // This protects user passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      id: Date.now(),
      username,
      email,
      password: hashedPassword,
    };

    // Save user to temporary array
    users.push(newUser);

    // Success response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;