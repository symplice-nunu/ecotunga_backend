# Email Troubleshooting Guide

## Current Configuration
- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 587
- **Email**: intwarisymplice@gmail.com
- **Security**: TLS (STARTTLS)

## Common Issues and Solutions

### 1. Authentication Failed
**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solutions**:
- **Option A**: Use App Password (Recommended)
  1. Enable 2-Factor Authentication on Gmail account
  2. Go to Google Account Settings → Security → App passwords
  3. Generate a new app password for "Mail"
  4. Use this 16-character password instead of your regular password

- **Option B**: Enable Less Secure App Access
  1. Go to Google Account Settings → Security
  2. Enable "Less secure app access"
  3. Use your regular Gmail password

### 2. Connection Timeout
**Error**: `Connection timeout` or `ECONNREFUSED`

**Solutions**:
- Check if port 587 is blocked by firewall
- Verify network connectivity to smtp.gmail.com
- Try using port 465 with SSL instead of 587 with TLS

### 3. TLS/SSL Issues
**Error**: `TLS handshake failed` or `certificate verification failed`

**Solutions**:
- Ensure `SMTP_SECURE=false` for port 587
- Set `SMTP_SECURE=true` for port 465
- Check if server has proper SSL certificates

### 4. Rate Limiting
**Error**: `Daily sending quota exceeded`

**Solutions**:
- Gmail has a daily sending limit of 500 emails for regular accounts
- Consider using Gmail API for higher limits
- Monitor email sending volume

## Testing Email Configuration

### Run Email Test
```bash
# On the server
cd /opt/ecotunga_backend
docker-compose -f docker-compose.prod.yml exec backend node test_email.js
```

### Manual SMTP Test
```bash
# Test SMTP connection manually
telnet smtp.gmail.com 587
```

## Environment Variables

Make sure these are set correctly in your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=intwarisymplice@gmail.com
EMAIL_PASSWORD=your-app-password-or-regular-password
```

## Alternative Email Providers

If Gmail continues to have issues, consider:

1. **SendGrid**: Professional email service
2. **Mailgun**: Developer-friendly email API
3. **Amazon SES**: AWS email service
4. **Outlook/Hotmail**: Microsoft's email service

## Debugging Steps

1. **Check Environment Variables**:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend env | grep -E "(SMTP|EMAIL)"
   ```

2. **Check Application Logs**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f backend
   ```

3. **Test SMTP Connection**:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend node test_email.js
   ```

4. **Verify Gmail Settings**:
   - Check if account is not suspended
   - Verify no security alerts
   - Ensure app password is correct

## Quick Fix Commands

```bash
# Restart the backend service
systemctl restart ecotunga-backend.service

# Rebuild containers
cd /opt/ecotunga_backend
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Check email logs
docker-compose -f docker-compose.prod.yml logs backend | grep -i email
``` 