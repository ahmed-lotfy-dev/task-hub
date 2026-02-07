import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/layouts/root-layout'
import { AuthenticatedLayout } from '@/app/layouts/authenticated-layout'
import { LandingPage } from '@/app/routes/landing-page'
import { LoginPage } from '@/app/routes/login-page'
import { SignupPage } from '@/app/routes/signup-page'
import { HomePage } from '@/app/routes/home-page'
import { BoardsPage } from '@/app/routes/boards-page'
import { BoardPage } from '@/app/routes/board-page'
import { TasksPage } from '@/app/routes/tasks-page'
import { InboxPage } from '@/app/routes/inbox-page'
import { ActivityPage } from '@/app/routes/activity-page'
import { SettingsPage } from '@/app/routes/settings-page'
import { WorkspacePage } from '@/app/routes/workspace-page'
import { PersonalPage } from '@/app/routes/personal-page'
import { AcceptInvitePage } from '@/app/routes/accept-invite-page'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/accept-invite/:token',
        element: <AcceptInvitePage />,
      },
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: '/home',
            element: <HomePage />,
          },
          {
            path: '/boards',
            element: <BoardsPage />,
          },
          {
            path: '/board/:boardId',
            element: <BoardPage />,
          },
          {
            path: '/tasks',
            element: <TasksPage />,
          },
          {
            path: '/inbox',
            element: <InboxPage />,
          },
          {
            path: '/activity',
            element: <ActivityPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          {
            path: '/workspace/:slug',
            element: <WorkspacePage />,
          },
          {
            path: '/personal',
            element: <PersonalPage />,
          },
        ],
      },
    ],
  },
])
