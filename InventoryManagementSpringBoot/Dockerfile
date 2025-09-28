# PRODUCTION DOCKERFILE - COMMENTED OUT FOR DEVELOPMENT
# FROM openjdk:21-jdk-slim
# WORKDIR /app
# COPY target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar app.jar
# EXPOSE 8080
# ENTRYPOINT ["java", "-jar", "app.jar"]

# DEVELOPMENT DOCKERFILE
# FROM openjdk:21-jdk-slim

# # Install Maven
# RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# # Set working directory
# WORKDIR /app

# # Copy pom.xml first for better layer caching
# COPY pom.xml .

# # Download dependencies (this layer will be cached if pom.xml doesn't change)
# RUN mvn dependency:go-offline -B

# # Copy source code
# COPY src ./src

# # Build the application
# RUN mvn clean package -DskipTests

# # Expose port
# EXPOSE 8080

# # Run the application
# CMD ["mvn", "spring-boot:run"]



# Production Dockerfile

# Multi-stage build for production
FROM openjdk:21-jdk-slim AS builder

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -Pprod

# Production stage
FROM openjdk:21-jre-slim

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy the JAR file from builder stage
COPY --from=builder /app/target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar app.jar

# Create logs directory
RUN mkdir -p logs && chown -R appuser:appuser logs

# Change ownership of the app directory
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimizations for production
ENV JAVA_OPTS="-Xms512m -Xmx2048m -XX:+UseG1GC -XX:+UseStringDeduplication -XX:+OptimizeStringConcat -Djava.security.egd=file:/dev/./urandom"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
