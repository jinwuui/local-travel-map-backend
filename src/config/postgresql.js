const pg = require("pg");

const pgClient = new pg.Pool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "looocalpg",
  port: 5432,
  max: 5,
});

module.exports = pgClient;
