import { createFileRoute, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Star, Clock, Calendar, LayoutGrid, ChevronRight, Plus, Search, Loader2 } from 'lucide-react'
import { StatCard } from '@/components/home/stat-card'
import { BoardCard } from '@/components/home/board-card'
import { TaskItem } from '@/components/home/task-item'
import { ActivityItem } from '@/components/home/activity-item'
import { WorkspaceItem } from '@/components/home/workspace-item'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { useBoards as useRecentBoards } from '@/hooks/use-boards'
import { useTasks as usePriorityTasks } from '@/hooks/use-tasks'
import { useSession } from '@/lib/auth-client'
import { Workspace, Board, Card as Task } from '@taskflow/shared'

export const Route = createFileRoute('/_authenticated/home')({
  component: HomePage,
})

function HomePage() {
  const { data: session } = useSession();
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { data: boards, isLoading: isLoadingBoards } = useRecentBoards();
  const { data: tasks, isLoading: isLoadingTasks } = usePriorityTasks();

  const isLoading = isLoadingWorkspaces || isLoadingBoards || isLoadingTasks;

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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-[#2D3748] tracking-tight"
          >
            Good Morning, {session?.user?.name?.split(' ')[0]}! 👋
          </motion.h1>
          <p className="text-muted-foreground text-lg font-medium">Here's your productivity overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-11 pr-4 py-3 rounded-2xl bg-white shadow-sm border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 font-medium transition-all"
            />
          </div>
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <StatCard icon={<Star className="text-accent" />} label="Focus" value={`${tasks?.length || 0} Tasks`} />
        <StatCard icon={<Clock className="text-primary" />} label="Workspaces" value={`${workspaces?.length || 0}`} />
        <StatCard icon={<Calendar className="text-secondary" />} label="Boards" value={`${boards?.length || 0}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-primary" />
                Recent Boards
              </h2>
              <Link to="/boards" className="text-primary font-bold text-sm hover:underline cursor-pointer flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {boards?.map((board: Board) => (
                <BoardCard
                  key={board.id}
                  name={board.name}
                  workspace="General" // This should ideally come from a join or store
                  color="bg-primary"
                  activeTasks={0}
                />
              ))}
              <div className="flex items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-zinc-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-zinc-500 group-hover:text-primary">Create New Board</span>
                </div>
              </div>
            </div>
            {boards?.length === 0 && (
              <p className="text-center py-8 text-muted-foreground font-medium bg-zinc-50/50 rounded-[32px] border border-zinc-100">
                No boards yet. Start by creating your first one!
              </p>
            )}
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Priority Focus</h2>
            <div className="flex flex-col gap-4">
              {tasks?.map((task: Task) => (
                <TaskItem key={task.id} title={task.title} project="Direct Task" status={(task.priority as any) || "Medium"} />
              ))}
              {tasks?.length === 0 && (
                <p className="text-sm text-muted-foreground font-medium italic">No high priority tasks assigned to you.</p>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Team Activity</h2>
            <Card className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-6 grayscale opacity-60">
                <ActivityItem
                  user="Demo User"
                  action="started"
                  target="New Project"
                  time="Just now"
                />
              </div>
              <Button variant="white" className="w-full mt-2 cursor-pointer disabled:opacity-50" disabled>Connect Activity Feed</Button>
            </Card>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Workspaces</h2>
            <div className="flex flex-col gap-3">
              {workspaces?.map((workspace: Workspace) => (
                <WorkspaceItem key={workspace.id} name={workspace.name} members={1} icon={workspace.name[0]} />
              ))}
              <Button variant="outline" className="w-full rounded-2xl border-dashed border-2 py-6 font-bold flex items-center gap-2 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all">
                <Plus className="w-4 h-4" />
                New Workspace
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
