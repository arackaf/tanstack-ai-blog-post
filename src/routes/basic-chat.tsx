import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/basic-chat")({ component: BasicChat });

function BasicChat() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Basic Chat</h1>
    </div>
  );
}
