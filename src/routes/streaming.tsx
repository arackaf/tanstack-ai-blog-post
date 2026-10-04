import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/streaming")({ component: Streaming });

function Streaming() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Streaming</h1>
    </div>
  );
}
