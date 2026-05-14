import { useState } from "react";
import { Mail, Loader2, Copy, Sparkles } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/page-header";
import { StructuredOutput } from "@/components/structured-output";
import { callAI } from "@/lib/ai-client";

export const Route = createFileRoute("/email")({
  component: EmailGenerator,
});

function EmailGenerator() {
  const [tone, setTone] = useState("Formal");
  const [brief, setBrief] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!brief.trim()) return toast.error("Describe what the email should be about.");
    setLoading(true);
    try {
      const content = await callAI({
        tool: "email",
        prompt: brief,
        options: { tone },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Tool"
        title="Smart Email Generator"
        description="Describe the message — pick a tone — get a polished, ready-to-send email."
        icon={<Mail className="h-6 w-6" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-5">
          <div className="grid gap-4">
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                  <SelectItem value="Concise">Concise</SelectItem>
                  <SelectItem value="Apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>What is the email about?</Label>
              <Textarea
                className="mt-1.5 min-h-[200px]"
                placeholder="E.g. Follow up with client Acme Corp about the Q3 proposal we sent last Friday and ask for their feedback by Wednesday."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="bg-gradient-brand text-white shadow-glow hover:opacity-90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Email
            </Button>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/60 p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Generated email (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            )}
          </div>
          <StructuredOutput
            value={output}
            onChange={setOutput}
            minHeight="340px"
            placeholder="Your generated email will appear here..."
          />
          <AIDisclaimer />
        </Card>
      </div>
    </div>
  );
}
