import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FC } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { fetchServerSentEvents, useChat, type UIMessage } from "@tanstack/ai-react";
import { promptOutputSchema } from "#/lib/zod-schema";
import type { WorkoutTemplateState } from "#/data/workout-templates/workout-state";
import type { MessagePart } from "@tanstack/ai";
import { DisplayWorkoutTemplate as DisplayWorkoutTemplateStreaming } from "#/components/display-workout-template-streaming/DisplayWorkoutTemplate";

export const Route = createFileRoute("/structured-output")({
  component: BasicChat,
});

const MIN_PROMPT_LENGTH = 20;

function BasicChat() {
  const [prompt, setPrompt] = useState("");

  const payload = useChat({
    connection: fetchServerSentEvents("/api/ai/chat-with-persistence"),
    threadId: "xxx",
    persistence: true,
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
            <DisplayMessage key={message.id} message={message} />
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

type DisplayMessageProps = {
  message: UIMessage<any, { commentary: string; workouts: WorkoutTemplateState[] }, undefined>;
};
const DisplayMessage: FC<DisplayMessageProps> = props => {
  const { message } = props;

  return (
    <div key={message.id} className="w-full">
      {message.parts.map((part, index) => (
        <div key={index}>
          <DisplayMessagePart part={part} />
        </div>
      ))}
    </div>
  );
};

type DisplayMessagePartProps = {
  part: MessagePart<{ commentary: string; workouts: WorkoutTemplateState[] }>;
};
const DisplayMessagePart: FC<DisplayMessagePartProps> = props => {
  const { part } = props;
  if (part.type === "structured-output") {
    if (!part.partial?.commentary) {
      return null;
    }
    return (
      <div className="flex flex-col gap-2">
        {part.partial?.commentary && <span>{part.partial?.commentary}</span>}
        {part.partial?.workouts?.map((workoutTemplate, idx) => (
          <DisplayWorkoutTemplateStreaming key={idx} workoutTemplate={workoutTemplate as WorkoutTemplateState} />
        ))}
      </div>
    );
  }
  if (part.type === "text") {
    return <span>{part.content}</span>;
  }
  return null;
};
