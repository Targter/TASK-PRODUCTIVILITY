// import { getMonthlyStats } from "@/actions/analyticsActions";
import { getMonthlyStats } from "@/actions/analyticsActions";
import { format } from "date-fns";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const stats = await getMonthlyStats();
  const currentMonth = format(new Date(), "MMMM yyyy");

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Report for {currentMonth}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Completion Rate Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </h3>
            <span className="text-xs font-bold text-primary">
              {currentMonth}
            </span>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-foreground">
              {completionRate}%
            </span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Completed
            </h3>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-foreground">
              {stats.completedTasks}
            </span>
            <p className="text-xs text-muted-foreground">
              Tasks finished this month
            </p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-orange-500/10 p-2 text-orange-500">
              <Circle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Pending
            </h3>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-foreground">
              {stats.pendingTasks}
            </span>
            <p className="text-xs text-muted-foreground">
              Remaining in {currentMonth}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
