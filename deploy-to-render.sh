#!/bin/bash

# Render Deployment Script
# This script helps you deploy both backend and frontend to Render

echo "🚀 Starting Render Deployment Process"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if user is in the right directory
if [ ! -d "InventoryManagementSpringBoot" ] || [ ! -d "InventoryManagementReact" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Project structure found ✓"

# Step 1: Prepare Backend
echo ""
echo "📦 Preparing Backend for Render..."
echo "=================================="

# Copy render-specific Dockerfile
if [ -f "InventoryManagementSpringBoot/Dockerfile.render" ]; then
    cp InventoryManagementSpringBoot/Dockerfile.render InventoryManagementSpringBoot/Dockerfile
    print_success "Dockerfile updated for Render"
else
    print_error "Dockerfile.render not found"
    exit 1
fi

# Step 2: Prepare Frontend
echo ""
echo "📦 Preparing Frontend for Render..."
echo "==================================="

# Create production environment file
cat > InventoryManagementReact/.env.production << EOF
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_APP_NAME=Inventory Management System
VITE_APP_VERSION=1.0.0
NODE_ENV=production
EOF

print_success "Frontend environment file created"

# Step 3: Instructions
echo ""
echo "📋 Manual Steps Required:"
echo "========================"
echo ""
echo "1. 🌐 Go to https://render.com and sign in"
echo ""
echo "2. 🗄️  Create PostgreSQL Database:"
echo "   - Click 'New +' → 'PostgreSQL'"
echo "   - Name: inventory-db"
echo "   - Database: InventoryManagementDB"
echo "   - User: postgres"
echo "   - Plan: Free"
echo "   - Click 'Create Database'"
echo ""
echo "3. 🔧 Deploy Backend:"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect GitHub repository"
echo "   - Select 'InventoryManagementSpringBoot' folder"
echo "   - Environment: Java"
echo "   - Build Command: mvn clean package -DskipTests"
echo "   - Start Command: java -jar target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar"
echo "   - Plan: Free"
echo ""
echo "4. 🔑 Set Backend Environment Variables:"
echo "   - SPRING_PROFILES_ACTIVE=prod"
echo "   - SPRING_DATASOURCE_URL=<Internal Database URL>"
echo "   - SPRING_DATASOURCE_USERNAME=postgres"
echo "   - SPRING_DATASOURCE_PASSWORD=<Database Password>"
echo "   - JWT_SECRET=<Generate strong secret>"
echo "   - FRONTEND_BASE_URL=https://your-frontend-app.onrender.com"
echo "   - Add other required environment variables"
echo ""
echo "5. 🎨 Deploy Frontend:"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect GitHub repository"
echo "   - Select 'InventoryManagementReact' folder"
echo "   - Environment: Node"
echo "   - Build Command: npm ci && npm run build"
echo "   - Start Command: npm run preview"
echo "   - Plan: Free"
echo ""
echo "6. 🔗 Update Frontend Environment:"
echo "   - VITE_API_BASE_URL=https://your-backend-url.onrender.com/api"
echo "   - NODE_ENV=production"
echo ""
echo "7. 🔄 Update Backend CORS:"
echo "   - Update FRONTEND_BASE_URL in backend environment"
echo "   - Redeploy backend"
echo ""

print_warning "Important Notes:"
echo "- Free tier services sleep after 15 minutes of inactivity"
echo "- First deployment may take 5-10 minutes"
echo "- Update environment variables with your actual values"
echo "- Test the application after deployment"

echo ""
print_success "Preparation complete! Follow the manual steps above to deploy to Render."
echo ""
echo "🔗 Useful Links:"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Documentation: https://render.com/docs"
echo ""

# Create a quick reference file
cat > RENDER_QUICK_REFERENCE.md << 'EOF'
# Render Deployment Quick Reference

## Backend Environment Variables
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=<Internal Database URL>
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<Database Password>
JWT_SECRET=<Generate strong secret>
FRONTEND_BASE_URL=https://your-frontend-app.onrender.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_PUBLIC_KEY=your_vapid_public_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY=your_aws_access_key
AWS_S3_SECRET_KEY=your_aws_secret_key
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
```

## Frontend Environment Variables
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
NODE_ENV=production
VITE_APP_NAME=Inventory Management System
VITE_APP_VERSION=1.0.0
```

## Commands
- Backend Build: `mvn clean package -DskipTests`
- Backend Start: `java -jar target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar`
- Frontend Build: `npm ci && npm run build`
- Frontend Start: `npm run preview`

## Health Check URLs
- Backend Health: `https://your-backend-url.onrender.com/actuator/health`
- Frontend: `https://your-frontend-url.onrender.com`
EOF

print_success "Quick reference file created: RENDER_QUICK_REFERENCE.md"
