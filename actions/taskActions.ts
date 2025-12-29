"use server";

import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, endOfMonth, startOfMonth, parseISO ,eachDayOfInterval, addDays} from "date-fns";

/**
 * Helper to get the authenticated user's ID
 */
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

export async function getUserTasks(filter: "pending" | "completed" = "pending") {
    const userId = await getUserId();
    await connectDB();
  
    const isCompleted = filter === "completed";
  
    // Sort: Pending tasks by date (asc), Completed tasks by newest (desc)
    const sortOrder = isCompleted ? -1 : 1;
  
    const tasks = await Task.find({
      user: userId,
      isCompleted: isCompleted,
    }).sort({ date: sortOrder, createdAt: -1 });
  
    return JSON.parse(JSON.stringify(tasks));
  }
// 

export async function createTask(formData: FormData) {
  const userId = await getUserId();
  await connectDB();

  const title = formData.get("title") as string;
  const dateInput = formData.get("date") as string; 
  const repeatMode = formData.get("repeatMode") as string; // "none", "tomorrow", "month", "custom"
  const endDateInput = formData.get("endDate") as string;

  if (!title || !dateInput) return { error: "Required fields missing" };

  const baseDate = new Date(dateInput);

  try {
    const tasksToInsert = [];

    // Logic: Always create the base task
    tasksToInsert.push({
      user: userId,
      title,
      date: baseDate,
      isCompleted: false,
    });

    // Handle Repetition
    if (repeatMode === "tomorrow") {
      // Add one more for the next day
      tasksToInsert.push({
        user: userId,
        title,
        date: addDays(baseDate, 1),
        isCompleted: false,
      });
    } 
    else if (repeatMode === "month") {
      // Fill rest of the month
      const currentMonthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
      const days = eachDayOfInterval({ 
        start: addDays(baseDate, 1), // Start from next day
        end: currentMonthEnd 
      });
      
      days.forEach(day => {
        tasksToInsert.push({ user: userId, title, date: day, isCompleted: false });
      });
    }
    else if (repeatMode === "custom" && endDateInput) {
      // Fill until custom date
      const end = new Date(endDateInput);
      if (end > baseDate) {
         const days = eachDayOfInterval({ 
            start: addDays(baseDate, 1), 
            end: end 
         });
         days.forEach(day => {
            tasksToInsert.push({ user: userId, title, date: day, isCompleted: false });
         });
      }
    }

    await Task.insertMany(tasksToInsert);
    revalidatePath("/");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}

/**
 * 2. Duplicate a Task
 */
export async function duplicateTask(taskId: string, targetDateStr?: string) {
  const userId = await getUserId();
  await connectDB();

  try {
    const original = await Task.findOne({ _id: taskId, user: userId });
    if (!original) return { error: "Task not found" };

    // Default to today if no date provided, or use the provided date
    const newDate = targetDateStr ? new Date(targetDateStr) : new Date();

    await Task.create({
      user: userId,
      title: original.title, // Copy title
      description: original.description,
      date: newDate,
      isCompleted: false, // Reset status
      isImportant: original.isImportant,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to copy" };
  }
}

// ... Keep existing delete/toggle actions ...
export async function toggleTaskStatus(taskId: string, currentStatus: boolean) {
  const userId = await getUserId();
  await connectDB();
  await Task.findOneAndUpdate({ _id: taskId, user: userId }, { isCompleted: !currentStatus });
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  await connectDB();
  await Task.findOneAndDelete({ _id: taskId, user: userId });
  revalidatePath("/");
}


/**
 * Fetch tasks for the Dashboard.
 * Returns:
 * 1. Today's Tasks
 * 2. Overdue Tasks (Carry-over: Pending tasks from past)
 */

export async function getDashboardTasks(dateStr?: string) {
  const userId = await getUserId();
  await connectDB();

  // 1. Determine the "View Date" (Target)
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  
  const targetStart = startOfDay(targetDate);
  const targetEnd = endOfDay(targetDate);

  try {
    // 2. Fetch Tasks scheduled specifically FOR this day
    const targetTasks = await Task.find({
      user: userId,
      date: { $gte: targetStart, $lte: targetEnd },
    }).sort({ createdAt: -1 });

    // 3. Fetch "Carry-over" Tasks (Pending)
    // LOGIC FIX: Find tasks strictly OLDER than the view date that are NOT completed.
    // This allows you to see what was overdue on the 22nd (tasks from 21st, 20th...).
    const pendingTasks = await Task.find({
      user: userId,
      date: { $lt: targetStart }, // Strictly before the viewing day starts
      isCompleted: false,
    }).sort({ date: 1 }); // Oldest first

    return {
      tasks: JSON.parse(JSON.stringify(targetTasks)),
      pending: JSON.parse(JSON.stringify(pendingTasks)),
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { tasks: [], pending: [] };
  }
}
