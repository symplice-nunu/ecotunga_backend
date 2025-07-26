const nodemailer = require('nodemailer');

// Create transporter for SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true' ? true : false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true
  }
});

// Test SMTP connection
const testSMTPConnection = async () => {
  try {
    console.log('🔧 Testing SMTP connection...');
    console.log('📧 SMTP Host:', process.env.SMTP_HOST);
    console.log('🔌 SMTP Port:', process.env.SMTP_PORT);
    console.log('👤 Email User:', process.env.SMTP_USER || process.env.EMAIL_USER);
    console.log('🔒 Email Password:', (process.env.SMTP_PASS || process.env.EMAIL_PASSWORD) ? '***SET***' : '***NOT SET***');
    
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    return { success: true, message: 'SMTP connection successful' };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
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
    console.log('📧 Sending booking confirmation email to:', bookingData.email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: bookingData.email,
      subject: `Waste Collection Booking Confirmation - #${bookingData.id}`,
      html: createBookingEmailTemplate(bookingData)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Create approval notification email template
const createApprovalNotificationTemplate = (bookingData) => {
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
    company_phone,
    admin_notes
  } = bookingData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Waste Collection Request Approved</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #10B981; }
        .section { margin: 20px 0; }
        .section h3 { color: #10B981; border-bottom: 2px solid #10B981; padding-bottom: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .status-approved { background-color: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        .admin-notes { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Waste Collection Request Approved</h1>
          <p>Great news! Your waste collection request has been approved.</p>
        </div>
        
        <div class="content">
          <div class="booking-details">
            <h2>Booking #${id}</h2>
            <span class="status-approved">Status: Approved</span>
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

          ${admin_notes ? `
          <div class="section">
            <h3>📝 Admin Notes</h3>
            <div class="admin-notes">
              <p><strong>Message from our team:</strong></p>
              <p>${admin_notes}</p>
            </div>
          </div>
          ` : ''}

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
              <li>Your waste collection has been approved and is scheduled</li>
              <li>Please ensure your waste is properly sorted and ready for collection</li>
              <li>Be available during the scheduled time slot</li>
              <li>Contact your service provider if you need to reschedule</li>
              <li>Keep this confirmation for your records</li>
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

// Create denial notification email template
const createDenialNotificationTemplate = (bookingData) => {
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
    company_phone,
    admin_notes
  } = bookingData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Waste Collection Request Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #EF4444; }
        .section { margin: 20px 0; }
        .section h3 { color: #EF4444; border-bottom: 2px solid #EF4444; padding-bottom: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .status-denied { background-color: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        .admin-notes { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Waste Collection Request Update</h1>
          <p>We regret to inform you that your waste collection request could not be approved.</p>
        </div>
        
        <div class="content">
          <div class="booking-details">
            <h2>Booking #${id}</h2>
            <span class="status-denied">Status: Denied</span>
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
            <h3>📅 Requested Pickup Details</h3>
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

          ${admin_notes ? `
          <div class="section">
            <h3>📝 Reason for Denial</h3>
            <div class="admin-notes">
              <p><strong>Message from our team:</strong></p>
              <p>${admin_notes}</p>
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h3>ℹ️ Next Steps</h3>
            <ul>
              <li>You can submit a new waste collection request</li>
              <li>Please review the reason for denial and make necessary adjustments</li>
              <li>Contact our support team if you have any questions</li>
              <li>We're here to help you with proper waste management</li>
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

// Send approval notification email
const sendApprovalNotificationEmail = async (bookingData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: bookingData.email,
      subject: `Waste Collection Request Approved - #${bookingData.id}`,
      html: createApprovalNotificationTemplate(bookingData)
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send denial notification email
const sendDenialNotificationEmail = async (bookingData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: bookingData.email,
      subject: `Waste Collection Request Update - #${bookingData.id}`,
      html: createDenialNotificationTemplate(bookingData)
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create approval email template
const createApprovalEmailTemplate = (approvalData) => {
  const {
    userName,
    companyName,
    bookingDate,
    bookingTime,
    location,
    price,
    notes,
    bookingId,
    wasteTypes,
    sortedProperly,
    points
  } = approvalData;

  // Debug: Log the frontend URL being used
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  console.log('🔗 Using frontend URL for email links:', frontendUrl);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recycling Booking Approved</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #10B981; }
        .section { margin: 20px 0; }
        .section h3 { color: #10B981; border-bottom: 2px solid #10B981; padding-bottom: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .status-approved { background-color: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        .price-highlight { background-color: #fef3c7; color: #92400e; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
        .confirm-button { background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
          .container { padding: 10px; }
          .content { padding: 15px; }
          .detail-row { flex-direction: column; }
          .label, .value { margin: 2px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>♻️ Recycling Booking Approved!</h1>
          <p>Great news! Your recycling booking has been approved.</p>
        </div>
        
        <div class="content">
          <div class="booking-details">
            <h2>Booking #${bookingId}</h2>
            <span class="status-approved">Status: Approved</span>
          </div>

          <div class="price-highlight">
            💰 Total Price: ${price}
          </div>

          <div class="section">
            <h3>📋 Booking Details</h3>
            <div class="detail-row">
              <span class="label">Customer:</span>
              <span class="value">${userName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Recycling Center:</span>
              <span class="value">${companyName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Drop-off Date:</span>
              <span class="value">${bookingDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time Slot:</span>
              <span class="value">${bookingTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">${location}</span>
            </div>
            <div class="detail-row">
              <span class="label">Waste Types:</span>
              <span class="value">${wasteTypes}</span>
            </div>
            ${sortedProperly ? `
            <div class="detail-row">
              <span class="label">Sorted Properly:</span>
              <span class="value">✅ Yes</span>
            </div>
            <div class="detail-row">
              <span class="label">Points Earned:</span>
              <span class="value">⭐ ${points} points</span>
            </div>
            ` : ''}
          </div>

          ${notes ? `
          <div class="section">
            <h3>📝 Additional Notes</h3>
            <p>${notes}</p>
          </div>
          ` : ''}

          <div class="section">
            <h3>✅ Next Steps</h3>
            <ol>
              <li><strong>Confirm Price:</strong> Please confirm that you accept the quoted price</li>
              <li><strong>Prepare Waste:</strong> Sort your recyclable materials properly</li>
              <li><strong>Drop-off:</strong> Bring your materials to the recycling center on the scheduled date</li>
              <li><strong>Payment:</strong> Pay the quoted amount at the recycling center</li>
            </ol>
          </div>

          <div class="section">
            <h3>💰 Price Confirmation</h3>
            <p>Please confirm that you accept the quoted price of <strong>${price}</strong>.</p>
            <p>If you have any questions about the pricing, please contact the recycling center directly.</p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
              <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">Confirm Your Price</h3>
              <p style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                Please click one of the buttons below to confirm or decline the quoted price.
              </p>
              
              <!-- Desktop buttons -->
              <table style="width: 100%; max-width: 400px; margin: 0 auto; display: block;">
                <tr>
                  <td style="text-align: center; padding: 10px;">
                    <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm?action=accept" 
                       style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); min-width: 140px;">
                      ✅ Accept Price
                    </a>
                  </td>
                  <td style="text-align: center; padding: 10px;">
                    <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm?action=decline" 
                       style="background-color: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2); min-width: 140px;">
                      ❌ Decline Price
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Mobile buttons (stacked) -->
              <div style="display: none; max-width: 300px; margin: 0 auto;">
                <div style="margin-bottom: 15px;">
                  <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm?action=accept" 
                     style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); text-align: center; width: 100%; box-sizing: border-box;">
                    ✅ Accept Price
                  </a>
                </div>
                <div>
                  <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm?action=decline" 
                     style="background-color: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2); text-align: center; width: 100%; box-sizing: border-box;">
                    ❌ Decline Price
                  </a>
                </div>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 13px;">
                  <strong>Note:</strong> Clicking these buttons will immediately confirm or decline your price. 
                  You can also log into your account to manage your bookings.
                </p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 5px; border-left: 4px solid #64748b;">
              <p style="margin: 0; color: #475569; font-size: 13px;">
                <strong>Alternative Links:</strong> If the buttons above don't work, you can use these direct links:<br>
                  <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm?action=accept" style="color: #10B981; text-decoration: underline;">Accept Price</a> | 
                  <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm?action=decline" style="color: #EF4444; text-decoration: underline;">Decline Price</a>
              </p>
            </div>
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              Click the buttons above to confirm or decline the quoted price.
            </p>
          </div>

          <div class="section">
            <h3>💳 Payment Confirmation</h3>
            <p>After confirming the price, you can also confirm that you will pay the amount at the recycling center.</p>
            <p>This helps the recycling center prepare for your visit and ensures smooth processing.</p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border: 2px solid #0ea5e9;">
              <h3 style="color: #0c4a6e; margin-bottom: 15px; font-size: 18px;">Confirm Payment Intent</h3>
              <p style="color: #0369a1; margin-bottom: 20px; font-size: 14px;">
                Please click the button below to confirm that you will pay the quoted amount.
              </p>
              
              <!-- Desktop button -->
              <table style="width: 100%; max-width: 300px; margin: 0 auto; display: block;">
                <tr>
                  <td style="text-align: center; padding: 10px;">
                    <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm-payment?action=confirm" 
                       style="background-color: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2); min-width: 200px;">
                      💳 Confirm Payment Intent
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Mobile button -->
              <div style="display: none; max-width: 300px; margin: 0 auto;">
                <div style="margin-bottom: 15px;">
                  <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm-payment?action=confirm" 
                     style="background-color: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2); text-align: center; width: 100%; box-sizing: border-box;">
                    💳 Confirm Payment Intent
                  </a>
                </div>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 5px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #065f46; font-size: 13px;">
                  <strong>Note:</strong> This confirms your intent to pay. You will still need to pay the amount at the recycling center when you drop off your materials.
                </p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 5px; border-left: 4px solid #64748b;">
              <p style="margin: 0; color: #475569; font-size: 13px;">
                <strong>Alternative Link:</strong> If the button above doesn't work, you can use this direct link:<br>
                <a href="${frontendUrl}/recycling-center/bookings/${bookingId}/confirm-payment?action=confirm" style="color: #0ea5e9; text-decoration: underline;">Confirm Payment Intent</a>
              </p>
            </div>
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              Click the button above to confirm your payment intent.
            </p>
          </div>

          <div class="section">
            <h3>ℹ️ Important Information</h3>
            <ul>
              <li>Please arrive on time for your scheduled drop-off</li>
              <li>Ensure your recyclable materials are clean and properly sorted</li>
              <li>Bring a valid ID for verification</li>
              <li>Payment is due at the time of drop-off</li>
              <li>Contact the recycling center if you need to reschedule</li>
            </ul>
          </div>

          <div class="footer">
            <p>Thank you for choosing Ecotunga for your recycling needs!</p>
            <p>For support, contact us at support@ecotunga.rw</p>
            <p>© 2024 Ecotunga. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send approval confirmation email
const sendApprovalEmail = async (approvalData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: approvalData.to,
      subject: approvalData.subject,
      html: createApprovalEmailTemplate(approvalData.data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending approval confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send waste collection payment confirmation email
const sendWasteCollectionPaymentEmail = async (wasteCollectionData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
      to: wasteCollectionData.to,
      subject: wasteCollectionData.subject,
      html: createWasteCollectionPaymentTemplate(wasteCollectionData.data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Waste collection payment confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending waste collection payment confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Create waste collection payment confirmation email template
const createWasteCollectionPaymentTemplate = (wasteCollectionData) => {
  const {
    userName,
    bookingId,
    bookingDate,
    bookingTime,
    price,
    district,
    sector,
    cell,
    street
  } = wasteCollectionData;

  // Debug: Log the frontend URL being used
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  console.log('🔗 Using frontend URL for email links:', frontendUrl);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Waste Collection Payment Confirmation</title>
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
        .status-approved { background-color: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        .price-highlight { background-color: #fef3c7; color: #92400e; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
          .container { padding: 10px; }
          .content { padding: 15px; }
          .detail-row { flex-direction: column; }
          .label, .value { margin: 2px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗑️ Waste Collection Payment Confirmation</h1>
          <p>Please confirm your payment intent for the approved waste collection request.</p>
        </div>
        
        <div class="content">
          <div class="booking-details">
            <h2>Collection #${bookingId}</h2>
            <span class="status-approved">Status: Approved - Payment Confirmation Required</span>
          </div>

          <div class="price-highlight">
            💰 Total Price: ${price}
          </div>

          <div class="section">
            <h3>📋 Collection Details</h3>
            <div class="detail-row">
              <span class="label">Customer:</span>
              <span class="value">${userName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Pickup Date:</span>
              <span class="value">${bookingDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time Slot:</span>
              <span class="value">${bookingTime}</span>
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
            <h3>💰 Price Confirmation</h3>
            <p>Please confirm that you accept the quoted price of <strong>${price}</strong>.</p>
            <p>If you have any questions about the pricing, please contact the waste collection company directly.</p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
              <h3 style="color: #1f2937; margin-bottom: 15px; font-size: 18px;">Confirm Your Payment</h3>
              <p style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                Please click one of the buttons below to confirm or decline the quoted price.
              </p>
              
              <!-- Desktop buttons -->
              <table style="width: 100%; max-width: 400px; margin: 0 auto; display: block;">
                <tr>
                  <td style="text-align: center; padding: 10px;">
                    <a href="${frontendUrl}/waste-collections/${bookingId}/confirm-payment?action=accept" 
                       style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); min-width: 140px;">
                      ✅ Accept Price
                    </a>
                  </td>
                  <td style="text-align: center; padding: 10px;">
                    <a href="${frontendUrl}/waste-collections/${bookingId}/confirm-payment?action=decline" 
                       style="background-color: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2); min-width: 140px;">
                      ❌ Decline Price
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Mobile buttons -->
              <div style="display: none; max-width: 400px; margin: 0 auto;">
                <div style="margin-bottom: 15px;">
                  <a href="${frontendUrl}/waste-collections/${bookingId}/confirm-payment?action=accept" 
                     style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); text-align: center; width: 100%; box-sizing: border-box;">
                    ✅ Accept Price
                  </a>
                </div>
                <div>
                  <a href="${frontendUrl}/waste-collections/${bookingId}/confirm-payment?action=decline" 
                     style="background-color: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2); text-align: center; width: 100%; box-sizing: border-box;">
                    ❌ Decline Price
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>✅ Next Steps</h3>
            <ol>
              <li><strong>Confirm Price:</strong> Click "Accept Price" above to confirm the quoted amount</li>
              <li><strong>Prepare Waste:</strong> Sort your waste materials properly</li>
              <li><strong>Collection:</strong> Wait for the waste collection team on the scheduled date</li>
              <li><strong>Payment:</strong> Pay the confirmed amount when the team arrives</li>
            </ol>
          </div>

          <div class="footer">
            <p>Thank you for choosing Ecotunga for your waste collection needs!</p>
            <p>For support, contact us at support@ecotunga.rw</p>
            <p>© 2024 Ecotunga. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendBookingConfirmationEmail,
  sendApprovalEmail,
  createApprovalEmailTemplate,
  sendApprovalNotificationEmail,
  sendDenialNotificationEmail,
  sendWasteCollectionPaymentEmail,
  createWasteCollectionPaymentTemplate,
  testSMTPConnection
}; 