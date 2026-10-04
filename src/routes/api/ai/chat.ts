import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();

        // TODO: implement
        return Response.json({ received: body });
      },
    },
  },
});
