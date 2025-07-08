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
      waste_type,
      waste_types
    } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!company_id || !dropoff_date || !time_slot || !district || !sector || !cell) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['company_id', 'dropoff_date', 'time_slot', 'district', 'sector', 'cell']
      });
    }


    
    // Handle waste types - support both single waste_type and multiple waste_types
    let finalWasteType = waste_type;
    let finalWasteTypes = waste_types;
    
    // If waste_types is provided, use it; otherwise fall back to single waste_type
    if (finalWasteTypes) {
      try {
        // If waste_types is a string, parse it
        if (typeof finalWasteTypes === 'string') {
          finalWasteTypes = JSON.parse(finalWasteTypes);
        }
        // Ensure it's an array
        if (!Array.isArray(finalWasteTypes)) {
          finalWasteTypes = [finalWasteTypes];
        }
        // Set the first waste type as the primary waste_type for backward compatibility
        finalWasteType = finalWasteTypes.length > 0 ? finalWasteTypes[0] : 'other';
      } catch (error) {
        console.error('Error parsing waste_types:', error);
        finalWasteType = 'other';
        finalWasteTypes = ['other'];
      }
    } else if (!finalWasteType) {
      // If no waste_type is provided, get the first available waste type from the company
      const company = await db('companies')
        .where('id', company_id)
        .where('type', 'recycling_center')
        .first();
      
      if (company && company.waste_types) {
        try {
          const companyWasteTypes = typeof company.waste_types === 'string' 
            ? JSON.parse(company.waste_types) 
            : company.waste_types;
          finalWasteType = companyWasteTypes.length > 0 ? companyWasteTypes[0] : 'other';
          finalWasteTypes = companyWasteTypes.length > 0 ? companyWasteTypes : ['other'];
        } catch (error) {
          console.error('Error parsing company waste types:', error);
          finalWasteType = 'other';
          finalWasteTypes = ['other'];
        }
      } else {
        finalWasteType = 'other';
        finalWasteTypes = ['other'];
      }
    } else {
      // If only waste_type is provided, use it as the single waste type
      finalWasteTypes = [finalWasteType];
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
      waste_type: JSON.stringify(finalWasteTypes)
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

    // Parse waste_type if it exists (now contains JSON array of waste types)
    if (booking && booking.waste_type) {
      try {
        // MySQL automatically parses JSON, so it might already be an array
        if (typeof booking.waste_type === 'string') {
          booking.waste_types = JSON.parse(booking.waste_type);
        } else {
          booking.waste_types = booking.waste_type;
        }
        // Ensure it's an array
        if (!Array.isArray(booking.waste_types)) {
          booking.waste_types = [booking.waste_types];
        }
      } catch (error) {
        console.error('Error parsing booking waste_type:', error);
        booking.waste_types = ['other'];
      }
    } else {
      booking.waste_types = ['other'];
    }
    


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

    // Parse waste_types for each booking
    bookings.forEach(booking => {
      if (booking.waste_types) {
        try {
          // MySQL automatically parses JSON, so it might already be an array
          if (typeof booking.waste_types === 'string') {
            booking.waste_types = JSON.parse(booking.waste_types);
          }
          // Ensure it's an array
          if (!Array.isArray(booking.waste_types)) {
            booking.waste_types = [booking.waste_types];
          }
        } catch (error) {
          console.error('Error parsing booking waste_types:', error);
          booking.waste_types = [booking.waste_type || 'other'];
        }
      }
    });

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

    // Parse waste_types for each booking
    bookings.forEach(booking => {
      if (booking.waste_types) {
        try {
          // MySQL automatically parses JSON, so it might already be an array
          if (typeof booking.waste_types === 'string') {
            booking.waste_types = JSON.parse(booking.waste_types);
          }
          // Ensure it's an array
          if (!Array.isArray(booking.waste_types)) {
            booking.waste_types = [booking.waste_types];
          }
        } catch (error) {
          console.error('Error parsing booking waste_types:', error);
          booking.waste_types = [booking.waste_type || 'other'];
        }
      }
    });

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

    // Parse waste_types for each booking
    bookings.forEach(booking => {
      if (booking.waste_types) {
        try {
          // MySQL automatically parses JSON, so it might already be an array
          if (typeof booking.waste_types === 'string') {
            booking.waste_types = JSON.parse(booking.waste_types);
          }
          // Ensure it's an array
          if (!Array.isArray(booking.waste_types)) {
            booking.waste_types = [booking.waste_types];
          }
        } catch (error) {
          console.error('Error parsing booking waste_types:', error);
          booking.waste_types = [booking.waste_type || 'other'];
        }
      }
    });

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

    // Parse waste_types if it exists
    if (booking.waste_types) {
      try {
        // MySQL automatically parses JSON, so it might already be an array
        if (typeof booking.waste_types === 'string') {
          booking.waste_types = JSON.parse(booking.waste_types);
        }
        // Ensure it's an array
        if (!Array.isArray(booking.waste_types)) {
          booking.waste_types = [booking.waste_types];
        }
      } catch (error) {
        console.error('Error parsing booking waste_types:', error);
        booking.waste_types = [booking.waste_type || 'other'];
      }
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

// Cancel recycling center booking
exports.cancelRecyclingCenterBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get the booking to check if it exists and user has permission
    const booking = await db('recycling_center_bookings')
      .where('id', id)
      .first();

    if (!booking) {
      return res.status(404).json({ error: 'Recycling center booking not found' });
    }

    // Check if user has permission to cancel this booking
    if (booking.user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You can only cancel your own bookings.' });
    }

    // Check if booking is in the future (can't cancel past bookings)
    const bookingDate = new Date(booking.dropoff_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({ error: 'Cannot cancel past bookings' });
    }

    // Delete the booking
    await db('recycling_center_bookings')
      .where('id', id)
      .del();

    res.json({ 
      message: 'Recycling center booking cancelled successfully',
      bookingId: id
    });
  } catch (error) {
    console.error('Error cancelling recycling center booking:', error);
    res.status(500).json({ error: 'Failed to cancel recycling center booking' });
  }
}; 