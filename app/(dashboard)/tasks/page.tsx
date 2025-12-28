import { getUserTasks } from "@/actions/taskActions";
import { AddTask } from "@/components/tasks/add-task";
import { TaskItem } from "@/components/tasks/task-item";
import { cn } from "@/lib/utils";
import { CheckSquare, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface TasksPageProps {
  searchParams: Promise<{ filter?: string }>; // Next.js 15+ convention
}

export default async function TasksPage(props: TasksPageProps) {
  const params = await props.searchParams;
  const filter = (params.filter as "pending" | "completed") || "pending";

  const tasks = await getUserTasks(filter);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
      </div>

      <AddTask />

      {/* Tabs */}
      <div className="flex w-full items-center rounded-lg border border-border bg-card p-1">
        <Link
          href="/tasks?filter=pending"
          className={cn(
            "flex-1 rounded-md py-2 text-center text-sm font-medium transition-colors",
            filter === "pending"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </div>
        </Link>
        <Link
          href="/tasks?filter=completed"
          className={cn(
            "flex-1 rounded-md py-2 text-center text-sm font-medium transition-colors",
            filter === "completed"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Completed
          </div>
        </Link>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No {filter} tasks found.</p>
          </div>
        ) : (
          tasks.map((task: any) => (
            <TaskItem
              key={task._id}
              id={task._id}
              title={task.title}
              date={task.date}
              isCompleted={task.isCompleted}
              // We only show overdue warning on pending tasks
              isOverdue={
                filter === "pending" &&
                new Date(task.date) < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
