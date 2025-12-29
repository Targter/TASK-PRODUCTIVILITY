import { getUserTasks } from "@/actions/taskActions";
import { AddTask } from "@/components/tasks/add-task";
import { TaskItem } from "@/components/tasks/task-item";
import { cn } from "@/lib/utils";
import { CheckSquare, Clock, ListFilter } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface TasksPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function TasksPage(props: TasksPageProps) {
  const params = await props.searchParams;
  const filter = (params.filter as "pending" | "completed") || "pending";
  const tasks = await getUserTasks(filter);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border pb-6 pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Tasks
        </h1>
        <p className="text-muted-foreground mt-1">
          Master list of all your activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: FILTERS (Sidebar style) --- */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
            Views
          </h3>
          <nav className="flex flex-col space-y-1">
            <Link
              href="/tasks?filter=pending"
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                filter === "pending"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
              Pending
            </Link>
            <Link
              href="/tasks?filter=completed"
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                filter === "completed"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <CheckSquare className="h-4 w-4" />
              Completed
            </Link>
          </nav>
        </div>

        {/* --- RIGHT: TASK LIST --- */}
        <div className="lg:col-span-9 space-y-6">
          {/* Add Task Widget (Only visible in Pending view) */}
          {filter === "pending" && (
            <div className="bg-card rounded-xl border border-border shadow-sm px-4">
              <AddTask />
            </div>
          )}

          {/* List */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <ListFilter className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {filter} ({tasks.length})
              </h2>
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-muted/20">
                <p className="text-muted-foreground text-sm font-medium">
                  No tasks found.
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {tasks.map((task: any) => (
                  <TaskItem
                    key={task._id}
                    id={task._id}
                    title={task.title}
                    date={task.date}
                    isCompleted={task.isCompleted}
                    isOverdue={
                      filter === "pending" &&
                      new Date(task.date) <
                        new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
