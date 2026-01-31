import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/personal')({
  component: () => <div className="p-8"><h1 className="text-2xl font-bold">Personal Workspace</h1></div>,
})
