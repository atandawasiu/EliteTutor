import { useEffect, useState } from "react";
import { X, Megaphone, Info, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Announcement = {
  id: string;
  title: string;
  body: string;
  type: string;
  active: boolean;
  expires_at: string | null;
};

const STORAGE_KEY = "elitetutor-dismissed-announcements";

const TYPE_STYLES: Record<string, { wrap: string; Icon: typeof Info }> = {
  info:    { wrap: "bg-primary text-primary-foreground",       Icon: Info },
  success: { wrap: "bg-success text-white",                    Icon: CheckCircle2 },
  warning: { wrap: "bg-destructive text-destructive-foreground", Icon: AlertTriangle },
  promo:   { wrap: "bg-gradient-hero text-white",              Icon: Sparkles },
};

export function SiteAnnouncementBanner() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDismissed(new Set(JSON.parse(raw) as string[]));
    } catch { /* noop */ }
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("id, title, body, type, active, expires_at")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    const now = Date.now();
    const fresh = (data ?? []).filter((a) => !a.expires_at || new Date(a.expires_at).getTime() > now);
    setItems(fresh as Announcement[]);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`site-announcements-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch { /* noop */ }
  };

  const visible = items.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="w-full">
      {visible.map((a) => {
        const s = TYPE_STYLES[a.type] ?? TYPE_STYLES.info;
        const Icon = s.Icon;
        return (
          <div key={a.id} className={`${s.wrap} relative`}>
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
              <Megaphone className="hidden h-4 w-4 shrink-0 sm:block opacity-90" />
              <Icon className="h-4 w-4 shrink-0 sm:hidden opacity-90" />
              <div className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">{a.title}</span>
                <span className="mx-2 opacity-60">·</span>
                <span className="opacity-95">{a.body}</span>
              </div>
              <button
                onClick={() => dismiss(a.id)}
                aria-label="Dismiss announcement"
                className="shrink-0 rounded-md p-1 hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
