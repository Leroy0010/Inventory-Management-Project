# Render Deployment Guide

This guide provides detailed steps to deploy both the backend (Spring Boot) and frontend (React) applications to Render for testing.

## Prerequisites

-   Render account (free tier available)
-   GitHub repository with your code
-   Domain name (optional, Render provides free subdomains)

## Backend Deployment (Spring Boot)

### Step 1: Prepare Backend for Render

1. **Update the main Dockerfile for Render compatibility:**

    ```bash
    cd InventoryManagementSpringBoot
    ```

2. **Create a render-specific Dockerfile:**

    ```dockerfile
    # Dockerfile for Render deployment
    FROM openjdk:21-jdk-slim AS builder

    # Install Maven
    RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

    # Set working directory
    WORKDIR /app

    # Copy pom.xml first for better layer caching
    COPY pom.xml .

    # Download dependencies
    RUN mvn dependency:go-offline -B

    # Copy source code
    COPY src ./src

    # Build the application
    RUN mvn clean package -DskipTests

    # Production stage
    FROM openjdk:21-jre-slim

    # Create non-root user
    RUN groupadd -r appuser && useradd -r -g appuser appuser

    # Set working directory
    WORKDIR /app

    # Copy the JAR file
    COPY --from=builder /app/target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar app.jar

    # Create logs directory
    RUN mkdir -p logs && chown -R appuser:appuser logs

    # Change ownership
    RUN chown -R appuser:appuser /app

    # Switch to non-root user
    USER appuser

    # Expose port (Render uses PORT environment variable)
    EXPOSE $PORT

    # Health check
    HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
        CMD curl -f http://localhost:$PORT/actuator/health || exit 1

    # JVM optimizations
    ENV JAVA_OPTS="-Xms256m -Xmx1024m -XX:+UseG1GC -XX:+UseStringDeduplication"

    # Run the application
    ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
    ```

3. **Create a render.yaml configuration file:**
    ```yaml
    services:
        - type: web
          name: inventory-management-backend
          env: java
          plan: free
          buildCommand: mvn clean package -DskipTests
          startCommand: java -jar target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar
          envVars:
              - key: SPRING_PROFILES_ACTIVE
                value: prod
              - key: SPRING_DATASOURCE_URL
                fromDatabase:
                    name: inventory-db
                    property: connectionString
              - key: JWT_SECRET
                generateValue: true
              - key: FRONTEND_BASE_URL
                value: https://your-frontend-app.onrender.com
    ```

### Step 2: Set up PostgreSQL Database on Render

