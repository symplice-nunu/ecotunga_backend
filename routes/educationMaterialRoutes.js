const express = require('express');
const router = express.Router();
const educationMaterialController = require('../controllers/educationMaterialController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.get('/', educationMaterialController.getAllMaterials);
router.get('/:materialId', educationMaterialController.getMaterialById);

// Protected routes (authentication required)
router.use(authMiddleware);

// Material management (admin only)
router.post('/', educationMaterialController.createMaterial);
router.put('/:materialId', educationMaterialController.updateMaterial);
router.delete('/:materialId', educationMaterialController.deleteMaterial);

// User interactions
router.post('/:materialId/bookmark', educationMaterialController.bookmarkMaterial);
router.delete('/:materialId/bookmark', educationMaterialController.removeBookmark);
router.get('/user/bookmarks', educationMaterialController.getUserBookmarks);
router.post('/:materialId/rate', educationMaterialController.rateMaterial);

module.exports = router; 