import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Workspace, formatDate, DATE_FORMATS } from "@taskflow/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActivityItem } from "@/components/home/activity-item";
import { WorkspaceItem } from "@/components/home/workspace-item";
import { CreateWorkspaceDialog } from "@/components/home/create-workspace-dialog";

interface HomeSidebarProps {
  activities: any[] | undefined;
  workspaces: Workspace[] | undefined;
}

export function HomeSidebar({ activities, workspaces }: HomeSidebarProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Team Activity</h2>
        <Card className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            {activities && activities.length > 0 ? (
              activities.slice(0, 10).map((activity) => (
                <ActivityItem
                  key={activity.id}
                  user={activity.user.name || "Unknown"}
                  action={activity.action}
                  target={activity.entityName || activity.entityType}
                  time={formatDate(activity.createdAt, DATE_FORMATS.TIME)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-muted-foreground font-medium italic">
                  No activity yet. Start by creating a task!
                </p>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full mt-2 cursor-pointer transition-all hover:bg-primary hover:text-white"
            asChild
          >
            <Link to="/activity">View Full History</Link>
          </Button>
        </Card>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Workspaces</h2>
        <div className="flex flex-col gap-3">
          {workspaces?.map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              name={workspace.name}
              members={1}
              icon={workspace.name[0]}
            />
          ))}
          <CreateWorkspaceDialog>
            <Button
              variant="outline"
              className="w-full rounded-2xl border-dashed border-2 py-6 font-bold flex items-center gap-2 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Workspace
            </Button>
          </CreateWorkspaceDialog>
        </div>
      </section>
    </div>
  );
}
