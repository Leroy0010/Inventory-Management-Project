FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# First copy ONLY the dependency files (this layer won't change often)
COPY target/classes/db /app/resources/db/

# Then copy the application JAR (this changes frequently)
COPY target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]


