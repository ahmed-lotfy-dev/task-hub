"use client";

import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Workspace, formatDate, DATE_FORMATS } from "@taskflow/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActivityItem } from "@/features/dashboard/components/ActivityItem/ActivityItem";
import { WorkspaceItem } from "@/features/workspace/components/WorkspaceItem/WorkspaceItem";
import { CreateWorkspaceDialog } from "@/features/workspace/components/CreateWorkspaceDialog/CreateWorkspaceDialog";
import { WorkspaceMembersModal } from "@/features/workspace/components/WorkspaceMembersModal/WorkspaceMembersModal";

interface HomeSidebarProps {
  activities: any[] | undefined;
  workspaces: Workspace[] | undefined;
}

export function HomeSidebar({ activities, workspaces }: HomeSidebarProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team activity</h2>
          <p className="text-sm text-muted-foreground">Latest updates across your workspace.</p>
        </div>
        <Card className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
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
                <p className="text-sm text-muted-foreground">No activity yet. Start by creating a task.</p>
              </div>
            )}
          </div>
          <Button variant="outline" className="w-full mt-2" asChild>
            <Link to="/activity">View full history</Link>
          </Button>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Workspaces</h2>
          <p className="text-sm text-muted-foreground">Quick access to your spaces.</p>
        </div>
        <div className="flex flex-col gap-2">
          {workspaces?.map((workspace) => (
            <WorkspaceMembersModal
              key={workspace.id}
              workspaceId={workspace.id}
              workspaceName={workspace.name}
            >
              <WorkspaceItem
                workspaceId={workspace.id}
                name={workspace.name}
                icon={workspace.name[0]}
              />
            </WorkspaceMembersModal>
          ))}
          <CreateWorkspaceDialog>
            <Button variant="outline" className="w-full border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              New workspace
            </Button>
          </CreateWorkspaceDialog>
        </div>
      </section>
    </div>
  );
}
