const config = require('./config');

const mysql = require('mysql2/promise');
const env =  'development';
const dbConfig = config[env];
// Replace with your actual database connection details
const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

module.exports = pool;
