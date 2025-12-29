"use client";

import { getMonthlyActivity, DayActivity } from "@/actions/calendarActions";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CalendarView() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activity, setActivity] = useState<Record<string, DayActivity>>({});
  const [loading, setLoading] = useState(false);

  // Fetch data when month changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getMonthlyActivity(
        currentMonth.getFullYear(),
        currentMonth.getMonth()
      );
      setActivity(data);
      setLoading(false);
    }
    fetchData();
  }, [currentMonth]);

  // Generate Calendar Grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function handleDayClick(day: Date) {
    // Navigate to dashboard with that specific date selected
    const dateStr = format(day, "yyyy-MM-dd");
    router.push(`/?date=${dateStr}`);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs font-medium px-3 py-1 rounded-md border border-border hover:bg-muted"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div
        className={cn(
          "grid grid-cols-7 gap-1",
          loading && "opacity-50 pointer-events-none"
        )}
      >
        {calendarDays.map((day, idx) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayData = activity[dateKey];
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <button
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={cn(
                "min-h-[80px] p-2 flex flex-col items-start justify-between rounded-md border transition-all hover:border-primary/50 hover:bg-primary/5 text-left relative group",
                !isCurrentMonth
                  ? "bg-muted/20 border-transparent text-muted-foreground/40"
                  : "border-border bg-card",
                isToday(day) && "border-primary bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                  isToday(day)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>

              {/* Indicators */}
              <div className="flex w-full items-end justify-between mt-2 gap-1">
                {dayData?.taskCount > 0 && (
                  <div className="flex items-center gap-1 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px] text-blue-500 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>
                      {dayData.completedCount}/{dayData.taskCount}
                    </span>
                  </div>
                )}
                {dayData?.hasNote && (
                  <div className="text-amber-500" title="Note added">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
