import { test, expect, BrowserContext } from "@playwright/test";
import { LoginPage } from "./pages/login-page";
import { invalidTodoTestData, validTodoTestData } from "./data/todo-test-data";
import { TodoPage } from "./pages/todo-page";

let loginPage: LoginPage;
let todoPage: TodoPage;
let context: BrowserContext;

test.beforeEach(async ({ page }) => {
  context = page.context();
  loginPage = new LoginPage(page);
  todoPage = new TodoPage(page);
  // Arrange
  await loginPage.open();
});

test.describe("Todo App UI Tests - Login tests", () => {
  test(
    "Login with valid credentials",
    {
      tag: ["@ui", "@smoke", "@regression"],
    },
    async () => {
      // Act
      await loginPage.login(
        validTodoTestData.username,
        validTodoTestData.password,
      );
      // Assert
      expect(await loginPage.isLoggedIn()).toBe(true);
    },
  );

  test(
    "Login with invalid credentials",
    {
      tag: ["@ui", "@smoke", "@regression"],
    },
    async () => {
      // Act
      await loginPage.login(
        invalidTodoTestData.username,
        invalidTodoTestData.password,
      );
      // Assert
      expect(await loginPage.isLoggedIn()).toBe(false);
    },
  );

  test.afterAll(async () => {
    // Cleanup actions if needed
    console.log("All tests completed. Cleanup actions can be performed here.");
    await context.close();
  });
});
