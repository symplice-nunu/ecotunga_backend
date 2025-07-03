const db = require('../config/db');

// Get all education materials
const getAllMaterials = async (req, res) => {
  try {
    const { category, level, type, featured, search } = req.query;
    
    let query = db('education_materials')
      .select(
        'education_materials.*',
        'users.name as created_by_name'
      )
      .leftJoin('users', 'education_materials.created_by', 'users.id')
      .where('education_materials.is_active', true);

    // Filter by category
    if (category && category !== 'all') {
      query = query.where('education_materials.category', category);
    }

    // Filter by level
    if (level && level !== 'all') {
      query = query.where('education_materials.level', level);
    }

    // Filter by type
    if (type && type !== 'all') {
      query = query.where('education_materials.type', type);
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.where('education_materials.featured', true);
    }

    // Search functionality
    if (search) {
      query = query.where(function() {
        this.where('education_materials.title', 'like', `%${search}%`)
          .orWhere('education_materials.description', 'like', `%${search}%`)
          .orWhere('education_materials.author', 'like', `%${search}%`)
          .orWhereRaw('JSON_SEARCH(education_materials.tags, "one", ?)', [`%${search}%`]);
      });
    }

    const materials = await query.orderBy('education_materials.created_at', 'desc');
    
    res.json(materials);
  } catch (error) {
    console.error('Error fetching education materials:', error);
    res.status(500).json({ message: 'Error fetching education materials' });
  }
};

// Get material by ID
const getMaterialById = async (req, res) => {
  const { materialId } = req.params;
  
  try {
    const material = await db('education_materials')
      .select(
        'education_materials.*',
        'users.name as created_by_name'
      )
      .leftJoin('users', 'education_materials.created_by', 'users.id')
      .where('education_materials.id', materialId)
      .where('education_materials.is_active', true)
      .first();
      
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Increment view count
    await db('education_materials')
      .where({ id: materialId })
      .increment('views', 1);
    
    res.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ message: 'Error fetching material' });
  }
};

// Create new material
const createMaterial = async (req, res) => {
  const {
    title,
    description,
    category,
    level,
    type,
    duration,
    author,
    image_url,
    content_url,
    youtube_url,
    featured,
    tags
  } = req.body;

  const userId = req.user.id;

  try {
    // Validate required fields
    if (!title || !description || !category || !type || !duration || !author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [materialId] = await db('education_materials')
      .insert({
        title,
        description,
        category,
        level: level || 'beginner',
        type,
        duration,
        author,
        image_url,
        content_url,
        youtube_url,
        featured: featured || false,
        tags: tags ? JSON.stringify(tags) : JSON.stringify([]),
        created_by: userId
      });

    // Fetch the created material
    const material = await db('education_materials').where({ id: materialId }).first();

    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ message: 'Error creating material' });
  }
};

// Update material
const updateMaterial = async (req, res) => {
  const { materialId } = req.params;
  const {
    title,
    description,
    category,
    level,
    type,
    duration,
    author,
    image_url,
    content_url,
    youtube_url,
    featured,
    tags,
    is_active
  } = req.body;

  try {
    // Check if material exists
    const existingMaterial = await db('education_materials').where({ id: materialId }).first();
    if (!existingMaterial) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Update the material
    await db('education_materials')
      .where({ id: materialId })
      .update({
        title: title || existingMaterial.title,
        description: description || existingMaterial.description,
        category: category || existingMaterial.category,
        level: level || existingMaterial.level,
        type: type || existingMaterial.type,
        duration: duration || existingMaterial.duration,
        author: author || existingMaterial.author,
        image_url: image_url || existingMaterial.image_url,
        content_url: content_url || existingMaterial.content_url,
        youtube_url: youtube_url || existingMaterial.youtube_url,
        featured: featured !== undefined ? featured : existingMaterial.featured,
        tags: tags ? JSON.stringify(tags) : existingMaterial.tags,
        is_active: is_active !== undefined ? is_active : existingMaterial.is_active,
        updated_at: db.fn.now()
      });

    // Fetch the updated material
    const updatedMaterial = await db('education_materials').where({ id: materialId }).first();

    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error updating material:', error.message, error.stack);
    res.status(500).json({ message: 'Error updating material', error: error.message });
  }
};

// Delete material
const deleteMaterial = async (req, res) => {
  const { materialId } = req.params;
  
  try {
    // Check if material exists
    const material = await db('education_materials').where({ id: materialId }).first();
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Soft delete by setting is_active to false
    await db('education_materials')
      .where({ id: materialId })
      .update({ is_active: false, updated_at: db.fn.now() });
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ message: 'Error deleting material' });
  }
};

// Bookmark material
const bookmarkMaterial = async (req, res) => {
  const { materialId } = req.params;
  const userId = req.user.id;

  try {
    // Check if material exists and is active
    const material = await db('education_materials')
      .where({ id: materialId, is_active: true })
      .first();
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found or inactive' });
    }

    // Check if already bookmarked
    const existingBookmark = await db('bookmarked_materials')
      .where({ material_id: materialId, user_id: userId })
      .first();

    if (existingBookmark) {
      return res.status(400).json({ message: 'Material already bookmarked' });
    }

    // Bookmark material
    await db('bookmarked_materials').insert({
      material_id: materialId,
      user_id: userId
    });

    res.json({ message: 'Material bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking material:', error);
    res.status(500).json({ message: 'Error bookmarking material' });
  }
};

// Remove bookmark
const removeBookmark = async (req, res) => {
  const { materialId } = req.params;
  const userId = req.user.id;

  try {
    // Check if bookmark exists
    const bookmark = await db('bookmarked_materials')
      .where({ material_id: materialId, user_id: userId })
      .first();

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // Remove bookmark
    await db('bookmarked_materials')
      .where({ material_id: materialId, user_id: userId })
      .del();

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Error removing bookmark' });
  }
};

// Get user's bookmarked materials
const getUserBookmarks = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookmarks = await db('bookmarked_materials')
      .select(
        'education_materials.*',
        'bookmarked_materials.bookmarked_at',
        'users.name as created_by_name'
      )
      .join('education_materials', 'bookmarked_materials.material_id', 'education_materials.id')
      .leftJoin('users', 'education_materials.created_by', 'users.id')
      .where('bookmarked_materials.user_id', userId)
      .where('education_materials.is_active', true)
      .orderBy('bookmarked_materials.bookmarked_at', 'desc');

    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    res.status(500).json({ message: 'Error fetching user bookmarks' });
  }
};

// Rate material
const rateMaterial = async (req, res) => {
  const { materialId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if material exists
    const material = await db('education_materials')
      .where({ id: materialId, is_active: true })
      .first();
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // For now, we'll just update the overall rating
    // In a real application, you might want to store individual user ratings
    const newRating = (material.rating + rating) / 2;
    
    await db('education_materials')
      .where({ id: materialId })
      .update({ rating: newRating });

    res.json({ message: 'Rating submitted successfully', newRating });
  } catch (error) {
    console.error('Error rating material:', error);
    res.status(500).json({ message: 'Error rating material' });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bookmarkMaterial,
  removeBookmark,
  getUserBookmarks,
  rateMaterial
}; 