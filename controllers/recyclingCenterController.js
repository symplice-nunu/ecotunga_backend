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

// Get user's total points from recycling bookings
exports.getUserPoints = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get total points from approved bookings where sorted_properly is true
    const result = await db('recycling_center_bookings')
      .where('user_id', user_id)
      .where('status', 'approved')
      .where('sorted_properly', true)
      .sum('points as total_points')
      .first();

    const totalPoints = result.total_points || 0;

    res.json({ 
      total_points: totalPoints
    });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ error: 'Failed to fetch user points' });
  }
};

// Get recycling center bookings by company (for recycling center owners)
exports.getRecyclingCenterBookingsByCompany = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_email = req.user.email;
    const user_role = req.user.role;
    
    console.log('[DEBUG] getRecyclingCenterBookingsByCompany called by user_id:', user_id, 'role:', user_role, 'email:', user_email);
    
    // Check if user has recycling_center role
    if (user_role !== 'recycling_center') {
      console.log('[DEBUG] User does not have recycling_center role');
      return res.status(403).json({ 
        error: 'Access denied. Only recycling center users can access this endpoint.',
        user_role: user_role
      });
    }
    
    // Find company by user's email
    const company = await db('companies')
      .where('email', user_email)
      .where('type', 'recycling_center')
      .first();

    console.log('[DEBUG] Company found by email:', company);

    if (!company) {
      console.log('[DEBUG] No recycling center company found for user email:', user_email);
      return res.status(404).json({ 
        error: 'No recycling center found for this user',
        user_email: user_email
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

    console.log('[DEBUG] Found bookings:', bookings.length, 'for company_id:', company.id);
    if (bookings.length > 0) {
      bookings.forEach((b, i) => {
        console.log(`[DEBUG] Booking #${i+1}:`, b);
      });
    }

    // Parse waste_types for each booking
    bookings.forEach(booking => {
      if (booking.waste_type) {
        try {
          if (typeof booking.waste_type === 'string') {
            booking.waste_types = JSON.parse(booking.waste_type);
          } else {
            booking.waste_types = booking.waste_type;
          }
          if (!Array.isArray(booking.waste_types)) {
            booking.waste_types = [booking.waste_types];
          }
        } catch (error) {
          console.error('Error parsing booking waste_type:', error);
          booking.waste_types = [booking.waste_type || 'other'];
        }
      } else {
        booking.waste_types = ['other'];
      }
    });

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

// Approve recycling center booking with pricing
exports.approveRecyclingCenterBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, notes, sorted_properly } = req.body;
    const user_id = req.user.id;
    const user_role = req.user.role;

    // Debug: Log the request body
    console.log('Approval request body:', req.body);
    console.log('sorted_properly value:', sorted_properly);

    // Check if user has recycling_center role
    if (user_role !== 'recycling_center') {
      return res.status(403).json({ 
        error: 'Access denied. Only recycling center users can approve bookings.',
        user_role: user_role
      });
    }

    // Get the booking with user and company details
    const booking = await db('recycling_center_bookings as rcb')
      .join('users as u', 'rcb.user_id', 'u.id')
      .join('companies as c', 'rcb.company_id', 'c.id')
      .where('rcb.id', id)
      .select(
        'rcb.*',
        'u.name as user_name',
        'u.last_name as user_last_name',
        'u.email as user_email',
        'c.name as company_name',
        'c.email as company_email'
      )
      .first();

    if (!booking) {
      return res.status(404).json({ error: 'Recycling center booking not found' });
    }

    // Validate price
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Valid price is required' });
    }

    // Calculate points based on sorted_properly
    const points = sorted_properly ? 5 : 0;

    // Update booking with approval details
    await db('recycling_center_bookings')
      .where('id', id)
      .update({
        status: 'approved',
        price: parseFloat(price),
        approval_notes: notes || null,
        approved_at: new Date(),
        approved_by: user_id,
        sorted_properly: sorted_properly || false,
        points: points
      });

    // Send confirmation email to user
    const emailService = require('../services/emailService');
    
    const emailData = {
      to: booking.user_email,
      subject: 'Your Recycling Booking Has Been Approved!',
      data: {
        userName: `${booking.user_name} ${booking.user_last_name}`,
        companyName: booking.company_name,
        bookingDate: new Date(booking.dropoff_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        bookingTime: booking.time_slot,
        location: `${booking.sector}, ${booking.district}`,
        price: parseFloat(price).toLocaleString('en-US', {
          style: 'currency',
          currency: 'RWF'
        }),
        notes: notes || 'No additional notes',
        bookingId: id,
        wasteTypes: booking.waste_types ? JSON.parse(booking.waste_types).join(', ') : 'Not specified',
        sortedProperly: sorted_properly || false,
        points: points
      }
    };

    // Debug: Log the email data
    console.log('Email data sortedProperly:', emailData.data.sortedProperly);
    console.log('Email data points:', emailData.data.points);

    try {
      await emailService.sendApprovalEmail(emailData);
      console.log('Approval confirmation email sent to:', booking.user_email);
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the approval if email fails
    }

    res.json({ 
      message: 'Recycling center booking approved successfully',
      bookingId: id,
      price: parseFloat(price),
      sorted_properly: sorted_properly || false,
      points: points,
      emailSent: true
    });
  } catch (error) {
    console.error('Error approving recycling center booking:', error);
    res.status(500).json({ error: 'Failed to approve recycling center booking' });
  }
};