1. **Go to Render Dashboard:**

    - Visit [render.com](https://render.com)
    - Sign in to your account

2. **Create a new PostgreSQL database:**

    - Click "New +" → "PostgreSQL"
    - Name: `inventory-db`
    - Database: `InventoryManagementDB`
    - User: `postgres`
    - Region: Choose closest to your location
    - Plan: Free (for testing)
    - Click "Create Database"

3. **Note the connection details:**
    - External Database URL
    - Internal Database URL (for backend service)
    - Database name, username, password

### Step 3: Deploy Backend to Render

1. **Connect your GitHub repository:**

    - Click "New +" → "Web Service"
    - Connect your GitHub account
    - Select your repository
    - Choose the branch (usually `main` or `master`)

2. **Configure the backend service:**

    - **Name:** `inventory-management-backend`
    - **Environment:** `Java`
    - **Build Command:** `mvn clean package -DskipTests`
    - **Start Command:** `java -jar target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar`
    - **Plan:** Free (for testing)

3. **Set environment variables:**

    ```
    SPRING_PROFILES_ACTIVE=prod
    SPRING_DATASOURCE_URL=<Internal Database URL from step 2>
    SPRING_DATASOURCE_USERNAME=postgres
    SPRING_DATASOURCE_PASSWORD=<Password from step 2>
    JWT_SECRET=<Generate a strong secret key>
    FRONTEND_BASE_URL=https://your-frontend-app.onrender.com
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    MAIL_USERNAME=your_email@gmail.com
    MAIL_PASSWORD=your_app_password
    ```

4. **Deploy:**
    - Click "Create Web Service"
    - Wait for the build to complete (5-10 minutes)
    - Note the service URL (e.g., `https://inventory-management-backend.onrender.com`)

### Step 4: Test Backend Deployment

1. **Check health endpoint:**

    ```bash
    curl https://your-backend-url.onrender.com/actuator/health
    ```

2. **Test API endpoints:**
    ```bash
    curl https://your-backend-url.onrender.com/api/health
    ```

## Frontend Deployment (React)

### Step 1: Prepare Frontend for Render

1. **Update environment variables:**

    ```bash
    cd InventoryManagementReact
    ```

2. **Create a render-specific environment file:**

    ```bash
    # .env.production
    VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
    VITE_APP_NAME=Inventory Management System
    VITE_APP_VERSION=1.0.0
    ```

3. **Update package.json scripts:**
    ```json
    {
        "scripts": {
            "build": "vite build --mode production",
            "preview": "vite preview --port $PORT"
        }
    }
    ```

### Step 2: Deploy Frontend to Render

1. **Create a new Web Service:**

    - Click "New +" → "Web Service"
    - Connect your GitHub repository
    - Select the frontend folder: `InventoryManagementReact`

2. **Configure the frontend service:**

    - **Name:** `inventory-management-frontend`
    - **Environment:** `Node`
    - **Build Command:** `npm ci && npm run build`
    - **Start Command:** `npm run preview`
    - **Plan:** Free (for testing)

3. **Set environment variables:**

    ```
    VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
    NODE_ENV=production
    ```

4. **Deploy:**
    - Click "Create Web Service"
    - Wait for the build to complete (3-5 minutes)
    - Note the service URL (e.g., `https://inventory-management-frontend.onrender.com`)

### Step 3: Update Backend CORS Configuration

1. **Update the backend environment variables:**
    - Go to your backend service on Render
    - Go to "Environment" tab
    - Update `FRONTEND_BASE_URL` to your frontend URL
    - Redeploy the backend

## Full Stack Testing

### Step 1: Test the Complete Application

1. **Access the frontend:**

    - Open your frontend URL in a browser
    - Test user registration/login
    - Test inventory management features

2. **Check API connectivity:**
    - Open browser developer tools
    - Check Network tab for API calls
    - Verify all requests are going to your backend

### Step 2: Monitor and Debug

1. **Check Render logs:**

    - Go to your service dashboard
    - Click "Logs" tab
    - Monitor for any errors

2. **Test database connectivity:**
    - Check backend logs for database connection
    - Verify data persistence

## Troubleshooting Common Issues

### Backend Issues

1. **Build failures:**

    - Check Maven dependencies
    - Verify Java version compatibility
    - Check build logs for specific errors

2. **Database connection issues:**

    - Verify database URL format
    - Check database credentials
    - Ensure database is running

3. **CORS errors:**
    - Update `FRONTEND_BASE_URL` environment variable
    - Check CORS configuration in Spring Boot

### Frontend Issues

1. **Build failures:**

    - Check Node.js version compatibility
    - Verify all dependencies are installed
    - Check for TypeScript errors

2. **API connection issues:**
    - Verify `VITE_API_BASE_URL` is correct
    - Check if backend is running
    - Verify CORS configuration

### General Issues

1. **Service not starting:**

    - Check start command
    - Verify port configuration
    - Check environment variables

2. **Performance issues:**
    - Monitor resource usage
    - Check for memory leaks
    - Optimize database queries

## Production Considerations

### Security

1. **Environment variables:**

    - Use strong, unique secrets
    - Never commit secrets to repository
    - Use Render's environment variable management

2. **Database security:**
    - Use strong database passwords
    - Enable SSL connections
    - Regular backups

### Monitoring

1. **Health checks:**

    - Monitor `/actuator/health` endpoint
    - Set up alerts for failures
    - Monitor response times

2. **Logs:**
    - Centralize logging
    - Set up log aggregation
    - Monitor error rates

### Scaling

1. **Database:**

    - Upgrade to paid plan for better performance
    - Set up read replicas if needed
    - Implement connection pooling

2. **Application:**
    - Use multiple instances
    - Implement load balancing
    - Cache frequently accessed data

## Cost Optimization

### Free Tier Limitations

1. **Backend:**

    - 750 hours/month
    - Sleeps after 15 minutes of inactivity
    - 512MB RAM

2. **Database:**

    - 1GB storage
    - 1GB RAM
    - 1 connection

3. **Frontend:**
    - 750 hours/month
    - Sleeps after 15 minutes of inactivity
    - 512MB RAM

### Optimization Tips

1. **Reduce cold starts:**

    - Use health check endpoints
    - Implement keep-alive strategies
    - Optimize startup time

2. **Database optimization:**

    - Use connection pooling
    - Optimize queries
    - Implement caching

3. **Frontend optimization:**
    - Minimize bundle size
    - Use CDN for static assets
    - Implement service workers

## Next Steps

1. **Set up custom domain:**

    - Configure DNS records
    - Set up SSL certificates
    - Update environment variables

2. **Implement CI/CD:**

    - Set up automatic deployments
    - Configure staging environment
    - Implement testing pipeline

3. **Add monitoring:**

    - Set up application monitoring
    - Configure alerting
    - Implement logging

4. **Security hardening:**
    - Implement rate limiting
    - Add security headers
    - Regular security audits

This guide should help you successfully deploy your inventory management system to Render for testing. The free tier is perfect for testing and development, and you can easily upgrade to paid plans when you're ready for production.
