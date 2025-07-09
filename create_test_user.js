const db = require('./config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createTestUser() {
  try {
    console.log('Creating test recycling center user...\n');
    
    const testEmail = 'test.recycling@example.com';
    const testPassword = 'password123';
    const testName = 'Test Recycling Center';
    
    // Check if user already exists
    const existingUser = await db('users').where({ email: testEmail }).first();
    if (existingUser) {
      console.log('Test user already exists, deleting...');
      await db('users').where({ email: testEmail }).del();
      await db('companies').where({ email: testEmail }).del();
    }
    
    // Create user
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const userId = uuidv4();
    
    const userData = {
      id: userId,
      name: testName,
      email: testEmail,
      password: hashedPassword,
      role: 'recycling_center'
    };
    
    await db('users').insert(userData);
    console.log('✅ Test user created:', userData.email);
    
    // Create company
    const companyData = {
      name: testName,
      email: testEmail,
      phone: '+250788123456',
      logo: '',
      district: 'Kigali',
      sector: 'Test Sector',
      cell: 'Test Cell',
      village: 'Test Village',
      street: 'Test Street',
      amount_per_month: 15000.00,
      type: 'recycling_center'
    };
    
    await db('companies').insert(companyData);
    console.log('✅ Test company created:', companyData.email);
    
    console.log('\nTest user created successfully!');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('Role: recycling_center');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser(); 