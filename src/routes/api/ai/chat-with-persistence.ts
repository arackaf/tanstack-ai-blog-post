import { chat, chatParamsFromRequest, toServerSentEventsResponse, memoryStream, resumeServerSentEventsResponse } from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { createFileRoute } from "@tanstack/react-router";
import { reconstructChat, withPersistence } from "@tanstack/ai-persistence";
import { persistence } from "#/lib/persistence";

export const Route = createFileRoute("/api/ai/chat-with-persistence")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const durability = memoryStream(request);
        if (durability.resumeFrom() !== null) {
          return resumeServerSentEventsResponse({ adapter: durability });
        }

        return reconstructChat(persistence, request, {
          // WITHOUT this, anyone who guesses a thread id gets the whole transcript.
          authorize: async (threadId, req) => true,
        });
      },
      POST: async ({ request }) => {
        const params = await chatParamsFromRequest(request);

        const stream = chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          middleware: [withPersistence(persistence)],
        });

        return toServerSentEventsResponse(stream, {
          durability: { adapter: memoryStream(request) },
        });
      },
    },
  },
});
