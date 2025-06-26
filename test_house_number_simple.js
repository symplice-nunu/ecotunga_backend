const db = require('./config/db');

async function testHouseNumberDatabase() {
  try {
    console.log('Testing house_number field in database operations...');
    
    // Test data with house_number
    const testData = {
      name: 'Test User',
      last_name: 'Test Last',
      gender: 'Male',
      phone_number: '0781234567',
      ubudehe_category: 'A',
      house_number: '123',
      district: 'Gasabo',
      sector: 'Kacyiru',
      cell: 'Kacyiru',
      street: 'Test Street'
    };
    
    console.log('Test data:', testData);
    
    // Test direct database insert
    const [userId] = await db('users').insert({
      id: require('crypto').randomUUID(),
      name: testData.name,
      last_name: testData.last_name,
      gender: testData.gender,
      phone_number: testData.phone_number,
      ubudehe_category: testData.ubudehe_category,
      house_number: testData.house_number,
      district: testData.district,
      sector: testData.sector,
      cell: testData.cell,
      street: testData.street,
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user'
    });
    
    console.log('Inserted user with ID:', userId);
    
    // Test direct database select
    const user = await db('users')
      .where('email', 'test@example.com')
      .select('*')
      .first();
    
    console.log('Retrieved user:', user);
    console.log('House number in database:', user.house_number);
    
    // Test waste collection insert
    const [collectionId] = await db('waste_collection').insert({
      user_id: user.id,
      name: testData.name,
      last_name: testData.last_name,
      gender: testData.gender,
      phone_number: testData.phone_number,
      ubudehe_category: testData.ubudehe_category,
      house_number: testData.house_number,
      district: testData.district,
      sector: testData.sector,
      cell: testData.cell,
      street: testData.street,
      email: 'test@example.com'
    });
    
    console.log('Inserted waste collection with ID:', collectionId);
    
    // Test waste collection select
    const collection = await db('waste_collection')
      .where('id', collectionId)
      .select('*')
      .first();
    
    console.log('Retrieved waste collection:', collection);
    console.log('House number in waste collection:', collection.house_number);
    
    // Clean up test data
    await db('waste_collection').where('id', collectionId).del();
    await db('users').where('email', 'test@example.com').del();
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    process.exit(0);
  }
}

testHouseNumberDatabase(); 