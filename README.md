# Project 3

# Fullstack Web Application with Spring Boot and Angular

## 📝 Project Overview

This repository contains the project5 of  OpenClassrooms [Angular and Java development](https://openclassrooms.com/fr/paths/533-developpeur-full-stack-java-et-angular) development path.It was built as a fullstack web application with:

- **Backend**: Spring Boot (Java) for REST API
- **Frontend**: Angular (TypeScript) for user interface
- **Testing**: Comprehensive test suite including unit, integration, and e2e tests

## 🛠️ Technologies Used

### Backend (Spring Boot)

- Spring Boot
- Spring Data JPA
- Spring Security
- Hibernate
- Maven
- Mysql
- Testing:
  - JUnit 5
  - Mockito
  - Jacoco (code coverage)
  - Failsafe (integration tests)
  - Surefire (unit tests)

### Frontend (Angular)

- Angular
- RxJS
- Angular Material (or other UI library)
- Testing:
  - Jest (integration and unit tests)
  - Cypress (e2e tests)

## 🚀 Installation & Setup

### Prerequisites

- Java JDK
- Node
- npm or yarn
- MySQL
- Maven



1. **Clone the repository**
  
        git clone https://github.com/tesfayande/project5.git

### Backend Setup

        cd fullstack-app/backend

1. **Configure database**
   - Create a database in your DBMS
   - Update application.properties with your DB credentials

2. **Build and run**

## Using Maven

        mvn clean install
        mvn spring-boot:run

### Or run directly from IDE

4.Verify backend is running**

- Open http://localhost:8080


### Frontend Setup

1.**Navigate to frontend directory**

        cd front

2.**Install dependencies**

        npm install
##### or
        yarn install

3.**Run development server**
        ng serve

4.**Access the application**

- Open http://localhost:4200 in your browser

## 🧪 Testing

### Backend Tests

1.**Unit tests (Surefire)**
  
     mvn test

- Reports generated at `target/site/jacoco-unit/index.html`

2.**Integration tests (Failsafe)**
   ```bash
   mvn verify
   ```

- Reports generated at `target/site/jacoco-integration/index.html`

3.**Code coverage (Jacoco)**
   - Reports generated at `target/site/jacoco/index.html`
   ```bash
   mvn test jacoco:report
   ```

### Frontend Tests

1. **Unit tests (Jest)**
   ```bash
   npm test
   # or
   yarn test
   ```

2. **E2E tests (Cypress)**
   ```bash
   npm run e2e
   # or for interactive mode
   npx cypress open
   ```

## 📦 Libraries & Dependencies

### Backend (Key Dependencies)
```xml
<!-- In pom.xml -->
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Code Coverage -->
    <dependency>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <version>0.8.8</version>
    </dependency>
</dependencies>
```

### Frontend (Key Dependencies)
```json
// In package.json
"dependencies": {
    "@angular/core": "^15.0.0",
    "@angular/material": "^15.0.0",
    "rxjs": "^7.0.0"
},
"devDependencies": {
    "@types/jest": "^27.0.0",
    "jest": "^27.0.0",
    "cypress": "^10.0.0",
    "@angular/cli": "^15.0.0"
}
```

## 🌟 Features
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact
Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/fullstack-app](https://github.com/yourusername/fullstack-app)