# --- BUILD STAGE ---
FROM openjdk:21-jdk-slim AS build

# Set working directory for the build stage
WORKDIR /app

# Copy the Maven build files (pom.xml) first to leverage Docker cache
# If pom.xml doesn't change, this layer will be cached
COPY pom.xml .

# Copy the Maven wrapper files and script
COPY .mvn .mvn/
COPY mvnw .
COPY mvnw.cmd .

# Give execute permissions to the mvnw script
RUN chmod +x mvnw

# Copy the source code
COPY src ./src

# Build the application using Maven
# -Dmaven.test.skip=true is often used to skip tests during Docker builds for faster builds
# You might want to run tests separately or in a different CI/CD stage
RUN ./mvnw clean install -Dmaven.test.skip=true

# --- RUNNING STAGE ---
FROM openjdk:21-jdk-slim

# Set working directory for the runtime image
WORKDIR /app

# Copy only the necessary build artifacts from the build stage
# Copy the JAR file
COPY --from=build /app/target/InventoryManagementSpringBoot-0.0.1-SNAPSHOT.jar app.jar

# Copy the resources that you specifically need (e.g., db migration files)
# Ensure the path in the build stage is correct (target/classes/db or target/your-app-name/WEB-INF/classes/db if using WAR)
# For a JAR, it's typically target/classes
COPY --from=build /app/target/classes/db /app/resources/db/

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]