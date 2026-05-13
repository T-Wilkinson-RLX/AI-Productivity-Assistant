import { useState, useRef, useEffect } from "react";
import { MessageSquare, Loader2, Send, Sparkles } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { MarkdownView } from "@/components/markdown-view";
import { callAI } from "@/lib/ai-client";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your AI workplace assistant. Ask me to draft something, brainstorm, summarize, or plan your day." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const content = await callAI({ tool: "chat", messages: next });
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <PageHeader
        eyebrow="Tool"
        title="AI Chatbot"
        description="Your interactive workplace assistant. Press Enter to send, Shift+Enter for new line."
        icon={<MessageSquare className="h-6 w-6" />}
      />

      <Card className="flex flex-1 flex-col overflow-hidden border-border/60 bg-card/60 p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-brand px-4 py-2.5 text-sm text-white shadow-glow"
                    : "max-w-[80%] rounded-2xl rounded-bl-sm border border-border/60 bg-secondary px-4 py-2.5 text-sm text-foreground"
                }
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-border/60 bg-background/50 p-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask me anything workplace-related…"
              className="min-h-[52px] resize-none"
            />
            <Button onClick={send} disabled={loading || !input.trim()} className="bg-gradient-brand text-white shadow-glow hover:opacity-90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            AI-generated responses may be inaccurate. Verify before relying on them.
          </p>
        </div>
      </Card>
    </div>
  );
}
