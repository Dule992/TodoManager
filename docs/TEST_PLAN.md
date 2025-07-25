# 🧪 Test Plan / Test Strategy – Todo Manager App

**Project**: Todo Manager  
**Stack**: React (Frontend) + Node.js/Express (Backend)  
**Author**: Dušan Milić  
**Date**: 25.7.2025

---

## ✅ What is Being Tested

This strategy outlines the approach to testing a full-stack Todo Manager application. The goal is to ensure both frontend (UI) and backend (API) functionalities perform correctly under typical usage conditions and error scenarios.

---

## 🧩 Test Coverage Areas

### 🔹 UI Functional Tests (React App)

- Login with valid credentials ✅
- Login with invalid credentials ❌
- Create a new todo
- Edit an existing todo
- Delete a todo
- Assert that data is correctly updated/rendered

### 🔹 API Tests (Node.js Backend)

- `POST /login`: valid and invalid login
- `GET /todos`: verify list of todos
- `POST /todos`: add new todo with valid/invalid data
- `PUT /todos/:id`: update existing todo
- `DELETE /todos/:id`: delete a todo
- Validate status codes, response schema, and data integrity

---

## 🛠️ Tools Used and Why

| Tool                        | Purpose                 | Reason                                                               |
| --------------------------- | ----------------------- | -------------------------------------------------------------------- |
| **Playwright**              | UI Automation Testing   | Modern, fast, supports Chromium/WebKit/Firefox, built-in test runner |
| **Playwright**              | API Testing (Node.js)   | Lightweight and easy to use with the same configuration as UI        |
| **Docker & Docker Compose** | Containerized execution | Ensures consistent, reproducible environments                        |
| **nyc / istanbul**          | Code coverage           | Tracks test coverage for backend                                     |

---

## ▶️ How to Run the Tests

### 📦 Setup

1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
2. Start app with Docker:

   ```bash
   docker-compose up --build
   ```

## ✅ Run Tests

### 🔹 UI Tests (Playwright)

```bash
npx playwright install
npm run test:ui
```

## 🔹 API Tests (Playwright)

```bash
npm run test:api
```

### ⚠️ Assumptions and Limitations

- Assumes the backend service is running on localhost:3001 and frontend on localhost:3000.

- Basic error handling is covered; extended validations and performance/load tests are out of scope.

- Test credentials are predefined (e.g., admin/admin).

- Database is assumed to be in a clean or test-ready state before execution.

- UI tests are written for Chromium; other browsers (WebKit/Firefox) can be added if needed.

### 📎 Notes

- Tests are modular and follow Page Object Model (POM) for maintainability.

- Docker ensures parity between local and CI environments.

- Future improvements may include:

- CI integration (e.g., GitHub Actions, GitLab CI)

- Database seeding/reset hooks before tests

- Mocking external APIs or services
