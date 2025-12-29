import { getMonthlyStats } from "@/actions/analyticsActions";
import { CalendarView } from "@/components/analytics/calendar-view";
import { format } from "date-fns";
import { CheckCircle2, Circle, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const stats = await getMonthlyStats();
  const currentMonth = format(new Date(), "MMMM yyyy");

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Your productivity at a glance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Completion Rate */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full bg-primary/10 blur-2xl" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Monthly Rate
            </h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">
              {completionRate}%
            </span>
            <span className="text-xs text-muted-foreground">completion</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Completed Absolute */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.completedTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Absolute */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Circle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.pendingTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The New Powerful Calendar */}
      <CalendarView />
    </div>
  );
}
