import fs from "fs";

/**
 * Loads JSON data from a specified file.
 * @param filePath Path to the JSON file containing data.
 * @param key
 * @returns Parsed JSON data or a specific key's value if provided.
 * @throws Will throw an error if the file does not exist or if JSON parsing fails.
 */
export function loadData<T>(filePath: string, key?: string): T {
  if (!fs.existsSync(filePath)) {
    console.error(`Data file not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  let jsonData: unknown;
  try {
    jsonData = JSON.parse(fileContent);
  } catch (error) {
    console.error(
      `Failed to parse JSON from file: ${filePath}. Error: ${error}`,
    );
  }

  if (key) {
    if (typeof jsonData === "object" && jsonData !== null && key in jsonData) {
      return (jsonData as Record<string, unknown>)[key] as T;
    } else {
      console.error(`Key "${key}" not found in JSON data.`);
    }
  }
  return jsonData as T;
}
