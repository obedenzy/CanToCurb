
const { Pool } = require('pg');

const DATABASE_URL1 = "postgres://db_manager:dbmanagerenz05@35.238.25.245:5432/cantocurb";

if (!DATABASE_URL1) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database? Ensure .env is loaded in server/index.js",
  );
}

const pool = new Pool({ connectionString: DATABASE_URL1,ssl: false});

module.exports = { pool };
