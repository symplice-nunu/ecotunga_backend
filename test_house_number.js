const axios = require('axios');

async function testHouseNumberAPI() {
  try {
    console.log('Testing house_number field in API...');
    
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
    
    // First, let's test the updateProfile endpoint
    // We need to get a token first
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'angeiradu19@gmail.com',
      password: 'password123' // You might need to adjust this
    });
    
    const token = loginResponse.data.token;
    console.log('Got token:', token ? 'Yes' : 'No');
    
    // Test the profile update
    const updateResponse = await axios.put('http://localhost:5001/api/users/profile/me', testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Update response:', updateResponse.data);
    console.log('House number in response:', updateResponse.data.house_number);
    
    // Test the getProfile endpoint
    const getResponse = await axios.get('http://localhost:5001/api/users/profile/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Get profile response:', getResponse.data);
    console.log('House number in get response:', getResponse.data.house_number);
    
  } catch (error) {
    console.error('Error testing API:', error.response?.data || error.message);
  }
}

testHouseNumberAPI(); 