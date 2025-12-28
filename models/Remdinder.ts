import mongoose, { Schema, models, model } from "mongoose";

const ReminderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    // Full datetime for the reminder trigger
    dateTime: { type: Date, required: true },
    isImportant: { type: Boolean, default: false },
    // Persists until user explicitly acknowledges/clears it
    isAcknowledged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Reminder = models.Reminder || model("Reminder", ReminderSchema);

export default Reminder;