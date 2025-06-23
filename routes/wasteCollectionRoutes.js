const express = require('express');
const router = express.Router();
const wasteCollectionController = require('../controllers/wasteCollectionController');
const authMiddleware = require('../middleware/authMiddleware');

// Test route without auth
router.get('/test', (req, res) => {
  res.json({ message: 'Waste collection routes are working!' });
});

// Debug route without auth to check database structure
router.get('/debug', wasteCollectionController.debugDatabaseStructure);

// Apply auth middleware to all routes below
router.use(authMiddleware);

// Create waste collection
router.post('/', wasteCollectionController.createWasteCollection);

// Get user's waste collections
router.get('/user', wasteCollectionController.getUserWasteCollections);

// Get waste collections by company (for waste collectors)
router.get('/company', wasteCollectionController.getWasteCollectionsByCompany);

// Get all waste collections (for admin users)
router.get('/', wasteCollectionController.getAllWasteCollections);

// Get next waste pickup for user
router.get('/next-pickup', wasteCollectionController.getNextWastePickup);

// Admin routes
router.get('/admin/all', wasteCollectionController.getAllWasteCollections);
router.put('/admin/:id/approve', wasteCollectionController.approveWasteCollection);
router.put('/admin/:id/deny', wasteCollectionController.denyWasteCollection);

module.exports = router; 