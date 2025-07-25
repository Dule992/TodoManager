import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { IConfig } from "./_models/i-config";

dotenv.config();
const environment = process.env.ENVIRONMENT || "dev";
const envFile =
  environment !== "dev" ? `.env${process.env.ENVIRONMENT}` : ".env";
dotenv.config({ path: `${envFile}`, override: true });
console.log(`Environment:${environment}`);

const environmentConfigPath = path.resolve(
  __dirname,
  `./_configuration/${environment}-config.json`,
);
const environmentConfig = JSON.parse(
  fs.readFileSync(environmentConfigPath, "utf-8"),
) as IConfig;
const endpointsPath = path.resolve(
  __dirname,
  "./_configuration/endpoints.json",
);
const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));

export const appConfig = { ...environmentConfig, ...endpoints };

async function globalSetup() {
  // Ensure the environment URL is set
  if (!appConfig.uiBaseURL) {
    throw new Error("Base URL is not defined in the configuration.");
  }

  // Log the environment URL for debugging purposes
  console.log(`Global setup: Using environment URL: ${appConfig.uiBaseURL}`);

  // You can add more global setup logic here if needed
}

export default globalSetup;
