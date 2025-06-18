const db = require('../config/db');

// Store waste collection data
exports.createWasteCollection = async (req, res) => {
  try {
    const {
      name,
      last_name,
      gender,
      email,
      phone_number,
      ubudehe_category,
      district,
      sector,
      cell,
      village,
      street,
      company_id,
      pickup_date,
      time_slot,
      notes
    } = req.body;
    const user_id = req.user.id;

    const [id] = await db('waste_collection').insert({
      user_id,
      name,
      last_name,
      gender,
      email,
      phone_number,
      ubudehe_category,
      district,
      sector,
      cell,
      village,
      street,
      company_id,
      pickup_date,
      time_slot,
      notes
    });

    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create waste collection record' });
  }
};

// Get waste collections for the logged-in user
exports.getUserWasteCollections = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const collections = await db('waste_collection')
      .leftJoin('companies', 'waste_collection.company_id', 'companies.id')
      .where('waste_collection.user_id', user_id)
      .select(
        'waste_collection.*',
        'companies.name as company_name',
        'companies.email as company_email',
        'companies.phone as company_phone'
      )
      .orderBy('waste_collection.created_at', 'desc');

    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch waste collections' });
  }
};

// Get all waste collections (admin only)
exports.getAllWasteCollections = async (req, res) => {
  try {
    // First get all waste collections
    const collections = await db('waste_collection')
      .select('*')
      .orderBy('created_at', 'desc');

    // Then get company information for each collection
    const collectionsWithCompanyInfo = await Promise.all(
      collections.map(async (collection) => {
        let companyInfo = {};
        
        if (collection.company_id) {
          try {
            const company = await db('companies')
              .where('id', collection.company_id)
              .select('name', 'email', 'phone')
              .first();
            
            if (company) {
              companyInfo = {
                company_name: company.name,
                company_email: company.email,
                company_phone: company.phone
              };
            }
          } catch (companyError) {
            console.error('Error fetching company info:', companyError);
            companyInfo = {
              company_name: 'Unknown Company',
              company_email: null,
              company_phone: null
            };
          }
        }

        return {
          ...collection,
          ...companyInfo,
          user_name: collection.name, // Use the name from waste_collection
          user_email: collection.email // Use the email from waste_collection
        };
      })
    );

    res.json(collectionsWithCompanyInfo);
  } catch (error) {
    console.error('Error in getAllWasteCollections:', error);
    res.status(500).json({ 
      error: 'Failed to fetch waste collections',
      details: error.message 
    });
  }
};

// Approve waste collection request
exports.approveWasteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    const admin_id = req.user.id;

    const updated = await db('waste_collection')
      .where('id', id)
      .update({
        status: 'approved',
        admin_notes: admin_notes || null,
        status_updated_at: db.fn.now()
      });

    if (updated === 0) {
      return res.status(404).json({ error: 'Waste collection not found' });
    }

    res.json({ message: 'Waste collection approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve waste collection' });
  }
};

// Deny waste collection request
exports.denyWasteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    const admin_id = req.user.id;

    const updated = await db('waste_collection')
      .where('id', id)
      .update({
        status: 'denied',
        admin_notes: admin_notes || null,
        status_updated_at: db.fn.now()
      });

    if (updated === 0) {
      return res.status(404).json({ error: 'Waste collection not found' });
    }

    res.json({ message: 'Waste collection denied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to deny waste collection' });
  }
}; 