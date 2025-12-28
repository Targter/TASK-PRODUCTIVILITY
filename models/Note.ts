import mongoose, { Schema, models, model } from "mongoose";

const NoteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["daily", "monthly", "general"], 
      default: "daily" 
    },
    // For Daily notes
    date: { type: Date }, 
    // For Monthly notes (e.g., "2023-10-01" representing October)
    monthIdentifier: { type: Date }, 
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Note = models.Note || model("Note", NoteSchema);

export default Note;