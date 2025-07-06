const db = require('../config/db');

// Create receipt
exports.createReceipt = async (req, res) => {
  try {
    const {
      waste_collection_id,
      booking_id,
      customer_name,
      email,
      phone,
      company,
      pickup_date,
      time_slot,
      location,
      amount,
      payment_method,
      payment_status,
      transaction_date,
      receipt_data
    } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!waste_collection_id || !booking_id || !customer_name || !email || !phone || !company || !pickup_date || !time_slot || !location || !amount || !payment_method || !payment_status || !transaction_date) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['waste_collection_id', 'booking_id', 'customer_name', 'email', 'phone', 'company', 'pickup_date', 'time_slot', 'location', 'amount', 'payment_method', 'payment_status', 'transaction_date']
      });
    }

    const insertData = {
      user_id,
      waste_collection_id,
      booking_id,
      customer_name,
      email,
      phone,
      company,
      pickup_date,
      time_slot,
      location,
      amount,
      payment_method,
      payment_status,
      transaction_date,
      receipt_data: receipt_data ? JSON.stringify(receipt_data) : null
    };

    const [id] = await db('receipts').insert(insertData);

    // Get the created receipt
    const receipt = await db('receipts')
      .where('id', id)
      .first();

    res.status(201).json({ 
      id,
      message: 'Receipt created successfully',
      receipt
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ error: 'Failed to create receipt' });
  }
};

// Get user's receipts
exports.getUserReceipts = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const receipts = await db('receipts')
      .where('user_id', user_id)
      .orderBy('created_at', 'desc');

    res.json({ receipts });
  } catch (error) {
    console.error('Error fetching user receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
};

// Get receipt by ID
exports.getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const receipt = await db('receipts')
      .where('id', id)
      .first();

    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    // Check if user has permission to view this receipt
    if (receipt.user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ receipt });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
};

// Get all receipts (for admin users)
exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await db('receipts')
      .join('users', 'receipts.user_id', 'users.id')
      .select(
        'receipts.*',
        'users.name as user_name',
        'users.last_name as user_last_name',
        'users.email as user_email'
      )
      .orderBy('receipts.created_at', 'desc');

    res.json({ receipts });
  } catch (error) {
    console.error('Error fetching all receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
};

// Get receipts by waste collection ID
exports.getReceiptsByWasteCollectionId = async (req, res) => {
  try {
    const { waste_collection_id } = req.params;
    const user_id = req.user.id;

    const receipts = await db('receipts')
      .where('waste_collection_id', waste_collection_id)
      .where('user_id', user_id)
      .orderBy('created_at', 'desc');

    res.json({ receipts });
  } catch (error) {
    console.error('Error fetching receipts by waste collection ID:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
}; 