"use client";

import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function DateNavigator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const currentDate = dateParam ? new Date(dateParam) : new Date();

  function goToDate(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    router.push(`/?date=${dateStr}`);
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
        Overview
      </div>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {format(currentDate, "EEEE, MMM do")}
        </h1>

        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => goToDate(subDays(currentDate, 1))}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {dateParam && (
            <button
              onClick={() => router.push("/")}
              className="px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted rounded-full transition-all"
            >
              Today
            </button>
          )}

          <button
            onClick={() => goToDate(addDays(currentDate, 1))}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
