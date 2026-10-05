import { chat, chatParamsFromRequest, toServerSentEventsResponse } from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { createFileRoute } from "@tanstack/react-router";
import { withPersistence } from "@tanstack/ai-persistence";
import { persistence } from "#/lib/persistence";

export const Route = createFileRoute("/api/ai/chat-with-persistence")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const params = await chatParamsFromRequest(request);

        const stream = chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          middleware: [withPersistence(persistence)],
        });

        return toServerSentEventsResponse(stream);
      },
    },
  },
});
