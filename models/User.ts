import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will store hashed password
  },
  { timestamps: true }
);

// Prevent overwrite model error in development hot-reloading
const User = models.User || model("User", UserSchema);

export default User;