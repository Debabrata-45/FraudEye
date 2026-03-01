const pg = require("pg");
const { env } = require("../config/env");

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

module.exports = { pool };