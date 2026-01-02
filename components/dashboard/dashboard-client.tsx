"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardTasks } from "@/actions/taskActions";
import { getRemindersForDate } from "@/actions/reminderActions";
import { AddTask } from "@/components/tasks/add-task";
import { TaskItem } from "@/components/tasks/task-item";
import { ActiveReminders } from "@/components/reminders/active-reminders";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { format, isSameDay } from "date-fns";
import { AlertTriangle, Layers, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface DashboardClientProps {
  initialTasks: any;
  initialReminders: any;
  userName: string;
}

export default function DashboardClient({
  initialTasks,
  initialReminders,
  userName,
}: DashboardClientProps) {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date"); // "2024-01-05" or null

  // Logic: View Date
  const today = new Date();
  const viewDate = dateParam ? new Date(dateParam) : today;
  const isViewToday = isSameDay(viewDate, today);

  // --- 1. REACT QUERY HOOKS (Global Cache) ---

  // Tasks Query
  const { data: taskData, isLoading: tasksLoading } = useQuery({
    queryKey: ["dashboard-tasks", dateParam || "today"], // Unique key for cache
    queryFn: () => getDashboardTasks(dateParam || undefined),
    initialData: isViewToday ? initialTasks : undefined, // Use server data for initial load
  });

  // Reminders Query
  const { data: reminders, isLoading: remindersLoading } = useQuery({
    queryKey: ["dashboard-reminders", dateParam || "today"],
    queryFn: () => getRemindersForDate(dateParam || undefined),
    initialData: isViewToday ? initialReminders : undefined,
  });

  // Extract data (Handle possible structure differences or loading states)
  const tasks = taskData?.tasks || [];
  const pending = taskData?.pending || [];

  // Greeting Logic
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 5) greeting = "Late Night Hustle";
  else if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 pb-10">
      {/* Calendar Strip controls the URL, which updates 'dateParam', which triggers useQuery */}
      <CalendarStrip />

      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isViewToday
                ? `${greeting}, ${userName}.`
                : format(viewDate, "EEEE, MMMM do")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isViewToday ? "bg-green-500" : "bg-primary"
                )}
              ></span>
              {isViewToday ? "Overview for Today" : "Historical View"}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm p-1">
            <AddTask />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Scheduled Tasks
                </h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {tasks.length} items
              </span>
            </div>

            <div
              className={cn(
                "transition-opacity duration-200",
                tasksLoading && "opacity-50"
              )}
            >
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
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Bell className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                {isViewToday
                  ? "Active Reminders"
                  : `Alerts for ${format(viewDate, "MMM d")}`}
              </h3>
            </div>

            <div
              className={cn(
                "transition-opacity duration-200",
                remindersLoading && "opacity-50"
              )}
            >
              {reminders && reminders.length > 0 ? (
                <ActiveReminders reminders={reminders} />
              ) : (
                <p className="text-xs text-muted-foreground">
                  No active reminders.
                </p>
              )}
            </div>
          </div>

          {pending.length > 0 && (
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 animate-in slide-in-from-right-2">
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
