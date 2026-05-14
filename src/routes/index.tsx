import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, BookOpen, MessageSquare, ArrowRight, Sparkles, Clock, TrendingUp, Zap, CheckCircle2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUsageStats, resetUsage } from "@/lib/usage-stats";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const tools = [
  { title: "Smart Email Generator", desc: "Draft professional emails in any tone — formal, friendly, persuasive.", url: "/email", icon: Mail },
  { title: "Meeting Notes Summarizer", desc: "Turn long notes into summaries, decisions, action items and deadlines.", url: "/meetings", icon: FileText },
  { title: "AI Task Planner", desc: "Build prioritized daily and weekly schedules from your task list.", url: "/tasks", icon: CalendarCheck },
  { title: "AI Research Assistant", desc: "Summarize topics or articles and surface insights and recommendations.", url: "/research", icon: BookOpen },
  { title: "AI Chatbot", desc: "Your interactive workplace assistant for any quick question.", url: "/chat", icon: MessageSquare },
];

function formatMinutes(mins: number): { value: string; hint: string } {
  if (mins < 60) return { value: `${Math.round(mins)}m`, hint: "estimated time saved" };
  const hours = mins / 60;
  if (hours < 10) return { value: `${hours.toFixed(1)}h`, hint: "estimated time saved" };
  return { value: `${Math.round(hours)}h`, hint: "estimated time saved" };
}

function formatChars(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

function relativeTime(ts: number | null): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function Dashboard() {
  const usage = useUsageStats();
  const time = formatMinutes(usage.minutesSaved);
  const stats = [
    { label: "Time saved", value: time.value, delta: usage.totalRuns > 0 ? "live" : "—", icon: Clock, hint: time.hint },
    { label: "AI runs", value: `${usage.totalRuns}`, delta: usage.lastUsedAt ? relativeTime(usage.lastUsedAt) : "—", icon: Zap, hint: "across all tools" },
    { label: "Words generated", value: formatChars(Math.round(usage.charsGenerated / 5)), delta: usage.charsGenerated > 0 ? "live" : "—", icon: TrendingUp, hint: "by the assistant" },
    { label: "Active streak", value: `${usage.streakDays}d`, delta: usage.streakDays > 0 ? "🔥" : "—", icon: CheckCircle2, hint: "consecutive days" },
  ];
  const topTool = (Object.entries(usage.byTool) as [string, number][])
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/40 p-8 shadow-elegant">
        <div className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg, oklch(0.78 0.16 85 / 0.18) 0%, oklch(0.92 0.08 90 / 0.10) 50%, transparent 100%), var(--gradient-radial-purple), var(--gradient-radial-red)" }} />
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          <Sparkles className="h-3.5 w-3.5" /> AI Workplace Suite
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
          Automate your <span className="text-gradient-brand">workday</span> with AI.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Five focused tools to help you write, plan, summarize, and research faster — all in one
          professional dashboard.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/email" className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90">
            Start with Email <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/chat" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-card">
            Open AI Chatbot
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-sm font-semibold text-muted-foreground">
              Your productivity{" "}
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> live
              </span>
            </h2>
            {topTool && topTool[1] > 0 && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Most used: <span className="font-medium text-foreground capitalize">{topTool[0]}</span> · {topTool[1]} runs
              </p>
            )}
          </div>
          {usage.totalRuns > 0 && (
            <button
              onClick={() => resetUsage()}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="relative overflow-hidden border-border/60 bg-card/60 p-3">
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-gold opacity-10 blur-2xl" />
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-gold text-background shadow-glow">
                  <s.icon className="h-3.5 w-3.5" />
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                  {s.delta}
                </span>
              </div>
              <div className="mt-2 text-xl font-bold tracking-tight text-gradient-gold">{s.value}</div>
              <div className="mt-0.5 text-xs font-medium text-foreground">{s.label}</div>
              <div className="text-[11px] text-muted-foreground">{s.hint}</div>
            </Card>
          ))}
        </div>
        {usage.totalRuns === 0 && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Stats update in real time as you use the tools below.
          </p>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Productivity tools</h2>
            <p className="text-sm text-muted-foreground">Pick a tool to start automating your workflow.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.url} to={t.url} className="group">
            <Card className="h-full border-border/60 bg-card/60 p-5 transition hover:border-accent/60 hover:shadow-glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold text-background">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
        ))}
        <Card className="border-border/60 bg-gradient-brand-soft p-5 text-white">
          <h3 className="font-display text-lg font-semibold">Responsible AI</h3>
          <p className="mt-2 text-sm text-white/85">
            All outputs are generated by AI and may contain errors or omissions. Always review and
            edit before sharing or acting on them, and avoid sharing confidential information.
          </p>
        </Card>
        </div>
      </section>
    </div>
  );
}
