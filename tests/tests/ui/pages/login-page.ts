import { Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { appConfig } from "../../../global-setup";

export class LoginPage extends BasePage {
  private readonly enterUsernameFail: "Failed to enter username: ";

  constructor(page: Page) {
    super(page);
  }

  override async open() {
    super.open(appConfig.uiBaseURL);
  }

  async login(username: string, password: string) {
    console.log(
      `Attempting to login with username: ${username} and password: ${password}`,
    );
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    console.log("Login attempt completed.");
  }

  async isLoggedIn(): Promise<boolean> {
    console.log("Checking if user is logged in...");
    try {
      const isUserLoggedIn = await this.page
        .getByRole("heading", { name: "Todos" })
        .isVisible();
      return isUserLoggedIn;
    } catch (error) {
      console.error(`Error checking login status: ${error}`);
      return false;
    }
  }

  private async enterUsername(username: string) {
    const usernameInputLocator = this.page.getByPlaceholder("Username");
    try {
      await usernameInputLocator.fill(username);
      console.log(`Username ${username} filled in.`);
    } catch (error) {
      console.error(`${this.enterUsernameFail} ${error}`);
    }
  }

  private async enterPassword(password: string) {
    const passwordInputLocator = this.page.getByPlaceholder("Password");
    try {
      await passwordInputLocator.fill(password);
      console.log(`Password ${password} filled in.`);
    } catch (error) {
      console.error(`Failed to enter password: ${error}`);
    }
  }

  private async clickLoginButton() {
    const loginButtonLocator = this.page.getByRole("button", { name: "Login" });
    try {
      await loginButtonLocator.click();
      console.log("Login button clicked.");
    } catch (error) {
      console.error(`Failed to click login button: ${error}`);
    }
  }
}
