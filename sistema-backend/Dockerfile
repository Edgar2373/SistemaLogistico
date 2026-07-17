FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

#COPY PROJECTS FILES
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

#COPY EVERTHING ELSE
COPY src src
RUN ./mvnw package -DskipTests

#BUILD THE IMAGE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]