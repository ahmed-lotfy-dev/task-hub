import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PersonalSidebar } from '@/components/app/personal-sidebar'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PersonalSidebar />
      <main className="flex-1 p-12">
        <Outlet />
      </main>
    </div>
  )
}
