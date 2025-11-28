const { Pool } = require('pg');

/**
 * PostgreSQL Database Connection Pool
 * 
 * Connection configuration uses environment variables with development defaults:
 * - PGUSER: Database user (default: postgres)
 * - PGPASSWORD: Database password (default: 12345678)
 * - PGHOST: Database host (default: localhost)
 * - PGDATABASE: Database name (default: app_react_db)
 * - PGPORT: Database port (default: 5432)
 */
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '12345678',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'app_react_db',
  port: parseInt(process.env.PGPORT || '5432', 10),
});

// Log connection status
pool.on('connect', () => {
  console.log('DB connected - PostgreSQL pool connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

/**
 * Execute a query on the database
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
