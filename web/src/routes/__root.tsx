import { HeadContent, Scripts, Outlet, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from 'sonner'
import '../globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Task Hub',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap',
      },
    ],
  }),
  shellComponent: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <QueryProvider>
        <Outlet />
      </QueryProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: 'Lexend, sans-serif' }}>
        {children}
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  )
}
