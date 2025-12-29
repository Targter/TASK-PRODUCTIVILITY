"use client";

import { createDailyNote } from "@/actions/noteActions";
import { Send, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </button>
  );
}

export function NoteInput({ dateStr }: { dateStr: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    await createDailyNote(formData);
    formRef.current?.reset();
  }

  return (
    <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
      <form
        ref={formRef}
        action={clientAction}
        className="flex items-end gap-2"
      >
        <input type="hidden" name="date" value={dateStr} />

        <textarea
          name="content"
          placeholder="Log a thought, update, or idea..."
          required
          className="flex-1 min-h-[60px] max-h-[200px] bg-transparent border-none resize-y p-3 text-sm focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
          onKeyDown={(e) => {
            // Submit on Cmd+Enter
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />

        <div className="pb-2 pr-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
