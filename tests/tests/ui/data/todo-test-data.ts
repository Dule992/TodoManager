import path from "path";
import { loadData } from "../../../_utils/load-data";

const todoTestDataPath = path.resolve(__dirname, "todo-test-data.json");
export const validTodoTestData = loadData(todoTestDataPath, "validData") as any;
export const invalidTodoTestData = loadData(
  todoTestDataPath,
  "invalidData",
) as any;
