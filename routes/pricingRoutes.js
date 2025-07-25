const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// Get all pricing configurations
router.get('/', pricingController.getAllPricing);

// Get pricing by ubudehe category
router.get('/category/:category', pricingController.getPricingByCategory);

// Protected routes (admin only)
// Create new pricing configuration (Admin only)
router.post('/', authMiddleware, pricingController.createPricing);

// Update pricing configuration (Admin only)
router.put('/:id', authMiddleware, pricingController.updatePricing);

// Delete pricing configuration (Admin only)
router.delete('/:id', authMiddleware, pricingController.deletePricing);

module.exports = router; 