"use client";

import { acknowledgeReminder } from "@/actions/reminderActions";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface ReminderProps {
  reminders: any[];
}

export function ActiveReminders({ reminders }: ReminderProps) {
  const router = useRouter();

  if (reminders.length === 0) return null;

  async function handleDismiss(id: string) {
    await acknowledgeReminder(id);
    router.refresh();
  }

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
      <div className="mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
        <Bell className="h-5 w-5 animate-pulse" />
        <h3 className="font-semibold">Active Reminders</h3>
      </div>
      <div className="space-y-2">
        {reminders.map((rem) => (
          <div
            key={rem._id}
            className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm dark:bg-card"
          >
            <div>
              <p className="font-medium text-foreground">{rem.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(rem.dateTime), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(rem._id)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
