const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'herman1976',
  port: 5432, 
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

//hola