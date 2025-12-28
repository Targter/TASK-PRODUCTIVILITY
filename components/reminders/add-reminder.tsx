"use client";

import { createReminder } from "@/actions/reminderActions";
import { BellPlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Reminder"}
    </button>
  );
}

export function AddReminder() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  async function clientAction(formData: FormData) {
    await createReminder(formData);
    formRef.current?.reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground hover:border-primary/50 hover:bg-card hover:text-primary transition-all"
      >
        <BellPlus className="h-5 w-5" />
        Create a new reminder...
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-in fade-in zoom-in-95">
      <form ref={formRef} action={clientAction} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Title
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="What to remember?"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Time
            </label>
            <input
              name="dateTime"
              type="datetime-local"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
