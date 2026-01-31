import { createFileRoute, Outlet } from '@tanstack/react-router'
import { WorkspaceSidebar } from '@/components/app/workspace-sidebar'

export const Route = createFileRoute('/_authenticated/workspace')({
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <WorkspaceSidebar />
      <main className="flex-1 p-12">
        <Outlet />
      </main>
    </div>
  )
}
