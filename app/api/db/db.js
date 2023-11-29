const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'wj651213',
  database: 'store'
});

module.exports = pool.promise();
