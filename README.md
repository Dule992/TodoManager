# 📝 Todo Manager App

A simple full-stack application to manage todo items with authentication, built using:

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express + JSON file-based storage
- **UI Testing:** Playwright + TypeScript
- **API Testing:** Playwright + TypeScript
- **Dockerized** for easy deployment and test isolation

---

## 🚀 Features

- 🔐 Login with predefined credentials
- 📋 View todos
- ➕ Add new todo
- ✏️ Edit todo
- ✅ Toggle completion
- ❌ Delete todo
- ✅ Automated UI & API tests
- 📊 Code coverage reporting

---

## 📁 Project Structure

```bash
.
├── client/             # React frontend
├── server/             # Node.js backend
├── tests/              # API tests using Playwright Request
├── e2e/                # UI tests using Playwright
├── docker-compose.yml  # Docker orchestration
├── README.md           # This file
```

## 🛠️ Technologies Used

- React, TypeScript

- Node.js, Express

- Playwright

- Docker, Docker Compose

## ✅ Run Tests

### 🔹 UI Tests (Playwright)

```bash
npx playwright install
npx playwright test
```

### 🔹 API Tests (Playwright)

```bash
npm run test:api
```

## 🔹 Code Coverage

```bash
npm run test:api:coverage
```

## 🐳 Docker Setup

- Start both frontend and backend:

```bash
docker-compose up --build
```

- App will be available at:

- Frontend: http://localhost:5173

- Backend API: http://localhost:4000

## ⚠️ Assumptions and Limitations

- Backend runs on localhost:4000, frontend on localhost:3000.

- Test credentials are hardcoded (e.g., admin/admin).

- Database is a simple JSON file and not persistent across sessions in containerized environments.

- UI tests run only in Chromium; other browsers can be configured if needed.

- No advanced validation or performance testing is implemented yet.

## 🧪 Test Coverage

✔️ Login with valid/invalid credentials

✔️ Creating, editing, deleting todo items

✔️ Assertions for data integrity after each operation

✔️ UI flows tested with Playwright (POM-based)

✔️ API endpoints covered using Jest + Supertest

✔️ Optional Istanbul code coverage reporting

## 📎 Notes

- Modular design with clear separation of concerns.

- Playwright UI tests use Page Object Model for maintainability.

- Docker ensures parity between development and CI environments.

- Future work: CI/CD integration, data seeding/reset scripts, mocking external services.

## 📬 Contact

Maintainer: Dušan Milić
Feel free to contribute or raise issues.
