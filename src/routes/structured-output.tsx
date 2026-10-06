import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FC } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { fetchServerSentEvents, useChat, type UIMessage } from "@tanstack/ai-react";
import { promptOutputSchema } from "#/lib/zod-schema";

export const Route = createFileRoute("/structured-output")({ component: BasicChat });

const MIN_PROMPT_LENGTH = 20;

function BasicChat() {
  const [prompt, setPrompt] = useState("");

  const payload = useChat({
    connection: fetchServerSentEvents("/api/ai/chat-with-persistence"),
    threadId: "xxx",
    persistence: true,
    outputSchema: promptOutputSchema,
  });

  console.log({ payload });

  //console.log("payload", payload);
  const { messages, sendMessage, isLoading } = payload;
  const handleGenerate = () => {
    sendMessage(prompt);
  };

  const wasLoading = useRef(isLoading);
  useEffect(() => {
    if (wasLoading.current && !isLoading) {
      setPrompt("");
    }
    wasLoading.current = isLoading;
  }, [isLoading]);

  const charactersRemaining = MIN_PROMPT_LENGTH - prompt.length;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Basic Chat</h1>

      <div className="flex flex-col gap-4">
        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="w-1/2 self-end rounded-2xl bg-blue-100 px-4 py-2">
              {message.parts.map((part, index) => (part.type === "text" ? <p key={index}>{part.content}</p> : null))}
            </div>
          ) : (
            <div key={message.id} className="w-full">
              {message.parts.map((part, index) => (part.type === "text" ? <p key={index}>{part.content}</p> : null))}
            </div>
          ),
        )}
        {isLoading && <Loader2 className="size-6 animate-spin text-muted-foreground" />}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        {prompt.length > 0 && charactersRemaining > 0 && <p className="text-sm text-muted-foreground">{charactersRemaining} more characters</p>}
      </div>
      <Button className="self-start" onClick={handleGenerate} disabled={isLoading || charactersRemaining > 0}>
        Generate
      </Button>
    </div>
  );
}

type DisplayMessageProps = {
  message: UIMessage;
};
const DisplayMessage: FC<DisplayMessageProps> = (props) => {
  const { message } = props;
  return (
    <div key={message.id} className="w-full">
      {message.parts.map((part, index) => (part.type === "text" ? <p key={index}>{part.content}</p> : null))}
    </div>
  );
};
