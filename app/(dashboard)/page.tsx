// import { getDashboardTasks } from "@/actions/taskActions";
// import { getDashboardTasks } from "@/actions/taskActions";
import { getDashboardTasks } from "@/actions/taskActions";
import { getActiveReminders } from "@/actions/reminderActions";
import { AddTask } from "@/components/tasks/add-task";
import { TaskItem } from "@/components/tasks/task-item";

import { ActiveReminders } from "@/components/reminders/active-reminders";
import { format } from "date-fns";
import { AlertCircle, CalendarCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Parallel fetching for performance
  const [taskData, activeReminders] = await Promise.all([
    getDashboardTasks(),
    getActiveReminders(),
  ]);

  const { today, pending } = taskData;

  return (
    <div className="mx-auto max-w-3xl pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Day
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM do")}
        </p>
      </div>

      {/* Active Notifications Area */}
      <ActiveReminders reminders={activeReminders} />

      {/* Add Task Input */}
      <AddTask />

      <div className="space-y-8">
        {/* Pending / Carry-over Section */}
        {pending.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-500">
              <AlertCircle className="h-4 w-4" />
              <h3>Pending Tasks (Carried Over)</h3>
            </div>
            <div className="space-y-2">
              {pending.map((task: any) => (
                <TaskItem
                  key={task._id}
                  id={task._id}
                  title={task.title}
                  date={task.date}
                  isCompleted={task.isCompleted}
                  isOverdue={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <CalendarCheck className="h-4 w-4" />
            <h3>Today</h3>
          </div>

          {today.length === 0 && pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p>No tasks for today.</p>
              <p className="text-sm">Enjoy your free time!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {today.map((task: any) => (
                <TaskItem
                  key={task._id}
                  id={task._id}
                  title={task.title}
                  date={task.date}
                  isCompleted={task.isCompleted}
                  isOverdue={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
