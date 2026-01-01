"use client";

import {
  toggleTaskStatus,
  deleteTask,
  updateTaskTitle,
  rescheduleTask,
} from "@/actions/taskActions";
import { cn } from "@/lib/utils";
import {
  Check,
  Trash2,
  Pencil,
  Save,
  CalendarClock,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";

interface TaskProps {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  isOverdue?: boolean;
}

export function TaskItem({
  id,
  title,
  date,
  isCompleted,
  isOverdue,
}: TaskProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reschedule Menu State
  const [showReschedule, setShowReschedule] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  // --- ACTIONS ---

  async function handleToggle() {
    if (isEditing) return;
    setLoading(true);
    await toggleTaskStatus(id, isCompleted);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Permanently delete?")) return;
    setLoading(true);
    await deleteTask(id);
    router.refresh();
  }

  async function saveEdit() {
    if (editValue.trim() === "" || editValue.trim() === title) {
      setIsEditing(false);
      setEditValue(title);
      return;
    }
    setLoading(true);
    await updateTaskTitle(id, editValue);
    setIsEditing(false);
    router.refresh();
    setLoading(false);
  }

  async function handleReschedule(targetDate: Date) {
    setLoading(true);
    setShowReschedule(false);
    await rescheduleTask(id, targetDate.toISOString());
    router.refresh();
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") saveEdit();
    else if (e.key === "Escape") {
      setEditValue(title);
      setIsEditing(false);
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 py-3 px-3 border-b border-border/40 transition-all hover:bg-muted/40",
        isCompleted && "opacity-50",
        isEditing && "bg-muted/60"
      )}
      onMouseLeave={() => setShowReschedule(false)} // Close menu on mouse leave
    >
      {/* Checkbox */}
      {!isEditing && (
        <button
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground hover:border-foreground"
          )}
        >
          {isCompleted && <Check className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="w-full bg-background border border-primary/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
              className={cn(
                "text-sm font-medium leading-none text-foreground transition-all truncate cursor-text",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {title}
            </span>
            <div className="flex gap-2 mt-1">
              {isOverdue && !isCompleted && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1">
                  Overdue
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {format(new Date(date), "MMM d")}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          // If menu is open, force opacity 100, otherwise hover only
          showReschedule ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        {isEditing ? (
          <button
            onMouseDown={saveEdit}
            className="p-1.5 text-green-500 rounded"
          >
            <Save className="h-4 w-4" />
          </button>
        ) : (
          <>
            {/* RESCHEDULE BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowReschedule(!showReschedule)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  showReschedule
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
                title="Reschedule"
              >
                <CalendarClock className="h-3.5 w-3.5" />
              </button>

              {/* --- RESCHEDULE MENU --- */}
              {showReschedule && (
                <div className="absolute right-0 top-8 z-50 w-48 rounded-lg border border-border bg-card shadow-lg p-1 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground px-2 py-1">
                    Move Task To...
                  </div>

                  {/* Option 1: Tomorrow */}
                  <button
                    onClick={() => handleReschedule(addDays(new Date(), 1))}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-green-500" />
                    Tomorrow
                  </button>

                  {/* Option 2: Pick Date */}
                  <button
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-foreground hover:bg-muted relative"
                  >
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    Pick Date...
                    {/* Hidden Date Input */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.value)
                          handleReschedule(new Date(e.target.value));
                      }}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* EDIT BUTTON */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* DELETE BUTTON */}
            <button
              onClick={handleDelete}
              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
