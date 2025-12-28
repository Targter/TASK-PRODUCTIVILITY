"use client";

import { toggleTaskStatus, deleteTask } from "@/actions/taskActions";
// import { toggleTaskStatus, deleteTask } from "@/actions/tasksActions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, Trash2, CalendarClock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TaskProps {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  isOverdue?: boolean; // Visual cue for carry-over tasks
}

export function TaskItem({
  id,
  title,
  date,
  isCompleted,
  isOverdue,
}: TaskProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleTaskStatus(id, isCompleted);
    router.refresh(); // Refresh server data
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    await deleteTask(id);
    router.refresh();
  }

  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md",
        isCompleted
          ? "border-transparent bg-gray-50 dark:bg-gray-900 opacity-60"
          : "border-border bg-card text-card-foreground",
        isOverdue && !isCompleted && "border-orange-500/50 bg-orange-50/10"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
            isCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-400 hover:border-primary dark:border-gray-500"
          )}
        >
          {isCompleted && <Check className="h-3.5 w-3.5" />}
        </button>

        <div className="flex flex-col">
          <span
            className={cn(
              "font-medium transition-all",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {title}
          </span>
          {isOverdue && !isCompleted && (
            <span className="flex items-center gap-1 text-xs text-orange-500">
              <CalendarClock className="h-3 w-3" />
              Carried over from {format(new Date(date), "MMM d")}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="opacity-0 transition-opacity group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
