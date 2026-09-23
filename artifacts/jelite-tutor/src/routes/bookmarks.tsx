import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Bookmark, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import { AIChatWidget } from "@/components/AIChatWidget";
import { toast } from "sonner";

type Row = {
  id: string;
  question_id: string;
  questions: {
    id: string; question: string; options: string[]; correct_answer: string; explanation: string | null;
    subjects: { name: string; exams: { name: string } | null } | null;
  } | null;
};

export const Route = createFileRoute("/bookmarks")({
  component: () => <RequireAuth><BookmarksPage /></RequireAuth>,
});

function BookmarksPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [reveal, setReveal] = useState<Set<string>>(new Set());
  const [explainCtx, setExplainCtx] = useState<{ question: string; options: string[]; correctAnswer: string } | undefined>();
  const [explainSignal, setExplainSignal] = useState(0);

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bookmarks")
      .select("id, question_id, questions(id, question, options, correct_answer, explanation, subjects(name, exams(name)))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRows((data ?? []) as never);
    setLoading(false);
  };
  useEffect(() => { reload(); }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setRows(rows.filter(r => r.id !== id)); toast.success("Removed"); }
  };

  const askAI = (q: NonNullable<Row["questions"]>) => {
    setExplainCtx({ question: q.question, options: q.options, correctAnswer: q.correct_answer });
    setExplainSignal(s => s + 1);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold flex items-center gap-2"><Bookmark className="h-7 w-7 text-primary" /> Bookmarks</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tough questions you've saved — review answers and ask AI for help.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No bookmarks yet. Tap the bookmark icon during practice to save tricky questions.</p>
          <Link to="/practice"><Button className="mt-4 bg-gradient-hero text-white">Start practicing</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const q = r.questions; if (!q) return null;
            const shown = reveal.has(r.id);
            return (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{q.subjects?.exams?.name} · {q.subjects?.name}</p>
                    <p className="mt-1 text-sm font-medium">{q.question}</p>
                  </div>
                  <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  {q.options.map((o, oi) => (
                    <p key={oi} className={shown && o === q.correct_answer ? "text-success font-medium" : "text-muted-foreground"}>
                      {String.fromCharCode(65 + oi)}) {o} {shown && o === q.correct_answer && "✓"}
                    </p>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    const next = new Set(reveal); next.has(r.id) ? next.delete(r.id) : next.add(r.id); setReveal(next);
                  }}>{shown ? "Hide answer" : "Show answer"}</Button>
                  <Button size="sm" variant="ghost" className="text-primary" onClick={() => askAI(q)}>
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> Explain
                  </Button>
                </div>
                {shown && q.explanation && <p className="mt-2 text-xs italic text-muted-foreground">💡 {q.explanation}</p>}
              </div>
            );
          })}
        </div>
      )}
      <AIChatWidget context={explainCtx ? { currentQuestion: explainCtx } : undefined} openSignal={explainSignal} />
    </div>
  );
}
