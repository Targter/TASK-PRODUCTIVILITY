import { getMonthlyStats } from "@/actions/analyticsActions";
import { CalendarView } from "@/components/analytics/calendar-view";
import { format } from "date-fns";
import {
  TrendingUp,
  Activity,
  CheckCircle,
  CircleDashed,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const stats = await getMonthlyStats();
  const currentMonth = format(new Date(), "MMMM yyyy");

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-border pb-6 pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Performance
        </h1>
        <p className="text-muted-foreground mt-1">
          Data analysis for {currentMonth}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: STATS (Span 3) --- */}
        <div className="lg:col-span-3 space-y-4">
          {/* Primary Metric: Completion Rate */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Velocity
              </span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-mono font-medium text-foreground tracking-tighter">
                {completionRate}
              </span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 gap-4">
            {/* Completed */}
            <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Finished
                </span>
                <span className="text-2xl font-mono font-medium text-foreground">
                  {stats.completedTasks}
                </span>
              </div>
              <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded-md">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>

            {/* Pending */}
            <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                  Pending
                </span>
                <span className="text-2xl font-mono font-medium text-foreground">
                  {stats.pendingTasks}
                </span>
              </div>
              <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-md">
                <CircleDashed className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Insight Box */}
          <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Insight:</strong> Consistent
              activity beats intensity. Aim for green days on the calendar to
              build a streak.
            </p>
          </div>
        </div>

        {/* --- RIGHT: CALENDAR HEATMAP (Span 9) --- */}
        <div className="lg:col-span-9">
          <div className="mb-3 px-1 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Activity Heatmap
            </h2>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary/20 border border-primary/50"></div>
                <span>Productive</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500/10 border border-orange-500/30"></div>
                <span>Incomplete</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-amber-500/70" />
                <span>Journal Entry</span>
              </div>
            </div>
          </div>

          <CalendarView />
        </div>
      </div>
    </div>
  );
}
