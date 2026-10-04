import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">TanStack AI Demo</h1>
      <p className="mt-2 text-muted-foreground">Pick a demo from the header.</p>
    </div>
  );
}
