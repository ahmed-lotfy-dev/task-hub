import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/boards')({
  component: () => <div className="p-8"><h1 className="text-2xl font-bold">All Boards</h1></div>,
})
