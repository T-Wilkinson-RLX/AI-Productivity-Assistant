import { useState } from "react";
import { FileText, Loader2, Sparkles, Copy } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/page-header";
import { StructuredOutput } from "@/components/structured-output";
import { callAI } from "@/lib/ai-client";

export const Route = createFileRoute("/meetings")({
  component: MeetingNotes,
});

function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes first.");
    setLoading(true);
    try {
      const content = await callAI({ tool: "meeting", prompt: notes });
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
        title="Meeting Notes Summarizer"
        description="Paste raw notes — get a clean summary, decisions, action items, and deadlines."
        icon={<FileText className="h-6 w-6" />}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-5">
          <Label>Raw meeting notes</Label>
          <Textarea
            className="mt-1.5 min-h-[360px]"
            placeholder="Paste full meeting transcript or notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button onClick={summarize} disabled={loading} className="mt-4 bg-gradient-brand text-white shadow-glow hover:opacity-90">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Summarize
          </Button>
        </Card>

        <Card className="border-border/60 bg-card/60 p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Structured summary (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            )}
          </div>
          <StructuredOutput
            value={output}
            onChange={setOutput}
            placeholder="Summary, decisions, action items and deadlines will appear here..."
          />
          <AIDisclaimer />
        </Card>
      </div>
    </div>
  );
}
