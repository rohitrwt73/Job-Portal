# ---------- Build Stage ----------
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper & pom.xml first to leverage Docker cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# Copy project source
COPY src ./src

# Package application (skip tests for faster build)
RUN ./mvnw clean package -DskipTests


# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables (optional)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Expose application port
EXPOSE 8081

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
