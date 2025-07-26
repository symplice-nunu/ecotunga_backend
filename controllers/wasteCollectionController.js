const db = require('../config/db');
const { sendBookingConfirmationEmail, sendApprovalNotificationEmail, sendDenialNotificationEmail } = require('../services/emailService');

// Debug function to check database structure
exports.debugDatabaseStructure = async (req, res) => {
  try {
    console.log('🔍 Debug: Checking database structure...');
    
    // Test database connection
    const connectionTest = await db.raw('SELECT 1 as test');
    console.log('✅ Database connection test:', connectionTest[0]);
    
    // Check if tables exist
    const tables = await db.raw('SHOW TABLES');
    console.log('📋 Available tables:', tables[0]);
    
    // Check waste_collection table structure
    const wasteCollectionColumns = await db.raw('DESCRIBE waste_collection');
    console.log('📊 waste_collection table structure:', wasteCollectionColumns[0]);
    
    // Check users table structure
    const usersColumns = await db.raw('DESCRIBE users');
    console.log('👤 users table structure:', usersColumns[0]);
    
    // Check companies table structure
    const companiesColumns = await db.raw('DESCRIBE companies');
    console.log('🏢 companies table structure:', companiesColumns[0]);
    
    // Count records in each table
    const wasteCollectionCount = await db('waste_collection').count('* as count');
    const usersCount = await db('users').count('* as count');
    const companiesCount = await db('companies').count('* as count');
    
    console.log('📊 Record counts:', {
      waste_collection: wasteCollectionCount[0].count,
      users: usersCount[0].count,
      companies: companiesCount[0].count
    });
    
    res.json({
      message: 'Database structure debug completed',
      connection: 'OK',
      tables: tables[0],
      wasteCollectionColumns: wasteCollectionColumns[0],
      usersColumns: usersColumns[0],
      companiesColumns: companiesColumns[0],
      recordCounts: {
        waste_collection: wasteCollectionCount[0].count,
        users: usersCount[0].count,
        companies: companiesCount[0].count
      }
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      error: 'Debug failed',
      message: error.message,
      stack: error.stack
    });
  }
};

// Store waste collection data
exports.createWasteCollection = async (req, res) => {
  try {
    const {
      name, last_name, gender, email, phone_number, ubudehe_category, house_number, district, sector, cell, street, company_id, pickup_date, time_slot,
      notes
    } = req.body;
    const user_id = req.user.id;
    const insertData = {
      user_id,name,last_name,gender,email,phone_number,ubudehe_category,house_number,district,sector,cell,street,company_id,pickup_date,time_slot,
      notes
    };

    const [id] = await db('waste_collection').insert(insertData);
    let companyInfo = {};
    if (company_id) {
      try {
        const company = await db('companies')
          .where('id', company_id)
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
        console.error('Error fetching company info for email:', companyError);
      }
    }
    const bookingData = {
      id,name,last_name,gender,email,phone_number,ubudehe_category,house_number,district,sector,cell,street,pickup_date,time_slot,notes,
      ...companyInfo
    };
    try {
      const emailResult = await sendBookingConfirmationEmail(bookingData);
      if (emailResult.success) {
      } else {
      }
    } catch (emailError) {
    }
    res.status(201).json({ 
      id,
      message: 'Waste collection booking created successfully. Confirmation email sent.',
      emailSent: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create waste collection record' });
  }
};

// Get waste collections for the logged-in user
exports.getUserWasteCollections = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // console.log('🔍 getUserWasteCollections called for user:', user_id);
    
    // First, let's check if the user exists and get their details
    const user = await db('users').where('id', user_id).select('id', 'email', 'role').first();
    // console.log('👤 User details:', user);
    
    // Check if there are any waste collections at all
    const allCollections = await db('waste_collection').select('id', 'user_id', 'name', 'email', 'status');
    // console.log('📊 All waste collections in database:', allCollections);
    
    // Check collections for this specific user
    const userCollections = allCollections.filter(c => c.user_id === user_id);
    // console.log('📊 Collections for this user:', userCollections);
    
    const collections = await db('waste_collection')
      .leftJoin('companies', 'waste_collection.company_id', 'companies.id')
      .where('waste_collection.user_id', user_id)
      .select(
        'waste_collection.*',
        'companies.name as company_name',
        'companies.email as company_email',
        'companies.phone as company_phone',
        'companies.district as company_district',
        'companies.sector as company_sector',
        'companies.cell as company_cell',
        'companies.village as company_village',
        'companies.street as company_street'
      )
      .orderBy('waste_collection.created_at', 'desc');

    console.log('🔍 getUserWasteCollections - Sending response with', collections.length, 'collections');
    if (collections.length > 0) {
      console.log('🔍 First collection company fields:', {
        company_name: collections[0].company_name,
        company_street: collections[0].company_street,
        company_village: collections[0].company_village,
        company_cell: collections[0].company_cell,
        company_sector: collections[0].company_sector,
        company_district: collections[0].company_district
      });
    }

    res.json(collections);
  } catch (error) {
    console.error('❌ Error in getUserWasteCollections:', error);
    res.status(500).json({ error: 'Failed to fetch waste collections' });
  }
};

