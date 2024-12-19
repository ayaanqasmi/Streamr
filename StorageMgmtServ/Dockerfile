FROM eclipse-temurin:21
LABEL authors="haris"

WORKDIR /app

# Copy the JAR file
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app/StorageManagementMicroservice.jar

# Copy the GCP credentials file into the container
COPY config/project-credentials.json /app/config/project-credentials.json

# Copy the application.properties file into the container
COPY src/main/resources/application.properties /app/resources/application.properties

# Expose the port your application will run on (adjust if necessary)
EXPOSE 8080

# Set environment variable for GCP credentials file
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/config/project-credentials.json

# Run the application
CMD ["java", "-jar", "StorageManagementMicroservice.jar"]