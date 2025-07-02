const db = require('./config/db');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if recycling center user exists
    const recyclingUser = await db('users')
      .where('role', 'recycling_center')
      .first();
    
    console.log('Recycling center user:', recyclingUser);
    
    // Test 2: Check if recycling center company exists
    const recyclingCompany = await db('companies')
      .where('type', 'recycling_center')
      .first();
    
    console.log('Recycling center company:', recyclingCompany);
    
    // Test 3: Check if company is associated with user
    if (recyclingUser && recyclingCompany) {
      const associatedCompany = await db('companies')
        .where('user_id', recyclingUser.id)
        .where('type', 'recycling_center')
        .first();
      
      console.log('Associated company:', associatedCompany);
    }
    
    // Test 4: Check if there are any bookings
    const bookings = await db('recycling_center_bookings').select('*');
    console.log('Total bookings:', bookings.length);
    
    if (bookings.length > 0) {
      console.log('Sample booking:', bookings[0]);
    }
    
  } catch (error) {
    console.error('Database test error:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase(); 