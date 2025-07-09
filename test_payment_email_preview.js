const emailService = require('./services/emailService');

// Test data for payment confirmation email
const testApprovalData = {
  userName: 'John Doe',
  companyName: 'EcoRecycle Center',
  bookingDate: 'Monday, January 15, 2025',
  bookingTime: '09:00-11:00',
  location: 'Kacyiru, Kigali',
  price: 'RWF 5,000.00',
  notes: 'Please ensure your recyclable materials are clean and properly sorted.',
  bookingId: '12345',
  wasteTypes: 'Plastic, Paper, Glass'
};

async function generatePaymentEmailPreview() {
  console.log('📧 Generating Payment Confirmation Email Preview\n');

  try {
    // Generate the email HTML
    const emailHtml = emailService.createApprovalEmailTemplate(testApprovalData);
    
    // Save the email preview to a file
    const fs = require('fs');
    const path = require('path');
    
    const previewPath = path.join(__dirname, 'payment_email_preview.html');
    fs.writeFileSync(previewPath, emailHtml);
    
    console.log('✅ Payment confirmation email preview generated successfully!');
    console.log(`📁 File saved to: ${previewPath}`);
    console.log('\n📋 Email Features:');
    console.log('   - Professional styling with mobile responsiveness');
    console.log('   - Price confirmation section with Accept/Decline buttons');
    console.log('   - Payment confirmation section with Confirm Payment Intent button');
    console.log('   - Alternative text links for email clients that don\'t support buttons');
    console.log('   - Clear instructions and next steps');
    console.log('   - Color-coded status indicators');
    console.log('   - Booking details and contact information');
    
    console.log('\n🔗 Email Links:');
    console.log('   - Accept Price: /recycling-center/bookings/12345/confirm?action=accept');
    console.log('   - Decline Price: /recycling-center/bookings/12345/confirm?action=decline');
    console.log('   - Confirm Payment: /recycling-center/bookings/12345/confirm-payment?action=confirm');
    
    console.log('\n📱 Mobile Features:');
    console.log('   - Responsive design that works on all devices');
    console.log('   - Stacked buttons on mobile for better usability');
    console.log('   - Touch-friendly button sizes');
    console.log('   - Readable font sizes and spacing');
    
    console.log('\n🎨 Design Features:');
    console.log('   - Green theme for approval status');
    console.log('   - Blue accent for payment confirmation');
    console.log('   - Professional color scheme');
    console.log('   - Clear visual hierarchy');
    console.log('   - Proper spacing and typography');

  } catch (error) {
    console.error('❌ Error generating email preview:', error);
  }
}

// Run the preview generation
generatePaymentEmailPreview(); 