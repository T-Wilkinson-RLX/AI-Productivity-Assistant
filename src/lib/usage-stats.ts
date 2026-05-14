// Lightweight client-side productivity tracker.
// Stores per-tool usage in localStorage and notifies subscribers in real time.
import { useEffect, useState } from "react";

export type ToolKey = "email" | "meeting" | "tasks" | "research" | "chat";

export interface UsageEvent {
  tool: ToolKey;
  inputChars: number;
  outputChars: number;
  ts: number; // epoch ms
}

export interface UsageStats {
  totalRuns: number;
  byTool: Record<ToolKey, number>;
  charsGenerated: number;
  minutesSaved: number; // estimated
  firstUsedAt: number | null;
  lastUsedAt: number | null;
  events: UsageEvent[]; // capped recent events
  streakDays: number;
}

const STORAGE_KEY = "workai.usage.v1";
const EVENT_NAME = "workai:usage-updated";
const MAX_EVENTS = 200;

// Rough minutes saved per tool per run (vs doing it manually).
const MINUTES_PER_RUN: Record<ToolKey, number> = {
  email: 6,
  meeting: 12,
  tasks: 8,
  research: 15,
  chat: 3,
};

function emptyStats(): UsageStats {
  return {
    totalRuns: 0,
    byTool: { email: 0, meeting: 0, tasks: 0, research: 0, chat: 0 },
    charsGenerated: 0,
    minutesSaved: 0,
    firstUsedAt: null,
    lastUsedAt: null,
    events: [],
    streakDays: 0,
  };
}

function read(): UsageStats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw) as Partial<UsageStats>;
    return { ...emptyStats(), ...parsed, byTool: { ...emptyStats().byTool, ...(parsed.byTool ?? {}) } };
  } catch {
    return emptyStats();
  }
}

function write(stats: UsageStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function computeStreak(events: UsageEvent[]): number {
  if (events.length === 0) return 0;
  const days = new Set(
    events.map((e) => new Date(e.ts).toISOString().slice(0, 10)),
  );
  let streak = 0;
  const cursor = new Date();
  // Allow today or yesterday as the most recent active day.
  const today = cursor.toISOString().slice(0, 10);
  const yesterday = new Date(cursor.getTime() - 86400000).toISOString().slice(0, 10);
  if (!days.has(today) && !days.has(yesterday)) return 0;
  if (!days.has(today)) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function recordUsage(tool: ToolKey, inputChars: number, outputChars: number) {
  const stats = read();
  const now = Date.now();
  stats.totalRuns += 1;
  stats.byTool[tool] = (stats.byTool[tool] ?? 0) + 1;
  stats.charsGenerated += outputChars;
  stats.minutesSaved += MINUTES_PER_RUN[tool] ?? 5;
  stats.firstUsedAt = stats.firstUsedAt ?? now;
  stats.lastUsedAt = now;
  stats.events = [...stats.events, { tool, inputChars, outputChars, ts: now }].slice(-MAX_EVENTS);
  stats.streakDays = computeStreak(stats.events);
  write(stats);
}

export function resetUsage() {
  write(emptyStats());
}

export function useUsageStats(): UsageStats {
  const [stats, setStats] = useState<UsageStats>(() => emptyStats());
  useEffect(() => {
    setStats(read());
    const update = () => setStats(read());
    window.addEventListener(EVENT_NAME, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT_NAME, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return stats;
}
