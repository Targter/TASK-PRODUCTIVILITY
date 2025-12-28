import mongoose, { Schema, models, model } from "mongoose";

const TaskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true }, // The scheduled date (00:00:00)
    isCompleted: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexing for performance: We will frequently query by User + Date + Status
TaskSchema.index({ user: 1, date: 1 });
TaskSchema.index({ user: 1, isCompleted: 1 });

const Task = models.Task || model("Task", TaskSchema);

export default Task;