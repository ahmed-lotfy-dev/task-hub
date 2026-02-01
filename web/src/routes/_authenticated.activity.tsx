import { createFileRoute } from "@tanstack/react-router";
import { useActivities } from "@/hooks/use-activities";
import { ActivityItem } from "@/components/home/activity-item";
import { Card } from "@/components/ui/card";
import { History, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatDate, DATE_FORMATS } from "@taskflow/shared";

export const Route = createFileRoute("/_authenticated/activity")({
  component: ActivityHistoryPage,
});

function ActivityHistoryPage() {
  const { data: activities, isLoading } = useActivities();

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/50 p-8 sm:p-12">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/home">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <History className="w-8 h-8 text-primary" />
                Team Activity History
              </h1>
              <p className="text-muted-foreground font-medium mt-1">A comprehensive log of all actions within your workspace.</p>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-bold">Retrieving activity logs...</p>
          </div>
        ) : !activities || activities.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center bg-white/50 border-dashed">
            <History className="w-16 h-16 text-zinc-200 mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">No Activity Recorded</h3>
            <p className="text-sm text-zinc-300 max-w-xs mt-2">
              All future actions will be logged here for total transparency.
            </p>
          </Card>
        ) : (
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl shadow-zinc-200/50 border-white/20">
            <div className="flex flex-col gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-2">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 ml-14">
                    {formatDate(activity.createdAt, DATE_FORMATS.DISPLAY_WITH_TIME)}
                  </div>
                  <ActivityItem
                    user={activity.user.name || "Unknown User"}
                    action={activity.action}
                    target={activity.entityName || activity.entityType}
                    time={formatDate(activity.createdAt, DATE_FORMATS.TIME)}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
