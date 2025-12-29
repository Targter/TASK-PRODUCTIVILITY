"use client";

import { createReminder } from "@/actions/reminderActions";
import { BellPlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Reminder"}
    </button>
  );
}

export function AddReminder() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(true);

  async function clientAction(formData: FormData) {
    await createReminder(formData);
    formRef.current?.reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="group w-full flex items-center justify-between rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:border-primary/50 hover:bg-muted/30 hover:text-foreground transition-all"
      >
        <span className="flex items-center gap-2">
          <BellPlus className="h-4 w-4 text-primary" />
          Schedule a new reminder...
        </span>
        <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          Press to Open
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          New Reminder
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form ref={formRef} action={clientAction} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Title
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="e.g. Call Client, Submit Report..."
              className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Date & Time
            </label>
            <input
              name="dateTime"
              type="datetime-local"
              required
              className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
