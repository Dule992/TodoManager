import { request } from "@playwright/test";
import { appConfig } from "../global-setup";

/**
 * Fetches all todos from the API.
 * @returns Promise resolving to an array of todos.
 */
export async function getAllTodos(): Promise<Array<any>> {
    const endpoint = appConfig.todos;
    console.log("Fetching all todos...");
    const context = await request.newContext();
    const response = await context.get(`${appConfig.apiBaseURL}${endpoint}`);
    if (response.ok()) {
        const todosData = await response.json();
        const todos = todosData.map((data: any) => data.id);
        console.log(`Fetched ${todos.length} todos successfully.`);
        return todos;
    } else {
        console.error(
            `Failed to fetch todos. Status: ${response.status()}. Response: ${await response.text()}`,
        );
        return [];
    }
}

/**
 * Deletes all todos with the given IDs.
 * @param ids
 */
export async function deleteAllTodos(ids: Array<string>): Promise<void> {
    const endpoint = appConfig.todos;
    console.log("Deleting all todos...");
    const context = await request.newContext();
    for (const id of ids) {
        console.log(`Deleting todo with ID: ${id}`);
        const response = await context.delete(
            `${appConfig.apiBaseURL}${endpoint}/${id}`,
        );
        if (response.ok()) {
            console.log(`Todo with ID: ${id} deleted successfully.`);
        } else {
            console.error(
                `Failed to delete todo with ID: ${id}. Status: ${response.status()}. Response: ${await response.text()}`,
            );
        }
    }
}
