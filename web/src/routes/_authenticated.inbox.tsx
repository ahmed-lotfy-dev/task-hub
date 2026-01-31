import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/inbox')({
  component: () => <div className="p-8"><h1 className="text-2xl font-bold">Inbox</h1></div>,
})
