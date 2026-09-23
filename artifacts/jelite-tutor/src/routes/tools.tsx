import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, GraduationCap, TrendingUp, BookOpen, Atom, Loader2, Search, AlertTriangle, Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Student Tools</h1>
        <p className="mt-2 text-muted-foreground">Powerful calculators and predictors for your academic journey.</p>
      </div>
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <AggregateCalculator />
          <JambScoreCalculator />
        </div>
        <GpaCalculator />
        <WolframCalculator />
      </div>
    </div>
  );
}

/* ─── Aggregate Calculator ─────────────────────────────────────────────────── */
function AggregateCalculator() {
  const [jambScore, setJambScore] = useState("");
  const [postUtme, setPostUtme] = useState("");
  const [oLevelWeight, setOLevelWeight] = useState("0");
  const [aggregate, setAggregate] = useState<number | null>(null);
  const [formula, setFormula] = useState<"50-50" | "60-40" | "70-30">("50-50");

  const FORMULAS = {
    "50-50": { jamb: 0.5, post: 0.5, label: "50/50 (most common)" },
    "60-40": { jamb: 0.6, post: 0.4, label: "60/40 (some schools)" },
    "70-30": { jamb: 0.7, post: 0.3, label: "70/30 (UNILAG-style)" },
  };

  const calculateAggregate = () => {
    const j = Number(jambScore);
    const p = Number(postUtme);
    if (!j || !p) return;
    const f = FORMULAS[formula];
    const agg = (j / 400) * 100 * f.jamb + p * f.post + Number(oLevelWeight);
    setAggregate(Math.round(agg * 100) / 100);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Aggregate Score Calculator</h2>
          <p className="text-xs text-muted-foreground">JAMB + Post-UTME admission aggregate</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <Label>Formula</Label>
          <Select value={formula} onValueChange={v => setFormula(v as typeof formula)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(FORMULAS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>JAMB Score (out of 400)</Label>
          <Input type="number" min={0} max={400} placeholder="e.g. 280" value={jambScore} onChange={e => setJambScore(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Post-UTME Score (out of 100)</Label>
          <Input type="number" min={0} max={100} placeholder="e.g. 75" value={postUtme} onChange={e => setPostUtme(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>O'Level Bonus (if any, usually 0–5)</Label>
          <Input type="number" min={0} max={10} placeholder="0" value={oLevelWeight} onChange={e => setOLevelWeight(e.target.value)} className="mt-1" />
        </div>
        <Button onClick={calculateAggregate} className="w-full bg-gradient-hero text-white hover:opacity-90">
          Calculate Aggregate
        </Button>
        {aggregate !== null && (
          <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
            <p className="text-sm text-muted-foreground">Your Aggregate Score</p>
            <p className="font-display text-3xl font-bold text-success">{aggregate}<span className="text-lg">/100</span></p>
            <p className="mt-1 text-xs text-muted-foreground">
              {aggregate >= 70 ? "🟢 Strong admission chance" : aggregate >= 55 ? "🟡 Moderate — check cut-offs" : "🔴 Below average — consider alternatives"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── JAMB Score Calculator ────────────────────────────────────────────────── */
const JAMB_SUBJECTS = ["English Language","Mathematics","Physics","Chemistry","Biology","Economics","Government","Literature in English","Commerce","Geography","Agricultural Science","Further Mathematics","Civic Education","Financial Accounting","Christian Religious Studies","Islamic Religious Studies","French","Yoruba","Igbo","Hausa","Technical Drawing","Food & Nutrition"];

type JambSubjectRow = { subject: string; correct: number };

function JambScoreCalculator() {
  const [rows, setRows] = useState<JambSubjectRow[]>([
    { subject: "English Language", correct: 0 },
    { subject: "Mathematics", correct: 0 },
    { subject: "", correct: 0 },
    { subject: "", correct: 0 },
  ]);
  const [result, setResult] = useState<{ score: number; pct: number } | null>(null);

  const QUESTIONS_PER_SUBJECT = 40;
  const MARKS_PER_CORRECT = 2.5;
  const MAX_SCORE = 400;

  const update = (i: number, field: keyof JambSubjectRow, value: string | number) => {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
    setResult(null);
  };

  const calculate = () => {
    const total = rows.reduce((sum, r) => sum + Math.min(r.correct, QUESTIONS_PER_SUBJECT) * MARKS_PER_CORRECT, 0);
    setResult({ score: Math.round(total * 10) / 10, pct: Math.round((total / MAX_SCORE) * 100) });
  };

  const gradeLabel = result
    ? result.score >= 300 ? { label: "Outstanding — Top 5%", color: "text-success" }
    : result.score >= 250 ? { label: "Very Good — High chance", color: "text-success" }
    : result.score >= 200 ? { label: "Good — Average range", color: "text-warning" }
    : result.score >= 160 ? { label: "Fair — May qualify some schools", color: "text-warning" }
    : { label: "Below cut-off for most schools", color: "text-destructive" }
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-5/10">
          <BookOpen className="h-5 w-5 text-chart-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">JAMB Score Calculator</h2>
          <p className="text-xs text-muted-foreground">4 subjects × 40 questions × 2.5 marks = 400</p>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px] gap-2 items-end">
            <div>
              <Label className="text-xs">Subject {i + 1}{i < 2 ? " (required)" : ""}</Label>
              {i < 2 ? (
                <Select value={row.subject} onValueChange={v => update(i, "subject", v)}>
                  <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>{JAMB_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Select value={row.subject} onValueChange={v => update(i, "subject", v)}>
                  <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>{JAMB_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Label className="text-xs">Correct (0–40)</Label>
              <Input type="number" min={0} max={40} value={row.correct || ""} onChange={e => update(i, "correct", Math.min(40, Math.max(0, Number(e.target.value))))} className="mt-1 h-9 text-sm" placeholder="0" />
            </div>
          </div>
        ))}
        <div className="rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-3.5 w-3.5 flex-none mt-0.5 text-primary" />
          Each correct answer = 2.5 marks. No penalty for wrong answers (2024 JAMB rules).
        </div>
        <Button onClick={calculate} className="w-full bg-gradient-hero text-white hover:opacity-90">
          Calculate JAMB Score
        </Button>
        {result && (
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
            <div className="text-center mb-3">
              <p className="text-xs text-muted-foreground">Estimated JAMB Score</p>
              <p className="font-display text-4xl font-bold text-primary">{result.score}<span className="text-lg text-muted-foreground">/400</span></p>
              <p className={cn("text-xs font-medium mt-1", gradeLabel?.color)}>{gradeLabel?.label}</p>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-gradient-hero transition-all" style={{ width: `${result.pct}%` }} />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Correct answers: {rows.reduce((s, r) => s + r.correct, 0)}/{rows.length * 40} · {result.pct}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── GPA Calculator ───────────────────────────────────────────────────────── */
type Course = { name: string; grade: string; units: number };

const GRADE_POINTS_5: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
const GRADE_POINTS_4: Record<string, number> = { "A": 4.0, "B+": 3.5, "B": 3.0, "C+": 2.5, "C": 2.0, "D": 1.0, "F": 0.0 };

function GpaCalculator() {
  const [scale, setScale] = useState<"5" | "4">("5");
  const [courses, setCourses] = useState<Course[]>([
    { name: "MTH 101", grade: "A", units: 3 },
    { name: "ENG 101", grade: "B", units: 2 },
    { name: "", grade: "A", units: 3 },
  ]);
  const [gpa, setGpa] = useState<{ gpa: number; totalUnits: number; classification: string } | null>(null);

  const gradeOptions5 = ["A", "B", "C", "D", "E", "F"];
  const gradeOptions4 = ["A", "B+", "B", "C+", "C", "D", "F"];
  const gradeOptions = scale === "5" ? gradeOptions5 : gradeOptions4;
  const gradePoints = scale === "5" ? GRADE_POINTS_5 : GRADE_POINTS_4;

  const addCourse = () => setCourses(c => [...c, { name: "", grade: "A", units: 3 }]);
  const removeCourse = (i: number) => setCourses(c => c.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Course, val: string | number) =>
    setCourses(c => c.map((co, idx) => idx === i ? { ...co, [field]: val } : co));

  const calculate = () => {
    const valid = courses.filter(c => c.name.trim() && c.units > 0);
    if (valid.length === 0) return;
    const totalWGP = valid.reduce((s, c) => s + (gradePoints[c.grade] ?? 0) * c.units, 0);
    const totalUnits = valid.reduce((s, c) => s + c.units, 0);
    const gpaVal = Math.round((totalWGP / totalUnits) * 100) / 100;
    const classif = scale === "5"
      ? gpaVal >= 4.5 ? "First Class Honours 🏆" : gpaVal >= 3.5 ? "Second Class Upper (2:1) 🎖️" : gpaVal >= 2.4 ? "Second Class Lower (2:2)" : gpaVal >= 1.5 ? "Third Class" : "Pass"
      : gpaVal >= 3.7 ? "A / First Class 🏆" : gpaVal >= 3.0 ? "B+ / Upper Second" : gpaVal >= 2.0 ? "B / Lower Second" : "Below Average";
    setGpa({ gpa: gpaVal, totalUnits, classification: classif });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">GPA / CGPA Calculator</h2>
            <p className="text-xs text-muted-foreground">Nigeria 5.0 or International 4.0 scale</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-xl border border-border p-0.5">
          {(["5", "4"] as const).map(s => (
            <button key={s} onClick={() => { setScale(s); setGpa(null); }}
              className={cn("rounded-lg px-3 py-1 text-xs font-semibold transition-all", scale === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {s}.0 Scale
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-3 max-h-72 overflow-y-auto pr-1">
        <div className="grid grid-cols-[1fr_90px_60px_32px] gap-2 text-xs font-semibold text-muted-foreground px-1">
          <span>Course</span><span>Grade</span><span>Units</span><span />
        </div>
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_90px_60px_32px] gap-2 items-center">
            <Input value={c.name} onChange={e => update(i, "name", e.target.value)} placeholder="Course code" className="h-8 text-sm" />
            <Select value={c.grade} onValueChange={v => update(i, "grade", v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{gradeOptions.map(g => <SelectItem key={g} value={g}>{g} ({gradePoints[g]})</SelectItem>)}</SelectContent>
            </Select>
            <Input type="number" min={1} max={6} value={c.units} onChange={e => update(i, "units", Math.max(1, Number(e.target.value)))} className="h-8 text-sm text-center" />
            <button onClick={() => removeCourse(i)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={addCourse} className="gap-1.5 text-xs flex-1">
          <Plus className="h-3.5 w-3.5" /> Add Course
        </Button>
        <Button onClick={calculate} size="sm" className="gap-1.5 text-xs flex-1 bg-gradient-hero text-white hover:opacity-90">
          Calculate GPA
        </Button>
      </div>

      {gpa && (
        <div className="mt-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-4 text-center">
          <p className="text-xs text-muted-foreground">Your GPA ({scale}.0 scale)</p>
          <p className="font-display text-4xl font-bold text-primary">{gpa.gpa}<span className="text-lg text-muted-foreground">/{scale}.0</span></p>
          <p className="mt-1 text-sm font-semibold text-foreground">{gpa.classification}</p>
          <p className="mt-1 text-xs text-muted-foreground">Based on {gpa.totalUnits} credit units</p>
        </div>
      )}

      <div className="mt-3 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Grade scales:</p>
        <p>5.0: A=5, B=4, C=3, D=2, E=1, F=0</p>
        <p>4.0: A=4.0, B+=3.5, B=3.0, C+=2.5, C=2.0, D=1.0, F=0</p>
      </div>
    </div>
  );
}

/* ─── WolframAlpha ─────────────────────────────────────────────────────────── */
type WolframPod = { title: string; id: string; subpods: { title: string; plaintext: string; img?: { src: string; alt: string } }[] };
type WolframResult = { success: true; pods: WolframPod[]; inputstring: string } | { success: false; didyoumean: string[]; tips: string[] };

const EXAMPLE_QUERIES = ["integrate x^2 sin(x) dx","solve x^2 - 5x + 6 = 0","derivative of sin(x)*ln(x)","speed of light in km/h","pH of 0.01M HCl","quadratic formula"];

function WolframCalculator() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WolframResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (q?: string) => {
    const text = (q ?? query).trim();
    if (!text) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch(`/api/wolfram?q=${encodeURIComponent(text)}&format=plaintext,image`);
      if (!res.ok) { const err = await res.json().catch(() => ({})); setError(err.error ?? "Request failed"); return; }
      setResult(await res.json());
    } catch { setError("Could not reach WolframAlpha — check your connection"); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
          <Atom className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">WolframAlpha Science &amp; Maths Engine</h2>
          <p className="text-xs text-muted-foreground">Solve calculus, chemistry, physics &amp; more — Full Access API</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 mt-3">
        {EXAMPLE_QUERIES.map(q => (
          <button key={q} onClick={() => { setQuery(q); run(q); }}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition">{q}</button>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); run(); }}>
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. integrate x^2 sin(x) dx, or pH of HCl" className="flex-1 font-mono text-sm" />
        <Button type="submit" disabled={loading || !query.trim()} className="gap-2 bg-gradient-hero text-white shadow-hero hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Compute
        </Button>
      </form>
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /><span>{error}</span>
        </div>
      )}
      {result && (
        <div className="mt-4 space-y-4">
          {!result.success && (
            <div className="rounded-xl bg-warning/10 p-4 text-sm">
              <p className="font-medium mb-1">No results found</p>
              {result.didyoumean?.length > 0 && <p className="text-muted-foreground">Did you mean: {result.didyoumean.slice(0, 3).join(", ")}?</p>}
            </div>
          )}
          {result.success && result.pods.map(pod => (
            <div key={pod.id} className="rounded-xl border border-border bg-secondary/30 p-4">
              <h4 className="font-display text-sm font-semibold text-foreground mb-2">{pod.title}</h4>
              {pod.subpods.map((sp, i) => (
                <div key={i} className="mt-2 first:mt-0">
                  {sp.title && <p className="text-xs text-muted-foreground mb-1">{sp.title}</p>}
                  {sp.plaintext && <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{sp.plaintext}</pre>}
                  {sp.img && <img src={sp.img.src} alt={sp.img.alt || pod.title} className="max-w-full rounded mt-1" loading="lazy" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
