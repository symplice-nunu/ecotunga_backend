const knex = require('./knexfile');
const db = require('knex')(knex.development);

async function runGraphTestData() {
  try {
    console.log('🚀 Starting Graph Test Data Setup...');
    console.log('=====================================');
    
    // Check if we have the required data
    const users = await db('users').select('id', 'role').limit(5);
    const companies = await db('companies').select('id').limit(3);
    
    console.log(`👥 Found ${users.length} users`);
    console.log(`🏢 Found ${companies.length} companies`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Please run user seeds first:');
      console.log('   npm run seed:users');
      return;
    }
    
    if (companies.length === 0) {
      console.log('❌ No companies found. Please run company seeds first:');
      console.log('   npm run seed:companies');
      return;
    }
    
    // Clear existing waste collection data
    const existingCount = await db('waste_collection').count('* as count');
    console.log(`🗑️  Clearing ${existingCount[0].count} existing waste collection records...`);
    await db('waste_collection').del();
    
    // Import and run the graph test data seed
    const graphTestSeed = require('./seeds/07_graph_test_data');
    await graphTestSeed.seed(db);
    
    console.log('');
    console.log('✅ Graph Test Data Setup Complete!');
    console.log('=====================================');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Start your frontend: npm start');
    console.log('   3. Login as a waste_collector user');
    console.log('   4. Check the Home page to see the beautiful graph!');
    console.log('');
    console.log('📊 Expected Graph Data:');
    console.log('   Oct 2024: 12 collections');
    console.log('   Nov 2024: 18 collections');
    console.log('   Dec 2024: 25 collections');
    console.log('   Jan 2025: 22 collections');
    console.log('   Feb 2025: 28 collections');
    console.log('   Mar 2025: 32 collections');
    console.log('   Apr 2025: 35 collections');
    console.log('');
    console.log('📈 This should show a clear upward trend in your graph!');
    
  } catch (error) {
    console.error('❌ Error setting up graph test data:', error);
  } finally {
    await db.destroy();
  }
}

// Run the script
runGraphTestData(); 