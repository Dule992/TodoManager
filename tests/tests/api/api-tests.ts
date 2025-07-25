import { test, expect } from "@playwright/test";
import {
  createdItemTestData,
  pathToCreatedItemFile,
  todoApiLoginTestData,
  todoApiTodoTestData,
} from "./data/todo-test-data";
import path from "path";
import fs from "fs";
import { deleteAllTodos, getAllTodos } from "../../helpers/api-helper";
import { appConfig } from "../../global-setup";

test.describe("Todo App API Tests - Login tests", () => {
  test(
    "POST /login - valid credentials",
    {
      tag: ["@api", "@login", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.post(
        `${appConfig.apiBaseURL}${appConfig.login}`,
        {
          data: todoApiLoginTestData.validData,
        },
      );

      console.log("URL:", `${appConfig.apiBaseURL}${appConfig.login}`);
      console.log("Request body:", todoApiLoginTestData.validData);

      const body = await response.json();
      console.log("Login response:", body);
      expect(response.status()).toBe(200);
      expect(body.success).toBe(true);
    },
  );

  test("POST /login - invalid credentials", async ({ request }) => {
    const response = await request.post(
      `${appConfig.apiBaseURL}${appConfig.login}`,
      {
        data: todoApiLoginTestData.invalidData,
      },
    );

    console.log("URL:", `${appConfig.apiBaseURL}${appConfig.login}`);
    console.log("Request body:", todoApiLoginTestData.invalidData);

    const body = await response.json();
    console.log("Login response:", body);
    expect(response.status()).toBe(401);
    expect(body.success).toBe(false);
  });
});

test.describe("Todo App API Tests - Todo tests", () => {
  test(
    "GET /todos - should return list",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.get(
        `${appConfig.apiBaseURL}${appConfig.todos}`,
      );
      console.log("URL:", `${appConfig.apiBaseURL}${appConfig.todos}`);
      const body = await response.json();
      console.log("Response body:", body);
      expect(response.status()).toBe(200);
      console.log("Response status:", response.status());
      expect(Array.isArray(body)).toBe(true);
    },
  );

  test(
    "POST /todos - create new item",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.post(
        `${appConfig.apiBaseURL}${appConfig.todos}`,
        {
          data: todoApiTodoTestData.validData,
        },
      );
      console.log("URL:", `${appConfig.apiBaseURL}${appConfig.todos}`);

      const body = await response.json();
      console.log("Response body:", body);
      expect(body.title).toBe(todoApiTodoTestData.validData.title);
      expect(response.status()).toBe(201);
      expect(body.completed).toBe(false);

      // Save the created item ID for later tests
      const createdItem = {
        id: body.id,
        title: body.title,
        completed: body.completed,
      };

      fs.mkdirSync(path.dirname(pathToCreatedItemFile), { recursive: true });
      fs.writeFileSync(
        pathToCreatedItemFile,
        JSON.stringify(createdItem, null, 2),
        "utf-8",
      );
    },
  );

  test(
    "POST /todos - invalid data",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.post(
        `${appConfig.apiBaseURL}${appConfig.todos}`,
        {
          data: todoApiTodoTestData.invalidData,
        },
      );
      console.log("URL:", `${appConfig.apiBaseURL}${appConfig.todos}`);
      console.log("Request body: { completed: false }");
      const body = await response.json();
      console.log("Response body:", body);
      expect(response.status()).toBeGreaterThanOrEqual(400);
    },
  );

  test(
    "PUT /todos/:id - update title",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.put(
        `${appConfig.apiBaseURL}${appConfig.todos}/${createdItemTestData.id}`,
        {
          data: {
            id: createdItemTestData.id,
            title: "Updated Todo Task",
            completed: createdItemTestData.completed,
          },
        },
      );
      console.log(
        "URL:",
        `${appConfig.apiBaseURL}${appConfig.todos}/${createdItemTestData.id}`,
      );

      const body = await response.json();
      console.log("Response body:", body);

      expect(response.status()).toBe(200);
      expect(body.title).toBe("Updated Todo Task");
    },
  );

  test(
    "PUT /todos/:id - fail on invalid id",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.put(
        `${appConfig.apiBaseURL}${appConfig.todos}/99999999`,
        {
          data: { title: "Fail" },
        },
      );

      expect(response.status()).toBe(404);
    },
  );

  test(
    "DELETE /todos/:id - delete item",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.delete(
        `${appConfig.apiBaseURL}${appConfig.todos}/${createdItemTestData.id}`,
      );
      console.log(
        "URL:",
        `${appConfig.apiBaseURL}${appConfig.todos}/${createdItemTestData.id}`,
      );
      expect(response.status()).toBe(204);
    },
  );

  test(
    "DELETE /todos/:id - fail on invalid id",
    {
      tag: ["@api", "@todo", "@smoke", "@regression"],
    },
    async ({ request }) => {
      const response = await request.delete(
        `${appConfig.apiBaseURL}${appConfig.todos}/99999999`,
      );
      expect(response.status()).toBe(404);
    },
  );
});

test.afterAll(async ({ request }) => {
  // Clean up the created item file after all tests
  const todoIds = await getAllTodos();
  if (todoIds.length > 0) {
    console.log(`Deleting ${todoIds.length} todos after tests...`);
    await deleteAllTodos(todoIds);
  } else {
    console.log("No todos to delete after tests.");
  }
  await request.dispose();
});
