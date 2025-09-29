# Production Deployment Guide

This guide covers deploying both the backend (Spring Boot) and frontend (React) applications to production.

## Prerequisites

-   Docker and Docker Compose installed
-   Domain name configured
-   SSL certificates (for HTTPS)
-   Environment variables configured

## Backend Production Setup

### 1. Environment Configuration

Copy the production environment template:

```bash
cd InventoryManagementSpringBoot
cp environment.prod .env
```

Update the `.env` file with your production values:

-   Database credentials
-   JWT secrets (use a strong, random secret)
-   Google OAuth2 credentials
-   Email configuration
-   AWS S3 credentials (if using)
-   VAPID keys for push notifications

### 2. Database Setup

The production setup uses PostgreSQL with the following optimizations:

-   Connection pooling (HikariCP)
-   Optimized JPA settings
-   Proper indexing
-   Backup configuration

### 3. Security Configuration

The production configuration includes:

-   Secure cookie settings
-   HTTPS enforcement
-   CORS configuration
-   Security headers
-   JWT token security

### 4. Monitoring and Health Checks

Spring Boot Actuator is configured for:

-   Health checks at `/actuator/health`
-   Metrics at `/actuator/metrics`
-   Prometheus metrics at `/actuator/prometheus`

### 5. Deploy Backend

```bash
# Build and run with production configuration
docker-compose -f compose.prod.yaml up -d

# Check logs
docker-compose -f compose.prod.yaml logs -f backend

# Check health
curl http://localhost:8080/actuator/health
```

## Frontend Production Setup

### 1. Environment Configuration

Copy the production environment template:

```bash
cd InventoryManagementReact
cp environment.production .env.production
```

Update the `.env.production` file with your production values:

-   Backend API URL
-   Analytics IDs (if using)
-   Feature flags

### 2. Build for Production

```bash
# Install dependencies
npm ci

# Build for production
npm run build:prod

# Or build with Docker
npm run deploy:prod
```

### 3. Deploy Frontend

```bash
# Using Docker
docker build -t inventory-management-frontend .
docker run -p 3000:80 inventory-management-frontend

# Or using a web server
# Copy the dist/ folder to your web server
```

## Full Stack Deployment

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.fullstack.yaml`:

```yaml
version: "3.8"
services:
    frontend:
        build:
            context: ./InventoryManagementReact
            dockerfile: Dockerfile
        ports:
            - "80:80"
            - "443:443"
        depends_on:
            - backend
        environment:
            - VITE_API_BASE_URL=http://backend:8080/api

    backend:
        build:
            context: ./InventoryManagementSpringBoot
            dockerfile: Dockerfile.prod
        ports:
            - "8080:8080"
        depends_on:
            - database
        environment:
            - SPRING_PROFILES_ACTIVE=prod
            - FRONTEND_BASE_URL=http://localhost

    database:
        image: postgres:16-alpine
        environment:
            - POSTGRES_DB=InventoryManagementDB
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=your_secure_password
        volumes:
            - db_data:/var/lib/postgresql/data

volumes:
    db_data:
```

Deploy:

```bash
docker-compose -f docker-compose.fullstack.yaml up -d
```

### Option 2: Separate Deployments

1. Deploy backend to a cloud service (AWS, GCP, Azure)
2. Deploy frontend to a CDN or static hosting service
3. Configure CORS and API endpoints

## Production Checklist

### Backend Checklist

-   [ ] Environment variables configured
-   [ ] Database credentials secured
-   [ ] JWT secrets are strong and unique
-   [ ] HTTPS enabled
-   [ ] Security headers configured
-   [ ] Monitoring endpoints accessible
-   [ ] Logging configured
-   [ ] Database backups scheduled
-   [ ] SSL certificates installed

### Frontend Checklist

-   [ ] Production build created
-   [ ] Environment variables set
-   [ ] API endpoints configured
-   [ ] CDN configured (if using)
-   [ ] Service worker configured
-   [ ] Error tracking configured
-   [ ] Performance monitoring enabled
-   [ ] Security headers configured

### Infrastructure Checklist

-   [ ] Domain name configured
-   [ ] SSL certificates installed
-   [ ] Load balancer configured (if needed)
-   [ ] Database backups scheduled
-   [ ] Monitoring and alerting configured
-   [ ] Log aggregation configured
-   [ ] Security scanning enabled

## Performance Optimizations

### Backend Optimizations

-   Connection pooling configured
-   JPA optimizations enabled
-   Caching configured
-   Gzip compression enabled
-   Database indexing optimized

### Frontend Optimizations

-   Code splitting enabled
-   Lazy loading implemented
-   Image optimization
-   CSS optimization
-   JavaScript minification
-   Service worker for caching

## Security Considerations

1. **HTTPS Everywhere**: All traffic should be encrypted
2. **Secure Headers**: Implement security headers
3. **Input Validation**: Validate all inputs
4. **Authentication**: Use secure JWT tokens
5. **Authorization**: Implement proper RBAC
6. **Database Security**: Use parameterized queries
7. **Secrets Management**: Store secrets securely
8. **Regular Updates**: Keep dependencies updated

## Monitoring and Maintenance

1. **Health Checks**: Monitor application health
2. **Logs**: Centralized logging
3. **Metrics**: Application and infrastructure metrics
4. **Alerts**: Set up alerting for critical issues
5. **Backups**: Regular database backups
6. **Updates**: Regular security updates

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS configuration
2. **Database Connection**: Verify database credentials
3. **JWT Issues**: Check JWT configuration
4. **Build Failures**: Check environment variables
5. **Performance Issues**: Check resource limits

### Logs

```bash
# Backend logs
docker-compose -f compose.prod.yaml logs -f backend

# Frontend logs
docker logs inventory-management-frontend

# Database logs
docker-compose -f compose.prod.yaml logs -f database
```

## Support

For issues or questions:

1. Check the logs first
2. Verify environment configuration
3. Check the health endpoints
4. Review the monitoring dashboards
