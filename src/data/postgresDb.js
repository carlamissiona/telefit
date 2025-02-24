import pg from 'pg';
const { Pool } = pg;

// Uncomment and configure these when ready to use Postgres

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const pool = new Pool({
  user: "admin",
  host: "dpg-cugqr723esus73fg1egg-a.oregon-postgres.render.com",
  database: "telefitdb",
  password: "yaHa2t9CtHNJBS1jKhn2Mzke5Jvca3PM",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});
// Schema setup
// Note users gyms

const setupSchema = async () => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      home_address TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      city TEXT NOT NULL,
      tagline TEXT,
      image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gyms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      city TEXT NOT NULL,
      tagline TEXT,
      image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS petshops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      city TEXT NOT NULL,
      tagline TEXT,
      image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
     
    CREATE TABLE IF NOT EXISTS trainers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      firstname character varying(60) NOT NULL,
      lastname character varying(60) NOT NULL,
      description character varying(255) NOT NULL,
      image character varying(500) NOT NULL, 
      userid INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS programs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name character varying(100) NOT NULL,
      description character varying(2000) NOT NULL, 
      image character varying(1000) NOT NULL, 
      gymid INTEGER NOT NULL,
      trainerid INTEGER NOT NULL,
      status character varying(100) NOT NULL, 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

  `);
};

export const queries = {
  // Users
  async createUser(username, hashedPassword, email , type , homeaddress) {
    try {

      const result = await pool.query(
        'INSERT INTO users (username, password, email , type , homeaddress) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, hashedPassword, email, type, homeaddress]
      );
      return result.rows[0];

    } catch (e) { 
      console.log(typeof e);
      console.log(e.toString());
      console.log("typeof e");
      if(true == (e.toString()).includes('duplicate key value violates unique constraint') && (e.toString()).includes('users_email_key')){
           return "Duplicate Email";
      }else{
        console.error('Error Occurred', e);
        return "Error"
      
      }
       
    }
    
  },

  async getUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getUserByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },


  async getUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async updateUser(id, username, hashedPassword,  email, type, homeaddress) {
    const result = await pool.query(
      'UPDATE users SET username = $2, password = $3, email = $4 , type=$5, homeaddress=$6 WHERE id = $1 RETURNING *',
      [id, username, hashedPassword, email, type, homeaddress ]
    );
    return result.rows[0];
  },

  // Stores
  async getAllStores() {
    const result = await pool.query('SELECT * FROM stores ORDER BY created_at DESC');
    return result.rows;
  },

  async getStoreById(id) {
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createStore(name, description, city, tagline, image) {
    const result = await pool.query(
      'INSERT INTO stores (name, description, city, tagline, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, city, tagline, image]
    );
    return result.rows[0];
  },

  async updateStore(id, name, description, city, tagline, image) {
    const result = await pool.query(
      'UPDATE stores SET name = $2, description = $3, city = $4, tagline = $5, image = $6 WHERE id = $1 RETURNING *',
      [id, name, description, city, tagline, image]
    );
    return result.rows[0];
  },

  async deleteStore(id) {
    const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Gyms
  async getAllGyms() {
    const result = await pool.query('SELECT * FROM gyms ORDER BY created_at DESC');
    return result.rows;
  },

  async getGymById(id) {
    const result = await pool.query('SELECT * FROM gyms WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createGym(name, description, address, image) {
    const result = await pool.query(
      'INSERT INTO gyms (name, description, address, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, address , image]
    );
    return result.rows[0];
  },

  async updateGym(id, name, description, address, image) {
    const result = await pool.query(
      'UPDATE gyms SET name = $2, description = $3, city = $4, tagline = $5, image = $6 WHERE id = $1 RETURNING *',
      [id, name, description, address, image]
    );
    return result.rows[0];
  },

  async deleteGym(id) {
    const result = await pool.query('DELETE FROM gyms WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Petshops
  async getAllPetshops() {
    const result = await pool.query('SELECT * FROM petshops ORDER BY created_at DESC');
    return result.rows;
  },

  async getPetshopById(id) {
    const result = await pool.query('SELECT * FROM petshops WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createPetshop(name, description, city, tagline, image) {
    const result = await pool.query(
      'INSERT INTO petshops (name, description, city, tagline, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, city, tagline, image]
    );
    return result.rows[0];
  },

  async updatePetshop(id, name, description, city, tagline, image) {
    const result = await pool.query(
      'UPDATE petshops SET name = $2, description = $3, city = $4, tagline = $5, image = $6 WHERE id = $1 RETURNING *',
      [id, name, description, city, tagline, image]
    );
    return result.rows[0];
  },

  async deletePetshop(id) {
    const result = await pool.query('DELETE FROM petshops WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

// Initialize schema when database connection is ready
setupSchema().catch(console.error);
