const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cv',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  charset: 'utf8mb4',
});

// Test connection on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected — database:', process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('Make sure XAMPP MySQL is running and the "cv" database exists.');
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
