const db = require('./config/database.js');

async function testRecyclingCenterBookings() {
  try {
    console.log('🔍 Testing recycling center bookings directly...');
    
    // Get a recycling center user
    const user = await db('users')
      .where('role', 'recycling_center')
      .first();
    
    if (!user) {
      console.log('❌ No recycling center user found');
      return;
    }
    
    console.log('👤 Testing with user:', user.email, 'ID:', user.id);
    
    // Test the logic from getRecyclingCenterBookingsByCompany
    let company = await db('companies')
      .where('user_id', user.id)
      .where('type', 'recycling_center')
      .first();

    console.log('🏢 Company with user_id:', company);

    if (!company) {
      console.log('🔍 No recycling center company found with user_id, searching for any recycling center...');
      company = await db('companies')
        .where('type', 'recycling_center')
        .first();
      
      console.log('🏢 Found recycling center company without user_id:', company);
    }

    if (!company) {
      console.log('❌ No recycling center company found');
      return;
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

    console.log('📊 Found bookings:', bookings.length, 'for company_id:', company.id);
    
    if (bookings.length > 0) {
      bookings.forEach((b, i) => {
        console.log(`📋 Booking #${i+1}:`, {
          id: b.id,
          user_name: b.user_name,
          dropoff_date: b.dropoff_date,
          time_slot: b.time_slot,
          company_id: b.company_id
        });
      });
    } else {
      console.log('❌ No bookings found for this company');
      
      // Check if there are any bookings at all
      const allBookings = await db('recycling_center_bookings').select('*');
      console.log('📊 Total bookings in database:', allBookings.length);
      
      if (allBookings.length > 0) {
        console.log('📋 Sample bookings:');
        allBookings.slice(0, 3).forEach((b, i) => {
          console.log(`  Booking ${i+1}: company_id=${b.company_id}, user_id=${b.user_id}, date=${b.dropoff_date}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

testRecyclingCenterBookings(); 