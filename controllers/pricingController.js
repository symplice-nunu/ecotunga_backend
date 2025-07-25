const db = require('../config/db');

// Get all pricing configurations
exports.getAllPricing = async (req, res) => {
  try {
    const pricing = await db('pricing_configuration')
      .select('*')
      .orderBy('ubudehe_category');
    
    res.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing configurations:', error);
    res.status(500).json({ error: 'Failed to fetch pricing configurations' });
  }
};

// Get pricing by ubudehe category
exports.getPricingByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const pricing = await db('pricing_configuration')
      .where({ ubudehe_category: category, is_active: true })
      .first();
    
    if (!pricing) {
      return res.status(404).json({ error: 'Pricing configuration not found for this category' });
    }
    
    res.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing by category:', error);
    res.status(500).json({ error: 'Failed to fetch pricing configuration' });
  }
};

// Create new pricing configuration (Admin only)
exports.createPricing = async (req, res) => {
  try {
    const { ubudehe_category, amount, description } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Validate required fields
    if (!ubudehe_category || !amount) {
      return res.status(400).json({ error: 'Ubudehe category and amount are required' });
    }

    // Check if pricing for this category already exists
    const existingPricing = await db('pricing_configuration')
      .where({ ubudehe_category })
      .first();
    
    if (existingPricing) {
      return res.status(400).json({ error: 'Pricing configuration for this category already exists' });
    }

    // Insert new pricing configuration
    const [pricingId] = await db('pricing_configuration').insert({
      ubudehe_category,
      amount: parseFloat(amount),
      description: description || null,
      created_by: userId,
      updated_by: userId
    });

    const newPricing = await db('pricing_configuration')
      .where({ id: pricingId })
      .first();

    res.status(201).json({
      message: 'Pricing configuration created successfully',
      pricing: newPricing
    });
  } catch (error) {
    console.error('Error creating pricing configuration:', error);
    res.status(500).json({ error: 'Failed to create pricing configuration' });
  }
};

// Update pricing configuration (Admin only)
exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, is_active } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if pricing configuration exists
    const existingPricing = await db('pricing_configuration')
      .where({ id })
      .first();
    
    if (!existingPricing) {
      return res.status(404).json({ error: 'Pricing configuration not found' });
    }

    // Prepare update data
    const updateData = {
      updated_by: userId,
      updated_at: db.fn.now()
    };

    if (amount !== undefined) {
      updateData.amount = parseFloat(amount);
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    // Update pricing configuration
    await db('pricing_configuration')
      .where({ id })
      .update(updateData);

    const updatedPricing = await db('pricing_configuration')
      .where({ id })
      .first();

    res.json({
      message: 'Pricing configuration updated successfully',
      pricing: updatedPricing
    });
  } catch (error) {
    console.error('Error updating pricing configuration:', error);
    res.status(500).json({ error: 'Failed to update pricing configuration' });
  }
};

// Delete pricing configuration (Admin only)
exports.deletePricing = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if pricing configuration exists
    const existingPricing = await db('pricing_configuration')
      .where({ id })
      .first();
    
    if (!existingPricing) {
      return res.status(404).json({ error: 'Pricing configuration not found' });
    }

    // Delete pricing configuration
    await db('pricing_configuration')
      .where({ id })
      .del();

    res.json({ message: 'Pricing configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricing configuration:', error);
    res.status(500).json({ error: 'Failed to delete pricing configuration' });
  }
}; 