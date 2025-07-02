const db = require('./config/db');

async function updateUserToRecyclingCenter(userEmail) {
  try {
    console.log('Updating user to recycling center role...');
    
    // Find the user by email
    const user = await db('users').where('email', userEmail).first();
    
    if (!user) {
      console.log('User not found with email:', userEmail);
      return;
    }
    
    console.log('Found user:', user.name, 'with ID:', user.id);
    
    // Update user role to recycling_center
    await db('users')
      .where('id', user.id)
      .update({
        role: 'recycling_center',
        updated_at: db.fn.now()
      });
    
    console.log('Updated user role to recycling_center');
    
    // Check if user already has a recycling center company
    const existingCompany = await db('companies')
      .where('user_id', user.id)
      .where('type', 'recycling_center')
      .first();
    
    if (existingCompany) {
      console.log('User already has a recycling center company:', existingCompany.name);
      return;
    }
    
    // Create a recycling center company for the user
    const now = new Date();
    const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const [companyId] = await db('companies').insert({
      name: `${user.name}'s Recycling Center`,
      email: user.email,
      phone: '+250788123456',
      logo: 'https://example.com/recycling-logo.png',
      district: 'Kigali',
      sector: 'Nyamirambo',
      cell: 'Cell 1',
      village: 'Village 1',
      street: 'KG 123 Street',
      amount_per_month: 15000.00,
      user_id: user.id,
      type: 'recycling_center',
      created_at: mysqlDateTime,
      updated_at: mysqlDateTime
    });
    
    console.log('Created recycling center company with ID:', companyId);
    console.log('User is now ready to access recycling center features!');
    
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await db.destroy();
  }
}

// Get email from command line argument
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node update_user_to_recycling_center.js <user_email>');
  console.log('Example: node update_user_to_recycling_center.js john.doe@example.com');
  process.exit(1);
}

updateUserToRecyclingCenter(userEmail); 