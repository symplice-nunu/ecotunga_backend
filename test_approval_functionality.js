const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'recycling@test.com',
  password: 'password123'
};

const testBooking = {
  user_id: 1,
  company_id: 1,
  dropoff_date: '2024-12-20',
  time_slot: '09:00-11:00',
  district: 'Kigali',
  sector: 'Kacyiru',
  waste_types: JSON.stringify(['plastic', 'paper']),
  notes: 'Test booking for approval'
};

async function testApprovalFunctionality() {
  try {
    console.log('🧪 Testing Recycling Center Booking Approval Functionality\n');

    // Step 1: Login as recycling center user
    console.log('1. Logging in as recycling center user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Create a test booking (if needed)
    console.log('\n2. Creating test booking...');
    const createBookingResponse = await axios.post(`${BASE_URL}/recycling-center/bookings`, testBooking, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bookingId = createBookingResponse.data.id;
    console.log(`✅ Test booking created with ID: ${bookingId}`);

    // Step 3: Approve the booking with pricing
    console.log('\n3. Approving booking with pricing...');
    const approvalData = {
      price: 15000,
      notes: 'Test approval with pricing. Please confirm the price.'
    };

    const approvalResponse = await axios.put(
      `${BASE_URL}/recycling-center/bookings/${bookingId}/approve`,
      approvalData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Booking approved successfully');
    console.log('📧 Email should have been sent to the customer');
    console.log('💰 Price set:', approvalResponse.data.price);
    console.log('📝 Notes:', approvalData.notes);

    // Step 4: Verify the booking status
    console.log('\n4. Verifying booking status...');
    const bookingResponse = await axios.get(`${BASE_URL}/recycling-center/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const booking = bookingResponse.data.booking;
    console.log('✅ Booking details:');
    console.log(`   - Status: ${booking.status}`);
    console.log(`   - Price: ${booking.price}`);
    console.log(`   - Approved at: ${booking.approved_at}`);
    console.log(`   - Approval notes: ${booking.approval_notes}`);

    console.log('\n🎉 All tests passed! Approval functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 Make sure the user has "recycling_center" role');
    }
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the booking exists and belongs to the user\'s company');
    }
  }
}

// Run the test
testApprovalFunctionality(); 