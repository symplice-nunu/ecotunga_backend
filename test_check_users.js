const db = require('./config/db');

async function checkUsers() {
  try {
    console.log('Checking users in database...\n');
    
    const users = await db('users').select('id', 'name', 'email', 'role');
    
    console.log('Found users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log(`\nTotal users: ${users.length}`);
    
    // Check if recycling center user exists
    const recyclingUser = users.find(u => u.email === 'recycling.center@example.com');
    if (recyclingUser) {
      console.log('\n✅ Recycling center user found:', recyclingUser);
    } else {
      console.log('\n❌ Recycling center user not found');
    }
    
    // Check companies
    console.log('\nChecking companies...');
    const companies = await db('companies').select('id', 'name', 'email', 'type');
    
    console.log('Found companies:');
    companies.forEach(company => {
      console.log(`- ${company.name} (${company.email}) - Type: ${company.type}`);
    });
    
    console.log(`\nTotal companies: ${companies.length}`);
    
    // Check if recycling center company exists
    const recyclingCompany = companies.find(c => c.email === 'recycling.center@example.com');
    if (recyclingCompany) {
      console.log('\n✅ Recycling center company found:', recyclingCompany);
    } else {
      console.log('\n❌ Recycling center company not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUsers(); 