// Get waste collections by company_id (for waste collectors)
exports.getWasteCollectionsByCompany = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // console.log('🔍 getWasteCollectionsByCompany called for user:', user_id);
    
    // Step 1: Get the user's email and role from the database
    const user = await db('users').where('id', user_id).select('email', 'role').first();
    
    if (!user) {
      // console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // console.log('👤 User email:', user.email);
    // console.log('👤 User role:', user.role);
    
    // Step 2: Check if user is a waste collector
    if (user.role !== 'waste_collector') {
      // console.log('❌ User is not a waste collector');
      return res.status(403).json({ error: 'Access denied. Only waste collectors can access this endpoint.' });
    }
    
    // Step 3: First, let's check if the type column exists and what companies are available
    try {
      const allCompanies = await db('companies').select('id', 'name', 'email', 'type');
      // console.log('🏢 All companies in database:', allCompanies);
      
      // Check if any companies have the type column
      const companiesWithType = allCompanies.filter(c => c.hasOwnProperty('type'));
      // console.log('🏢 Companies with type column:', companiesWithType);
      
      // Check if any companies match the user's email
      const companiesWithMatchingEmail = allCompanies.filter(c => c.email === user.email);
      // console.log('🏢 Companies with matching email:', companiesWithMatchingEmail);
      
    } catch (schemaError) {
      // console.log('⚠️ Schema error when checking companies:', schemaError.message);
    }
    
    // Step 4: Try to get the company record for this waste collector
    let userCompany;
    
    try {
      // First try with type filter
      userCompany = await db('companies')
        .where('email', user.email)
        .where('type', 'waste_collector')
        .first();
      
      // console.log('🏢 Company found with type filter:', userCompany);
      
      // If not found, try without type filter (in case type column doesn't exist)
      if (!userCompany) {
        // console.log('🔍 Trying without type filter...');
        userCompany = await db('companies')
          .where('email', user.email)
          .first();
        
        // console.log('🏢 Company found without type filter:', userCompany);
      }
      
    } catch (companyError) {
      // console.log('⚠️ Error when querying companies:', companyError.message);
      
      // If there's an error, try a simpler query
      try {
        userCompany = await db('companies')
          .where('email', user.email)
          .first();
        
        // console.log('🏢 Company found with simple query:', userCompany);
      } catch (simpleError) {
        // console.log('❌ Error with simple company query:', simpleError.message);
      }
    }
    
    if (!userCompany) {
      // console.log('❌ No company found for waste collector with email:', user.email);
      
      // Let's check what companies exist
      try {
        const allCompanies = await db('companies').select('id', 'name', 'email');
        // console.log('🏢 Available companies:', allCompanies);
      } catch (e) {
        // console.log('❌ Could not fetch companies:', e.message);
      }
      
      return res.status(404).json({ 
        error: 'Company not found for this waste collector',
        details: `No company found with email: ${user.email}`,
        userEmail: user.email,
        userRole: user.role
      });
    }
    
    // console.log('✅ Company found - ID:', userCompany.id, 'Name:', userCompany.name, 'Email:', userCompany.email);
    
    // Step 5: Check if there are any waste collections at all
    try {
      const allCollections = await db('waste_collection').select('id', 'company_id', 'name', 'email', 'status');
      // console.log('📊 All waste collections in database:', allCollections);
      
      const collectionsForCompany = allCollections.filter(c => c.company_id === userCompany.id);
      // console.log('📊 Collections for this company:', collectionsForCompany);
      
    } catch (collectionsError) {
      // console.log('⚠️ Error when checking all collections:', collectionsError.message);
    }
    
    // Step 6: Get waste collections where the company_id matches the waste collector's company
    const collections = await db('waste_collection')
      .leftJoin('companies', 'waste_collection.company_id', 'companies.id')
      .where('waste_collection.company_id', userCompany.id)
      .select(
        'waste_collection.*',
        'companies.name as company_name',
        'companies.email as company_email',
        'companies.phone as company_phone',
        'companies.district as company_district',
        'companies.sector as company_sector',
        'companies.cell as company_cell',
        'companies.village as company_village',
        'companies.street as company_street'
      )
      .orderBy('waste_collection.created_at', 'desc');

    // console.log('📊 Found collections:', collections.length);
    // console.log('📊 Collections data:', collections.map(c => ({
    //   id: c.id,
    //   customer_name: c.name,
    //   customer_email: c.email,
    //   status: c.status,
    //   pickup_date: c.pickup_date,
    //   company_id: c.company_id
    // })));

    res.json(collections);
  } catch (error) {
    console.error('❌ Error in getWasteCollectionsByCompany:', error);
    res.status(500).json({ 
      error: 'Failed to fetch waste collections for company',
      details: error.message,
      stack: error.stack
    });
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
              .select('name', 'email', 'phone', 'district', 'sector', 'cell', 'village', 'street')
              .first();
            
            if (company) {
              companyInfo = {
                company_name: company.name,
                company_email: company.email,
                company_phone: company.phone,
                company_district: company.district,
                company_sector: company.sector,
                company_cell: company.cell,
                company_village: company.village,
                company_street: company.street
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

    console.log('🔍 getAllWasteCollections - Sending response with', collectionsWithCompanyInfo.length, 'collections');
    if (collectionsWithCompanyInfo.length > 0) {
      console.log('🔍 First collection company fields:', {
        company_name: collectionsWithCompanyInfo[0].company_name,
        company_street: collectionsWithCompanyInfo[0].company_street,
        company_village: collectionsWithCompanyInfo[0].company_village,
        company_cell: collectionsWithCompanyInfo[0].company_cell,
        company_sector: collectionsWithCompanyInfo[0].company_sector,
        company_district: collectionsWithCompanyInfo[0].company_district
      });
    }

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

    // Get the waste collection details before updating
    const wasteCollection = await db('waste_collection')
      .leftJoin('companies', 'waste_collection.company_id', 'companies.id')
      .where('waste_collection.id', id)
      .select(
        'waste_collection.*',
        'companies.name as company_name',
        'companies.email as company_email',
        'companies.phone as company_phone'
      )
      .first();

    if (!wasteCollection) {
      return res.status(404).json({ error: 'Waste collection not found' });
    }

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

    // Send approval notification email
    try {
      const emailResult = await sendApprovalNotificationEmail(wasteCollection);
      if (emailResult.success) {
        console.log('✅ Approval notification email sent successfully');
      } else {
        console.error('❌ Failed to send approval notification email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending approval notification email:', emailError);
    }

    // Send payment confirmation request email to user
    console.log('🔄 Starting payment confirmation email process...');
    try {
      const { email, id, name, last_name, pickup_date, time_slot, price, district, sector, cell, street } = wasteCollection;
      console.log('📋 Extracted waste collection data:', { email, id, name, last_name, pickup_date, time_slot, price, district, sector, cell, street });
      
      const paymentEmailData = {
        to: email,
        subject: `Please Confirm Your Payment Intent for Waste Collection #${id}`,
        data: {
          userName: name + (last_name ? ' ' + last_name : ''),
          bookingId: id,
          bookingDate: pickup_date,
          bookingTime: time_slot,
          price: price || '5000 RWF', // Default price if not set
          district: district,
          sector: sector,
          cell: cell,
          street: street
        }
      };
      console.log('📧 Prepared payment email data:', paymentEmailData);
      
      const paymentEmailResult = await require('../services/emailService').sendWasteCollectionPaymentEmail(paymentEmailData);
      if (paymentEmailResult.success) {
        console.log('✅ Payment confirmation request email sent successfully');
        console.log('📨 Message ID:', paymentEmailResult.messageId);
      } else {
        console.error('❌ Failed to send payment confirmation request email:', paymentEmailResult.error);
      }
    } catch (paymentEmailError) {
      console.error('❌ Error sending payment confirmation request email:', paymentEmailError);
      console.error('🚨 Stack trace:', paymentEmailError.stack);
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

    // Get the waste collection details before updating
    const wasteCollection = await db('waste_collection')
      .leftJoin('companies', 'waste_collection.company_id', 'companies.id')
      .where('waste_collection.id', id)
      .select(
        'waste_collection.*',
        'companies.name as company_name',
        'companies.email as company_email',
        'companies.phone as company_phone'
      )
      .first();

    if (!wasteCollection) {
      return res.status(404).json({ error: 'Waste collection not found' });
    }

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

    // Send denial notification email
    try {
      const emailResult = await sendDenialNotificationEmail(wasteCollection);
      if (emailResult.success) {
        console.log('✅ Denial notification email sent successfully');
      } else {
        console.error('❌ Failed to send denial notification email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending denial notification email:', emailError);
    }

    res.json({ message: 'Waste collection denied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to deny waste collection' });
  }
};

// Complete waste collection request
exports.completeWasteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    const admin_id = req.user.id;

    const updated = await db('waste_collection')
      .where('id', id)
      .update({
        status: 'completed',
        admin_notes: admin_notes || null,
        status_updated_at: db.fn.now()
      });

    if (updated === 0) {
      return res.status(404).json({ error: 'Waste collection not found' });
    }

    res.json({ message: 'Waste collection completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete waste collection' });
  }
};

// Cancel waste collection request
exports.cancelWasteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    console.log('🔍 cancelWasteCollection called with:', { id, user_id, userRole: req.user.role });

    // Check if the waste collection exists and belongs to the user
    const collection = await db('waste_collection')
      .where('id', id)
      .first();

    console.log('🔍 Found collection:', collection);

    if (!collection) {
      console.log('❌ Collection not found');
      return res.status(404).json({ error: 'Waste collection not found' });
    }

    // Check if the user owns this collection or is an admin
    console.log('🔍 Checking permissions:', { 
      collectionUserId: collection.user_id, 
      currentUserId: user_id, 
      userRole: req.user.role 
    });
    
    if (collection.user_id !== user_id && req.user.role !== 'admin') {
      console.log('❌ Permission denied');
      return res.status(403).json({ error: 'You do not have permission to cancel this waste collection' });
    }

    // Check if the collection can be cancelled (only pending or approved collections)
    console.log('🔍 Checking collection status:', collection.status);
    if (collection.status === 'completed' || collection.status === 'denied' || collection.status === 'cancelled') {
      console.log('❌ Collection cannot be cancelled due to status:', collection.status);
      return res.status(400).json({ error: 'This waste collection cannot be cancelled' });
    }

    console.log('🔍 Updating collection status to cancelled...');
    const updated = await db('waste_collection')
      .where('id', id)
      .update({
        status: 'cancelled',
        status_updated_at: db.fn.now()
      });

    console.log('🔍 Update result:', updated);

    if (updated === 0) {
      console.log('❌ No rows updated');
      return res.status(404).json({ error: 'Waste collection not found' });
    }

    console.log('✅ Collection cancelled successfully');
    res.json({ message: 'Waste collection cancelled successfully' });
  } catch (error) {
    console.error('❌ Error in cancelWasteCollection:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ error: 'Failed to cancel waste collection' });
  }
};

// Get next waste pickup for the logged-in user
exports.getNextWastePickup = async (req, res) => {
  try {
    const user_id = req.user.id;
    const currentDate = new Date();
    
    console.log('getNextWastePickup called for user:', user_id);
    console.log('Current date:', currentDate.toISOString().split('T')[0]);
    
    // First, let's check if the user has any waste collections at all
    const allUserCollections = await db('waste_collection')
      .where('waste_collection.user_id', user_id)
      .select('*');
    
    console.log('All user collections:', allUserCollections);
    
    // Get the next scheduled pickup for this user
    const nextPickup = await db('waste_collection')
      .leftJoin('companies', 'waste_collection.company_id', 'companies.id')
      .where('waste_collection.user_id', user_id)
      .where('waste_collection.pickup_date', '>=', currentDate.toISOString().split('T')[0])
      .where('waste_collection.status', 'approved')
      .select(
        'waste_collection.pickup_date',
        'waste_collection.time_slot',
        'waste_collection.street',
        'waste_collection.sector',
        'waste_collection.district',
        'companies.name as company_name'
      )
      .orderBy('waste_collection.pickup_date', 'asc')
      .first();

    console.log('Query result:', nextPickup);

    if (!nextPickup) {
      console.log('No upcoming pickup found');
      return res.json({
        hasUpcoming: false,
        message: 'No upcoming waste pickup scheduled'
      });
    }

    // Format the pickup date
    const pickupDate = new Date(nextPickup.pickup_date);
    const formattedDate = pickupDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const response = {
      hasUpcoming: true,
      pickup: {
        date: formattedDate,
        time: nextPickup.time_slot || '8:00 AM – 10:00 AM',
        location: nextPickup.street || 'Address not specified',
        sector: nextPickup.sector,
        district: nextPickup.district,
        company: nextPickup.company_name
      }
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error in getNextWastePickup:', error);
    res.status(500).json({ error: 'Failed to fetch next waste pickup' });
  }
};

// Debug endpoint to check database structure
exports.debugDatabaseStructure = async (req, res) => {
  try {
    console.log('🔍 Debug endpoint called');
    
    // Check users table
    const users = await db('users').select('id', 'email', 'role').limit(5);
    console.log('👤 Sample users:', users);
    
    // Check companies table structure
    const companies = await db('companies').select('*').limit(5);
    console.log('🏢 Sample companies:', companies);
    
    // Check waste_collection table structure
    const wasteCollections = await db('waste_collection').select('*').limit(5);
    console.log('📊 Sample waste collections:', wasteCollections);
    
    res.json({
      users: users,
      companies: companies,
      wasteCollections: wasteCollections,
      message: 'Database structure debug info'
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ 
      error: 'Debug failed',
      details: error.message,
      stack: error.stack
    });
  }
}; 