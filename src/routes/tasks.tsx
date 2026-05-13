import { useState } from "react";
import { CalendarCheck, Loader2, Sparkles, Copy } from "lucide-react";
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

export const Route = createFileRoute("/tasks")({
  component: TaskPlanner,
});

function TaskPlanner() {
  const [horizon, setHorizon] = useState("Daily");
  const [tasks, setTasks] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    if (!tasks.trim()) return toast.error("List your tasks first.");
    setLoading(true);
    try {
      const content = await callAI({
        tool: "tasks",
        prompt: `Planning horizon: ${horizon}.\nTasks:\n${tasks}`,
      });
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
        title="AI Task Planner"
        description="Drop in your tasks — get a prioritized daily or weekly schedule with focus blocks."
        icon={<CalendarCheck className="h-6 w-6" />}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-5">
          <Label>Schedule type</Label>
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Label className="mt-4 block">Your tasks</Label>
          <Textarea
            className="mt-1.5 min-h-[280px]"
            placeholder="One task per line. Add deadlines or estimated time if you have them, e.g.:&#10;Finalize Q3 deck — due Thursday (~3h)&#10;Reply to Acme proposal&#10;Code review for PR #421"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
          />
          <Button onClick={plan} disabled={loading} className="mt-4 bg-gradient-brand text-white shadow-glow hover:opacity-90">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Build Plan
          </Button>
        </Card>

        <Card className="border-border/60 bg-card/60 p-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Your schedule (editable)</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            )}
          </div>
          <StructuredOutput
            value={output}
            onChange={setOutput}
            placeholder="Your prioritized plan will appear here..."
          />
          <AIDisclaimer />
        </Card>
      </div>
    </div>
  );
}
