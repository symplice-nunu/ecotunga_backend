# Email Setup Guide

## Overview
The waste collection booking system now sends confirmation emails to customers and notification emails to administrators when a booking is created.

## Email Configuration

### 1. Environment Variables
Add the following variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@ecotunga.rw
```

### 2. SMTP Configuration

#### Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

#### Outlook/Hotmail SMTP
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-outlook@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo SMTP
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-yahoo@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### Custom SMTP Server
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@your-domain.com
EMAIL_PASSWORD=your-password
```

### 3. Gmail Setup (if using Gmail SMTP)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

#### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification
3. Click on "App passwords"
4. Generate a new app password for "Mail"
5. Use this password as your `EMAIL_PASSWORD`

#### Step 3: Update Environment Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=admin@ecotunga.rw
```

### 4. SMTP Port and Security Settings

| Service | Host | Port | Secure | Notes |
|---------|------|------|--------|-------|
| Gmail | smtp.gmail.com | 587 | false | TLS |
| Gmail | smtp.gmail.com | 465 | true | SSL |
| Outlook | smtp-mail.outlook.com | 587 | false | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | false | TLS |
| Yahoo | smtp.mail.yahoo.com | 465 | true | SSL |

### 5. Testing SMTP Connection

You can test your SMTP configuration by adding this to your server startup:

```javascript
// Test email configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});
```

## Email Templates

### Customer Confirmation Email
- Sent to the customer's email address
- Includes all booking details
- Professional HTML template with Ecotunga branding
- Shows booking status and important information

### Admin Notification Email
- Sent to the admin email address
- Contains summary of new booking
- Helps administrators track new requests

## Testing Email Functionality

1. Start the backend server
2. Create a waste collection booking through the frontend
3. Check the customer's email for confirmation
4. Check the admin email for notification
5. Check server logs for email status

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check SMTP host and port settings
   - Verify email and password are correct
   - For Gmail: Ensure 2FA is enabled and use app password
   - Check if your email provider requires app-specific passwords

2. **Connection Timeout**
   - Verify SMTP host is correct
   - Check if port is blocked by firewall
   - Try different ports (587 vs 465)
   - Check if your email provider allows SMTP access

3. **Email Not Sending**
   - Check server logs for error messages
   - Verify all environment variables are set
   - Test SMTP connection manually
   - Check email provider's sending limits

4. **Spam Folder**
   - Check spam/junk folder for emails
   - Add the sender email to contacts
   - Configure email provider settings
   - Use a reputable SMTP service

### Debug Mode
Enable debug logging by adding to your environment:
```env
DEBUG_EMAIL=true
NODE_ENV=development
```

### Manual SMTP Test
You can test your SMTP settings manually:

```javascript
const nodemailer = require('nodemailer');

const testTransporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

testTransporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready');
  }
});
```

## Security Notes

- Never commit email passwords to version control
- Use environment variables for sensitive data
- Regularly rotate app passwords
- Monitor email sending logs for security
- Use app-specific passwords when available
- Consider using OAuth2 for better security 