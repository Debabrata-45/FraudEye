// src/db/index.js
require("dotenv").config(); // load .env

const { Pool } = require("pg");
const { env } = require("../config/env"); // ✅ FIXED

if (!env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment");
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL client error:", err);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };