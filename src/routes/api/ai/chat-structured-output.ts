import { promptOutputSchema } from "#/lib/zod-schema";
import { chat } from "@tanstack/ai";
import { vercelGatewayText } from "@tanstack/ai-vercel-gateway";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/chat-structured-output")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();

        const stream = await chat({
          adapter: vercelGatewayText("anthropic/claude-opus-5"),
          messages,
          outputSchema: promptOutputSchema,
        });

        return Response.json(stream);
      },
    },
  },
});
