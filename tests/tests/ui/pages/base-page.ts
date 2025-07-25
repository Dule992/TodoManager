import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url: string): Promise<void> {
    console.log(`Navigating to ${url}`);
    await this.page.goto(url, { waitUntil: "load" });
  }
}
