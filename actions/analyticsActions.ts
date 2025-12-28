"use server";

import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { startOfMonth, endOfMonth } from "date-fns";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  // @ts-ignore
  return session.user.id;
}

export async function getMonthlyStats() {
  const userId = await getUserId();
  await connectDB();

  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  // MongoDB Aggregation to get counts in one go
  const stats = await Task.aggregate([
    {
      $match: {
        user: new (require("mongoose").Types.ObjectId)(userId),
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] },
        },
        pendingTasks: {
          $sum: { $cond: [{ $eq: ["$isCompleted", false] }, 1, 0] },
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return { totalTasks: 0, completedTasks: 0, pendingTasks: 0 };
  }

  return stats[0];
}