const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Company routes
const companyRoutes = require('./routes/companyRoutes');
console.log('Mounting company routes...');
app.use('/api/companies', companyRoutes);

// Test the route mounting
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routes are working!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err && err.stack ? err.stack : err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err && err.message ? err.message : String(err)
  });
});

// 404 handling
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  // Log all registered routes
  console.log('Registered routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      console.log(middleware.route);
    } else if (middleware.name === 'router') {
      // router middleware 
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(handler.route);
        }
      });
    }
  });
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/auth/profile');
  console.log('- POST /api/auth/logout');
  console.log('- GET /api/users');
  console.log('- GET /api/users/:userId');
  console.log('- PUT /api/users/:userId');
  console.log('- DELETE /api/users/:userId');
  console.log('- POST /api/companies/register');
  console.log('- GET /api/companies');
  console.log('- GET /api/companies/:id');
  console.log('- GET /api/test');
});
