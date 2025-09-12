#!/bin/bash

# Test script to verify environment setup
echo "🔍 Testing Environment Setup..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy docker-compose.env to .env and update with your values."
    echo "   Run: cp docker-compose.env .env"
    exit 1
fi

echo "✅ .env file found"

# Check if required environment variables are set
required_vars=(
    "SPRING_DATASOURCE_PASSWORD"
    "JWT_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "MAIL_USERNAME"
    "MAIL_PASSWORD"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=your_" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing or default values for required environment variables:"
    printf '   - %s\n' "${missing_vars[@]}"
    echo "   Please update .env file with actual values."
    exit 1
fi

echo "✅ All required environment variables are set"

# Check JWT secret length
jwt_secret=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2)
if [ ${#jwt_secret} -lt 64 ]; then
    echo "❌ JWT_SECRET is too short. Must be at least 64 characters (base64 encoded)."
    echo "   Current length: ${#jwt_secret}"
    echo "   Generate a new one with: openssl rand -base64 64"
    exit 1
fi

echo "✅ JWT_SECRET length is sufficient (${#jwt_secret} characters)"

# Test Docker Compose configuration
echo "🔍 Testing Docker Compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ Docker Compose configuration is valid"
else
    echo "❌ Docker Compose configuration has errors"
    docker-compose config
    exit 1
fi

echo ""
echo "🎉 Environment setup is valid!"
echo ""
echo "To start the application:"
echo "   docker-compose up"
echo ""
echo "To start in background:"
echo "   docker-compose up -d"
echo ""
echo "To view logs:"
echo "   docker-compose logs -f backend"
