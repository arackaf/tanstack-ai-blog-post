import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/structured-output")({
  component: StructuredOutput,
});

function StructuredOutput() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Structured Output</h1>
    </div>
  );
}
