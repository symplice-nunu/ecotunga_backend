const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  deleteUser, 
  updateUser, 
  updateProfile,
  getProfile,
  generateUsersPDF,
  getUsersCount,
  getDashboardStats
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const wasteCollectionController = require('../controllers/wasteCollectionController');

// Get all users (protected route)
router.get('/', auth, getAllUsers);

// Get users count (protected route)
router.get('/count', auth, getUsersCount);

// Get dashboard statistics (protected route)
router.get('/stats', auth, getDashboardStats);

// Generate PDF of users (protected route)
router.get('/pdf', auth, generateUsersPDF);

// Profile routes for logged-in user
router.get('/profile/me', auth, getProfile);
router.put('/profile/me', auth, updateProfile);

// Add waste collection (protected route)
router.post('/collection', auth, wasteCollectionController.createWasteCollection);

// Get user's waste collections (protected route)
router.get('/collection', auth, wasteCollectionController.getUserWasteCollections);

// Admin routes for waste collection management
router.get('/collection/all', auth, wasteCollectionController.getAllWasteCollections);
router.put('/collection/:id/approve', auth, wasteCollectionController.approveWasteCollection);
router.put('/collection/:id/deny', auth, wasteCollectionController.denyWasteCollection);

// Delete user (protected route)
router.delete('/:userId', auth, deleteUser);

// Update user (protected route)
router.put('/:userId', auth, updateUser);

// Get user by ID (protected route) - must be last because it has a parameter
router.get('/:userId', auth, getUserById);

module.exports = router; 