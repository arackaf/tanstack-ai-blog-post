import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vercel-ai-streaming")({
  component: VercelAiStreaming,
});

function VercelAiStreaming() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Vercel Streaming</h1>
    </div>
  );
}
