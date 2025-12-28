"use client";

import { saveDailyNote } from "@/actions/noteActions";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

// Helper component to show loading state on the button
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {pending ? "Saving..." : "Save Note"}
    </button>
  );
}

interface NoteEditorProps {
  initialContent: string;
  dateStr: string;
}

export function NoteEditor({ initialContent, dateStr }: NoteEditorProps) {
  const [message, setMessage] = useState<string>("");

  // This wrapper satisfies TypeScript's requirement for a void return type
  async function handleSave(formData: FormData) {
    setMessage(""); // Clear previous messages

    const result = await saveDailyNote(formData);

    if (result?.error) {
      setMessage("❌ Failed to save");
    } else {
      setMessage("✅ Saved successfully");
      // Auto-hide success message after 2 seconds
      setTimeout(() => setMessage(""), 2000);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <form action={handleSave} className="flex flex-col">
        <input type="hidden" name="date" value={dateStr} />

        <textarea
          name="content"
          defaultValue={initialContent}
          placeholder="Write your thoughts for today..."
          className="min-h-[400px] w-full resize-none bg-transparent p-6 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
        />

        <div className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Notes capture your daily context.
            </span>
            {message && (
              <span className="text-xs font-medium animate-in fade-in slide-in-from-left-2">
                {message}
              </span>
            )}
          </div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
