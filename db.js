const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool;

// Initialize pool if database configuration exists
if (process.env.DB_HOST) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
}

// User related database functions
async function createUser(email, password, type) {
  const query = 'INSERT INTO users (email, password, type) VALUES ($1, $2, $3) RETURNING *';
  const values = [email, password, type];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Gym related database functions
async function getAllGyms() {
  const query = 'SELECT * FROM gyms ORDER BY name';
  const result = await pool.query(query);
  return result.rows;
}

async function createGym(name, description, image, address) {
  const query = 'INSERT INTO gyms (name, description, image, address) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [name, description, image, address];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Initialize database tables
async function initializeTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gyms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

module.exports = {
  pool,
  createUser,
  getUserByEmail,
  getAllGyms,
  createGym,
  initializeTables
};