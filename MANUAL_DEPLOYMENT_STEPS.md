# Manual Deployment Steps for Production Server

## Overview
This guide will help you update your production server to use the correct FRONTEND_URL for email links.

## Files Created
1. `production.env` - Production environment file with correct FRONTEND_URL
2. `deploy_to_production.sh` - Automated deployment script
3. `docker-compose.yml` - Already updated with correct FRONTEND_URL

## Option 1: Automated Deployment (Recommended)

If you have `sshpass` installed:
```bash
./deploy_to_production.sh
```

## Option 2: Manual Deployment

### Step 1: Upload Files to Server
```bash
# Upload the updated files to your server
scp docker-compose.yml root@62.171.173.62:/path/to/your/ecotunga_backend/
scp production.env root@62.171.173.62:/path/to/your/ecotunga_backend/.env
```

### Step 2: SSH into Server and Deploy
```bash
# SSH into your production server
ssh root@62.171.173.62

# Navigate to your backend directory (update the path)
cd /path/to/your/ecotunga_backend

# Stop existing containers
docker-compose down

# Start containers with new configuration
docker-compose up -d

# Verify the environment variable is set correctly
docker-compose exec backend printenv | grep FRONTEND_URL

# Check container status
docker-compose ps
```

### Step 3: Verify the Changes
The output should show:
```
FRONTEND_URL=http://62.171.173.62
```

## Option 3: Direct File Editing on Server

If you prefer to edit files directly on the server:

### Step 1: SSH into Server
```bash
ssh root@62.171.173.62
```

### Step 2: Update docker-compose.yml
```bash
# Navigate to your backend directory
cd /path/to/your/ecotunga_backend

# Update FRONTEND_URL in docker-compose.yml
sed -i 's|FRONTEND_URL=https://ecotunga.rw|FRONTEND_URL=http://62.171.173.62|g' docker-compose.yml
```

### Step 3: Create .env File
```bash
cat > .env << 'EOF'
# Database Configuration
DB_HOST=mysql
DB_USER=ecotunga_user
DB_PASSWORD=ecotunga_password
DB_NAME=ecotunga
DB_ROOT_PASSWORD=rootpassword

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=http://62.171.173.62
EOF
```

### Step 4: Restart Containers
```bash
docker-compose down
docker-compose up -d
```

## Verification

After deployment, test the email functionality:

1. **Check environment variable:**
   ```bash
   docker-compose exec backend printenv | grep FRONTEND_URL
   ```

2. **Test email generation:**
   - Approve a recycling booking
   - Check the email links - they should now use `http://62.171.173.62` instead of `localhost:3000`

## Troubleshooting

### If containers fail to start:
1. Check logs: `docker-compose logs backend`
2. Verify .env file exists and has correct values
3. Make sure all required environment variables are set

### If FRONTEND_URL is still showing localhost:
1. Verify the environment variable is set: `docker-compose exec backend printenv | grep FRONTEND_URL`
2. Check if .env file is being loaded: `docker-compose exec backend cat /app/.env`
3. Restart containers: `docker-compose restart backend`

## Files Summary

- ✅ `docker-compose.yml` - Updated with `FRONTEND_URL=http://62.171.173.62`
- ✅ `production.env` - Created with all required environment variables
- ✅ `deploy_to_production.sh` - Automated deployment script
- ✅ Email templates - Updated to use production URL

## Next Steps

After successful deployment:
1. Test the email functionality by approving a recycling booking
2. Verify email links use the correct production URL
3. Monitor container logs for any issues 