import { getDailyNotes } from "@/actions/noteActions";
import { NoteInput } from "@/components/notes/note-input";
import { NoteFeed } from "@/components/notes/note-feed";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { format, isSameDay } from "date-fns";
import { History, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface NotesPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function NotesPage(props: NotesPageProps) {
  const params = await props.searchParams;
  const selectedDateStr = params.date;

  const { notes, prevNotes, currentDate, prevDate } = await getDailyNotes(
    selectedDateStr
  );
  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* 1. Navigation Strip */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md pt-2 pb-4">
        <CalendarStrip />
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: MAIN JOURNAL (Span 8) --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div className="border-b border-border pb-4 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Daily Log
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {format(currentDate, "EEEE, MMMM do")}
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              {notes.length} entries
            </span>
          </div>

          {/* Input Area */}
          <NoteInput dateStr={currentDate.toISOString()} />

          {/* The Feed */}
          <NoteFeed notes={notes} />
        </div>

        {/* --- RIGHT: CONTEXT (Span 4) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Context Card: Previous Day */}
          <div className="rounded-xl border border-border bg-muted/10 shadow-sm overflow-hidden sticky top-24">
            <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <History className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  History: {format(prevDate, "MMM do")}
                </span>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
              {prevNotes.length > 0 ? (
                prevNotes.map((pn: any) => (
                  <div
                    key={pn._id}
                    className="text-sm text-muted-foreground border-l-2 border-border pl-3"
                  >
                    <p className="mb-1 text-[10px] font-mono opacity-50">
                      {format(new Date(pn.createdAt), "HH:mm")}
                    </p>
                    <p className="leading-relaxed">{pn.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic opacity-50">
                  No logs found for previous day.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
