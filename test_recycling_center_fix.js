const db = require('./config/db');

async function testRecyclingCenterFix() {
  try {
    console.log('Testing recycling center fix...\n');
    
    // Get users with recycling_center role that have linked companies
    const usersWithCompanies = await db('users as u')
      .join('companies as c', 'u.id', 'c.user_id')
      .where('u.role', 'recycling_center')
      .where('c.type', 'recycling_center')
      .select('u.id', 'u.name', 'u.email', 'c.id as company_id', 'c.name as company_name');
    
    console.log('Users with linked recycling center companies:');
    usersWithCompanies.forEach(user => {
      console.log(`- User: ${user.name} (${user.email})`);
      console.log(`  Company: ${user.company_name} (ID: ${user.company_id})`);
      console.log('');
    });
    
    if (usersWithCompanies.length === 0) {
      console.log('No users found with linked recycling center companies.');
      return;
    }
    
    // Test the query that was failing
    const testUserId = usersWithCompanies[0].id;
    console.log(`Testing with user ID: ${testUserId}`);
    
    const company = await db('companies')
      .where('user_id', testUserId)
      .where('type', 'recycling_center')
      .first();
    
    if (company) {
      console.log('✅ SUCCESS: Found company for user');
      console.log(`Company: ${company.name} (ID: ${company.id})`);
      
      // Test the full query
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
      
      console.log(`✅ SUCCESS: Found ${bookings.length} bookings for the company`);
      
    } else {
      console.log('❌ FAILED: No company found for user');
    }
    
  } catch (error) {
    console.error('Error testing recycling center fix:', error);
  } finally {
    await db.destroy();
  }
}

testRecyclingCenterFix(); 