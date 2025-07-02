const express = require('express');
const router = express.Router();
const communityEventController = require('../controllers/communityEventController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.get('/', communityEventController.getAllEvents);
router.get('/tomorrow/count', communityEventController.getTomorrowEventsCount);
router.get('/tomorrow/events', communityEventController.getTomorrowEvents);
router.get('/:eventId', communityEventController.getEventById);

// Protected routes (authentication required)
router.use(authMiddleware);

// Event management (admin only)
router.post('/', communityEventController.createEvent);
router.put('/:eventId', communityEventController.updateEvent);
router.delete('/:eventId', communityEventController.deleteEvent);

// User participation
router.post('/:eventId/join', communityEventController.joinEvent);
router.delete('/:eventId/leave', communityEventController.leaveEvent);
router.get('/user/events', communityEventController.getUserEvents);

// Protected routes (authentication required)
router.use(authMiddleware);

// Event management (admin only)
router.post('/', communityEventController.createEvent);
router.put('/:eventId', communityEventController.updateEvent);
router.delete('/:eventId', communityEventController.deleteEvent);

// User participation
router.post('/:eventId/join', communityEventController.joinEvent);
router.delete('/:eventId/leave', communityEventController.leaveEvent);
router.get('/user/events', communityEventController.getUserEvents);

module.exports = router; 