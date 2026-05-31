const express = require("express");
const db = require("../db/db");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    // Simple query to confirm that the database connection works
    const result = await db.query("SELECT NOW()");

    res.status(200).json({
      message: "Database connection is successful",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed 😞",
    });
  }
});

module.exports = router;
