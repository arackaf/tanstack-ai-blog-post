import { chat, chatParamsFromRequest } from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/chat-no-streaming")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const params = await chatParamsFromRequest(request);

        const result = await chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          stream: false,
        });

        console.log("\n\n----------------------------------------------------------");
        console.log("result", result);
        console.log("----------------------------------------------------------\n\n");

        return new Response(result);
      },
    },
  },
});
