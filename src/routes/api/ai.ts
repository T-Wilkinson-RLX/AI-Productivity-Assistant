import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert workplace email writer. Generate a complete, ready-to-send professional email based on the user's brief. Adapt the tone strictly. Always include a subject line on the first line as "Subject: ...", then a blank line, then the email body with greeting, body paragraphs, and sign-off. Be concise and clear.`,
  meeting: `You are a meeting notes analyst. Summarize the provided notes in markdown with these exact sections in order:
## Summary
A short paragraph.
## Key Decisions
- bullet list
## Action Items
- [Owner] Task — Deadline (if any)
## Deadlines
- Item — Date
If a section has nothing, write "None identified".`,
  tasks: `You are an AI productivity planner. Create a prioritized schedule from the user's tasks. Output markdown with sections per day (or per priority block if a single day). For each task include: priority (P1/P2/P3), suggested time block, and 1-line rationale. End with a "Focus tip" line.`,
  research: `You are a research assistant. Given a topic or article text, produce markdown with:
## TL;DR
2-3 sentences.
## Key Insights
- 4-7 bullets
## Recommendations
- 3-5 actionable bullets
## Open Questions
- bullets
Be precise, neutral, and useful for a professional audience.`,
  chat: `You are an AI Workplace Assistant. Be friendly, concise, and practical. Help with writing, planning, summarizing, and brainstorming. Use markdown when helpful.`,
};

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { tool, messages, prompt, options } = (await request.json()) as {
            tool: keyof typeof SYSTEM_PROMPTS;
            messages?: { role: "user" | "assistant"; content: string }[];
            prompt?: string;
            options?: { tone?: string };
          };

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });
          }

          let system = SYSTEM_PROMPTS[tool] ?? SYSTEM_PROMPTS.chat;
          if (tool === "email" && options?.tone) {
            system += `\n\nTone: ${options.tone}.`;
          }

          const chatMessages = messages
            ? messages
            : [{ role: "user" as const, content: prompt ?? "" }];

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "system", content: system }, ...chatMessages],
            }),
          });

          if (!res.ok) {
            if (res.status === 429) {
              return new Response(
                JSON.stringify({ error: "Rate limit reached. Please try again shortly." }),
                { status: 429, headers: { "Content-Type": "application/json" } },
              );
            }
            if (res.status === 402) {
              return new Response(
                JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }),
                { status: 402, headers: { "Content-Type": "application/json" } },
              );
            }
            const t = await res.text();
            console.error("AI gateway error", res.status, t);
            return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500 });
          }

          const data = await res.json();
          const content: string = data.choices?.[0]?.message?.content ?? "";
          return Response.json({ content });
        } catch (e) {
          console.error(e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
