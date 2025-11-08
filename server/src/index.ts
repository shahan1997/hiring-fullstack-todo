import express, { type Application } from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import todoRoutes from "./routes/todos"

dotenv.config()

const app: Application = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/todo-app"

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() })
})

// Routes
app.use("/api/todos", todoRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
