// "use server";

// import connectDB from "@/lib/db";
// // import Reminder from "@/models/Reminder";
// import Reminder from "@/models/Reminder";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { revalidatePath } from "next/cache";

// // middlewatre to get user id
// async function getUserId() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user) throw new Error("Unauthorized");
//   // @ts-ignore
//   return session.user.id;
// }

// export async function createReminder(formData: FormData) {
//   const userId = await getUserId();
//   await connectDB();

//   const title = formData.get("title");
//   const dateTime = formData.get("dateTime");

//   if (!title || !dateTime) return { error: "Missing fields" };

//   try {
//     await Reminder.create({
//       user: userId,
//       title,
//       dateTime: new Date(dateTime as string),
//       isAcknowledged: false,
//     });
//     revalidatePath("/");
//     revalidatePath("/reminders");
//     return { success: true };
//   } catch (error) {
//     return { error: "Failed to create reminder" };
//   }
// }

// export async function getActiveReminders() {
//   const userId = await getUserId();
//   await connectDB();
  
//   const now = new Date();
//   console.log("Fetching active reminders for user:", userId, "at", now);  

//   // Fetch reminders that have passed their time but haven't been acknowledged
//   const active = await Reminder.find({
//     user: userId,
//     dateTime: { $lte: now },
//     isAcknowledged: false,
//   }).sort({ dateTime: -1 });

//   return JSON.parse(JSON.stringify(active));
// }

// export async function getAllReminders() {
//   const userId = await getUserId();
//   await connectDB();
  
//   // Future reminders
//   const future = await Reminder.find({
//     user: userId,
//     isAcknowledged: false,
//   }).sort({ dateTime: 1 });

//   return JSON.parse(JSON.stringify(future));
// }

// export async function acknowledgeReminder(id: string) {
//   const userId = await getUserId();
//   await connectDB();

//   await Reminder.findOneAndUpdate(
//     { _id: id, user: userId },
//     { isAcknowledged: true }
//   );
  
//   revalidatePath("/");
// }


"use server";

import connectDB from "@/lib/db";
import Reminder from "@/models/Reminder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, isSameDay } from "date-fns";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

// ... createReminder (keeps same) ...
export async function createReminder(formData: FormData) {
  const userId = await getUserId();
  await connectDB();
  const title = formData.get("title");
  const dateTime = formData.get("dateTime"); 
  if (!title || !dateTime) return { error: "Missing fields" };
  await Reminder.create({
    user: userId,
    title,
    dateTime: new Date(dateTime as string),
    isAcknowledged: false,
  });
  revalidatePath("/");
  revalidatePath("/reminders");
  return { success: true };
}

/**
 * SMART FETCH:
 * - If TODAY: Get Today's + ALL Overdue (So you see all pending work at once).
 * - If OTHER DATE: Get ONLY that specific day's reminders (Strict view).
 */
export async function getRemindersForDate(dateStr?: string) {
  const userId = await getUserId();
  await connectDB();
  
  // 1. Determine Target Date
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  
  // 2. Check if we are viewing "Today"
  const isToday = isSameDay(targetDate, new Date());
  
  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  let query: any = {
    user: userId,
    isAcknowledged: false, // We only want pending items
  };

  if (isToday) {
    
    query.dateTime = { $lte: end }; 
  } else {
    // --- LOGIC FOR SPECIFIC DATES (e.g. 30, 31) ---
    // "If user want then only it will load... for that day only"
    // Fetch strictly within that 24-hour window.
    query.dateTime = {  $lte: end };
  }

  const reminders = await Reminder.find(query).sort({ dateTime: 1 });

  return JSON.parse(JSON.stringify(reminders));
}

// ... acknowledgeReminder (keeps same) ...
export async function acknowledgeReminder(id: string) {
  const userId = await getUserId();
  await connectDB();
  await Reminder.findOneAndUpdate({ _id: id, user: userId }, { isAcknowledged: true });
  revalidatePath("/");
  revalidatePath("/reminders");
}

// ... getAllReminders (keeps same) ...
export async function getAllReminders() {
    const userId = await getUserId();
    await connectDB();
    const future = await Reminder.find({ user: userId, isAcknowledged: false }).sort({ dateTime: 1 });
    return JSON.parse(JSON.stringify(future));
}