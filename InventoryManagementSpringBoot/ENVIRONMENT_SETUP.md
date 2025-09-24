# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/InventoryManagementDB
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=mnkvbCcshAe8/hPogq0MtGonFJFqYMbTzMgwarqk3hCCxN1gvhA3Swgd4h6Yxyr0zOX0vfcILTtkg+LodbNv7g==

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Frontend Configuration
FRONTEND_BASE_URL=http://localhost:5173
```

## Default Values

The application now includes default values for all environment variables, so it should start even without a `.env` file. However, for production use, you should:

1. Generate a new JWT secret: `openssl rand -base64 64`
2. Configure proper Google OAuth2 credentials
3. Set up email configuration for notifications

## Running the Application

```bash
# Start the application with Docker Compose
docker-compose up --build
```

The application will be available at `http://localhost:8080`
