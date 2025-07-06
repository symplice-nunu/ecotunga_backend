const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create receipt
router.post('/', receiptController.createReceipt);

// Get user's receipts
router.get('/user', receiptController.getUserReceipts);

// Get receipt by ID
router.get('/:id', receiptController.getReceiptById);

// Get receipts by waste collection ID
router.get('/waste-collection/:waste_collection_id', receiptController.getReceiptsByWasteCollectionId);

// Get all receipts (admin only)
router.get('/', receiptController.getAllReceipts);

module.exports = router; 