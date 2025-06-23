const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const auth = require('../middleware/authMiddleware');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Company routes are working!' });
});

// Get all companies
router.get('/', companyController.getAllCompanies);

// Register a new company
router.post('/register', companyController.register);

// Update company by email
router.put('/update-by-email', companyController.updateByEmail);

// Company profile routes (protected)
router.get('/profile/me', auth, companyController.getProfile);
router.put('/profile/me', auth, companyController.updateProfile);

// Get company by ID (must be last because it has a parameter)
router.get('/:id', companyController.getCompanyById);

module.exports = router; 