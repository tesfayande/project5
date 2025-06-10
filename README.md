# Project 5

## Testez une application full-stack

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

1. **Clone the repository**
  
        git clone https://github.com/tesfayande/project5.git

### Backend Setup

        cd fullstack-app/back

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

3.**Run development server**

        ng serve

4.**Access the application**

- Open http://localhost:4200 in your browser


## 🧪 Testing

### Backend Tests

1.**Unit tests (Surefire)**
  
     mvn test

### Or

    mvn test jacoco:report

- Reports generated at `target/site/jacoco-unit/index.html`

2.**Integration tests (Failsafe)**

    mvn verify
  
- Reports generated at `target/site/jacoco-integration/index.html`

### Frontend Tests

1.**Unit tests (Jest)**

Launching Unit test:

> npm run test:unit
  
- Reports generated at `front/coverage/jest/unit/lcov-report/index.html`

2.**Integration tests (Jest)**

Launching Integration test:

> npm run test:integration

- Reports generated at `front/coverage/jest/integration/lcov-report/index.html`

3.**E2E tests (Cypress)**

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html
