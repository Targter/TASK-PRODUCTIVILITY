"use server";

import connectDB from "@/lib/db";
// import Reminder from "@/models/Reminder";
import Reminder from "@/models/Reminder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

export async function createReminder(formData: FormData) {
  const userId = await getUserId();
  await connectDB();

  const title = formData.get("title");
  const dateTime = formData.get("dateTime");

  if (!title || !dateTime) return { error: "Missing fields" };

  try {
    await Reminder.create({
      user: userId,
      title,
      dateTime: new Date(dateTime as string),
      isAcknowledged: false,
    });
    revalidatePath("/");
    revalidatePath("/reminders");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create reminder" };
  }
}

export async function getActiveReminders() {
  const userId = await getUserId();
  await connectDB();
  
  const now = new Date();

  // Fetch reminders that have passed their time but haven't been acknowledged
  const active = await Reminder.find({
    user: userId,
    dateTime: { $lte: now },
    isAcknowledged: false,
  }).sort({ dateTime: -1 });

  return JSON.parse(JSON.stringify(active));
}

export async function getAllReminders() {
  const userId = await getUserId();
  await connectDB();
  
  // Future reminders
  const future = await Reminder.find({
    user: userId,
    isAcknowledged: false,
  }).sort({ dateTime: 1 });

  return JSON.parse(JSON.stringify(future));
}

export async function acknowledgeReminder(id: string) {
  const userId = await getUserId();
  await connectDB();

  await Reminder.findOneAndUpdate(
    { _id: id, user: userId },
    { isAcknowledged: true }
  );
  
  revalidatePath("/");
}