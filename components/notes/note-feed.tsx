"use client";

import { deleteNote } from "@/actions/noteActions";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NoteFeedProps {
  notes: any[];
}

export function NoteFeed({ notes }: NoteFeedProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    setDeletingId(id);
    await deleteNote(id);
    setDeletingId(null);
    router.refresh();
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/50 border border-dashed border-border rounded-xl">
        <p className="text-sm">No entries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note._id}
          className={cn(
            "group relative flex gap-4 p-4 rounded-xl border border-border bg-card transition-all hover:shadow-sm",
            deletingId === note._id && "opacity-50 pointer-events-none"
          )}
        >
          {/* Timestamp Column */}
          <div className="flex flex-col items-center min-w-[3rem] border-r border-border/50 pr-4">
            <span className="text-xs font-bold text-muted-foreground font-mono">
              {format(new Date(note.createdAt), "HH:mm")}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
              {note.content}
            </div>
          </div>

          {/* Delete Action */}
          <button
            onClick={() => handleDelete(note._id)}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 transition-all bg-card rounded-md border border-border/50"
            title="Delete Entry"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
