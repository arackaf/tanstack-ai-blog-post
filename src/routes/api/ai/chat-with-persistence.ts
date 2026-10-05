import { chat, chatParamsFromRequest, toServerSentEventsResponse, type ChatMiddleware } from "@tanstack/ai";
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
      GET: async ({ request }) => reconstructChat(persistence, request),
      POST: async ({ request }) => {
        const params = await chatParamsFromRequest(request);

        const stream = chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          middleware: [testMiddleware, withPersistence(persistence)],
        });

        return toServerSentEventsResponse(stream);
      },
    },
  },
});
