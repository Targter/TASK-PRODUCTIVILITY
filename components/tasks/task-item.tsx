"use client";

import {
  toggleTaskStatus,
  deleteTask,
  duplicateTask,
} from "@/actions/taskActions";
import { cn } from "@/lib/utils";
import { Check, Copy, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface TaskProps {
  id: string;
  title: string;
  date: string; // The date of the task
  isCompleted: boolean;
  isOverdue?: boolean;
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
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Permanently delete?")) return;
    setLoading(true);
    await deleteTask(id);
    router.refresh();
  }

  async function handleCopy() {
    setLoading(true);
    // Duplicate to the SAME date as the original task (or we could pass 'today')
    await duplicateTask(id, date);
    router.refresh();
    setLoading(false);
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-4 py-3 px-3 border-b border-border/40 transition-all hover:bg-muted/40",
        isCompleted && "opacity-50"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground hover:border-foreground"
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5" />}
      </button>

      {/* Title & Info */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <span
          className={cn(
            "text-sm font-medium leading-none text-foreground transition-all truncate",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {title}
        </span>
        <div className="flex gap-2 mt-1">
          {isOverdue && !isCompleted && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
              Overdue
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {format(new Date(date), "MMM d")}
          </span>
        </div>
      </div>

      {/* Actions (Visible on Hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          disabled={loading}
          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
          title="Duplicate this task"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
