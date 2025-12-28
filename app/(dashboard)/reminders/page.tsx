import { getAllReminders } from "@/actions/reminderActions";
import { AddReminder } from "@/components/reminders/add-reminder";
import { format } from "date-fns";
import { BellRing, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RemindersPage() {
  const reminders = await getAllReminders();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
        <p className="text-muted-foreground">Never miss a deadline.</p>
      </div>

      <AddReminder />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Upcoming
        </h3>

        {reminders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming reminders.
          </p>
        ) : (
          <div className="grid gap-3">
            {reminders.map((rem: any) => (
              <div
                key={rem._id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BellRing className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{rem.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(rem.dateTime), "PPP 'at' p")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
