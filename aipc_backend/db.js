// config.js
const sql = require('mssql');
const config = require('./config');
const env =  'development';
const dbConfig = config[env];
const sqlConfig = {
  user:  dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  server: dbConfig.host, // e.g., 'localhost'
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed!', err));

module.exports = {
  sql, poolPromise
};
