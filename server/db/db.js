const { Pool } = require("@neondatabase/serverless");
const ws = require("ws");

// Tell the Neon serverless driver to use the 'ws' package for connections
Pool.webSocketConstructor = ws;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = db;