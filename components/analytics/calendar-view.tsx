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
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CalendarView() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activity, setActivity] = useState<Record<string, DayActivity>>({});
  const [loading, setLoading] = useState(false);

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

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function handleDayClick(day: Date) {
    router.push(`/?date=${format(day, "yyyy-MM-dd")}`);
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
          {format(currentMonth, "MMMM yyyy")}
          <span className="text-[10px] text-muted-foreground font-normal normal-case border border-border px-1.5 rounded bg-background">
            Monthly View
          </span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid Headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/5">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-[10px] font-bold text-muted-foreground uppercase text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* The Grid */}
      <div
        className={cn(
          "grid grid-cols-7 bg-muted/10",
          loading && "opacity-50 pointer-events-none"
        )}
      >
        {calendarDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayData = activity[dateKey];
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          // Calculate "Heat" (Intensity based on tasks)
          const taskCount = dayData?.taskCount || 0;
          const completed = dayData?.completedCount || 0;

          // Determine Intensity Class (GitHub style)
          let intensityClass = "bg-card"; // Default empty
          if (taskCount > 0) {
            const ratio = completed / taskCount;
            if (ratio === 1)
              intensityClass = "bg-primary/20 hover:bg-primary/30";
            else if (ratio > 0.5)
              intensityClass = "bg-primary/10 hover:bg-primary/20";
            else intensityClass = "bg-orange-500/5 hover:bg-orange-500/10";
          }
          if (!isCurrentMonth) intensityClass = "bg-muted/30 opacity-60";

          return (
            <button
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={cn(
                "h-24 p-2 flex flex-col justify-between border-r border-b border-border/50 transition-colors relative group",
                intensityClass,
                isCurrentDay && "ring-inset ring-2 ring-primary z-10"
              )}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrentDay
                      ? "text-primary font-bold"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>

                {/* Note Indicator */}
                {dayData?.hasNote && (
                  <FileText className="h-3 w-3 text-amber-500/70" />
                )}
              </div>

              {/* Task Bar */}
              {taskCount > 0 && (
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                    <span>{Math.round((completed / taskCount) * 100)}%</span>
                    <span>
                      {completed}/{taskCount}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(completed / taskCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
