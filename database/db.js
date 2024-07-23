const { Pool } = require('pg');

const credentials = {
  user: process.env.users,
  password: process.env.password,
  host: process.env.host,
  database: process.env.database,
  port: 5432
};

const pool = new Pool(credentials);

module.exports = pool;

console.log("Database Connected..");