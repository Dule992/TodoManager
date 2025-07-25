import { LoginPage } from "./pages/login-page";
import { TodoPage } from "./pages/todo-page";
import { validTodoTestData } from "./data/todo-test-data";
import { BrowserContext, expect, test } from "@playwright/test";
import { deleteAllTodos, getAllTodos } from "../../helpers/api-helper";

let loginPage: LoginPage;
let todoPage: TodoPage;
let context: BrowserContext;

test.beforeEach(async ({ page }) => {
  context = page.context();
  loginPage = new LoginPage(page);
  todoPage = new TodoPage(page);
  await loginPage.open();
});

test.describe("Todo App UI Tests - Todo tests", () => {
  test(
    "Create a new todo",
    {
      tag: ["@ui", "@smoke", "@regression"],
    },
    async () => {
      // Arrange
      await loginPage.login(
        validTodoTestData.username,
        validTodoTestData.password,
      );
      // Act
      await todoPage.addTodo(validTodoTestData.todoTitle);
      // Assert
      const isTodoExists = await todoPage.isTodoExists(
        validTodoTestData.todoTitle,
      );
      expect(isTodoExists).toBe(true);
    },
  );

  test(
    "Edit an existing todo",
    {
      tag: ["@ui", "@smoke", "@regression"],
    },
    async () => {
      // Arrange
      await loginPage.login(
        validTodoTestData.username,
        validTodoTestData.password,
      );
      // Act
      const original = validTodoTestData.todoTitle;
      const updated = validTodoTestData.todoUpdatedTitle;
      await todoPage.editTodo(original, updated);
      // Assert
      const isUpdatedTaskExist = await todoPage.isTodoExists(updated);
      expect(isUpdatedTaskExist).toBe(true);
    },
  );

  test(
    "Delete a todo",
    {
      tag: ["@ui", "@smoke", "@regression"],
    },
    async () => {
      // Arrange
      await loginPage.login(
        validTodoTestData.username,
        validTodoTestData.password,
      );
      // Act
      const task = validTodoTestData.todoDeleteMe;
      await todoPage.addTodo(task);
      await todoPage.deleteTodo(task);
      // Assert
      const isTaskExist = await todoPage.isTodoExists(task);
      expect(isTaskExist).toBe(false);
    },
  );

  test(
    "Toggle todo completed state",
    {
      tag: ["@ui", "@smoke", "@regression"],
    },
    async ({ page }) => {
      // Arrange
      await loginPage.login(
        validTodoTestData.username,
        validTodoTestData.password,
      );
      const task = "Toggle me";
      // Act
      await todoPage.addTodo(task);
      await todoPage.toggleTodo(task);
      // Assert
      const todoText = page.getByText(task);
      await expect(todoText).toHaveCSS(
        "text-decoration",
        validTodoTestData.colorCompletedStatus,
      );
    },
  );

  test.afterAll(async () => {
    // Cleanup actions if needed
    // For example, you can delete all todos created during the tests
    // await todoPage.deleteAllTodos();
    console.log("All tests completed. Cleanup actions can be performed here.");
    const todoIds = await getAllTodos();
    if (todoIds.length > 0) {
      console.log(`Deleting ${todoIds.length} todos after tests...`);
      await deleteAllTodos(todoIds);
    } else {
      console.log("No todos to delete after tests.");
    }
    await context.close();
  });
});
