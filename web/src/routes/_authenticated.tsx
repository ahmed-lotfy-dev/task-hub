import { createFileRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { PersonalSidebar } from '@/components/app/personal-sidebar'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isPending && !session) {
      navigate({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  }, [session, isPending, navigate, location.href])

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-zinc-500">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PersonalSidebar />
      <main className="flex-1 p-12">
        <Outlet />
      </main>
    </div>
  )
}