// Confirm price for recycling center booking
exports.confirmRecyclingCenterBookingPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmed } = req.body;
    const user_id = req.user.id;

    // Get the booking to check if it exists and user has permission
    const booking = await db('recycling_center_bookings')
      .where('id', id)
      .first();

    if (!booking) {
      return res.status(404).json({ error: 'Recycling center booking not found' });
    }

    // Check if user has permission to confirm this booking
    if (booking.user_id !== user_id) {
      return res.status(403).json({ error: 'Access denied. You can only confirm your own bookings.' });
    }

    // Check if booking is approved
    if (booking.status !== 'approved') {
      return res.status(400).json({ error: 'Booking must be approved before price can be confirmed' });
    }

    // Update booking with confirmation
    await db('recycling_center_bookings')
      .where('id', id)
      .update({
        price_confirmed: confirmed,
        confirmed_at: confirmed ? new Date() : null
      });

    res.json({ 
      message: confirmed ? 'Price confirmed successfully' : 'Price confirmation cancelled',
      bookingId: id,
      price_confirmed: confirmed
    });
  } catch (error) {
    console.error('Error confirming recycling center booking price:', error);
    res.status(500).json({ error: 'Failed to confirm booking price' });
  }
};

// Confirm payment for recycling center booking
exports.confirmRecyclingCenterBookingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_confirmed } = req.body;
    const user_id = req.user.id;

    // Get the booking to check if it exists and user has permission
    const booking = await db('recycling_center_bookings')
      .where('id', id)
      .first();

    if (!booking) {
      return res.status(404).json({ error: 'Recycling center booking not found' });
    }

    // Check if user has permission to confirm payment for this booking
    if (booking.user_id !== user_id) {
      return res.status(403).json({ error: 'Access denied. You can only confirm payment for your own bookings.' });
    }

    // Check if booking is approved and price is confirmed
    if (booking.status !== 'approved') {
      return res.status(400).json({ error: 'Booking must be approved before payment can be confirmed' });
    }

    if (!booking.price_confirmed) {
      return res.status(400).json({ error: 'Price must be confirmed before payment can be confirmed' });
    }

    // Update booking with payment confirmation
    await db('recycling_center_bookings')
      .where('id', id)
      .update({
        payment_confirmed: payment_confirmed,
        payment_confirmed_at: payment_confirmed ? new Date() : null
      });

    res.json({ 
      message: payment_confirmed ? 'Payment confirmed successfully' : 'Payment confirmation cancelled',
      bookingId: id,
      payment_confirmed: payment_confirmed
    });
  } catch (error) {
    console.error('Error confirming recycling center booking payment:', error);
    res.status(500).json({ error: 'Failed to confirm booking payment' });
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