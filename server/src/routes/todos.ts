import express, { type Router, type Request, type Response } from "express"
import { TodoModel } from "../models/todo.model"
import type { ITodo, TodoRequest } from "../types/todo"

const router: Router = express.Router()

// GET all todos
router.get("/", async (req: Request, res: Response) => {
  try {
    const todos = await TodoModel.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      data: todos,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// POST create a new todo
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body as TodoRequest

    if (!title || title.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Title is required",
      })
      return
    }

    const existingTodo = await TodoModel.findOne({
      title: new RegExp(`^${title.trim()}$`, "i"),
    })

    if (existingTodo) {
      res.status(409).json({
        success: false,
        message: "A todo with this title already exists. Please use a different title.",
      })
      return
    }

    const todo = await TodoModel.create({
      title: title.trim(),
      description: description?.trim(),
      done: false,
    })

    res.status(201).json({
      success: true,
      data: todo,
      message: "Todo created successfully",
    })
  } catch (error) {
    let errorMessage = "Failed to create todo"
    let statusCode = 400

    if (error instanceof Error) {
      if (error.message.includes("duplicate") || error.message.includes("E11000")) {
        errorMessage = "A todo with this title already exists. Please use a different title."
        statusCode = 409
      } else {
        errorMessage = error.message
      }
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// PUT update a todo
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, done } = req.body as Partial<TodoRequest>

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      })
      return
    }

    if (title) {
      const existingTodo = await TodoModel.findOne({
        _id: { $ne: id },
        title: new RegExp(`^${title.trim()}$`, "i"),
      })

      if (existingTodo) {
        res.status(409).json({
          success: false,
          message: "A todo with this title already exists. Please use a different title.",
        })
        return
      }
    }

    const updateData: Partial<ITodo> = {}
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (done !== undefined) updateData.done = done

    const todo = await TodoModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!todo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      })
      return
    }

    res.json({
      success: true,
      data: todo,
      message: "Todo updated successfully",
    })
  } catch (error) {
    let errorMessage = "Failed to update todo"
    let statusCode = 400

    if (error instanceof Error) {
      if (error.message.includes("duplicate") || error.message.includes("E11000")) {
        errorMessage = "A todo with this title already exists. Please use a different title."
        statusCode = 409
      } else {
        errorMessage = error.message
      }
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// PATCH toggle done status
router.patch("/:id/done", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      })
      return
    }

    const todo = await TodoModel.findById(id)

    if (!todo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      })
      return
    }

    todo.done = !todo.done
    await todo.save()

    res.json({
      success: true,
      data: todo,
      message: "Todo status toggled successfully",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to toggle todo status",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// DELETE a todo
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      })
      return
    }

    const todo = await TodoModel.findByIdAndDelete(id)

    if (!todo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      })
      return
    }

    res.json({
      success: true,
      data: todo,
      message: "Todo deleted successfully",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete todo",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

export default router
