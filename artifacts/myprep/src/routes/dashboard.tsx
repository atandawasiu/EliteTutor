import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, TrendingUp, Flame, ChevronRight, Loader2, Bookmark, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import { AIChatWidget } from "@/components/AIChatWidget";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Attempt = {
  id: string; score: number; correct_count: number; total_questions: number;
  time_taken_seconds: number; created_at: string;
  exams: { name: string } | null;
  subjects: { name: string } | null;
};

export const Route = createFileRoute("/dashboard")({
  component: () => <RequireAuth><DashboardPage /></RequireAuth>,
});

function DashboardPage() {
  const { profile, user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("attempts")
        .select("id, score, correct_count, total_questions, time_taken_seconds, created_at, exams(name), subjects(name)")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
      setAttempts((data ?? []) as unknown as Attempt[]);
      setLoading(false);
    })();
  }, [user]);

  const totalTests = attempts.length;
  const avgScore = totalTests > 0 ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / totalTests) : 0;
  const bestScore = totalTests > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
  const recent = attempts.slice(0, 6);

  // Performance by subject (weak areas)
  const subjectStats: Record<string, { total: number; sum: number }> = {};
  attempts.forEach(a => {
    const name = a.subjects?.name ?? "Unknown";
    if (!subjectStats[name]) subjectStats[name] = { total: 0, sum: 0 };
    subjectStats[name].total++;
    subjectStats[name].sum += a.score;
  });
  const weakSubjects = Object.entries(subjectStats)
    .map(([name, s]) => ({ name, score: Math.round(s.sum / s.total) }))
    .sort((a, b) => a.score - b.score).slice(0, 4);

  const chartData = [...attempts].reverse().slice(-10).map((a, i) => ({ name: `T${i + 1}`, score: a.score }));

  // Streak: consecutive days with at least one attempt, ending today or yesterday
  const streak = useMemo(() => {
    if (attempts.length === 0) return 0;
    const days = new Set(attempts.map(a => new Date(a.created_at).toDateString()));
    let count = 0;
    const cursor = new Date();
    if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toDateString())) { count++; cursor.setDate(cursor.getDate() - 1); }
    return count;
  }, [attempts]);

  // Today's progress vs daily goal
  const todayMinutes = useMemo(() => {
    const today = new Date().toDateString();
    const seconds = attempts.filter(a => new Date(a.created_at).toDateString() === today)
      .reduce((s, a) => s + a.time_taken_seconds, 0);
    return Math.round(seconds / 60);
  }, [attempts]);
  const goalMinutes = (profile as { daily_goal_minutes?: number } | null)?.daily_goal_minutes ?? 30;
  const goalPct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Welcome back, {profile?.full_name?.split(" ")[0] ?? "Student"}! 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's your preparation overview.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/practice"><Button size="sm" className="bg-gradient-hero text-white gap-1.5"><Settings2 className="h-4 w-4" /> Custom practice</Button></Link>
          <Link to="/bookmarks"><Button size="sm" variant="outline" className="gap-1.5"><Bookmark className="h-4 w-4" /> Bookmarks</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        {[
          { icon: BookOpen, label: "Tests Taken", value: totalTests.toString(), color: "text-primary bg-primary/10" },
          { icon: Target, label: "Avg Score", value: `${avgScore}%`, color: "text-accent bg-accent/10" },
          { icon: Flame, label: "Streak", value: `${streak}d`, color: "text-chart-5 bg-chart-5/10" },
          { icon: TrendingUp, label: "Best", value: `${bestScore}%`, color: "text-success bg-success/10" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}><stat.icon className="h-4.5 w-4.5" /></div>
            <p className="mt-2 font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-display text-base font-semibold">Today's goal</h2>
            <p className="text-xs text-muted-foreground">{todayMinutes} of {goalMinutes} min studied</p>
          </div>
          <span className="text-sm font-semibold text-primary">{goalPct}%</span>
        </div>
        <Progress value={goalPct} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {chartData.length > 1 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold mb-4">Score Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="score" stroke="oklch(0.55 0.22 145)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Tests</h2>
              <Link to="/exams" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                Take new test <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>No tests taken yet.</p>
                <Link to="/exams"><Button size="sm" className="mt-3 bg-gradient-hero text-white">Start your first test</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recent.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl bg-secondary p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary flex-none">
                        {t.exams?.name.split(" ")[0].slice(0, 4) ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.subjects?.name ?? "Mixed"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-none">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-hero" style={{ width: `${t.score}%` }} />
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">{t.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold mb-3">Focus Areas</h2>
            {weakSubjects.length === 0 ? (
              <p className="text-xs text-muted-foreground">Take tests to see your weak subjects.</p>
            ) : (
              <div className="space-y-3">
                {weakSubjects.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-sm">{s.name}</span>
                    <span className={`text-xs font-medium ${s.score < 50 ? "text-destructive" : s.score < 70 ? "text-warning" : "text-success"}`}>
                      {s.score}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold mb-3">Quick Start</h2>
            <div className="space-y-2">
              <Link to="/practice"><Button variant="outline" className="w-full justify-start gap-2 text-sm"><Settings2 className="h-4 w-4" /> Custom practice</Button></Link>
              <Link to="/exams"><Button variant="outline" className="w-full justify-start gap-2 text-sm"><BookOpen className="h-4 w-4" /> Browse Exams</Button></Link>
              <Link to="/bookmarks"><Button variant="outline" className="w-full justify-start gap-2 text-sm"><Bookmark className="h-4 w-4" /> Bookmarks</Button></Link>
              <Link to="/tools"><Button variant="outline" className="w-full justify-start gap-2 text-sm"><Target className="h-4 w-4" /> Score Calculator</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <AIChatWidget
        context={{
          weakSubjects: weakSubjects.map((s) => s.name),
          recentScores: recent.map((r) => ({ subject: r.subjects?.name ?? "Mixed", score: r.score })),
        }}
      />
    </div>
  );
}
