import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, BookOpen, MessageSquare, ArrowRight, Sparkles, Clock, TrendingUp, Zap, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

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

const stats = [
  { label: "Hours saved per week", value: "12.4", delta: "+38%", icon: Clock, hint: "vs. manual workflows" },
  { label: "Tasks automated", value: "1,284", delta: "+22%", icon: Zap, hint: "this month" },
  { label: "Faster email drafting", value: "5.7×", delta: "+470%", icon: TrendingUp, hint: "avg. across teams" },
  { label: "Meeting follow-ups closed", value: "96%", delta: "+14%", icon: CheckCircle2, hint: "within 24h" },
];

function Dashboard() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const totalPages = tools.length + 1;
  const [activePage, setActivePage] = useState(0);

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const child = track.children[index] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  };

  const scrollByDir = (dir: 1 | -1) => {
    scrollToIndex(Math.min(Math.max(activePage + dir, 0), totalPages - 1));
  };

  useEffect(() => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const onScroll = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let min = Infinity;
      children.forEach((c, i) => {
        const cc = (c.offsetLeft - track.offsetLeft) + c.clientWidth / 2;
        const d = Math.abs(cc - center);
        if (d < min) { min = d; closest = i; }
      });
      setActivePage(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 shadow-elegant">
        <div className="absolute inset-0 -z-10 opacity-80"
          style={{ background: "var(--gradient-radial-purple), var(--gradient-radial-red)" }} />
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="relative overflow-hidden border-border/60 bg-card/60 p-3">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-gold opacity-10 blur-2xl" />
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-gold text-background shadow-glow">
                  <s.icon className="h-3.5 w-3.5" />
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                  {s.delta}
                </span>
              </div>
              <div className="mt-2 text-xl font-bold tracking-tight text-gradient-gold">{s.value}</div>
              <div className="text-xs font-medium text-foreground">{s.label}</div>
              <div className="text-[11px] text-muted-foreground">{s.hint}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Productivity tools</h2>
            <p className="text-sm text-muted-foreground">Swipe or use the arrows to explore.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous tool"
              onClick={() => scrollByDir(-1)}
              disabled={activePage === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:border-accent/60 hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next tool"
              onClick={() => scrollByDir(1)}
              disabled={activePage === totalPages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:border-accent/60 hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div ref={scrollerRef} className="-mx-2 overflow-x-auto pb-3 [scrollbar-width:thin] scroll-smooth">
          <div className="flex snap-x snap-mandatory gap-4 px-2">
            {tools.map((t) => (
              <Link key={t.url} to={t.url} className="group snap-start shrink-0 w-[260px] sm:w-[280px]">
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
            <Card className="snap-start shrink-0 w-[260px] sm:w-[280px] border-border/60 bg-gradient-brand-soft p-5 text-white">
              <h3 className="font-display text-lg font-semibold">Responsible AI</h3>
              <p className="mt-2 text-sm text-white/85">
                All outputs are generated by AI and may contain errors or omissions. Always review and
                edit before sharing or acting on them, and avoid sharing confidential information.
              </p>
            </Card>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activePage ? "w-6 bg-gradient-gold" : "w-1.5 bg-border hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
