import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/persistence")({
  component: Persistence,
});

function Persistence() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Persistence</h1>
    </div>
  );
}
