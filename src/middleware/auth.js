const API_KEY = '88&uyT65!!@3';

export const checkApiKey = (req, res, next) => {
  // Only check API key for login endpoint
  if (req.path === '/api/login') {
    const apiKey = req.cookies.apiKey;
    
    if (apiKey !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  next();
};

export const isAuthenticated = (req, res, next) => {
  const userId = req.cookies.userId;
  
  if (!userId) {
    return res.redirect('/login');
  }
  
  next();
};