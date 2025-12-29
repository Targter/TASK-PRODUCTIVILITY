"use server";

import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { startOfMonth, endOfMonth } from "date-fns";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

export interface DayActivity {
  date: string; // ISO Date String
  taskCount: number;
  completedCount: number;
  hasNote: boolean;
}

export async function getMonthlyActivity(year: number, month: number) {
  const userId = await getUserId();
  await connectDB();

  // Construct dates (Month is 0-indexed in JS, but 1-indexed in human args usually. 
  // Let's assume standard 0-11 input for simplicity in date-fns construction)
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));

  // 1. Aggregate Tasks
  const taskStats = await Task.aggregate([
    {
      $match: {
        user: new (require("mongoose").Types.ObjectId)(userId),
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] },
        },
      },
    },
  ]);

  // 2. Aggregate Notes
  const noteStats = await Note.aggregate([
    {
      $match: {
        user: new (require("mongoose").Types.ObjectId)(userId),
        type: "daily",
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
  ]);

  // 3. Map to Dictionary for O(1) Lookup
  const activityMap: Record<string, DayActivity> = {};

  taskStats.forEach((stat) => {
    activityMap[stat._id] = {
      date: stat._id,
      taskCount: stat.total,
      completedCount: stat.completed,
      hasNote: false,
    };
  });

  noteStats.forEach((stat) => {
    if (!activityMap[stat._id]) {
      activityMap[stat._id] = {
        date: stat._id,
        taskCount: 0,
        completedCount: 0,
        hasNote: true,
      };
    } else {
      activityMap[stat._id].hasNote = true;
    }
  });

  return activityMap;
}