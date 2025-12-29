// import { getDashboardTasks } from "@/actions/taskActions";
import { getDashboardTasks } from "@/actions/taskActions";
import { getActiveReminders } from "@/actions/reminderActions";
import { AddTask } from "@/components/tasks/add-task";
import { TaskItem } from "@/components/tasks/task-item";
import { ActiveReminders } from "@/components/reminders/active-reminders";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { format, isSameDay } from "date-fns";
import { AlertTriangle, Layers, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage(props: PageProps) {
  const params = await props.searchParams;
  const selectedDateStr = params.date;

  const today = new Date();
  const viewDate = selectedDateStr ? new Date(selectedDateStr) : today;
  const isViewToday = isSameDay(viewDate, today);

  const [taskData, activeReminders] = await Promise.all([
    getDashboardTasks(selectedDateStr),
    getActiveReminders(),
  ]);

  const { tasks, pending } = taskData;

  // Greeting Logic
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 5) greeting = "Late Night Hustle";
  else if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 pb-10">
      {/* 1. TOP NAV: Slider Calendar Strip */}
      <CalendarStrip />

      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN: FOCUS ZONE (Span 8) --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isViewToday
                ? `${greeting}, User.`
                : format(viewDate, "EEEE, MMMM do")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isViewToday ? "bg-green-500" : "bg-primary"
                )}
              ></span>
              {isViewToday ? "Overview for Today" : "Historical Archive"}
            </p>
          </div>

          {/* Add Task Input */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-1">
            <AddTask />
          </div>

          {/* Main Task List */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Scheduled Tasks
                </h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {tasks.filter((t: any) => t.isCompleted).length}/{tasks.length}
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/20">
                <p className="text-muted-foreground text-sm font-medium">
                  No tasks recorded.
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                {tasks.map((task: any) => (
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

        {/* --- RIGHT COLUMN: CONTEXT (Span 4) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Reminders Panel (Always show Active Reminders regardless of date) */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Bell className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Reminders
              </h3>
            </div>

            {activeReminders.length > 0 ? (
              <ActiveReminders reminders={activeReminders} />
            ) : (
              <p className="text-xs text-muted-foreground">
                No active reminders.
              </p>
            )}
          </div>

          {/* 
            2. Pending / Overdue Panel 
            Now visible on ANY date. 
            Displays tasks strictly older than the date you are currently viewing.
          */}
          {pending.length > 0 && (
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-500">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Overdue relative to {format(viewDate, "MMM d")} (
                  {pending.length})
                </h3>
              </div>
              <div className="space-y-1">
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
        </div>
      </div>
    </div>
  );
}
