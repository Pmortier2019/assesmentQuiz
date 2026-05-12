# ── Build stage ───────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# ── Run stage ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Keep memory low for Fly.io free tier (256 MB)
ENTRYPOINT ["java", \
  "-Xmx350m", "-Xss512k", "-XX:MaxMetaspaceSize=128m", \
  "-Dspring.profiles.active=railway", \
  "-jar", "app.jar"]
