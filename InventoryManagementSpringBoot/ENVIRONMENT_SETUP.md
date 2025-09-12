# Environment Setup Guide

This guide explains how to set up environment variables for the Inventory Management Spring Boot application.

## Quick Start

1. **Copy the environment template:**

    ```bash
    cp docker-compose.env .env
    ```

2. **Update the .env file with your actual values:**

    - Database passwords
    - JWT secret key
    - Google OAuth credentials
    - Email credentials

3. **Run the application:**
    ```bash
    docker-compose up
    ```

## Environment Variables

### Required Variables

| Variable                     | Description                                    | Example                                                             |
| ---------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| `SPRING_DATASOURCE_PASSWORD` | Database password                              | `your_secure_password`                                              |
| `JWT_SECRET`                 | JWT signing secret (64+ bytes, base64 encoded) | `your_jwt_secret_key_here_must_be_at_least_64_bytes_base64_encoded` |
| `GOOGLE_CLIENT_ID`           | Google OAuth client ID for web application     | `your_google_client_id_here`                                        |
| `GOOGLE_CLIENT_SECRET`       | Google OAuth client secret for web application | `your_google_client_secret_here`                                    |
| `GOOGLE_REDIRECT_URI`        | OAuth2 redirect URI for web app                | `http://localhost:5173/auth/callback`                               |
| `MAIL_USERNAME`              | Email username                                 | `your_email@gmail.com`                                              |
| `MAIL_PASSWORD`              | Email app password                             | `your_app_password_here`                                            |

### Optional Variables

| Variable                     | Description       | Default                                                  |
| ---------------------------- | ----------------- | -------------------------------------------------------- |
| `SPRING_DATASOURCE_URL`      | Database URL      | `jdbc:postgresql://localhost:5432/InventoryManagementDB` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres`                                               |
| `SERVER_PORT`                | Server port       | `8080`                                                   |
| `FRONTEND_BASE_URL`          | Frontend URL      | `http://localhost:5173`                                  |
| `SPRING_PROFILES_ACTIVE`     | Active profile    | `dev`                                                    |

## JWT Secret Generation

Generate a secure JWT secret key:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 64

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## Google OAuth Setup for Web Applications

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and OAuth2 API
4. Create OAuth 2.0 credentials for **Web Application**
5. Add authorized redirect URIs:
    - `http://localhost:5173/auth/callback` (development)
    - `https://yourdomain.com/auth/callback` (production)
6. Add authorized JavaScript origins:
    - `http://localhost:5173` (development)
    - `https://yourdomain.com` (production)
7. Configure OAuth consent screen with required scopes:
    - `email`
    - `profile`
    - `openid`

## Email Setup

For Gmail:

1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password as `MAIL_PASSWORD`

For other providers, update the `MAIL_HOST` and `MAIL_PORT` variables.

## Profiles

### Development Profile (`dev`)

-   Uses local database
-   Enables debug logging
-   Disables HTTPS cookies
-   Shows SQL queries

### Production Profile (`prod`)

-   Uses environment variables
-   Minimal logging
-   Enables HTTPS cookies
-   Optimized for performance

## Security Best Practices

1. **Never commit .env files to version control**
2. **Use strong, unique passwords**
3. **Rotate secrets regularly**
4. **Use different credentials for different environments**
5. **Enable HTTPS in production**
6. **Use environment-specific configurations**

## Troubleshooting

### Common Issues

1. **JWT Secret too short:**

    - Ensure JWT_SECRET is at least 64 bytes (512 bits)
    - Use base64 encoding

2. **Database connection failed:**

    - Check database credentials
    - Ensure database is running
    - Verify connection URL

3. **Google OAuth failed:**

    - Verify client ID and secret
    - Check redirect URIs
    - Ensure Google+ API is enabled

4. **Email sending failed:**
    - Check email credentials
    - Verify SMTP settings
    - Check firewall settings

### Logs

Check application logs for detailed error messages:

```bash
# Docker logs
docker-compose logs backend

# Application logs
tail -f logs/app.log
```

## Environment File Templates

-   `docker-compose.env` - Template for Docker Compose
-   `environment.example` - Template for local development
-   `application-dev.yaml` - Development profile configuration
-   `application-prod.yaml` - Production profile configuration
