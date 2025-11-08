"use client";

import { useState, useCallback, useEffect } from "react";
import { todoService } from "../services/todoService";
import type { Todo, CreateTodoInput } from "../types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load todos";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (input: CreateTodoInput) => {
    try {
      const newTodo = await todoService.createTodo(input);
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create todo";
      setError(message);
      throw err;
    }
  }, []);

  const updateTodoItem = useCallback(
    async (
      id: string,
      updates: Partial<CreateTodoInput> & { completed?: boolean }
    ) => {
      try {
        const updated = await todoService.updateTodo(id, updates);
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? updated : todo))
        );
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update todo";
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateStatusTodoItem = useCallback(
    async (
      id: string,
      updates: Partial<CreateTodoInput> & { completed?: boolean }
    ) => {
      try {
        const updated = await todoService.updateStatusTodo(id, updates);
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? updated : todo))
        );
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update todo";
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteTodoItem = useCallback(async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete todo";
      setError(message);
      throw err;
    }
  }, []);

  const toggleTodoComplete = useCallback(
    async (id: string) => {
      const todo = todos.find((t) => t._id === id);
      if (!todo) return;

      return updateStatusTodoItem(id, { completed: !todo.done });
    },
    [todos, updateStatusTodoItem]
  );

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodoItem,
    updateStatusTodoItem,
    deleteTodoItem,
    toggleTodoComplete,
  };
};
