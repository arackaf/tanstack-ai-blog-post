import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { fetchJson, useChat } from "@tanstack/ai-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { promptOutputSchema } from "#/lib/zod-schema";
import { DisplayWorkoutTemplate } from "#/components/display-workout-template/DisplayWorkoutTemplate";

export const Route = createFileRoute("/structured-output")({
  component: BasicChat,
});

const MIN_PROMPT_LENGTH = 20;

function BasicChat() {
  const [prompt, setPrompt] = useState("");

  const payload = useChat({
    connection: fetchJson("/api/ai/chat-structured-output"),
    outputSchema: promptOutputSchema,
  });

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
        {messages.map(message =>
          message.role === "user" ? (
            <div key={message.id} className="w-1/2 self-end rounded-2xl bg-blue-100 px-4 py-2">
              {message.parts.map((part, index) => (part.type === "text" ? <p key={index}>{part.content}</p> : null))}
            </div>
          ) : (
            <div key={message.id} className="w-full">
              {message.parts.map((part, index) => (
                <div key={index}>
                  {part.type === "structured-output" && part.status === "complete" ? (
                    <div className="flex flex-col gap-2">
                      <span>{part.data.commentary}</span>
                      {part.data.workouts.map(workoutTemplate => (
                        <DisplayWorkoutTemplate workoutTemplate={workoutTemplate} />
                      ))}
                    </div>
                  ) : part.type === "text" ? (
                    <span>{part.content}</span>
                  ) : null}
                </div>
              ))}
            </div>
          ),
        )}
        {isLoading && <Loader2 className="size-6 animate-spin text-muted-foreground" />}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} />
        {prompt.length > 0 && charactersRemaining > 0 && <p className="text-sm text-muted-foreground">{charactersRemaining} more characters</p>}
      </div>
      <Button className="self-start" onClick={handleGenerate} disabled={isLoading || charactersRemaining > 0}>
        Generate
      </Button>
    </div>
  );
}
