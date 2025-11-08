"use client"

import type React from "react"

import { useState } from "react"
import type { CreateTodoInput } from "../types"

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => Promise<void>
  loading?: boolean
}

export function TodoForm({ onSubmit, loading = false }: TodoFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      })
      setTitle("")
      setDescription("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create todo"
      setError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your task..."
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white disabled:opacity-50"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{title.length}/100</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your task..."
          disabled={loading}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white disabled:opacity-50 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description.length}/500</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  )
}
