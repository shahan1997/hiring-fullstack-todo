import axios from "axios";
import type { Todo, CreateTodoInput, ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const todoService = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get<ApiResponse<Todo[]>>("/todos");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch todos");
    }
    return response.data.data || [];
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<ApiResponse<Todo>>(`/todos/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch todo");
    }
    return response.data.data!;
  },

  createTodo: async (input: CreateTodoInput): Promise<Todo> => {
    const response = await apiClient.post<ApiResponse<Todo>>("/todos", input);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create todo");
    }
    return response.data.data!;
  },

  updateTodo: async (
    id: string,
    input: Partial<CreateTodoInput> & { completed?: boolean }
  ): Promise<Todo> => {
    const response = await apiClient.patch<ApiResponse<Todo>>(
      `/todos/${id}/done`,
      input
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update todo");
    }
    return response.data.data!;
  },

  deleteTodo: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/todos/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete todo");
    }
  },
};
