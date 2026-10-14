// lib/db.js

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'strawberries',
  database: 'ZiZoomChinese',
  connectionLimit: 5
});

module.exports = {
  getConnection: () => pool.getConnection()
};
