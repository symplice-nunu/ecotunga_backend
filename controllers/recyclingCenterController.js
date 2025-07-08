const db = require('../config/db');

// Create recycling center booking
exports.createRecyclingCenterBooking = async (req, res) => {
  try {
    const {
      company_id,
      dropoff_date,
      time_slot,
      notes,
      district,
      sector,
      cell,
      street,
      waste_type
    } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!company_id || !dropoff_date || !time_slot || !district || !sector || !cell) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['company_id', 'dropoff_date', 'time_slot', 'district', 'sector', 'cell']
      });
    }

    // If no waste_type is provided, get the first available waste type from the company
    let finalWasteType = waste_type;
    if (!finalWasteType) {
      const company = await db('companies')
        .where('id', company_id)
        .where('type', 'recycling_center')
        .first();
      
      if (company && company.waste_types) {
        try {
          const wasteTypes = typeof company.waste_types === 'string' 
            ? JSON.parse(company.waste_types) 
            : company.waste_types;
          finalWasteType = wasteTypes.length > 0 ? wasteTypes[0] : 'other';
        } catch (error) {
          console.error('Error parsing company waste types:', error);
          finalWasteType = 'other';
        }
      } else {
        finalWasteType = 'other';
      }
    }

    // Check if company exists and is a recycling center
    const company = await db('companies')
      .where('id', company_id)
      .where('type', 'recycling_center')
      .first();

    if (!company) {
      return res.status(404).json({ 
        error: 'Recycling center not found or invalid company type' 
      });
    }

    const insertData = {
      user_id,
      company_id,
      dropoff_date,
      time_slot,
      notes: notes || null,
      district,
      sector,
      cell,
      street: street || null,
      waste_type: finalWasteType
    };

    const [id] = await db('recycling_center_bookings').insert(insertData);

    // Get the created booking with company details
    const booking = await db('recycling_center_bookings as rcb')
      .join('companies as c', 'rcb.company_id', 'c.id')
      .join('users as u', 'rcb.user_id', 'u.id')
      .where('rcb.id', id)
      .select(
        'rcb.*',
        'c.name as company_name',
        'c.email as company_email',
        'c.phone as company_phone',
        'u.name as user_name',
        'u.last_name as user_last_name',
        'u.email as user_email'
      )
      .first();

    res.status(201).json({ 
      id,
      message: 'Recycling center booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating recycling center booking:', error);
    res.status(500).json({ error: 'Failed to create recycling center booking' });
  }
};

// Get user's recycling center bookings
exports.getUserRecyclingCenterBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const bookings = await db('recycling_center_bookings as rcb')
      .join('companies as c', 'rcb.company_id', 'c.id')
      .where('rcb.user_id', user_id)
      .select(
        'rcb.*',
        'c.name as company_name',
        'c.email as company_email',
        'c.phone as company_phone'
      )
      .orderBy('rcb.dropoff_date', 'desc');

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching user recycling center bookings:', error);
    res.status(500).json({ error: 'Failed to fetch recycling center bookings' });
  }
};

// Get recycling center bookings by company (for recycling center owners)
exports.getRecyclingCenterBookingsByCompany = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log('Fetching bookings for user:', user_id);
    
    // Get the company owned by the current user
    const company = await db('companies')
      .where('user_id', user_id)
      .where('type', 'recycling_center')
      .first();

    console.log('Found company:', company);

    if (!company) {
      console.log('No recycling center company found for user:', user_id);
      return res.status(404).json({ 
        error: 'No recycling center found for this user',
        user_id: user_id
      });
    }

    const bookings = await db('recycling_center_bookings as rcb')
      .join('users as u', 'rcb.user_id', 'u.id')
      .where('rcb.company_id', company.id)
      .select(
        'rcb.*',
        'u.name as user_name',
        'u.last_name as user_last_name',
        'u.email as user_email',
        'u.phone_number as user_phone'
      )
      .orderBy('rcb.dropoff_date', 'desc');

    console.log('Found bookings:', bookings.length);
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching company recycling center bookings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recycling center bookings',
      details: error.message
    });
  }
};

// Get all recycling center bookings (for admin users)
exports.getAllRecyclingCenterBookings = async (req, res) => {
  try {
    const bookings = await db('recycling_center_bookings as rcb')
      .join('companies as c', 'rcb.company_id', 'c.id')
      .join('users as u', 'rcb.user_id', 'u.id')
      .select(
        'rcb.*',
        'c.name as company_name',
        'c.email as company_email',
        'c.phone as company_phone',
        'u.name as user_name',
        'u.last_name as user_last_name',
        'u.email as user_email',
        'u.phone_number as user_phone'
      )
      .orderBy('rcb.dropoff_date', 'desc');

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching all recycling center bookings:', error);
    res.status(500).json({ error: 'Failed to fetch recycling center bookings' });
  }
};

// Get recycling center booking by ID
exports.getRecyclingCenterBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const booking = await db('recycling_center_bookings as rcb')
      .join('companies as c', 'rcb.company_id', 'c.id')
      .join('users as u', 'rcb.user_id', 'u.id')
      .where('rcb.id', id)
      .select(
        'rcb.*',
        'c.name as company_name',
        'c.email as company_email',
        'c.phone as company_phone',
        'u.name as user_name',
        'u.last_name as user_last_name',
        'u.email as user_email',
        'u.phone_number as user_phone'
      )
      .first();

    if (!booking) {
      return res.status(404).json({ error: 'Recycling center booking not found' });
    }

    // Check if user has permission to view this booking
    if (booking.user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching recycling center booking:', error);
    res.status(500).json({ error: 'Failed to fetch recycling center booking' });
  }
}; 