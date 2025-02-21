import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from './data/inMemoryDb.js';
// import { queries } from './data/postgresDb.js';
import { isAuthenticated } from './middleware/auth.js';

export const router = express.Router();

// Auth routes
router.post('/api/signup', async (req, res) => {
  const { username, password, homeAddress } = req.body;
  
  // Check if user exists
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    homeAddress
  };

  db.users.push(newUser);
  
  // Postgres version:
  // const newUser = await queries.createUser(username, hashedPassword, homeAddress);
  
  res.cookie('userId', newUser.id);
  res.redirect('/dashboard/stores');
});

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.cookie('userId', user.id);
  res.cookie('apiKey', '88&uyT65!!@3');
  res.redirect('/dashboard/stores');
});

router.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.clearCookie('apiKey');
  res.redirect('/login');
});

// Dashboard routes
router.get('/dashboard/stores', isAuthenticated, (req, res) => {
  res.render('stores', { stores: db.stores });
  // Postgres version:
  // const stores = await queries.getAllStores();
  // res.render('stores', { stores });
});

router.get('/dashboard/gyms', isAuthenticated, (req, res) => {
  res.render('gyms', { gyms: db.gyms });
  // Postgres version:
  // const gyms = await queries.getAllGyms();
  // res.render('gyms', { gyms });
});

router.get('/dashboard/petshops', isAuthenticated, (req, res) => {
  res.render('petshops', { petshops: db.petshops });
  // Postgres version:
  // const petshops = await queries.getAllPetshops();
  // res.render('petshops', { petshops });
});

// CRUD routes
router.post('/dashboard/stores/create', isAuthenticated, (req, res) => {
  const newStore = { id: Date.now().toString(), ...req.body };
  db.stores.push(newStore);
  res.redirect('/dashboard/stores');
});

router.post('/dashboard/stores/edit/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const storeIndex = db.stores.findIndex(s => s.id === id);
  if (storeIndex !== -1) {
    db.stores[storeIndex] = { ...db.stores[storeIndex], ...req.body };
  }
  res.redirect('/dashboard/stores');
});

router.get('/dashboard/stores/delete/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  db.stores = db.stores.filter(s => s.id !== id);
  res.redirect('/dashboard/stores');
});

router.post('/dashboard/gyms/create', isAuthenticated, (req, res) => {
  const newGym = { id: Date.now().toString(), ...req.body };
  db.gyms.push(newGym);
  res.redirect('/dashboard/gyms');
});

router.post('/dashboard/gyms/edit/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const gymIndex = db.gyms.findIndex(g => g.id === id);
  if (gymIndex !== -1) {
    db.gyms[gymIndex] = { ...db.gyms[gymIndex], ...req.body };
  }
  res.redirect('/dashboard/gyms');
});

router.get('/dashboard/gyms/delete/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  db.gyms = db.gyms.filter(g => g.id !== id);
  res.redirect('/dashboard/gyms');
});

router.post('/dashboard/petshops/create', isAuthenticated, (req, res) => {
  const newPetshop = { id: Date.now().toString(), ...req.body };
  db.petshops.push(newPetshop);
  res.redirect('/dashboard/petshops');
});

router.post('/dashboard/petshops/edit/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const petshopIndex = db.petshops.findIndex(p => p.id === id);
  if (petshopIndex !== -1) {
    db.petshops[petshopIndex] = { ...db.petshops[petshopIndex], ...req.body };
  }
  res.redirect('/dashboard/petshops');
});

router.get('/dashboard/petshops/delete/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  db.petshops = db.petshops.filter(p => p.id !== id);
  res.redirect('/dashboard/petshops');
});

// Serve HTML pages
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});