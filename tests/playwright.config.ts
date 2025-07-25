import { defineConfig, devices } from "@playwright/test";
import { appConfig } from "./global-setup";

export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  testDir: "./tests",
  timeout: appConfig.timeout,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    [
      "allure-playwright",
      {
        detail: true,
        outputFolder: "../allure-results",
        suiteTitle: true,
      },
    ],
  ],
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: false,
  },
  projects: [
    {
      name: "Setup",
      testMatch: "**/*setup.ts",
    },
    {
      name: "UI Tests on Chrome",
      testMatch: "**/*ui-tests.ts",
      dependencies: ["Setup"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "API Tests",
      testMatch: "**/*api-tests.ts",
      dependencies: ["Setup"],
      use: { baseURL: appConfig.apiBaseURL },
    },
  ],
});
