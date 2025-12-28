import { getDailyNoteContext } from "@/actions/noteActions";
import { NoteEditor } from "@/components/notes/note-editor";
import { format } from "date-fns";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const { today, yesterday } = await getDailyNoteContext();
  const todayDateStr = new Date().toISOString();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Notes</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
      </div>

      {/* Yesterday's Context */}
      {yesterday && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <History className="h-4 w-4" />
            <span>Yesterday's Scratchpad</span>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
            <p className="whitespace-pre-wrap">{yesterday.content}</p>
          </div>
        </div>
      )}

      {/* Client-side Editor Component */}
      <NoteEditor
        initialContent={today?.content || ""}
        dateStr={todayDateStr}
      />
    </div>
  );
}
