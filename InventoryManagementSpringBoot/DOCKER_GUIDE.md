# 🐳 Docker Setup Guide

Complete guide for running the Inventory Management application in both development and production environments using Docker.

## 📁 File Structure

```
InventoryManagementSpringBoot/
├── Dockerfile.dev              # Development Dockerfile
├── Dockerfile.prod             # Production Dockerfile (local)
├── Dockerfile.render           # Production Dockerfile (Render)
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
├── .dockerignore               # Docker ignore file
├── env.dev.example             # Development environment variables
├── env.prod.example            # Production environment variables
├── nginx.conf                  # Nginx configuration (optional)
├── Makefile                    # Easy management commands
└── DOCKER_GUIDE.md             # This guide
```

## 🚀 Quick Start

### Prerequisites

-   Docker Desktop installed
-   Docker Compose installed
-   Git repository cloned

### Development Environment

1. **Setup Environment Variables**

    ```bash
    cp env.dev.example .env.dev
    # Edit .env.dev with your actual values
    ```

2. **Start Development Environment**

    ```bash
    # Using Makefile (recommended)
    make dev

    # Or using docker-compose directly
    docker-compose up -d
    ```

3. **Access Services**
    - **Application**: http://localhost:8080
    - **Database**: localhost:5432
    - **pgAdmin**: http://localhost:5050 (optional)

### Production Environment

1. **Setup Environment Variables**

    ```bash
    cp env.prod.example .env.prod
    # Edit .env.prod with your production values
    ```

2. **Start Production Environment**

    ```bash
    # Using Makefile (recommended)
    make prod

    # Or using docker-compose directly
    docker-compose -f docker-compose.prod.yml up -d
    ```

## 🔧 Development Environment Details

### Features

-   **Hot Reload**: Code changes automatically restart the application
-   **Debug Support**: Remote debugging on port 5005
-   **JDBC Sessions**: Persistent session storage in PostgreSQL
-   **Database Management**: pgAdmin for easy database access
-   **Health Checks**: Automatic service health monitoring

### Services

#### 1. PostgreSQL Database

```yaml
postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    environment:
        POSTGRES_DB: inventorymanagementdb_dev
        POSTGRES_USER: dev_user
        POSTGRES_PASSWORD: dev_password
```

#### 2. Session Storage

```yaml
# Sessions are stored in PostgreSQL using JDBC
# No separate Redis service needed
```

#### 3. Spring Boot Application

```yaml
app:
    build:
        dockerfile: Dockerfile.dev
    ports: ["8080:8080", "5005:5005"] # App + Debug
    volumes: ["./src:/app/src"] # Hot reload
```

#### 4. pgAdmin (Optional)

```yaml
pgadmin:
    image: dpage/pgadmin4:latest
    ports: ["5050:80"]
    profiles: [tools]
```

### Development Commands

```bash
# Start development environment
make dev

# View logs
make dev-logs

# Open application shell
make dev-shell

# Stop development environment
make dev-down

# Start with database tools
make dev-tools
```

### Debugging

1. **Attach Debugger**

    - IDE: Connect to `localhost:5005`
    - VS Code: Use "Attach to Java Program" configuration

2. **Hot Reload**

    - Code changes in `src/` automatically restart the application
    - No need to rebuild the container

3. **Database Access**
    - pgAdmin: http://localhost:5050
    - Direct: `psql -h localhost -p 5432 -U dev_user -d inventorymanagementdb_dev`

## 🏭 Production Environment Details

### Features

-   **JDBC Sessions**: Persistent session storage in PostgreSQL
-   **Optimized JVM**: G1GC and memory optimizations
-   **Security**: Non-root user, security headers
-   **Monitoring**: Health checks and logging
-   **Scalability**: Ready for load balancing

### Services

#### 1. PostgreSQL Database

```yaml
postgres:
    image: postgres:15-alpine
    environment:
        POSTGRES_DB: inventorymanagementdb_prod
        POSTGRES_USER: prod_user
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

#### 2. Spring Boot Application

```yaml
app:
    build:
        dockerfile: Dockerfile.prod
    environment:
        SPRING_SESSION_STORE_TYPE: jdbc # JDBC sessions
        SPRING_PROFILES_ACTIVE: prod
