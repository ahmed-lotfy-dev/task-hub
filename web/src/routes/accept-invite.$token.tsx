import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/accept-invite/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/accept-invite/$token"!</div>
}
