const knex = require('knex');
const config = require('../knexfile');

const db = knex(config.development);

// Test the connection
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = db;
