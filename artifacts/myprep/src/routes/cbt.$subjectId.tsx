import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Clock, ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import { AIChatWidget } from "@/components/AIChatWidget";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Question = { id: string; question: string; options: string[]; correct_answer: string; explanation: string | null };
type Subject = { id: string; name: string; exam_id: string; exams: { id: string; name: string; duration_minutes: number } };

export const Route = createFileRoute("/cbt/$subjectId")({
  component: () => <RequireAuth><CBTEngine /></RequireAuth>,
});

function CBTEngine() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number; questions: Question[] } | null>(null);
  const [explainCtx, setExplainCtx] = useState<{ question: string; options: string[]; correctAnswer: string; userAnswer?: string } | undefined>(undefined);
  const [explainSignal, setExplainSignal] = useState(0);
  const [explainPrompt, setExplainPrompt] = useState<string | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const storageKey = `cbt_${subjectId}_${user?.id}`;

  // Load subject + questions
  useEffect(() => {
    (async () => {
      const [{ data: subj }, { data: qs }] = await Promise.all([
        supabase.from("subjects").select("id, name, exam_id, exams(id, name, duration_minutes)").eq("id", subjectId).single(),
        supabase.from("questions").select("id, question, options, correct_answer, explanation").eq("subject_id", subjectId).limit(20),
      ]);
      setSubject(subj as unknown as Subject);
      // Shuffle
      const shuffled = [...(qs ?? [])].sort(() => Math.random() - 0.5).map(q => ({ ...q, options: q.options as string[] })) as Question[];
      setQuestions(shuffled);
      setLoading(false);
    })();
  }, [subjectId]);

  // Restore from localStorage
  useEffect(() => {
    if (!started || !user) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.answers) setAnswers(data.answers);
        if (data.currentIdx !== undefined) setCurrentIdx(data.currentIdx);
      } catch {}
    }
  }, [started, user, storageKey]);

  // Persist answers
  useEffect(() => {
    if (!started) return;
    localStorage.setItem(storageKey, JSON.stringify({ answers, currentIdx }));
  }, [answers, currentIdx, started, storageKey]);

  // Timer
  useEffect(() => {
    if (!started || result) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, result]);

  const startTest = () => {
    if (questions.length === 0) { toast.error("No questions available for this subject yet."); return; }
    const dur = (subject?.exams?.duration_minutes ?? 30) * 60;
    setTimeLeft(dur);
    startTimeRef.current = Date.now();
    setStarted(true);
  };

  const selectAnswer = (qid: string, opt: string) => setAnswers(p => ({ ...p, [qid]: opt }));
  const toggleBookmark = async (qid: string) => {
    if (!user) return;
    const next = new Set(bookmarked);
    if (next.has(qid)) {
      next.delete(qid);
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("question_id", qid);
    } else {
      next.add(qid);
      await supabase.from("bookmarks").insert({ user_id: user.id, question_id: qid });
    }
    setBookmarked(next);
  };

  const handleSubmit = async (auto = false) => {
    if (submitting || result || !user || !subject) return;
    setSubmitting(true);
    const correctCount = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct_answer ? 1 : 0), 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    const { data: attempt, error } = await supabase
      .from("attempts")
      .insert({
        user_id: user.id, exam_id: subject.exam_id, subject_id: subject.id,
        score, correct_count: correctCount, total_questions: questions.length,
        time_taken_seconds: timeTaken, completed: true,
      })
      .select().single();

    if (!error && attempt) {
      const answerRows = questions.map(q => ({
        attempt_id: attempt.id, question_id: q.id,
        selected_answer: answers[q.id] ?? null,
        is_correct: answers[q.id] === q.correct_answer,
      }));
      await supabase.from("attempt_answers").insert(answerRows);
    }
    localStorage.removeItem(storageKey);
    setResult({ score, correct: correctCount, total: questions.length, questions });
    setSubmitting(false);
    if (auto) toast.warning("Time's up! Test auto-submitted.");
    else toast.success(`Test submitted — ${score}%`);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answered = Object.keys(answers).length;

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  // Result view
  if (result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className={cn("mx-auto flex h-20 w-20 items-center justify-center rounded-full", result.score >= 50 ? "bg-success/10" : "bg-destructive/10")}>
            <span className={cn("font-display text-3xl font-bold", result.score >= 50 ? "text-success" : "text-destructive")}>{result.score}%</span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">Test Complete!</h1>
          <p className="mt-2 text-muted-foreground">{subject?.name} — {subject?.exams?.name}</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-secondary p-4"><p className="text-2xl font-bold text-success">{result.correct}</p><p className="text-xs text-muted-foreground">Correct</p></div>
            <div className="rounded-xl bg-secondary p-4"><p className="text-2xl font-bold text-destructive">{result.total - result.correct}</p><p className="text-xs text-muted-foreground">Wrong</p></div>
            <div className="rounded-xl bg-secondary p-4"><p className="text-2xl font-bold">{result.total}</p><p className="text-xs text-muted-foreground">Total</p></div>
          </div>
          <div className="mt-6 flex gap-2 justify-center">
            <Button onClick={() => navigate({ to: "/dashboard" })} className="bg-gradient-hero text-white">View Dashboard</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/exams" })}>More Exams</Button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-display text-lg font-semibold">Review Answers</h2>
          {result.questions.map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correct_answer;
            return (
              <div key={q.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex gap-2">
                  {isCorrect ? <CheckCircle2 className="h-5 w-5 flex-none text-success" /> : <XCircle className="h-5 w-5 flex-none text-destructive" />}
                  <p className="font-medium">{i + 1}. {q.question}</p>
                </div>
                <div className="mt-3 ml-7 space-y-1">
                  {q.options.map(opt => (
                    <div key={opt} className={cn("rounded-lg px-3 py-2 text-sm",
                      opt === q.correct_answer ? "bg-success/10 text-success font-medium" :
                      opt === userAns ? "bg-destructive/10 text-destructive" : "bg-secondary/50"
                    )}>
                      {opt} {opt === q.correct_answer && "✓"} {opt === userAns && opt !== q.correct_answer && "(your answer)"}
                    </div>
                  ))}
                </div>
                {q.explanation && <p className="mt-3 ml-7 text-xs text-muted-foreground italic">💡 {q.explanation}</p>}
                <div className="mt-3 ml-7">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      setExplainCtx({ question: q.question, options: q.options, correctAnswer: q.correct_answer, userAnswer: userAns });
                      setExplainPrompt(`Please explain this question step-by-step in simple terms.`);
                      setExplainSignal(Date.now());
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Ask AI to explain
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <AIChatWidget context={explainCtx ? { currentQuestion: explainCtx } : undefined} openSignal={explainSignal} starterPrompt={explainPrompt} />
      </div>
    );
  }

  // Pre-start screen
  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl font-bold">{subject?.name}</h1>
          <p className="mt-1 text-muted-foreground">{subject?.exams?.name} Practice Test</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Questions</p><p className="text-2xl font-bold">{questions.length}</p></div>
            <div className="rounded-xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Duration</p><p className="text-2xl font-bold">{subject?.exams?.duration_minutes}min</p></div>
          </div>
          <div className="mt-6 rounded-xl bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Instructions:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Timer starts immediately when you begin</li>
              <li>You can navigate between questions</li>
              <li>Test auto-submits when time runs out</li>
              <li>Your progress is saved if you close the tab</li>
            </ul>
          </div>
          <Button onClick={startTest} className="mt-6 w-full bg-gradient-hero text-white" disabled={questions.length === 0}>
            {questions.length === 0 ? "No questions available" : "Start Test"}
          </Button>
        </div>
      </div>
    );
  }

  // Test in progress
  const q = questions[currentIdx];
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">{subject?.exams?.name} · {subject?.name}</p>
            <p className="text-sm font-medium">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          <div className={cn("flex items-center gap-2 rounded-lg px-4 py-2 font-mono font-bold", timeLeft < 60 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
            <Clock className="h-4 w-4" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 grid gap-6 lg:grid-cols-[1fr_240px]">
        <div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-base font-medium">{q.question}</p>
              <button onClick={() => toggleBookmark(q.id)} className="text-muted-foreground hover:text-accent">
                <Bookmark className={cn("h-5 w-5", bookmarked.has(q.id) && "fill-accent text-accent")} />
              </button>
            </div>
            <div className="mt-6 space-y-2">
              {q.options.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, opt)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-sm transition-all",
                    answers[q.id] === opt ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold flex-none",
                    answers[q.id] === opt ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            {currentIdx === questions.length - 1 ? (
              <Button onClick={() => handleSubmit(false)} disabled={submitting} className="bg-gradient-hero text-white gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />} Submit Test
              </Button>
            ) : (
              <Button onClick={() => setCurrentIdx(i => i + 1)} className="bg-gradient-hero text-white gap-2">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-4 h-fit">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress · {answered}/{questions.length}</p>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((qq, i) => (
              <button key={qq.id} onClick={() => setCurrentIdx(i)}
                className={cn("h-9 rounded-lg text-xs font-semibold transition-colors",
                  i === currentIdx ? "bg-primary text-primary-foreground" :
                  answers[qq.id] ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}>
                {i + 1}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => handleSubmit(false)} disabled={submitting} className="mt-4 w-full gap-2">
            <Flag className="h-3.5 w-3.5" /> Submit Now
          </Button>
        </aside>
      </div>
    </div>
  );
}
