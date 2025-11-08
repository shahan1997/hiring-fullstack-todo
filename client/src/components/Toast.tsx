"use client"

import { useEffect } from "react"

export interface ToastMessage {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface ToastProps {
  toast: ToastMessage
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration || 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[toast.type]

  return (
    <div
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-in flex items-center justify-between gap-2 min-w-max`}
    >
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="text-white hover:opacity-80 font-bold">
        ×
      </button>
    </div>
  )
}
