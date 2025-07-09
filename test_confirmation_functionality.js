const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test data
const testUser = {
  email: 'user@test.com',
  password: 'password123'
};

const testRecyclingUser = {
  email: 'recycling@test.com',
  password: 'password123'
};

async function testConfirmationFunctionality() {
  try {
    console.log('🧪 Testing Price Confirmation Functionality\n');

    // Step 1: Login as regular user
    console.log('1. Logging in as regular user...');
    const userLoginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    const userToken = userLoginResponse.data.token;
    console.log('✅ User login successful');

    // Step 2: Login as recycling center user
    console.log('\n2. Logging in as recycling center user...');
    const recyclingLoginResponse = await axios.post(`${BASE_URL}/auth/login`, testRecyclingUser);
    const recyclingToken = recyclingLoginResponse.data.token;
    console.log('✅ Recycling center login successful');

    // Step 3: Create a test booking
    console.log('\n3. Creating test booking...');
    const testBooking = {
      user_id: 1,
      company_id: 1,
      dropoff_date: '2024-12-25',
      time_slot: '10:00-12:00',
      district: 'Kigali',
      sector: 'Kacyiru',
      waste_types: JSON.stringify(['plastic', 'paper']),
      notes: 'Test booking for confirmation'
    };

    const createBookingResponse = await axios.post(`${BASE_URL}/recycling-center/bookings`, testBooking, {
      headers: { Authorization: `Bearer ${recyclingToken}` }
    });
    const bookingId = createBookingResponse.data.id;
    console.log(`✅ Test booking created with ID: ${bookingId}`);

    // Step 4: Approve the booking with pricing
    console.log('\n4. Approving booking with pricing...');
    const approvalData = {
      price: 20000,
      notes: 'Test approval with pricing. Please confirm the price.'
    };

    const approvalResponse = await axios.put(
      `${BASE_URL}/recycling-center/bookings/${bookingId}/approve`,
      approvalData,
      {
        headers: { Authorization: `Bearer ${recyclingToken}` }
      }
    );

    console.log('✅ Booking approved successfully');
    console.log('💰 Price set:', approvalResponse.data.price);
    console.log('📧 Email should have been sent to the customer');

    // Step 5: Confirm the price as the user
    console.log('\n5. Confirming price as user...');
    const confirmResponse = await axios.put(
      `${BASE_URL}/recycling-center/bookings/${bookingId}/confirm-price`,
      { confirmed: true },
      {
        headers: { Authorization: `Bearer ${userToken}` }
      }
    );

    console.log('✅ Price confirmed successfully');
    console.log('📝 Response:', confirmResponse.data);

    // Step 6: Verify the booking status
    console.log('\n6. Verifying booking status...');
    const bookingResponse = await axios.get(`${BASE_URL}/recycling-center/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    const booking = bookingResponse.data.booking;
    console.log('✅ Booking details:');
    console.log(`   - Status: ${booking.status}`);
    console.log(`   - Price: ${booking.price}`);
    console.log(`   - Price Confirmed: ${booking.price_confirmed}`);
    console.log(`   - Confirmed At: ${booking.confirmed_at}`);

    // Step 7: Test declining the price
    console.log('\n7. Testing price decline...');
    const declineResponse = await axios.put(
      `${BASE_URL}/recycling-center/bookings/${bookingId}/confirm-price`,
      { confirmed: false },
      {
        headers: { Authorization: `Bearer ${userToken}` }
      }
    );

    console.log('✅ Price declined successfully');
    console.log('📝 Response:', declineResponse.data);

    console.log('\n🎉 All confirmation tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 Make sure the users have the correct roles');
    }
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the booking exists and belongs to the user');
    }
  }
}

// Run the test
testConfirmationFunctionality(); 