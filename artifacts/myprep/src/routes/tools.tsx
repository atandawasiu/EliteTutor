import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, GraduationCap, TrendingUp, BookOpen, Atom, Loader2, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

function ToolsPage() {
  const [jambScore, setJambScore] = useState("");
  const [postUtme, setPostUtme] = useState("");
  const [aggregate, setAggregate] = useState<number | null>(null);

  const calculateAggregate = () => {
    const j = Number(jambScore);
    const p = Number(postUtme);
    if (j && p) {
      const agg = (j / 400) * 50 + (p / 100) * 50;
      setAggregate(Math.round(agg * 100) / 100);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Student Tools</h1>
        <p className="mt-2 text-muted-foreground">Helpful calculators and predictors for your admission journey.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Aggregate Calculator */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Aggregate Score Calculator</h2>
              <p className="text-xs text-muted-foreground">Calculate your admission aggregate</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label>JAMB Score (out of 400)</Label>
              <Input type="number" placeholder="e.g. 280" value={jambScore} onChange={e => setJambScore(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Post-UTME Score (out of 100)</Label>
              <Input type="number" placeholder="e.g. 75" value={postUtme} onChange={e => setPostUtme(e.target.value)} className="mt-1" />
            </div>
            <Button onClick={calculateAggregate} className="w-full bg-gradient-hero text-white hover:opacity-90">
              Calculate Aggregate
            </Button>
            {aggregate !== null && (
              <div className="rounded-xl bg-success/10 p-4 text-center">
                <p className="text-sm text-muted-foreground">Your Aggregate Score</p>
                <p className="font-display text-3xl font-bold text-success">{aggregate}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {aggregate >= 70 ? "🟢 High admission chance" : aggregate >= 55 ? "🟡 Medium chance" : "🔴 Consider other options"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* GPA Calculator */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">GPA Calculator</h2>
              <p className="text-xs text-muted-foreground">Calculate your grade point average</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Coming soon — Enter your course grades and units to calculate CGPA on a 4.0 or 5.0 scale.</p>
        </div>

        {/* Admission Predictor */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
              <TrendingUp className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Admission Predictor</h2>
              <p className="text-xs text-muted-foreground">Predict your chances at any school</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Coming soon — Input your scores and we'll predict admission probability with alternative school suggestions.</p>
        </div>

        {/* JAMB Score Calculator */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-5/10">
              <BookOpen className="h-5 w-5 text-chart-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">JAMB Score Calculator</h2>
              <p className="text-xs text-muted-foreground">Estimate your JAMB score from practice</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Coming soon — Based on your practice test performance, we'll estimate your likely JAMB score range.</p>
        </div>
      </div>

      {/* WolframAlpha Full Access Calculator */}
      <WolframCalculator />
    </div>
  );
}

type WolframPod = {
  title: string;
  id: string;
  subpods: { title: string; plaintext: string; img?: { src: string; alt: string } }[];
};
type WolframResult =
  | { success: true; pods: WolframPod[]; inputstring: string }
  | { success: false; didyoumean: string[]; tips: string[] };

const EXAMPLE_QUERIES = [
  "integrate x^2 sin(x) dx",
  "solve x^2 - 5x + 6 = 0",
  "derivative of sin(x)*ln(x)",
  "speed of light in km/h",
  "pH of 0.01M HCl",
];

function WolframCalculator() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WolframResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (q?: string) => {
    const text = (q ?? query).trim();
    if (!text) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/wolfram?q=${encodeURIComponent(text)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Request failed");
        return;
      }
      setResult(await res.json());
    } catch {
      setError("Could not reach WolframAlpha — check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-6">
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
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => { setQuery(q); run(q); }}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
          >
            {q}
          </button>
        ))}
      </div>

      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); run(); }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. integrate x^2 sin(x) dx, or pH of HCl"
          className="flex-1 font-mono text-sm"
        />
        <Button type="submit" disabled={loading || !query.trim()} className="gap-2 bg-gradient-hero text-white shadow-hero hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Compute
        </Button>
      </form>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          {!result.success && (
            <div className="rounded-xl bg-warning/10 p-4 text-sm text-warning-foreground">
              <p className="font-medium mb-1">No results found</p>
              {result.didyoumean?.length > 0 && (
                <p>Did you mean: {result.didyoumean.slice(0, 3).join(", ")}?</p>
              )}
            </div>
          )}
          {result.success && result.pods.map((pod) => (
            <div key={pod.id} className="rounded-xl border border-border bg-secondary/30 p-4">
              <h4 className="font-display text-sm font-semibold text-foreground mb-2">{pod.title}</h4>
              {pod.subpods.map((sp, i) => (
                <div key={i} className="mt-2 first:mt-0">
                  {sp.title && <p className="text-xs text-muted-foreground mb-1">{sp.title}</p>}
                  {sp.plaintext && (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{sp.plaintext}</pre>
                  )}
                  {sp.img && !sp.plaintext && (
                    <img src={sp.img.src} alt={sp.img.alt || pod.title} className="max-w-full rounded" loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
