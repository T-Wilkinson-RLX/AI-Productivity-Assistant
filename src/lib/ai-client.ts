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
  return data.content as string;
}
