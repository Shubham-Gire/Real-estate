# Multi-stage Dockerfile for EstateHub Backend (Java 21 LTS)

# Stage 1: Build JAR with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Distroless / Alpine Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user and uploads directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

COPY --from=builder --chown=appuser:appgroup /app/target/realestate-backend-1.0.0.jar app.jar

ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod \
    UPLOAD_DIR=/app/uploads

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
