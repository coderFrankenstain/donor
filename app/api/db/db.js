const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: 'root',
  password: 'wj651213',
  database: 'store'
});

module.exports = pool.promise();
