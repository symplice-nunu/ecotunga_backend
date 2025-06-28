const nodemailer = require('nodemailer');

// Create transporter for SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true' ? true : false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false // Only use this in development
  }
});

// Test SMTP connection
const testSMTPConnection = async () => {
  try {
    await transporter.verify();
    // console.log('✅ SMTP connection successful');
    return { success: true, message: 'SMTP connection successful' };
  } catch (error) {
    // console.error('❌ SMTP connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test connection on startup if in development
if (process.env.NODE_ENV === 'development') {
  testSMTPConnection();
}

// Email template for booking confirmation
const createBookingEmailTemplate = (bookingData) => {
  const {
    id,
    name,
    last_name,
    email,
    phone_number,
    district,
    sector,
    cell,
    street,
    pickup_date,
    time_slot,
    notes,
    company_name,
    company_email,
    company_phone
  } = bookingData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Waste Collection Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0C9488; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #0C9488; }
        .section { margin: 20px 0; }
        .section h3 { color: #0C9488; border-bottom: 2px solid #0C9488; padding-bottom: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .status-pending { background-color: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 3px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗑️ Waste Collection Booking Confirmation</h1>
          <p>Thank you for booking with Ecotunga!</p>
        </div>
        
        <div class="content">
          <div class="booking-details">
            <h2>Booking #${id}</h2>
            <span class="status-pending">Status: Pending Approval</span>
          </div>

          <div class="section">
            <h3>👤 Personal Information</h3>
            <div class="detail-row">
              <span class="label">Full Name:</span>
              <span class="value">${name} ${last_name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${phone_number}</span>
            </div>
          </div>

          <div class="section">
            <h3>📍 Collection Location</h3>
            <div class="detail-row">
              <span class="label">District:</span>
              <span class="value">${district}</span>
            </div>
            <div class="detail-row">
              <span class="label">Sector:</span>
              <span class="value">${sector}</span>
            </div>
            <div class="detail-row">
              <span class="label">Cell:</span>
              <span class="value">${cell}</span>
            </div>
            ${street ? `<div class="detail-row">
              <span class="label">Street:</span>
              <span class="value">${street}</span>
            </div>` : ''}
          </div>

          <div class="section">
            <h3>📅 Pickup Details</h3>
            <div class="detail-row">
              <span class="label">Pickup Date:</span>
              <span class="value">${pickup_date}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time Slot:</span>
              <span class="value">${time_slot}</span>
            </div>
            ${company_name ? `<div class="detail-row">
              <span class="label">Service Provider:</span>
              <span class="value">${company_name}</span>
            </div>` : ''}
            ${notes ? `<div class="detail-row">
              <span class="label">Notes:</span>
              <span class="value">${notes}</span>
            </div>` : ''}
          </div>

          ${company_name ? `
          <div class="section">
            <h3>🏢 Service Provider Contact</h3>
            <div class="detail-row">
              <span class="label">Company:</span>
              <span class="value">${company_name}</span>
            </div>
            ${company_email ? `<div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${company_email}</span>
            </div>` : ''}
            ${company_phone ? `<div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${company_phone}</span>
            </div>` : ''}
          </div>
          ` : ''}

          <div class="section">
            <h3>ℹ️ Important Information</h3>
            <ul>
              <li>Your booking is currently pending approval</li>
              <li>You will receive a confirmation email once approved</li>
              <li>Please ensure your waste is properly sorted and ready for collection</li>
              <li>Contact your service provider if you need to reschedule</li>
            </ul>
          </div>

          <div class="footer">
            <p>Thank you for choosing Ecotunga for your waste management needs!</p>
            <p>For support, contact us at support@ecotunga.rw</p>
            <p>© 2024 Ecotunga. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (bookingData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: bookingData.email,
      subject: `Waste Collection Booking Confirmation - #${bookingData.id}`,
      html: createBookingEmailTemplate(bookingData)
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error('Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification email
const sendAdminNotificationEmail = async (bookingData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecotunga.rw';
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: adminEmail,
      subject: `New Waste Collection Booking - #${bookingData.id}`,
      html: `
        <h2>New Waste Collection Booking</h2>
        <p><strong>Booking ID:</strong> ${bookingData.id}</p>
        <p><strong>Customer:</strong> ${bookingData.name} ${bookingData.last_name}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone_number}</p>
        <p><strong>Location:</strong> ${bookingData.district}, ${bookingData.sector}</p>
        <p><strong>Pickup Date:</strong> ${bookingData.pickup_date}</p>
        <p><strong>Time Slot:</strong> ${bookingData.time_slot}</p>
        <p><strong>Company:</strong> ${bookingData.company_name || 'Not specified'}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
  testSMTPConnection
}; 