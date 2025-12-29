
"use server";

import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, subDays } from "date-fns";



/**
 * Fetch the note for the Selected Date and the Previous Day (Context)
 */
export async function getDailyNoteContext(dateStr?: string) {
  const userId = await getUserId();
  await connectDB();

  // Default to today if no date provided
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  
  const targetStart = startOfDay(targetDate);
  const targetEnd = endOfDay(targetDate);
  
  // "Yesterday" is relative to the selected target date
  const prevDate = subDays(targetDate, 1);
  const prevStart = startOfDay(prevDate);
  const prevEnd = endOfDay(prevDate);

  const [targetNote, prevNote] = await Promise.all([
    Note.findOne({
      user: userId,
      type: "daily",
      date: { $gte: targetStart, $lte: targetEnd },
    }),
    Note.findOne({
      user: userId,
      type: "daily",
      date: { $gte: prevStart, $lte: prevEnd },
    }),
  ]);

  return {
    note: targetNote ? JSON.parse(JSON.stringify(targetNote)) : null,
    prevNote: prevNote ? JSON.parse(JSON.stringify(prevNote)) : null,
    currentDate: targetDate, // Return this for the UI to verify
    prevDate: prevDate
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
    // We don't revalidatePath('/') blindly to avoid scroll jumps, 
    // the client component handles the success state.
    // However, revalidating the specific notes path ensures data consistency.
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save note" };
  }
}


async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

/**
 * Fetch ALL notes for the target date and previous date
 */
export async function getDailyNotes(dateStr?: string) {
  const userId = await getUserId();
  await connectDB();

  const targetDate = dateStr ? new Date(dateStr) : new Date();
  
  const targetStart = startOfDay(targetDate);
  const targetEnd = endOfDay(targetDate);
  
  const prevDate = subDays(targetDate, 1);
  const prevStart = startOfDay(prevDate);
  const prevEnd = endOfDay(prevDate);

  const [targetNotes, prevNotes] = await Promise.all([
    Note.find({
      user: userId,
      type: "daily",
      date: { $gte: targetStart, $lte: targetEnd },
    }).sort({ createdAt: 1 }), // Oldest first (Log style)

    Note.find({
      user: userId,
      type: "daily",
      date: { $gte: prevStart, $lte: prevEnd },
    }).sort({ createdAt: 1 }),
  ]);

  return {
    notes: JSON.parse(JSON.stringify(targetNotes)),
    prevNotes: JSON.parse(JSON.stringify(prevNotes)),
    currentDate: targetDate,
    prevDate: prevDate
  };
}

/**
 * Create a NEW Note Entry
 */
export async function createDailyNote(formData: FormData) {
  const userId = await getUserId();
  await connectDB();

  const content = formData.get("content");
  const dateStr = formData.get("date"); // ISO string
  
  if (!dateStr || !content) return { error: "Missing data" };

  try {
    await Note.create({
      user: userId,
      content,
      type: "daily",
      date: new Date(dateStr as string),
    });
    
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create note" };
  }
}

/**
 * Delete a Note
 */
export async function deleteNote(noteId: string) {
  const userId = await getUserId();
  await connectDB();

  await Note.findOneAndDelete({ _id: noteId, user: userId });
  revalidatePath("/notes");
}