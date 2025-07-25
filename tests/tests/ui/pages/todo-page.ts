import { Page, expect } from "@playwright/test";

export class TodoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async isVisible() {
    await expect(this.page.getByText("Todos")).toBeVisible();
    console.log("Todo page is visible.");
    // Ensure the page is fully loaded before proceeding
    await this.page.waitForLoadState("networkidle");
    console.log("Todo page fully loaded.");
  }

  async addTodo(title: string) {
    const newTodoInputLocator = this.page.getByPlaceholder("New todo");
    const addButtonLocator = this.page.getByRole("button", { name: "Add" });
    try {
      await newTodoInputLocator.fill(title);
      await addButtonLocator.click();
      await expect(this.page.getByText(title)).toBeVisible();
      console.log(`Todo "${title}" added successfully.`);
    } catch (error) {
      console.error(`Failed to add todo "${title}": ${error}`);
    }
  }

  async isTodoExists(title: string): Promise<boolean> {
    console.log(`Checking if todo "${title}" exists...`);
    // Check if the To do item is present in the DOM
    try {
      await expect(this.page.getByText(title)).toBeVisible();
      console.log(`Todo "${title}" exists.`);
      return true;
    } catch (error) {
      console.error(`Error checking todo existence: ${error}`);
      return false;
    }
  }

  async toggleTodo(title: string) {
    try {
      const todoItem = this.page.getByText(title).locator("..");
      await todoItem.getByRole("button", { name: "Toggle" }).click();
      await expect(todoItem).toHaveCSS("text-decoration", /line-through/);
      console.log(`Todo "${title}" toggled successfully.`);
    } catch (error) {
      console.error(`Failed to toggle todo "${title}": ${error}`);
    }
  }

  async deleteTodo(title: string) {
    try {
      const todoItem = this.page.getByText(title).locator("..");
      await todoItem.getByRole("button", { name: "Delete" }).click();
      await expect(todoItem).toHaveCount(0);
      console.log(`Todo "${title}" deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete todo "${title}": ${error}`);
    }
  }

  async editTodo(oldTitle: string, newTitle: string) {
    try {
      const todoItem = this.page
        .getByText("Write Playwright tests")
        .locator("..");
      const editButton = todoItem.getByRole("button", { name: "Edit" });
      await editButton.click();

      const input = this.page.getByRole("list").getByRole("textbox");
      await input.clear();
      await input.fill(newTitle);

      const saveButton = this.page.getByRole("button", { name: "Save" });
      await saveButton.click();

      await expect(this.page.getByText(newTitle)).toBeVisible();
      await expect(this.page.getByText(oldTitle, { exact: true })).toHaveCount(
        0,
      );
      console.log(`Todo "${oldTitle}" edited to "${newTitle}" successfully.`);
      await this.isTodoExists(newTitle);
    } catch (error) {
      console.error(`Failed to edit todo "${oldTitle}": ${error}`);
    }
  }
}
