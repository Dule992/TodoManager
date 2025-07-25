import path from "path";
import { loadData } from "../../../_utils/load-data";

const todoApiTestDataPath = path.resolve(__dirname, "todo-test-data.json");
export const pathToCreatedItemFile = path.resolve(
  __dirname,
  "created-item.json",
);

export const todoApiLoginTestData = loadData(
  todoApiTestDataPath,
  "loginTestData",
) as any;
export const todoApiTodoTestData = loadData(
  todoApiTestDataPath,
  "todoTestData",
) as any;
export const createdItemTestData = loadData(pathToCreatedItemFile) as any;
