"use server";

import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, eachDayOfInterval, endOfMonth, startOfMonth, parseISO } from "date-fns";

/**
 * Helper to get the authenticated user's ID
 */
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

/**
 * Create a new task.
 * Handles: Single Date, Multiple Dates, or Entire Month logic.
 */
export async function createTask(formData: FormData) {
  const userId = await getUserId();
  await connectDB();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const mode = formData.get("mode") as "single" | "range" | "month"; // from hidden input
  const dateInput = formData.get("date") as string; // ISO string or simple YYYY-MM-DD

  if (!title || !dateInput) return { error: "Title and Date are required" };

  try {
    const tasksToCreate = [];
    const baseDate = new Date(dateInput);

    if (mode === "month") {
      // Generate a task for every day of the selected month
      const monthStart = startOfMonth(baseDate);
      const monthEnd = endOfMonth(baseDate);
      
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      days.forEach((day) => {
        tasksToCreate.push({
          user: userId,
          title,
          description,
          date: day, // Stores individual date
          isCompleted: false,
        });
      });
    } else {
      // Default: Single day creation
      // Note: If "Multiple Dates" was selected, the UI should call this action multiple times 
      // or pass a JSON array. For simplicity, we handle single here.
      tasksToCreate.push({
        user: userId,
        title,
        description,
        date: baseDate,
        isCompleted: false,
      });
    }

    if (tasksToCreate.length > 0) {
      await Task.insertMany(tasksToCreate);
    }

    revalidatePath("/"); // Refresh dashboard
    return { success: true };
  } catch (error) {
    console.error("Create Task Error:", error);
    return { error: "Failed to create task" };
  }
}

/**
 * Fetch tasks for the Dashboard.
 * Returns:
 * 1. Today's Tasks
 * 2. Overdue Tasks (Carry-over: Pending tasks from past)
 */
export async function getDashboardTasks() {
  const userId = await getUserId();
  await connectDB();

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  try {
    // 1. Fetch tasks scheduled strictly for Today
    const todayTasks = await Task.find({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    }).sort({ createdAt: -1 });

    // 2. Fetch "Carry-over" tasks (Date < Today AND Not Completed)
    const pendingTasks = await Task.find({
      user: userId,
      date: { $lt: todayStart },
      isCompleted: false,
    }).sort({ date: 1 }); // Oldest first

    return {
      today: JSON.parse(JSON.stringify(todayTasks)),
      pending: JSON.parse(JSON.stringify(pendingTasks)),
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { today: [], pending: [] };
  }
}

/**
 * Toggle Task Completion
 */
export async function toggleTaskStatus(taskId: string, currentStatus: boolean) {
  const userId = await getUserId();
  await connectDB();

  try {
    await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { isCompleted: !currentStatus }
    );
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update" };
  }
}

/**
 * Delete a Task
 */
export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  await connectDB();

  try {
    await Task.findOneAndDelete({ _id: taskId, user: userId });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}