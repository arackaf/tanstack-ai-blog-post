import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/persistence/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/persistence/$id"!</div>
}
