import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryProvider } from '@/components/providers/query-provider'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/app/router'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { GSAPProvider } from '@/components/providers/gsap-provider'
import '@/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <GSAPProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </GSAPProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
)
