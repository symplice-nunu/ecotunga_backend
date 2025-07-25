require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testSMTPConnection } = require('./services/emailService');

// Test email configuration on startup
console.log('🔧 Testing email configuration...');
testSMTPConnection().then(result => {
  if (result.success) {
    console.log('✅ Email configuration is working properly');
  } else {
    console.log('⚠️  Email configuration has issues:', result.error);
    console.log('📧 Emails may not be sent. Check your .env file and SMTP settings.');
  }
});

const app = express();

// CORS configuration - more permissive for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      // Local development
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:5001',
      'http://127.0.0.1:5001',
      // Production server
      'http://62.171.173.62',
      'https://62.171.173.62',
      // Production frontend domains
      'https://ecotunga-frontend.vercel.app',
      'https://ecotunga.vercel.app',
      'https://ecotunga-frontend-git-main.vercel.app',
      // Add your custom domain if you have one
      // 'https://yourdomain.com',
      // 'https://www.yourdomain.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
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

// Waste collection routes
const wasteCollectionRoutes = require('./routes/wasteCollectionRoutes');
console.log('Mounting waste collection routes...');
app.use('/api/waste-collections', wasteCollectionRoutes);

// Community events routes
const communityEventRoutes = require('./routes/communityEventRoutes');
console.log('Mounting community event routes...');
app.use('/api/community-events', communityEventRoutes);

// Education materials routes
const educationMaterialRoutes = require('./routes/educationMaterialRoutes');
console.log('Mounting education material routes...');
app.use('/api/education-materials', educationMaterialRoutes);

// Payment routes
const paymentRoutes = require('./routes/paymentRoutes');
console.log('Mounting payment routes...');
app.use('/api/payments', paymentRoutes);

// Recycling center routes
const recyclingCenterRoutes = require('./routes/recyclingCenterRoutes');
console.log('Mounting recycling center routes...');
app.use('/api/recycling-center', recyclingCenterRoutes);

// Receipt routes
const receiptRoutes = require('./routes/receiptRoutes');
console.log('Mounting receipt routes...');
app.use('/api/receipts', receiptRoutes);

// Pricing routes
const pricingRoutes = require('./routes/pricingRoutes');
console.log('Mounting pricing routes...');
app.use('/api/pricing', pricingRoutes);

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

const PORT = process.env.PORT || 5001;
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
  console.log('- POST /api/waste-collections');
  console.log('- GET /api/waste-collections/user');
  console.log('- GET /api/waste-collections/next-pickup');
  console.log('- GET /api/waste-collections/admin/all');
  console.log('- PUT /api/waste-collections/admin/:id/approve');
  console.log('- PUT /api/waste-collections/admin/:id/deny');
  console.log('- GET /api/test');
});
