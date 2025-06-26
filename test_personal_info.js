const axios = require('axios');

async function testPersonalInfoSubmission() {
  try {
    console.log('Testing PersonalInfo form submission...');
    
    // First, create a test user
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'user'
    };
    
    console.log('Creating test user...');
    const registerResponse = await axios.post('http://localhost:5001/api/auth/register', testUser);
    console.log('User created:', registerResponse.data);
    
    // Login to get token
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    const token = loginResponse.data.token;
    console.log('Got token:', token ? 'Yes' : 'No');
    
    // Simulate PersonalInfo form submission
    const personalInfoData = {
      name: 'Test User',
      last_name: 'Test Last',
      gender: 'Male',
      phone_number: '0781234567',
      ubudehe_category: 'A',
      house_number: '456',
      district: 'Gasabo',
      sector: 'Kacyiru',
      cell: 'Kacyiru',
      street: 'Test Street'
    };
    
    console.log('Submitting personal info:', personalInfoData);
    
    const profileResponse = await axios.put('http://localhost:5001/api/users/profile/me', personalInfoData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Profile update response:', profileResponse.data);
    console.log('House number in response:', profileResponse.data.house_number);
    
    // Test waste collection creation
    const wasteCollectionData = {
      name: 'Test User',
      last_name: 'Test Last',
      gender: 'Male',
      phone_number: '0781234567',
      ubudehe_category: 'A',
      house_number: '789',
      district: 'Gasabo',
      sector: 'Kacyiru',
      cell: 'Kacyiru',
      street: 'Test Street',
      pickup_date: '2025-06-26',
      time_slot: '08:00 - 10:00',
      notes: 'Test collection'
    };
    
    console.log('Creating waste collection:', wasteCollectionData);
    
    const collectionResponse = await axios.post('http://localhost:5001/api/waste-collections', wasteCollectionData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Waste collection response:', collectionResponse.data);
    
    // Clean up - delete the test user
    // Note: You might need to implement a delete endpoint or manually delete from database
    
  } catch (error) {
    console.error('Error testing PersonalInfo submission:', error.response?.data || error.message);
  }
}

testPersonalInfoSubmission(); 