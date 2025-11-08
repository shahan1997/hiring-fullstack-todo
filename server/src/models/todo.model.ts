import mongoose from "mongoose"

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
      unique: [true, "A todo with this title already exists"],
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// The field-level unique: true with collation is sufficient for case-insensitive uniqueness

export const TodoModel = mongoose.model("Todo", todoSchema)
