import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from './data/inMemoryDb.js';
import { queries } from './data/postgresDb.js';
import { isAuthenticated } from './middleware/auth.js';

export const router = express.Router();

// Auth routes
router.post('/api/signup', async (req, res) => {
  const { username, password, email, type ,  homeaddress } = req.body;
  
  // Check if user exists
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  // pg check username

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    homeaddress
  };

  db.users.push(newUser);
 
  const newuser = await new Promise( (resolve, reject) => { 
    try{
      resolve( queries.createUser(username, hashedPassword, email, type , homeaddress)  );
    }catch(error){ 
      console.log("error in db  creating user" , error );
      reject(error);
    }
  });
  console.log("newuser");
  console.log(newuser);
  
  if(newuser == "Error"){ 
    res.redirect('/signup');
  }
  res.cookie('userId', newUser.id);
  res.redirect('/dashboard/stores');

});

router.post('/api/login', async (req, res) => {

  const { email, password } = req.body;

  const user = await new Promise( (resolve, reject) => {
     resolve( queries.getUserByEmail(email) );

  });
    
  // const user = await new Promise((resolve, reject) => {
  //   fetchUser(userId, (err, user) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }

  //     resolve(user);
  //   });
  // });

  console.log("====userps====");
  console.log(user);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log("invalid password userps");
  }
 
  res.cookie('user', user.username);
  res.cookie('apiKey', '88&uyT65!!@3'); /* hash of username plus timestamp then store in db */
  res.redirect('/user_dashboard');

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

router.get('/dashboard/gyms', isAuthenticated, async (req, res) => {
  const gyms = await queries.getAllGyms();
  console.log("gyms===>>>" , gyms);
  res.render('gym_all', { gyms });

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

//edit acct
router.get('/account/edit', (req, res) => {
  res.render('edit_account');
});

router.get('/account', (req, res) => {
  res.render('account');
});

router.get('/user_dashboard', (req, res) => {
  res.render('user_home');
});

router.get('/user_subscriptions', (req, res) => {
  res.render('user_subscription');
});

router.get('/gym_all', isAuthenticated,(req, res) => {
  res.render('gym_all');
});
router.get('/gym_view', (req, res) => {
  res.render('gym_view');
});

router.get('/gym_edit', (req, res) => {
  res.render('gym_edit');
});

router.get('/gym_add', (req, res) => {
  res.render('gym_add');
});

router.get('/trainer/all', (req, res) => {
  res.render('trainer_all');
});

router.get('/trainer/add', (req, res) => {
  res.render('trainer_add');
});
router.get('/trainer/view', (req, res) => {
  res.render('trainer_view');
});

router.get('/program/all', (req, res) => {
  res.render('program_all');
});

router.get('/program/view', (req, res) => {
  res.render('program_view');
});


router.get('/program/add', (req, res) => {
  res.render('program_add');
});


router.get('/program/edit', (req, res) => {
  res.render('program_edit');
});



router.get('/subscription/all', (req, res) => {
  res.render('subscription_all');
});

router.get('/subscription/view', (req, res) => {
  res.render('subscription_view');
});




router.get('/', (req, res) => {
  res.render('index');
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});