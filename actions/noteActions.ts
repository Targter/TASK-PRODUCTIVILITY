"use server";

import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, subDays } from "date-fns";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

/**
 * Fetch the note for "Today" and optionally "Yesterday" (for context)
 */
export async function getDailyNoteContext() {
  const userId = await getUserId();
  await connectDB();

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  
  const yesterdayStart = startOfDay(subDays(new Date(), 1));
  const yesterdayEnd = endOfDay(subDays(new Date(), 1));

  const [todayNote, yesterdayNote] = await Promise.all([
    Note.findOne({
      user: userId,
      type: "daily",
      date: { $gte: todayStart, $lte: todayEnd },
    }),
    Note.findOne({
      user: userId,
      type: "daily",
      date: { $gte: yesterdayStart, $lte: yesterdayEnd },
    }),
  ]);

  return {
    today: todayNote ? JSON.parse(JSON.stringify(todayNote)) : null,
    yesterday: yesterdayNote ? JSON.parse(JSON.stringify(yesterdayNote)) : null,
  };
}

/**
 * Save (Upsert) a Daily Note
 */
export async function saveDailyNote(formData: FormData) {
  const userId = await getUserId();
  await connectDB();

  const content = formData.get("content");
  const dateStr = formData.get("date"); // ISO string
  
  if (!dateStr) return { error: "Date required" };

  const date = new Date(dateStr as string);
  const start = startOfDay(date);
  const end = endOfDay(date);

  try {
    await Note.findOneAndUpdate(
      {
        user: userId,
        type: "daily",
        date: { $gte: start, $lte: end },
      },
      {
        user: userId,
        content,
        type: "daily",
        date: date,
      },
      { upsert: true, new: true }
    );
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save note" };
  }
}