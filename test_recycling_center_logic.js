const axios = require('axios');

async function testRecyclingCenterLogic() {
  try {
    console.log('Testing recycling center logic...\n');

    // Test 1: Login as a recycling center user
    console.log('1. Testing login as recycling center user...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test.recycling@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token:', token);

    // Optionally fetch user info for debugging
    try {
      const profileResponse = await axios.get('http://localhost:5001/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('User profile:', profileResponse.data);
    } catch (profileErr) {
      console.log('Could not fetch user profile:', profileErr.response?.data || profileErr.message);
    }

    // Test 2: Test the recycling center bookings endpoint
    console.log('\n2. Testing recycling center bookings endpoint...');
    const bookingsResponse = await axios.get('http://localhost:5001/api/recycling-center/bookings/company', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Bookings response:', {
      bookings_count: bookingsResponse.data.bookings?.length || 0,
      has_bookings: !!bookingsResponse.data.bookings,
      first_booking: bookingsResponse.data.bookings?.[0] || 'No bookings'
    });

    // Test 3: Test with a non-recycling center user (should fail)
    console.log('\n3. Testing with non-recycling center user (should fail)...');
    try {
      const regularLoginResponse = await axios.post('http://localhost:5001/api/auth/login', {
        email: 'john.doe@example.com',
        password: 'password123'
      });

      const regularToken = regularLoginResponse.data.token;
      
      const regularBookingsResponse = await axios.get('http://localhost:5001/api/recycling-center/bookings/company', {
        headers: {
          'Authorization': `Bearer ${regularToken}`
        }
      });
      
      console.log('❌ ERROR: Non-recycling center user was able to access endpoint');
    } catch (error) {
      console.log('✅ SUCCESS: Non-recycling center user correctly blocked:', error.response?.data?.error);
    }

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testRecyclingCenterLogic(); 