import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
  type ChatMiddleware,
  memoryStream,
  resumeServerSentEventsResponse,
} from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { createFileRoute } from "@tanstack/react-router";
import { reconstructChat, withPersistence } from "@tanstack/ai-persistence";
import { persistence } from "#/lib/persistence";

const testMiddleware: ChatMiddleware = {
  name: "logger",

  onFinish: (ctx, info) => {
    console.log(`[${ctx.requestId}] Finished in ${info.duration}ms`);

    ctx.messages.forEach((message) => {
      console.log(message.id, message.role, message.content);
    });
  },
};

export const Route = createFileRoute("/api/ai/chat-with-persistence")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const durability = memoryStream(request);
        // A run still in flight: the client sent a resume offset, so replay its log.
        if (durability.resumeFrom() !== null) {
          return resumeServerSentEventsResponse({ adapter: durability });
        }
        // Otherwise return the stored thread, plus a cursor to any run still generating.
        return reconstructChat(persistence, request, {
          // WITHOUT this, anyone who guesses a thread id gets the whole transcript.
          authorize: async (threadId, req) => ownsThread(req, threadId),
        });
      },
      POST: async ({ request }) => {
        const params = await chatParamsFromRequest(request);

        const stream = chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          middleware: [testMiddleware, withPersistence(persistence)],
        });

        return toServerSentEventsResponse(stream, { durability: { adapter: memoryStream(request), batch: 1 } });
        // return toServerSentEventsResponse(stream);
      },
    },
  },
});

async function ownsThread(request: Request, threadId: string): Promise<boolean> {
  void request;
  void threadId;
  return true; // replace with your session and ownership check
}
