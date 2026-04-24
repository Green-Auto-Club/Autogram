const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "green_auto_club",
  password: "263625",
  port: 5432,
});

module.exports = pool;