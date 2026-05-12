import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Plus, Loader2, Pin, Lock, Heart, MessageSquareReply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { awardPoints, awardBadge } from "@/lib/gamification";
import { cn } from "@/lib/utils";

type Thread = {
  id: string; title: string; body: string; category: string;
  pinned: boolean; locked: boolean; view_count: number;
  author_id: string; created_at: string;
  reply_count?: number; like_count?: number; liked_by_me?: boolean; author_name?: string;
};

const CATEGORIES = ["general", "JAMB", "WAEC", "NECO", "IELTS", "SAT", "Schools", "Help"];

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

function CommunityPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    let q = supabase.from("forum_threads").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(60);
    if (filter !== "all") q = q.eq("category", filter);
    const { data } = await q;
    const list = (data ?? []) as Thread[];

    const ids = list.map((t) => t.id);
    const authorIds = Array.from(new Set(list.map((t) => t.author_id)));

    const [{ data: replies }, { data: likes }, { data: profs }] = await Promise.all([
      ids.length ? supabase.from("forum_replies").select("thread_id").in("thread_id", ids) : Promise.resolve({ data: [] as { thread_id: string }[] }),
      ids.length ? supabase.from("forum_likes").select("thread_id, user_id").in("thread_id", ids) : Promise.resolve({ data: [] as { thread_id: string | null; user_id: string }[] }),
      authorIds.length ? (supabase.from("profiles_public" as never).select("id, full_name").in("id", authorIds) as unknown as Promise<{ data: { id: string; full_name: string | null }[] }>) : Promise.resolve({ data: [] as { id: string; full_name: string | null }[] }),
    ]);

    const replyMap = new Map<string, number>();
    (replies ?? []).forEach((r) => replyMap.set(r.thread_id, (replyMap.get(r.thread_id) ?? 0) + 1));
    const likeMap = new Map<string, number>();
    const likedBy = new Set<string>();
    (likes ?? []).forEach((l) => {
      if (!l.thread_id) return;
      likeMap.set(l.thread_id, (likeMap.get(l.thread_id) ?? 0) + 1);
      if (user && l.user_id === user.id) likedBy.add(l.thread_id);
    });
    const profMap = new Map(profs?.map((p) => [p.id, p.full_name ?? "Anonymous"]) ?? []);

    setThreads(list.map((t) => ({
      ...t,
      reply_count: replyMap.get(t.id) ?? 0,
      like_count: likeMap.get(t.id) ?? 0,
      liked_by_me: likedBy.has(t.id),
      author_name: profMap.get(t.author_id) ?? "Anonymous",
    })));
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`forum_realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_threads" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_likes" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_replies" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user?.id]);

  const create = async () => {
    if (!user) { toast.error("Log in to start a discussion"); return; }
    if (title.trim().length < 5 || body.trim().length < 10) { toast.error("Title 5+ chars, body 10+ chars"); return; }
    setCreating(true);
    const { error } = await supabase.from("forum_threads").insert({
      author_id: user.id, title: title.trim(), body: body.trim(), category,
    });
    if (error) { toast.error(error.message); setCreating(false); return; }
    await awardPoints(user.id, 5, "Started a discussion");
    await awardBadge(user.id, "first_thread");
    toast.success("Discussion posted! +5 pts");
    setTitle(""); setBody(""); setCategory("general"); setOpen(false); setCreating(false);
  };

  const toggleLike = async (e: React.MouseEvent, t: Thread) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Log in to like"); return; }
    if (t.liked_by_me) {
      await supabase.from("forum_likes").delete().eq("user_id", user.id).eq("thread_id", t.id);
    } else {
      await supabase.from("forum_likes").insert({ user_id: user.id, thread_id: t.id });
    }
  };

  const filtered = threads.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground">Ask, share and discuss with thousands of students.</p>
        </div>
        <div className="flex items-center gap-2">
          {!user && (
            <Link to="/login">
              <Button variant="outline" size="sm">Log in to reply</Button>
            </Link>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-hero text-white" onClick={() => { if (!user) { toast.error("Log in to start a discussion"); return; } }}>
                <Plus className="h-4 w-4" /> New thread
              </Button>
            </DialogTrigger>
            {user && (
              <DialogContent>
                <DialogHeader><DialogTitle>Start a discussion</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Title (be specific!)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Textarea placeholder="Share your question or insight…" value={body} onChange={(e) => setBody(e.target.value)} rows={6} maxLength={3000} />
                  <Button onClick={create} disabled={creating} className="w-full bg-gradient-hero text-white">
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post discussion"}
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mb-4 space-y-3">
        <Input
          placeholder="Search discussions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...CATEGORIES] as const).map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No discussions yet</p>
          <p className="text-xs text-muted-foreground">Be the first to start one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card transition-colors hover:border-primary/40 hover:shadow-sm">
              <Link to="/community/$threadId" params={{ threadId: t.id }} className="block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.pinned && <Pin className="h-3.5 w-3.5 text-accent flex-none" />}
                      {t.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground flex-none" />}
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">{t.category}</span>
                    </div>
                    <h3 className="mt-1.5 font-semibold leading-snug hover:text-primary">{t.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.body}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium">{t.author_name}</span>
                      <span>·</span>
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col items-center gap-2 flex-none">
                    <button
                      onClick={(e) => toggleLike(e, t)}
                      className={cn("flex flex-col items-center gap-0.5 rounded-lg p-2 transition-colors",
                        t.liked_by_me ? "text-destructive" : "text-muted-foreground hover:text-destructive")}
                    >
                      <Heart className={cn("h-4 w-4", t.liked_by_me && "fill-current")} />
                      <span className="text-xs font-semibold">{t.like_count}</span>
                    </button>
                    <div className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-semibold">{t.reply_count}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Reply CTA bar */}
              <div className="flex items-center justify-between border-t border-border/50 px-4 py-2">
                <span className="text-xs text-muted-foreground">
                  {t.locked ? "🔒 Thread locked" : t.reply_count === 0 ? "Be the first to reply!" : `${t.reply_count} ${t.reply_count === 1 ? "reply" : "replies"}`}
                </span>
                <Link
                  to="/community/$threadId"
                  params={{ threadId: t.id }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    t.locked
                      ? "text-muted-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <MessageSquareReply className="h-3.5 w-3.5" />
                  {t.locked ? "View thread" : user ? "Reply" : "View & Reply"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp CTA */}
      <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-5 text-center">
        <p className="text-sm font-medium">Want faster help from other students?</p>
        <p className="mt-1 text-xs text-muted-foreground">Join our WhatsApp study groups for real-time discussions</p>
        <a href="https://chat.whatsapp.com" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="mt-3 gap-2">
            Join WhatsApp study group
          </Button>
        </a>
      </div>
    </div>
  );
}
