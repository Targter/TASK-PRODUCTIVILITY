"use client";

import { createTask } from "@/actions/taskActions";
// import { createTask } from "@/actions/tasksActions";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AddTask() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // Default to today in YYYY-MM-DD format for input
  const todayStr = new Date().toISOString().split("T")[0];

  async function clientAction(formData: FormData) {
    const title = formData.get("title");
    if (!title) return;

    await createTask(formData);
    formRef.current?.reset();
    setIsExpanded(false);
  }

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-2 shadow-sm">
      <form ref={formRef} action={clientAction} className="flex flex-col gap-3">
        {/* Main Input */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <input
            name="title"
            type="text"
            placeholder="Add a task..."
            required
            onFocus={() => setIsExpanded(true)}
            className="flex-1 bg-transparent py-3 text-sm font-medium outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
        </div>

        {/* Expanded Options (Date Picker) */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out px-2",
            isExpanded ? "max-h-20 opacity-100 pb-2" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50">
              <CalendarIcon className="h-3.5 w-3.5" />
              <input
                type="date"
                name="date"
                defaultValue={todayStr}
                className="bg-transparent outline-none"
              />
            </div>

            {/* Hidden mode input - default to single for MVP */}
            <input type="hidden" name="mode" value="single" />

            <div className="flex-1" />

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-muted-foreground hover:text-foreground mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
