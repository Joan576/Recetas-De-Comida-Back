const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'herman1976',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.error('Error al conectarse a la base de datos:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
