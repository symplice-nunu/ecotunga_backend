require('dotenv').config();
const { testSMTPConnection } = require('./services/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Configuration...');
  console.log('=====================================');
  
  // Test SMTP connection
  const result = await testSMTPConnection();
  
  if (result.success) {
    console.log('✅ Email configuration is working correctly!');
  } else {
    console.log('❌ Email configuration failed:');
    console.log('   Error:', result.error);
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('   1. Check if Gmail app password is correct');
    console.log('   2. Verify 2-factor authentication is enabled on Gmail');
    console.log('   3. Check if "Less secure app access" is enabled (if using regular password)');
    console.log('   4. Verify firewall/network allows SMTP connections');
    console.log('   5. Check if Gmail account has any restrictions');
  }
}

testEmail().catch(console.error); 