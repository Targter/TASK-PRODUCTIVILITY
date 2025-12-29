"use client";

import { format, addDays, isSameDay, subDays } from "date-fns";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // Import usePathname
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

export function CalendarStrip() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Get current path (e.g., "/notes" or "/")
  const dateInputRef = useRef<HTMLInputElement>(null);

  // 1. Get Selected Date
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  // 2. Generate a 10-day Window CENTERED on the selected date
  const days = Array.from({ length: 10 }, (_, i) =>
    addDays(subDays(selectedDate, 4), i)
  );

  // --- FIX IS HERE ---
  // We use 'pathname' instead of hardcoded "/"
  function onSelect(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");

    // Preserve existing params if needed, but for now we just switch date
    // If you have other filters (like tabs), you might want to preserve them,
    // but usually switching date resets view.
    // Simple approach: Current Path + Date Param

    // If we are on tasks page with a filter, we might want to keep it?
    // For now, let's just keep it simple: Path + Date.
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("date", dateStr);

    router.push(`${pathname}?${currentParams.toString()}`);
  }

  // Slider Logic
  const slideDate = (amount: number) => {
    const newDate = addDays(selectedDate, amount);
    onSelect(newDate);
  };

  return (
    <div className="flex w-full items-center gap-3 border-b border-border bg-card/80 backdrop-blur-md px-4 py-3 sticky top-0 z-20 shadow-sm transition-all">
      {/* A. Date Picker (Native) */}
      <div className="relative shrink-0">
        <button
          onClick={() => dateInputRef.current?.showPicker()}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          title="Jump to specific date"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
        <input
          type="date"
          ref={dateInputRef}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={(e) => {
            if (e.target.value) {
              // Use the same dynamic path logic
              const currentParams = new URLSearchParams(
                searchParams.toString()
              );
              currentParams.set("date", e.target.value);
              router.push(`${pathname}?${currentParams.toString()}`);
            }
          }}
        />
      </div>

      {/* B. Left Slider (Prev Day) */}
      <button
        onClick={() => slideDate(-1)}
        className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* C. The Strip (Centered Window) */}
      <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex justify-between md:justify-center gap-2 min-w-max px-1">
          {days.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            return (
              <button
                key={date.toString()}
                onClick={() => onSelect(date)}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-14 rounded-lg transition-all duration-300 border text-sm group relative",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-110 z-10"
                    : "bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground opacity-70 hover:opacity-100",
                  !isSelected &&
                    isToday &&
                    "text-primary font-bold bg-primary/5 border-primary/20 opacity-100"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider mb-1",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {format(date, "EEE")}
                </span>
                <span className="text-lg font-bold leading-none">
                  {format(date, "d")}
                </span>

                {!isSelected && isToday && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* D. Right Slider (Next Day) */}
      <button
        onClick={() => slideDate(1)}
        className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
