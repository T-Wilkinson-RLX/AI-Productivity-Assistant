import { useState } from "react";
import { BookOpen, Loader2, Sparkles, Copy } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/page-header";
import { StructuredOutput } from "@/components/structured-output";
import { callAI } from "@/lib/ai-client";

export const Route = createFileRoute("/research")({
  component: Research,
});

function Research() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return toast.error("Enter a topic or paste an article.");
    setLoading(true);
    try {
      const content = await callAI({ tool: "research", prompt: input });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Tool"
        title="AI Research Assistant"
        description="Summarize a topic or article and surface insights, recommendations and open questions."
        icon={<BookOpen className="h-6 w-6" />}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-5">
          <Label>Topic or article text</Label>
          <Textarea
            className="mt-1.5 min-h-[360px]"
            placeholder="Paste an article, or type a topic like: 'Impact of generative AI on B2B SaaS pricing in 2025'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={run} disabled={loading} className="mt-4 bg-gradient-brand text-white shadow-glow hover:opacity-90">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Research
          </Button>
        </Card>

        <Card className="border-border/60 bg-card/60 p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Insights & recommendations (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            )}
          </div>
          <Textarea
            className="min-h-[360px] font-mono text-sm"
            placeholder="A structured research brief will appear here..."
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
          <AIDisclaimer />
        </Card>
      </div>
    </div>
  );
}
