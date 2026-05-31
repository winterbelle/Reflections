// ========================================
// PostgreSQL Database Connection
// Handles the connection between Express and PostgreSQL
// ========================================

const { Pool } = require("pg");

// Pool manages database connections for us.
// It uses the DATABASE_URL stored in server/.env.
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = db;