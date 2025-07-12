#!/bin/bash

# Production server details
SERVER_IP="62.171.173.62"
SERVER_USER="root"
SERVER_PASSWORD="c428nWwb0VG03Fx3iX5"

echo "🚀 Deploying Ecotunga Backend to Production Server..."
echo "Server: $SERVER_IP"
echo "User: $SERVER_USER"
echo ""

# Create a temporary directory for the files
TEMP_DIR="/tmp/ecotunga_deploy_$(date +%s)"
mkdir -p $TEMP_DIR

# Copy the necessary files
echo "📁 Preparing files for deployment..."
cp docker-compose.yml $TEMP_DIR/
cp production.env $TEMP_DIR/.env

echo "📤 Uploading files to production server..."

# Use sshpass to upload files (if available)
if command -v sshpass &> /dev/null; then
    # Upload files using scp with password
    sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no $TEMP_DIR/* $SERVER_USER@$SERVER_IP:/tmp/ecotunga_deploy/
    
    # Execute deployment commands
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'EOF'
        echo "🔧 Setting up production environment..."
        
        # Navigate to your backend directory (update this path)
        cd /path/to/your/ecotunga_backend
        
        # Stop existing containers
        docker-compose down
        
        # Copy the new files
        cp /tmp/ecotunga_deploy/docker-compose.yml .
        cp /tmp/ecotunga_deploy/.env .
        
        # Start containers with new configuration
        docker-compose up -d
        
        # Verify the environment variable
        echo "🔍 Verifying FRONTEND_URL..."
        docker-compose exec backend printenv | grep FRONTEND_URL
        
        # Check container status
        echo "📊 Container status:"
        docker-compose ps
        
        # Clean up temporary files
        rm -rf /tmp/ecotunga_deploy
        
        echo "✅ Deployment completed!"
EOF
else
    echo "❌ sshpass not found. Please install it or run the commands manually:"
    echo ""
    echo "1. Upload files manually:"
    echo "   scp docker-compose.yml root@62.171.173.62:/path/to/your/ecotunga_backend/"
    echo "   scp production.env root@62.171.173.62:/path/to/your/ecotunga_backend/.env"
    echo ""
    echo "2. SSH into server and run:"
    echo "   ssh root@62.171.173.62"
    echo "   cd /path/to/your/ecotunga_backend"
    echo "   docker-compose down"
    echo "   docker-compose up -d"
    echo "   docker-compose exec backend printenv | grep FRONTEND_URL"
fi

# Clean up local temporary files
rm -rf $TEMP_DIR

echo "🎉 Deployment script completed!" 