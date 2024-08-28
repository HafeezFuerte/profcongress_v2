const pool = require('../db');

class UserService {
  static getFirstUser(callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection:', err);
        callback(err);
        return;
      }

      const sql = 'SELECT * FROM `user` ORDER BY `createdAt` LIMIT 1';
      connection.query(sql, (err, results) => {
        connection.release();
        if (err) {
          console.error('Error executing query:', err);
          callback(err);
          return;
        }
        callback(null, results[0]);
      });
    });
  }
}

module.exports = UserService;
