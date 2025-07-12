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

// Get user's total points from recycling bookings
router.get('/bookings/user/points', recyclingCenterController.getUserPoints);

// Get recycling center bookings by company (for recycling center owners)
router.get('/bookings/company', recyclingCenterController.getRecyclingCenterBookingsByCompany);

// Get all recycling center bookings (for admin users)
router.get('/bookings', recyclingCenterController.getAllRecyclingCenterBookings);

// Approve recycling center booking with pricing
router.put('/bookings/:id/approve', recyclingCenterController.approveRecyclingCenterBooking);

// Confirm price for recycling center booking
router.put('/bookings/:id/confirm-price', recyclingCenterController.confirmRecyclingCenterBookingPrice);

// Confirm payment for recycling center booking
router.put('/bookings/:id/confirm-payment', recyclingCenterController.confirmRecyclingCenterBookingPayment);

// Cancel recycling center booking
router.delete('/bookings/:id', recyclingCenterController.cancelRecyclingCenterBooking);

// Get specific recycling center booking by ID
router.get('/bookings/:id', recyclingCenterController.getRecyclingCenterBookingById);

module.exports = router; 