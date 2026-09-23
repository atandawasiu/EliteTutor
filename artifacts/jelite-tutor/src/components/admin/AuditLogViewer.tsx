import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Search, ShieldAlert, ChevronDown, ChevronRight, CheckCircle2, XCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type AuditLog = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: "INSERT" | "UPDATE" | "DELETE";
  table_name: string;
  row_id: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  created_at: string;
};

const TABLES = [
  "all", "exams", "subjects", "questions", "schools", "blog_posts",
  "announcements", "site_menu_sections", "site_menu_links", "user_roles", "profiles",
];

const ACTION_STYLES: Record<string, string> = {
  INSERT: "bg-success/10 text-success",
  UPDATE: "bg-accent/10 text-accent",
  DELETE: "bg-destructive/10 text-destructive",
};

function diffKeys(before: Record<string, unknown> | null, after: Record<string, unknown> | null): string[] {
  if (!before || !after) return [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed: string[] = [];
  keys.forEach((k) => {
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) changed.push(k);
  });
  return changed;
}

function labelize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bUrl\b/, "URL").replace(/\bId\b/, "ID");
}

function fmtVal(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
}

function CollapsedValue({ value, tone }: { value: unknown; tone: "before" | "after" }) {
  const [open, setOpen] = useState(false);
  const text = fmtVal(value);
  const isLong = text.length > 200 || text.includes("\n");
  const color = tone === "before" ? "text-destructive" : "text-success";
  if (!isLong) {
    return <pre className={`whitespace-pre-wrap break-all font-mono text-[11px] ${color}`}>{text}</pre>;
  }
  return (
    <div>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 text-[11px] font-mono ${color} hover:underline`}>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {open ? "Collapse" : `Show ${text.length} chars`}
      </button>
      {open && <pre className={`mt-1 max-h-60 overflow-auto whitespace-pre-wrap break-all rounded bg-background/50 p-2 font-mono text-[11px] ${color}`}>{text}</pre>}
    </div>
  );
}


function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

type TriggerStatus = { table_name: string; has_audit_trigger: boolean };

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [triggers, setTriggers] = useState<TriggerStatus[]>([]);
  const [triggersOpen, setTriggersOpen] = useState(false);

  const loadTriggers = async () => {
    const { data } = await supabase.rpc("get_audit_trigger_status");
    if (data) setTriggers(data as TriggerStatus[]);
  };
  useEffect(() => { loadTriggers(); }, []);


  const load = async () => {
    setLoading(true);
    let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
    if (tableFilter !== "all") q = q.eq("table_name", tableFilter);
    if (actionFilter !== "all") q = q.eq("action", actionFilter);
    const { data, error } = await q;
    if (!error) setLogs((data ?? []) as AuditLog[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tableFilter, actionFilter]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`audit-logs-stream-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_logs" }, (payload) => {
        const row = payload.new as AuditLog;
        if (tableFilter !== "all" && row.table_name !== tableFilter) return;
        if (actionFilter !== "all" && row.action !== actionFilter) return;
        setLogs((prev) => [row, ...prev].slice(0, 200));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tableFilter, actionFilter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return logs;
    const s = search.toLowerCase();
    return logs.filter((l) =>
      l.actor_email?.toLowerCase().includes(s) ||
      l.table_name.toLowerCase().includes(s) ||
      l.row_id?.toLowerCase().includes(s) ||
      JSON.stringify(l.after_data ?? l.before_data ?? {}).toLowerCase().includes(s)
    );
  }, [logs, search]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShieldAlert className="h-4 w-4 text-primary" /> Audit Log
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-normal text-muted-foreground">
            {filtered.length} entries
          </span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor, table, row, content…"
              className="h-9 w-64 pl-8"
            />
          </div>
          <Select value={tableFilter} onValueChange={setTableFilter}>
            <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TABLES.map((t) => <SelectItem key={t} value={t}>{t === "all" ? "All tables" : t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="INSERT">Created</SelectItem>
              <SelectItem value="UPDATE">Updated</SelectItem>
              <SelectItem value="DELETE">Deleted</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Trigger coverage panel */}
      <div className="rounded-xl border border-border bg-card">
        <button
          onClick={() => setTriggersOpen((v) => !v)}
          className="flex w-full items-center gap-3 p-3 text-left hover:bg-secondary/50"
        >
          {triggersOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Trigger coverage</span>
          {triggers.length > 0 && (
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {triggers.filter((t) => t.has_audit_trigger).length}/{triggers.length} tables tracked
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); loadTriggers(); }}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-secondary"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </button>
        {triggersOpen && (
          <div className="border-t border-border p-3">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {triggers.map((t) => (
                <div
                  key={t.table_name}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                    t.has_audit_trigger
                      ? "border-success/30 bg-success/5"
                      : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  {t.has_audit_trigger
                    ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                    : <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />}
                  <span className="font-mono">{t.table_name}</span>
                  <span className={`ml-auto text-[10px] font-semibold uppercase ${t.has_audit_trigger ? "text-success" : "text-destructive"}`}>
                    {t.has_audit_trigger ? "active" : "off"}
                  </span>
                </div>
              ))}
              {triggers.length === 0 && (
                <p className="col-span-full text-center text-xs text-muted-foreground py-4">Loading trigger status…</p>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No audit entries match your filters yet. CRUD changes from now on will appear here automatically.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => {
            const isOpen = expanded.has(log.id);
            const changed = log.action === "UPDATE" ? diffKeys(log.before_data, log.after_data) : [];
            return (
              <div key={log.id} className="rounded-xl border border-border bg-card">
                <button
                  onClick={() => toggle(log.id)}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-secondary/50"
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${ACTION_STYLES[log.action]}`}>
                    {log.action === "INSERT" ? "CREATE" : log.action}
                  </span>
                  <span className="font-mono text-xs text-foreground">{log.table_name}</span>
                  {log.row_id && <span className="hidden font-mono text-xs text-muted-foreground sm:inline">#{log.row_id.slice(0, 8)}</span>}
                  <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{log.actor_email ?? "system"}</span>
                    <span>{timeAgo(log.created_at)}</span>
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 text-xs">
                    <div className="mb-3 grid gap-2 sm:grid-cols-3">
                      <div><span className="text-muted-foreground">Actor:</span> <span className="font-mono">{log.actor_email ?? "system"}</span></div>
                      <div><span className="text-muted-foreground">When:</span> {new Date(log.created_at).toLocaleString()}</div>
                      <div><span className="text-muted-foreground">Row:</span> <span className="font-mono">{log.row_id ?? "—"}</span></div>
                    </div>

                    {log.action === "UPDATE" && changed.length > 0 && (
                      <div className="overflow-hidden rounded-lg border border-border">
                        <table className="w-full text-left">
                          <thead className="bg-secondary/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                            <tr>
                              <th className="p-2">Field</th>
                              <th className="p-2">Before</th>
                              <th className="p-2">After</th>
                            </tr>
                          </thead>
                          <tbody>
                            {changed.map((k) => (
                              <tr key={k} className="border-t border-border align-top">
                                <td className="p-2 text-xs">
                                  <div className="font-semibold">{labelize(k)}</div>
                                  <div className="font-mono text-[10px] text-muted-foreground">{k}</div>
                                </td>
                                <td className="p-2"><CollapsedValue value={log.before_data?.[k]} tone="before" /></td>
                                <td className="p-2"><CollapsedValue value={log.after_data?.[k]} tone="after" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {log.action === "INSERT" && log.after_data && (
                      <div>
                        <p className="mb-1 text-muted-foreground">Created with:</p>
                        <pre className="max-h-72 overflow-auto rounded-lg bg-secondary/50 p-3 font-mono text-[11px]">{JSON.stringify(log.after_data, null, 2)}</pre>
                      </div>
                    )}

                    {log.action === "DELETE" && log.before_data && (
                      <div>
                        <p className="mb-1 text-muted-foreground">Deleted record:</p>
                        <pre className="max-h-72 overflow-auto rounded-lg bg-secondary/50 p-3 font-mono text-[11px]">{JSON.stringify(log.before_data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
