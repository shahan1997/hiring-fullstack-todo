export interface ITodo {
  _id?: string
  title: string
  description?: string
  done: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface TodoRequest extends Omit<ITodo, "_id" | "createdAt" | "updatedAt"> {}
