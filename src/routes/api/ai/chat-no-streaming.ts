import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/chat-no-streaming")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();

        const stream = chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages,
        });

        return toServerSentEventsResponse(stream);
      },
    },
  },
});
