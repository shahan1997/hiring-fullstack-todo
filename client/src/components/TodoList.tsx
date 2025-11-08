"use client";

import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, title: string, description?: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  loading = false,
  error = null,
}: TodoListProps) {
  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;

  if (loading && totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Loading todos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No tasks yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-700 dark:text-blue-300">
          Progress: <span className="font-semibold">{completedCount}</span> of{" "}
          <span className="font-semibold">{totalCount}</span> tasks completed
        </p>
        <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
