import { Loader2 } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useBoards as useRecentBoards } from "@/hooks/use-boards";
import { useTasks as usePriorityTasks } from "@/hooks/use-tasks";
import { useActivities } from "@/hooks/use-activities";
import { useSession } from "@/lib/auth-client";
import { HomeHeader } from "@/components/home/dashboard/home-header";
import { HomeStats } from "@/components/home/dashboard/home-stats";
import { RecentBoards } from "@/components/home/dashboard/recent-boards";
import { PriorityTasks } from "@/components/home/dashboard/priority-tasks";
import { HomeSidebar } from "@/components/home/dashboard/home-sidebar";

export function HomePage() {
  const { data: session } = useSession();
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { data: boards, isLoading: isLoadingBoards } = useRecentBoards();
  const { data: tasks, isLoading: isLoadingTasks } = usePriorityTasks();
  const { data: activities, isLoading: isLoadingActivities } = useActivities();

  const isLoading =
    isLoadingWorkspaces || isLoadingBoards || isLoadingTasks || isLoadingActivities;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Powering up your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-20">
      <HomeHeader userName={session?.user?.name} />

      <HomeStats
        tasksCount={tasks?.length || 0}
        workspacesCount={workspaces?.length || 0}
        boardsCount={boards?.length || 0}
      />

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <RecentBoards boards={boards} />
          <PriorityTasks tasks={tasks} />
        </div>

        <HomeSidebar activities={activities} workspaces={workspaces} />
      </div>
    </div>
  );
}
