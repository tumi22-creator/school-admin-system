# School Administration System

A full-stack school management application for managing students, teachers, classes, subjects, attendance, academic marks, parent accounts, and school fees.

## Live Demo

- **Frontend:** https://school-admin-system-js253l5ie-tumelo-s-projects22.vercel.app
- **Backend:** https://school-admin-system-1-vrft.onrender.com
- **Repository:** https://github.com/tumi22-creator/school-admin-system

## Features

- **Authentication and security:** JWT-based authentication, role-based access control, and login rate limiting.
- **Student management:** Create and manage student records and class assignments.
- **Teacher management:** Maintain teacher records and teaching assignments.
- **Academic management:** Manage grades, classes, subjects, and student enrollments.
- **Attendance tracking:** Record attendance and review attendance history.
- **Marks and report cards:** Manage assessments and view student academic results.
- **Parent portal:** Allow parents to access information about their linked students.
- **School fees:** Manage fees and payments, with parent access to relevant fee information.
- **Audit logging:** Record selected system activities for accountability.

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Axios
- CSS

**Backend**
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Gradle
- JSON Web Tokens (JWT)

**Database and Deployment**
- PostgreSQL
- Neon
- Vercel
- Render

## Architecture

The frontend communicates with a REST API built using Spring Boot. The backend manages business logic, database operations, authentication, and authorization. PostgreSQL stores the application's data.

## Running Locally

### Backend

1. Install Java 21.
2. Configure the required database connection and security environment variables.
3. Open the backend directory and run:

```bash
gradlew.bat bootRun
```

### Frontend

1. Install Node.js.
2. Open the frontend directory.
3. Configure `VITE_API_URL` to point to your backend API, including the `/api` path.
4. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Create your own local environment configuration and never commit database credentials, passwords, or JWT secrets.

## Build Verification

Frontend production build:

```bash
npm run build
```

Backend build:

```bash
gradlew.bat clean build -x test
```

## What I Learned

- Building a full-stack application with React and Spring Boot.
- Designing REST APIs and relational database relationships.
- Implementing JWT authentication and role-based authorization.
- Connecting a frontend to a PostgreSQL-backed backend.
- Deploying frontend and backend services separately.
- Managing code changes with Git and GitHub.

## Future Improvements

- Automated integration and security tests.
- More comprehensive monitoring and audit reporting.
- Improved automated deployment checks.
- Expanded documentation and application screenshots.