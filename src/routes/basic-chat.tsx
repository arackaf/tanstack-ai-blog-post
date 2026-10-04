import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getRequest } from "@tanstack/react-start/server";

import { chat, chatParamsFromRequest, toServerSentEventsResponse } from "@tanstack/ai";
import { createVercelGatewayText, vercelGatewayText } from "@tanstack/ai-vercel-gateway";

import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";

export const Route = createFileRoute("/basic-chat")({ component: BasicChat });

function BasicChat() {
  const [prompt, setPrompt] = useState("");

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/ai/chat"),
  });
  const handleGenerate = () => {
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Basic Chat</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </div>
      <Button className="self-start" onClick={handleGenerate}>
        Generate
      </Button>

      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}</strong>
          {message.parts.map((part, index) => (part.type === "text" ? <p key={index}>{part.content}</p> : null))}
        </div>
      ))}
    </div>
  );
}
