import { getAllReminders } from "@/actions/reminderActions";
import { AddReminder } from "@/components/reminders/add-reminder";
import { ReminderItem } from "@/components/reminders/reminder-item";
import { BellRing, ListFilter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RemindersPage() {
  const reminders = await getAllReminders();

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border pb-6 pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <BellRing className="h-8 w-8 text-primary" />
          Reminders
        </h1>
        <p className="text-muted-foreground mt-1">
          Track time-sensitive alerts and deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: ACTIONS (Span 4) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Add New Widget */}
          <AddReminder />

          {/* Stats Card */}
          <div className="rounded-xl border border-border bg-muted/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Summary
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                {reminders.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Active Alerts
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Reminders stay active until you explicitly dismiss them. Overdue
              items are highlighted in red.
            </p>
          </div>
        </div>

        {/* --- RIGHT: LIST (Span 8) --- */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <ListFilter className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Upcoming Queue
            </h2>
          </div>

          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-muted/20">
              <BellRing className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-sm font-medium">
                All caught up.
              </p>
              <p className="text-xs text-muted-foreground/60">
                No pending reminders.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              {reminders.map((rem: any) => (
                <ReminderItem
                  key={rem._id}
                  id={rem._id}
                  title={rem.title}
                  dateTime={rem.dateTime}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
