import { createFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { PersonalSidebar } from '@/components/app/personal-sidebar'
import { apiFetch, serverFetch } from '@/lib/api'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  // Loader to verify session
  loader: async (ctx: any) => {
    try {
      const isServer = typeof window === 'undefined'
      const request = ctx.request as Request | undefined

      const user = isServer && request
        ? await serverFetch<any>('/api/user', request)
        : await apiFetch<any>('/api/user')

      return { user }
    } catch (error) {
      console.warn('[AuthenticatedLoader] Verification failed, continuing to client:', error)
      return { user: null as any }
    }
  },
  component: AuthenticatedLayout,
  errorComponent: () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      // Avoid redirect loops if we are already on login
      if (location.pathname === '/login') return;

      // Redirect to login on error (unauthorized)
      // Use pathname instead of href to avoid absolute URL issues in some routers
      navigate({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }, [navigate, location])

    return null
  },
})

function AuthenticatedLayout() {
  const { user } = Route.useLoaderData()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      console.warn('[AuthenticatedLayout] No user found, redirecting to login...')
      navigate({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  }, [user, navigate, location.pathname])

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PersonalSidebar />
      <main className="flex-1 p-12">
        <Outlet />
      </main>
    </div>
  )
}
