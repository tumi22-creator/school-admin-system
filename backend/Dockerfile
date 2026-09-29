FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x gradlew
RUN ./gradlew clean build

EXPOSE 10000

CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]