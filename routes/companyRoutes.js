const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Company routes are working!' });
});

// Get all companies
router.get('/', companyController.getAllCompanies);

// Register a new company
router.post('/register', companyController.register);

// Get company by ID (must be last because it has a parameter)
router.get('/:id', companyController.getCompanyById);

module.exports = router; 