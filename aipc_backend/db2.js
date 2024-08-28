// db.js

const config = require('./config');

const mysql = require('mysql2/promise');
const env =  'development';
const dbConfig = config[env];
// Replace with your actual database connection details
const createConnection = async () => {
  return await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

module.exports = createConnection;

