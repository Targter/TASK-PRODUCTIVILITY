"use client";

import { acknowledgeReminder } from "@/actions/reminderActions";
import { Check, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface ReminderProps {
  reminders: any[];
}

export function ActiveReminders({ reminders }: ReminderProps) {
  const router = useRouter();

  async function handleDismiss(id: string) {
    await acknowledgeReminder(id);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {reminders.map((rem) => (
        <div
          key={rem._id}
          className="group flex flex-col gap-1 rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:bg-muted/60 hover:border-primary/20"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-foreground leading-tight">
              {rem.title}
            </span>
            <button
              onClick={() => handleDismiss(rem._id)}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Mark as done"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(rem.dateTime))} ago
          </div>
        </div>
      ))}
    </div>
  );
}