// ========================================
// Auth Routes
// Handles:
// - user registration
// - user login
// - demo/admin accounts
// - JWT tokens with user roles
// ========================================

const express = require("express");
const router = express.Router();

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

// Temporary in-memory users array
// Later this will become a real database
const users = [];

// Demo accounts
// Allows visitors, recruiters, judges, and admins
// to explore the application with different permissions
const createDemoUsers = async () => {
  const demoHashedPassword = await bcrypt.hash("demo123", 10);
  const adminHashedPassword = await bcrypt.hash("admin123", 10);

  users.push({
    id: 1,
    username: "Demo Parent",
    email: "demo@kindredparenting.com",
    password: demoHashedPassword,
    role: "user",
  });

  users.push({
    id: 2,
    username: "Admin User",
    email: "admin@kindredparenting.com",
    password: adminHashedPassword,
    role: "admin",
  });
};

createDemoUsers();

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
    const existingUser = users.find((user) => user.email === email);

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
      role: "user",
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
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/*
========================================
POST /auth/login
Purpose:
Authenticate an existing user
========================================
*/

router.post("/login", async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = users.find((user) => user.email === email);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Create a JWT token after successful login
    // This token can be sent by the frontend on future requests
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/*
========================================
GET /auth/profile
Purpose:
Protected route that only works with a valid JWT
========================================
*/

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected profile route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
