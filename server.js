const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db');

// Initialize environment variables
dotenv.config();

const app = express();

// API key middleware
const API_KEY = 'Aqb1#1-89+&aq-1*jkiIK-Lpo!1}';

const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  
  next();
};

// Static data
const users = [
  { id: 1, email: 'trainer@example.com', password: 'trainer123', type: 'trainer' },
  { id: 2, email: 'gymowner@example.com', password: 'owner123', type: 'owner' },
  { id: 3, email: 'user@example.com', password: 'user123', type: 'user' }
];

const gyms = [
  {
    id: 1,
    name: 'FitZone Elite',
    description: 'Premium fitness facility with state-of-the-art equipment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    address: '123 Fitness Street'
  },
  {
    id: 2,
    name: 'PowerHouse Gym',
    description: 'Your ultimate strength training destination',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    address: '456 Muscle Avenue'
  }
];

// Initialize database tables if PostgreSQL is configured
if (db.pool) {
  db.initializeTables();
}

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Set view engine
app.set('view engine', 'ejs');

// Web Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    req.session.user = user;
    res.redirect('/gyms');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password, type } = req.body;
  const newUser = {
    id: users.length + 1,
    email,
    password,
    type
  };
  
  users.push(newUser);
  req.session.user = newUser;
  res.redirect('/gyms');
});

app.get('/gyms', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('gyms', { gyms, user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// API Routes
// Get all users
app.get('/api/users', validateApiKey, async (req, res) => {
  // Using static data
  const sanitizedUsers = users.map(({ password, ...user }) => user);
 // res.json(sanitizedUsers);

  // Using PostgreSQL (uncomment when ready to use database)
  try {
    const result = await db.pool.query('SELECT id, email, type, created_at FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

// Get user by ID
app.get('/api/users/:id', validateApiKey, async (req, res) => {
  // Using static data
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...sanitizedUser } = user;
  res.json(sanitizedUser);

  /* Using PostgreSQL (uncomment when ready to use database)
  try {
    const result = await db.pool.query(
      'SELECT id, email, type, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  */
});

// Create user
app.post('/api/users', validateApiKey, async (req, res) => {
  const { email, password, type } = req.body;
  
  if (!email || !password || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!['user', 'trainer', 'owner'].includes(type)) {
    return res.status(400).json({ error: 'Invalid user type' });
  }
  
  // Using static data
  const newUser = {
    id: users.length + 1,
    email,
    password,
    type
  };
  
  users.push(newUser);
  const { password: _, ...sanitizedUser } = newUser;
  res.status(201).json(sanitizedUser);

  /* Using PostgreSQL (uncomment when ready to use database)
  try {
    const result = await db.pool.query(
      'INSERT INTO users (email, password, type) VALUES ($1, $2, $3) RETURNING id, email, type, created_at',
      [email, password, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    if (error.code === '23505') { // unique_violation error code
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  */
});

// Get all gyms
app.get('/api/gyms', validateApiKey, async (req, res) => {
  // Using static data
  res.json(gyms);

  /* Using PostgreSQL (uncomment when ready to use database)
  try {
    const result = await db.pool.query('SELECT * FROM gyms ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  */
});

// Get gym by ID
app.get('/api/gyms/:id', validateApiKey, async (req, res) => {
  // Using static data
  const gym = gyms.find(g => g.id === parseInt(req.params.id));
  if (!gym) {
    return res.status(404).json({ error: 'Gym not found' });
  }
  res.json(gym);

  /* Using PostgreSQL (uncomment when ready to use database)
  try {
    const result = await db.pool.query(
      'SELECT * FROM gyms WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gym not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  */
});

// Create gym
app.post('/api/gyms', validateApiKey, async (req, res) => {
  const { name, description, image, address } = req.body;
  
  if (!name || !description || !image || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Using static data
  const newGym = {
    id: gyms.length + 1,
    name,
    description,
    image,
    address
  };
  
  gyms.push(newGym);
  res.status(201).json(newGym);

  /* Using PostgreSQL (uncomment when ready to use database)
  try {
    const result = await db.pool.query(
      'INSERT INTO gyms (name, description, image, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, image, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  */
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
