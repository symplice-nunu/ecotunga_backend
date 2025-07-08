const db = require('./config/db');

async function fixCompanyUserLinks() {
  try {
    console.log('Starting to fix company-user links...');
    
    // Get all users with recycling_center role
    const recyclingCenterUsers = await db('users')
      .where('role', 'recycling_center')
      .select('id', 'name', 'email');
    
    console.log('Found recycling center users:', recyclingCenterUsers.length);
    
    // Get all recycling center companies that don't have a user_id
    const recyclingCenterCompanies = await db('companies')
      .where('type', 'recycling_center')
      .whereNull('user_id')
      .select('id', 'name', 'email');
    
    console.log('Found recycling center companies without user_id:', recyclingCenterCompanies.length);
    
    // Link companies to users based on email match
    let linkedCount = 0;
    for (const company of recyclingCenterCompanies) {
      const matchingUser = recyclingCenterUsers.find(user => 
        user.email.toLowerCase() === company.email.toLowerCase()
      );
      
      if (matchingUser) {
        await db('companies')
          .where('id', company.id)
          .update({
            user_id: matchingUser.id,
            updated_at: db.fn.now()
          });
        
        console.log(`Linked company "${company.name}" (${company.email}) to user "${matchingUser.name}" (${matchingUser.id})`);
        linkedCount++;
      } else {
        console.log(`No matching user found for company "${company.name}" (${company.email})`);
      }
    }
    
    console.log(`\nSummary: Linked ${linkedCount} companies to users`);
    
    // Show remaining unlinked companies
    const remainingUnlinked = await db('companies')
      .where('type', 'recycling_center')
      .whereNull('user_id')
      .select('id', 'name', 'email');
    
    if (remainingUnlinked.length > 0) {
      console.log('\nRemaining unlinked recycling center companies:');
      remainingUnlinked.forEach(company => {
        console.log(`- ${company.name} (${company.email})`);
      });
    }
    
  } catch (error) {
    console.error('Error fixing company-user links:', error);
  } finally {
    await db.destroy();
  }
}

fixCompanyUserLinks(); 