const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser, updateUser, generateUsersPDF } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Get all users (protected route)
router.get('/', auth, getAllUsers);

// Generate PDF of users (protected route)
router.get('/pdf', auth, generateUsersPDF);

// Delete user (protected route)
router.delete('/:userId', auth, deleteUser);

// Update user (protected route)
router.put('/:userId', auth, updateUser);

// Get user by ID (protected route)
router.get('/:userId', auth, getUserById);

module.exports = router; 