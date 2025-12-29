"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface DailyProgressProps {
  total: number;
  completed: number;
}

export function DailyProgress({ total, completed }: DailyProgressProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
      {/* Ring Chart */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 80 80">
          {/* Background Ring */}
          <circle
            className="text-muted/50"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          {/* Progress Ring */}
          <circle
            className="text-primary transition-all duration-1000 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute text-xs font-bold text-foreground">
          {percentage}%
        </span>
      </div>

      {/* Text Stats */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Daily Velocity
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {completed}
          </span>
          <span className="text-sm text-muted-foreground">/ {total} Tasks</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
          {total === 0 ? (
            <span>Plan your day</span>
          ) : percentage === 100 ? (
            <span className="text-primary">All systems go. Great job.</span>
          ) : (
            <span>{total - completed} remaining</span>
          )}
        </div>
      </div>
    </div>
  );
}
