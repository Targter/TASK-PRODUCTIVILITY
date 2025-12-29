"use client";

import { createTask } from "@/actions/taskActions";
import { Plus, Settings2, CalendarDays, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function AddTask() {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const urlDate = searchParams.get("date");
  const defaultDate = urlDate
    ? urlDate
    : new Date().toISOString().split("T")[0];

  const [showOptions, setShowOptions] = useState(false);
  const [repeatMode, setRepeatMode] = useState<
    "none" | "tomorrow" | "month" | "custom"
  >("none");
  const [customEndDate, setCustomEndDate] = useState("");

  async function clientAction(formData: FormData) {
    const title = formData.get("title");
    if (!title) return;

    // Append our React state to the formData
    formData.append("repeatMode", repeatMode);
    if (customEndDate) formData.append("endDate", customEndDate);

    await createTask(formData);

    // Reset UI
    formRef.current?.reset();
    setRepeatMode("none");
    setCustomEndDate("");
    setShowOptions(false);
  }

  return (
    <div className="relative py-2">
      <form ref={formRef} action={clientAction} className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            <Plus className="h-5 w-5" />
          </div>

          <input
            name="title"
            type="text"
            placeholder="Add a new task..."
            required
            onFocus={() => setShowOptions(true)}
            className="flex-1 bg-transparent border-none py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none font-medium"
            autoComplete="off"
          />

          {/* Toggle Options Button */}
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={cn(
              "p-2 rounded-md transition-colors",
              showOptions || repeatMode !== "none"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        {/* Hidden Inputs */}
        <input type="hidden" name="date" value={defaultDate} />

        {/* --- EXPANDED OPTIONS PANEL --- */}
        {showOptions && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in duration-200 z-50">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Recurrence / Duration
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRepeatMode("none")}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-md border",
                      repeatMode === "none"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    Just Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepeatMode("tomorrow")}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-md border",
                      repeatMode === "tomorrow"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    + Next Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepeatMode("month")}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-md border",
                      repeatMode === "month"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    Entire Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepeatMode("custom")}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-md border",
                      repeatMode === "custom"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    Until Date...
                  </button>
                </div>
              </div>

              {/* Custom Date Picker */}
              {repeatMode === "custom" && (
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Repeat daily until:
                  </span>
                  <input
                    type="date"
                    className="bg-transparent text-xs border-b border-muted-foreground/30 focus:border-primary outline-none"
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-border">
                <button
                  type="submit"
                  className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium"
                >
                  Confirm & Add
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
