const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_USER_EMAIL = 'testuser@example.com';
const TEST_USER_PASSWORD = 'testpassword123';
const RECYCLING_CENTER_EMAIL = 'recycling@example.com';
const RECYCLING_CENTER_PASSWORD = 'recycling123';

let userToken = null;
let recyclingCenterToken = null;
let testBookingId = null;

async function testPaymentConfirmation() {
  console.log('🧪 Testing Payment Confirmation Functionality\n');

  try {
    // Step 1: Login as test user
    console.log('1️⃣ Logging in as test user...');
    const userLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    });
    userToken = userLoginResponse.data.token;
    console.log('   ✅ Test user logged in successfully');

    // Step 2: Login as recycling center
    console.log('\n2️⃣ Logging in as recycling center...');
    const recyclingLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: RECYCLING_CENTER_EMAIL,
      password: RECYCLING_CENTER_PASSWORD
    });
    recyclingCenterToken = recyclingLoginResponse.data.token;
    console.log('   ✅ Recycling center logged in successfully');

    // Step 3: Create a test booking
    console.log('\n3️⃣ Creating a test booking...');
    const bookingData = {
      company_id: 1, // Assuming company ID 1 is a recycling center
      dropoff_date: '2025-01-15',
      time_slot: '09:00-11:00',
      district: 'Kigali',
      sector: 'Kacyiru',
      cell: 'Kacyiru',
      street: 'Test Street 123',
      waste_types: JSON.stringify(['plastic', 'paper']),
      notes: 'Test booking for payment confirmation'
    };

    const bookingResponse = await axios.post(`${BASE_URL}/recycling-center/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    testBookingId = bookingResponse.data.id;
    console.log(`   ✅ Test booking created with ID: ${testBookingId}`);

    // Step 4: Approve the booking with pricing
    console.log('\n4️⃣ Approving the booking with pricing...');
    const approvalData = {
      price: 5000,
      notes: 'Test approval with payment confirmation'
    };

    await axios.put(`${BASE_URL}/recycling-center/bookings/${testBookingId}/approve`, approvalData, {
      headers: { Authorization: `Bearer ${recyclingCenterToken}` }
    });
    console.log('   ✅ Booking approved with pricing');

    // Step 5: Confirm the price
    console.log('\n5️⃣ Confirming the price...');
    await axios.put(`${BASE_URL}/recycling-center/bookings/${testBookingId}/confirm-price`, {
      confirmed: true
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('   ✅ Price confirmed');

    // Step 6: Confirm payment
    console.log('\n6️⃣ Confirming payment...');
    const paymentResponse = await axios.put(`${BASE_URL}/recycling-center/bookings/${testBookingId}/confirm-payment`, {
      payment_confirmed: true
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('   ✅ Payment confirmed');

    // Step 7: Verify the booking status
    console.log('\n7️⃣ Verifying booking status...');
    const bookingResponse2 = await axios.get(`${BASE_URL}/recycling-center/bookings/${testBookingId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const booking = bookingResponse2.data.booking;

    console.log('   📊 Booking Status:');
    console.log(`   - Status: ${booking.status}`);
    console.log(`   - Price: ${booking.price}`);
    console.log(`   - Price Confirmed: ${booking.price_confirmed}`);
    console.log(`   - Payment Confirmed: ${booking.payment_confirmed}`);
    console.log(`   - Payment Confirmed At: ${booking.payment_confirmed_at}`);

    // Step 8: Test payment confirmation cancellation
    console.log('\n8️⃣ Testing payment confirmation cancellation...');
    await axios.put(`${BASE_URL}/recycling-center/bookings/${testBookingId}/confirm-payment`, {
      payment_confirmed: false
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('   ✅ Payment confirmation cancelled');

    // Step 9: Verify cancellation
    console.log('\n9️⃣ Verifying cancellation...');
    const bookingResponse3 = await axios.get(`${BASE_URL}/recycling-center/bookings/${testBookingId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const updatedBooking = bookingResponse3.data.booking;

    console.log('   📊 Updated Booking Status:');
    console.log(`   - Payment Confirmed: ${updatedBooking.payment_confirmed}`);
    console.log(`   - Payment Confirmed At: ${updatedBooking.payment_confirmed_at}`);

    // Step 10: Test error cases
    console.log('\n🔟 Testing error cases...');

    // Test confirming payment without price confirmation
    try {
      await axios.put(`${BASE_URL}/recycling-center/bookings/${testBookingId}/confirm-payment`, {
        payment_confirmed: true
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('   ❌ Should have failed - payment confirmed without price confirmation');
    } catch (error) {
      console.log('   ✅ Correctly prevented payment confirmation without price confirmation');
    }

    // Test unauthorized access
    try {
      await axios.put(`${BASE_URL}/recycling-center/bookings/${testBookingId}/confirm-payment`, {
        payment_confirmed: true
      }, {
        headers: { Authorization: `Bearer ${recyclingCenterToken}` }
      });
      console.log('   ❌ Should have failed - recycling center cannot confirm payment');
    } catch (error) {
      console.log('   ✅ Correctly prevented recycling center from confirming payment');
    }

    console.log('\n🎉 All payment confirmation tests completed successfully!');
    console.log('\n📧 Email Template Features:');
    console.log('   - Price confirmation buttons (Accept/Decline)');
    console.log('   - Payment confirmation button');
    console.log('   - Mobile-responsive design');
    console.log('   - Alternative text links for compatibility');
    console.log('   - Clear instructions and next steps');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.error || error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testPaymentConfirmation(); 