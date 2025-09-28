const mysql = require('mysql2');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // MySQL user (root by default)
  password: 'root1',  // Replace with your root password
  database: 'ott_platform'  // Replace with your actual database name
});

// Export the pool to use in other files
module.exports = pool.promise();