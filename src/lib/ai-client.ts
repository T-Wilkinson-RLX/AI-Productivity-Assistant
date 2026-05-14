import { recordUsage, type ToolKey } from "./usage-stats";

export async function callAI(params: {
  tool: "email" | "meeting" | "tasks" | "research" | "chat";
  prompt?: string;
  messages?: { role: "user" | "assistant"; content: string }[];
  options?: { tone?: string };
}): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    let msg = "Something went wrong.";
    try {
      const data = await res.json();
      if (data.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  const content = data.content as string;
  const inputChars =
    (params.prompt?.length ?? 0) +
    (params.messages?.reduce((sum, m) => sum + m.content.length, 0) ?? 0);
  // Normalize "meeting"/"meetings" tool key.
  const toolKey = (params.tool === "meeting" ? "meeting" : params.tool) as ToolKey;
  try {
    recordUsage(toolKey, inputChars, content?.length ?? 0);
  } catch {}
  return content;
}
