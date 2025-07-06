// backend/data/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.connect((err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err.stack);
  } else {
    console.log('✅ Подключено к базе данных PostgreSQL');
  }
});
module.exports = pool;
