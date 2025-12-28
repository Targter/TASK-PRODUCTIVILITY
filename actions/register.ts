"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate input
  const validatedFields = RegisterSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name: vName, email: vEmail, password: vPassword } = validatedFields.data;

  try {
    await connectDB();

    // Check existing user
    const existingUser = await User.findOne({ email: vEmail });
    if (existingUser) {
      return { error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(vPassword, 10);

    // Create user
    await User.create({
      name: vName,
      email: vEmail,
      password: hashedPassword,
    });

    return { success: "Account created! Please login." };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong" };
  }
}