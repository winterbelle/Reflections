const express = require("express");
const db = require("../db/db");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.status(200).json({
      message: "Database connection is successful",
      time: result.rows[0].now,
    });
  } catch (error) {
    // Look at your terminal where npm run dev is running to see this log!
    console.error("--- DETAILED DATABASE ERROR ---", error);

    res.status(500).json({
      message: "Database connection failed 😞",
      // Temporarily add this line so curl shows the exact issue:
      debugError: error.message, 
    });
  }
});

module.exports = router;
