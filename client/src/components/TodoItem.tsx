"use client";

import { useState } from "react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, title: string, description?: string) => Promise<void>;
  loading?: boolean;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  loading = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }
    try {
      await onEdit(
        todo._id,
        editTitle.trim(),
        editDescription.trim() || undefined
      );
      setIsEditing(false);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update todo";
      setError(message);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-3 animate-in">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          maxLength={100}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
          rows={2}
          maxLength={500}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-2 px-3 rounded transition-colors"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={loading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-900 dark:text-white font-medium py-2 px-3 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start gap-4 transition-all hover:shadow-md ${
        todo.done ? "bg-gray-50 dark:bg-gray-800 opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo._id)}
        disabled={loading}
        className="mt-1 w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 accent-green-500"
      />
      <div className="flex-1 min-w-0">
        <h3
          className={`text-lg font-medium text-gray-900 dark:text-white transition-all ${
            todo.done ? "line-through text-gray-400 dark:text-gray-500" : ""
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p
            className={`text-gray-600 dark:text-gray-400 text-sm mt-1 transition-all ${
              todo.done ? "line-through text-gray-400 dark:text-gray-500" : ""
            }`}
          >
            {todo.description}
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {new Date(todo.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo._id)}
          disabled={loading}
          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
