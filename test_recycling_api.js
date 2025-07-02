const axios = require('axios');

async function testRecyclingAPI() {
  try {
    // First, let's login as the recycling center user
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'recycling.center@example.com',
      password: 'password123'
    });

    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.token;

    // Now test the recycling center bookings endpoint
    const bookingsResponse = await axios.get('http://localhost:5000/api/recycling-center/bookings/company', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Bookings response:', bookingsResponse.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testRecyclingAPI(); 