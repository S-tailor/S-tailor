FROM openjdk:17-jdk-slim as builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew clean build

FROM openjdk:17-jdk-slim as runner
COPY --from=builder /app/build/libs/Emo-Bank-1.0-SNAPSHOT.jar ./app.jar
ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "./app.jar"]
