import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: () => <div className="p-8"><h1 className="text-2xl font-bold">My Tasks</h1></div>,
})
