"use client";

import { acknowledgeReminder } from "@/actions/reminderActions";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import { Bell, Check, Clock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReminderItemProps {
  id: string;
  title: string;
  dateTime: string;
}

export function ReminderItem({ id, title, dateTime }: ReminderItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dateObj = new Date(dateTime);
  const isOverdue = isPast(dateObj);

  async function handleDismiss() {
    if (!confirm("Mark this reminder as handled?")) return;
    setLoading(true);
    await acknowledgeReminder(id);
    router.refresh();
    setLoading(false);
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-4 py-4 px-3 border-b border-border/50 transition-colors hover:bg-muted/30",
        loading && "opacity-50 pointer-events-none"
      )}
    >
      {/* Icon Status */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
          isOverdue
            ? "border-red-500/30 bg-red-500/10 text-red-600"
            : "border-primary/20 bg-primary/5 text-primary"
        )}
      >
        <Bell className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-sm font-medium text-foreground truncate">
          {title}
        </span>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className={cn(isOverdue && "text-red-500 font-semibold")}>
            {format(dateObj, "PPP 'at' p")}
          </span>
          {isOverdue && (
            <span className="text-[10px] uppercase tracking-wider text-red-500">
              • Overdue
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleDismiss}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all"
      >
        <Check className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Dismiss</span>
      </button>
    </div>
  );
}
