"use client";

import { useState, useCallback } from "react";
import { TodoHeader } from "./components/TodoHeader";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/ToastContainer";
import type { CreateTodoInput } from "./types";
import "./App.css";

function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodoItem,
    deleteTodoItem,
    toggleTodoComplete,
  } = useTodos();
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: errorToast } = useToast();

  const handleCreateTodo = useCallback(
    async (data: CreateTodoInput) => {
      setFormLoading(true);
      setFormError(null);
      try {
        await addTodo(data);
        success("Task created successfully!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create todo";
        setFormError(message);
        errorToast(message);
      } finally {
        setFormLoading(false);
      }
    },
    [addTodo, success, errorToast]
  );

  const handleToggleTodo = useCallback(
    async (id: string) => {
      try {
        await toggleTodoComplete(id);
        const todo = todos.find((t) => t._id === id);
        success(
          todo?.done ? "Task marked as pending!" : "Task marked as done!"
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update todo";
        errorToast(message);
      }
    },
    [toggleTodoComplete, todos, success, errorToast]
  );

  const handleDeleteTodo = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this task?")) {
        return;
      }
      try {
        await deleteTodoItem(id);
        success("Task deleted successfully!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete todo";
        errorToast(message);
      }
    },
    [deleteTodoItem, success, errorToast]
  );

  const handleEditTodo = useCallback(
    async (id: string, title: string, description?: string) => {
      try {
        await updateTodoItem(id, { title, description });
        success("Task updated successfully!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update todo";
        errorToast(message);
      }
    },
    [updateTodoItem, success, errorToast]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <TodoHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create a New Task
          </h2>
          <TodoForm onSubmit={handleCreateTodo} loading={formLoading} />
          {formError && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">
              {formError}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Tasks
          </h2>
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with React, Express, MongoDB & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
