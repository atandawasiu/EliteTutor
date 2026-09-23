import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, Medal, Loader2, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Row = { user_id: string; full_name: string | null; avatar_url: string | null; total: number; tests: number };

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<"all" | "week">("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = scope === "week" ? new Date(Date.now() - 7 * 86400_000).toISOString() : null;
      let q = supabase.from("attempts").select("user_id, score").eq("completed", true);
      if (since) q = q.gte("created_at", since);
      const { data: attempts } = await q.limit(2000);

      const agg = new Map<string, { total: number; tests: number }>();
      (attempts ?? []).forEach((a) => {
        const cur = agg.get(a.user_id) ?? { total: 0, tests: 0 };
        cur.total += a.score;
        cur.tests += 1;
        agg.set(a.user_id, cur);
      });
      const ids = Array.from(agg.keys());
      const { data: profs } = ids.length
        ? await supabase.from("profiles_public" as never).select("id, full_name, avatar_url").in("id", ids) as { data: { id: string; full_name: string | null; avatar_url: string | null }[] | null }
        : { data: [] as { id: string; full_name: string | null; avatar_url: string | null }[] };
      const profMap = new Map(profs?.map((p) => [p.id, p]) ?? []);

      const final: Row[] = ids
        .map((id) => {
          const a = agg.get(id)!;
          const p = profMap.get(id);
          return { user_id: id, full_name: p?.full_name ?? "Student", avatar_url: p?.avatar_url ?? null, total: a.total, tests: a.tests };
        })
        .sort((a, b) => b.total / b.tests - a.total / a.tests || b.tests - a.tests)
        .slice(0, 50);
      setRows(final);
      setLoading(false);
    })();
  }, [scope]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-white">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top performers across all exams</p>
        </div>
      </div>

      <div className="mb-4 inline-flex rounded-lg border border-border bg-card p-1">
        {(["all", "week"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={cn("rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              scope === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {s === "all" ? "All time" : "This week"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No completed tests yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => {
            const avg = Math.round(r.total / r.tests);
            const medal = i === 0 ? "text-yellow-500" : i === 1 ? "text-zinc-400" : i === 2 ? "text-amber-700" : "text-muted-foreground";
            return (
              <div key={r.user_id} className={cn("flex items-center gap-3 rounded-xl border border-border bg-card p-3", i < 3 && "border-primary/30")}>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg font-bold", i < 3 ? "bg-primary/10" : "bg-secondary")}>
                  {i < 3 ? <Medal className={cn("h-5 w-5", medal)} /> : <span className="text-sm">#{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{r.full_name}</p>
                  <p className="text-xs text-muted-foreground">{r.tests} tests · avg {avg}%</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-sm font-bold text-success">
                  <Flame className="h-3.5 w-3.5" /> {avg}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