```

#### 3. Nginx (Optional)

```yaml
nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    profiles: [nginx]
```

### Production Commands

```bash
# Start production environment
make prod

# View logs
make prod-logs

# Open application shell
make prod-shell

# Stop production environment
make prod-down

# Start with nginx reverse proxy
make prod-nginx
```

## 🔐 Environment Variables

### Development (.env.dev)

```bash
# Database
POSTGRES_DB=inventorymanagementdb_dev
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password

# OAuth2
GOOGLE_CLIENT_ID=your_dev_client_id
GOOGLE_CLIENT_SECRET=your_dev_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

# JWT
JWT_SECRET=dev_jwt_secret_key_very_long_and_secure

# Frontend
FRONTEND_BASE_URL=http://localhost:3000

# Cookies
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
```

### Production (.env.prod)

```bash
# Database
POSTGRES_DB=inventorymanagementdb_prod
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=your_secure_production_password

# OAuth2
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/login/oauth2/code/google

# JWT
JWT_SECRET=your_production_jwt_secret_key_very_long_and_secure

# Frontend
FRONTEND_BASE_URL=https://your-frontend-domain.com

# Cookies
COOKIE_DOMAIN=.your-domain.com
COOKIE_SECURE=true
```

## 🐳 Docker Commands Reference

### Basic Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute commands
docker-compose exec app bash
```

### Production Commands

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Stop production services
docker-compose -f docker-compose.prod.yml down

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Makefile Commands

```bash
# Development
make dev          # Start dev environment
make dev-build    # Build dev images
make dev-up       # Start dev services
make dev-down     # Stop dev services
make dev-logs     # View dev logs
make dev-shell    # Open dev shell

# Production
make prod         # Start prod environment
make prod-build   # Build prod images
make prod-up      # Start prod services
make prod-down    # Stop prod services
make prod-logs    # View prod logs
make prod-shell   # Open prod shell

# Utilities
make clean        # Clean up everything
make dev-tools    # Start with pgAdmin
make prod-nginx   # Start with nginx
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
netstat -tulpn | grep :8080

# Kill the process
sudo kill -9 <PID>
```

#### 2. Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec app psql -h postgres -U dev_user -d inventorymanagementdb_dev
```

#### 3. Memory Issues

```bash
# Check container memory usage
docker stats

# Increase memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
```

#### 4. Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Debugging Commands

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs -f app

# Execute shell in container
docker-compose exec app bash

# Check database
docker-compose exec postgres psql -U dev_user -d inventorymanagementdb_dev

# Check Redis
docker-compose exec redis redis-cli ping
```

## 📊 Monitoring

### Health Checks

-   **Application**: http://localhost:8080/actuator/health
-   **Database**: Automatic health checks in docker-compose
-   **Redis**: Automatic health checks in docker-compose

### Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

### Metrics

-   **JVM Metrics**: http://localhost:8080/actuator/metrics
-   **Prometheus**: http://localhost:8080/actuator/prometheus

## 🚀 Deployment

### Local Production

```bash
# 1. Setup environment
cp env.prod.example .env.prod
# Edit .env.prod with production values

# 2. Start production environment
make prod

# 3. Verify deployment
curl http://localhost:8080/actuator/health
```

### Render Deployment

```bash
# 1. Use Dockerfile.render (already configured)
# 2. Set environment variables in Render dashboard
# 3. Deploy using Render's Git integration
```

## 🔒 Security Considerations

### Development

-   Use non-sensitive test data
-   Disable security features for easier debugging
-   Use HTTP for local development

### Production

-   Use strong passwords and secrets
-   Enable HTTPS and secure cookies
-   Use non-root user in containers
-   Implement rate limiting with nginx
-   Regular security updates

## 📝 Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **Image Optimization**: Use multi-stage builds
3. **Security**: Run as non-root user
4. **Monitoring**: Implement health checks
5. **Logging**: Centralize log management
6. **Backups**: Regular database backups
7. **Updates**: Keep base images updated

## 🆘 Support

If you encounter issues:

1. Check the logs: `make dev-logs` or `make prod-logs`
2. Verify environment variables are set correctly
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions
5. Review this documentation for common solutions
