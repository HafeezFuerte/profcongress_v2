
// const createConnection = require('../db2');

const pool = require('../db3'); // Import the pool

const getAllCategories = async () => {
  let connection 
  try {
    // const connection = await createConnection();
    connection = await pool.getConnection();

    const [rows] = await connection.query('SELECT * FROM category');
    return rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }finally {
        if (connection) connection.release();  // Ensure the connection is released back to the pool
  }
};

module.exports = {
  getAllCategories
};