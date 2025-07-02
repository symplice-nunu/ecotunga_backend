const express = require('express');
const router = express.Router();
const recyclingCenterController = require('../controllers/recyclingCenterController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create recycling center booking
router.post('/bookings', recyclingCenterController.createRecyclingCenterBooking);

// Get user's recycling center bookings
router.get('/bookings/user', recyclingCenterController.getUserRecyclingCenterBookings);

// Get recycling center bookings by company (for recycling center owners)
router.get('/bookings/company', recyclingCenterController.getRecyclingCenterBookingsByCompany);

// Get all recycling center bookings (for admin users)
router.get('/bookings', recyclingCenterController.getAllRecyclingCenterBookings);

// Get specific recycling center booking by ID
router.get('/bookings/:id', recyclingCenterController.getRecyclingCenterBookingById);

module.exports = router; 