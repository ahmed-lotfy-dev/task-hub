import { Outlet, useNavigate, useLocation } from 'react-router'
import { PersonalSidebar } from '@/components/app/personal-sidebar'
import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'

export function AuthenticatedLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session, isPending } = useSession()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        console.warn('[AuthenticatedLayout] No session found, redirecting to login...')
        navigate('/login', {
          state: { redirect: location.pathname }
        })
      }
      setIsChecking(false)
    }
  }, [session, isPending, navigate, location.pathname])

  if (isPending || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <PersonalSidebar />
      <main className="flex-1 overflow-y-auto h-full p-12">
        <Outlet />
      </main>
    </div>
  );
}
