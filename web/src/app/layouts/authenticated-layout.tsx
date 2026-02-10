import { Outlet, useNavigate, useLocation } from 'react-router'
import { PersonalSidebar } from '@/components/app/personal-sidebar'
import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'

export function AuthenticatedLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session, isPending, isRefetching } = useSession()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Only redirect after we've confirmed there's no session
    // Wait for both initial pending and any background refetching to complete
    if (!isPending && !isRefetching) {
      if (!session) {
        console.warn('[AuthenticatedLayout] No session found, redirecting to login...')
        navigate('/login', {
          state: { redirect: location.pathname }
        })
      }
      setHasChecked(true)
    }
  }, [session, isPending, isRefetching, navigate, location.pathname])

  // Show loading spinner while checking authentication
  if (isPending || isRefetching || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If no session after checking, don't render anything (redirect will happen)
  if (!session) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <PersonalSidebar />
      <main className="flex-1 overflow-y-auto h-full p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
