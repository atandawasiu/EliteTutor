import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Wifi, Database, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Status = "pending" | "ok" | "fail";
type Check = { name: string; status: Status; detail: string; latencyMs?: number; icon: typeof Database };

const TABLES_TO_CHECK = ["profiles", "exams", "questions", "schools", "site_settings", "footer_links", "audit_logs"];

export function HealthCheck() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);

  const run = useCallback(async () => {
    setRunning(true);
    const results: Check[] = [];

    // 1. Auth session
    const t0 = performance.now();
    const { data: sess, error: sErr } = await supabase.auth.getSession();
    results.push({
      name: "Authentication",
      status: sErr ? "fail" : sess.session ? "ok" : "fail",
      detail: sErr ? sErr.message : sess.session ? `Signed in as ${sess.session.user.email}` : "No active session",
      latencyMs: Math.round(performance.now() - t0),
      icon: Shield,
    });

    // 2. Database read on each critical table
    for (const table of TABLES_TO_CHECK) {
      const start = performance.now();
      const { error, count } = await supabase.from(table as never).select("*", { count: "exact", head: true });
      results.push({
        name: `DB · ${table}`,
        status: error ? "fail" : "ok",
        detail: error ? error.message : `${count ?? 0} rows readable`,
        latencyMs: Math.round(performance.now() - start),
        icon: Database,
      });
    }

    // 3. Realtime — subscribe to a unique channel and wait for SUBSCRIBED status
    const rtStart = performance.now();
    const rtName = `health-${Math.random().toString(36).slice(2)}`;
    const rtResult = await new Promise<Check>((resolve) => {
      const ch = supabase.channel(rtName);
      const timeout = setTimeout(() => {
        supabase.removeChannel(ch);
        resolve({ name: "Realtime subscriptions", status: "fail", detail: "Timed out after 5s", latencyMs: 5000, icon: Wifi });
      }, 5000);
      ch.on("postgres_changes" as never, { event: "*", schema: "public", table: "site_settings" }, () => {})
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            clearTimeout(timeout);
            const latency = Math.round(performance.now() - rtStart);
            supabase.removeChannel(ch);
            resolve({ name: "Realtime subscriptions", status: "ok", detail: "Channel subscribed successfully", latencyMs: latency, icon: Wifi });
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            clearTimeout(timeout);
            supabase.removeChannel(ch);
            resolve({ name: "Realtime subscriptions", status: "fail", detail: `Status: ${status}`, latencyMs: Math.round(performance.now() - rtStart), icon: Wifi });
          }
        });
    });
    results.push(rtResult);

    // 4. API route check (any TanStack server route — we hit a known page)
    const apiStart = performance.now();
    try {
      const res = await fetch("/", { method: "HEAD" });
      results.push({
        name: "App server",
        status: res.ok ? "ok" : "fail",
        detail: `HTTP ${res.status}`,
        latencyMs: Math.round(performance.now() - apiStart),
        icon: Server,
      });
    } catch (e) {
      results.push({ name: "App server", status: "fail", detail: (e as Error).message, latencyMs: 0, icon: Server });
    }

    // 5. RLS / admin role check
    const roleStart = performance.now();
    const { data: roleRows, error: roleErr } = await supabase.from("user_roles").select("role").eq("role", "admin");
    results.push({
      name: "Admin RLS access",
      status: roleErr ? "fail" : "ok",
      detail: roleErr ? roleErr.message : `${roleRows?.length ?? 0} admin role(s) visible`,
      latencyMs: Math.round(performance.now() - roleStart),
      icon: Shield,
    });

    setChecks(results);
    setRunning(false);
  }, []);

  useEffect(() => { run(); }, [run]);

  const failed = checks.filter((c) => c.status === "fail").length;
  const okCount = checks.filter((c) => c.status === "ok").length;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
        <div>
          <h3 className="font-display font-semibold">System Health</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {running ? "Running diagnostics..." : failed > 0
              ? <span className="text-destructive">{failed} check(s) failing — see details below</span>
              : <span className="text-success">All {okCount} checks passing</span>}
          </p>
        </div>
        <Button onClick={run} disabled={running} variant="outline" className="gap-1.5">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Re-run
        </Button>
      </div>

      <div className="grid gap-2">
        {checks.length === 0 && running && (
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Running checks...
          </div>
        )}
        {checks.map((c) => (
          <div key={c.name} className={`flex items-start gap-3 rounded-xl border p-4 ${
            c.status === "ok" ? "border-success/30 bg-success/5" :
            c.status === "fail" ? "border-destructive/30 bg-destructive/5" :
            "border-border bg-card"
          }`}>
            <c.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm">{c.name}</p>
                {c.latencyMs !== undefined && (
                  <span className="text-xs text-muted-foreground tabular-nums">{c.latencyMs}ms</span>
                )}
              </div>
              <p className={`text-xs mt-0.5 break-all ${c.status === "fail" ? "text-destructive" : "text-muted-foreground"}`}>
                {c.detail}
              </p>
            </div>
            {c.status === "ok" && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
            {c.status === "fail" && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
            {c.status === "pending" && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
