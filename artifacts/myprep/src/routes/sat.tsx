import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, Target, TrendingUp, Award, CheckCircle, ArrowRight, Brain, Calculator, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sat")({
  component: SatPage,
});

const SAT_SECTIONS = [
  {
    icon: BookOpen,
    title: "Reading and Writing",
    time: "64 minutes",
    questions: "54 questions",
    description: "Vocabulary, comprehension, grammar, and rhetoric across various text types including literature, history, and science passages.",
    topics: ["Reading Comprehension", "Vocabulary in Context", "Grammar & Mechanics", "Evidence-Based Analysis", "Rhetorical Skills"],
    color: "text-primary bg-primary/10",
  },
  {
    icon: Calculator,
    title: "Math",
    time: "70 minutes",
    questions: "44 questions",
    description: "Algebra, advanced math, problem-solving, and data analysis. A calculator is allowed for the entire Math section on the digital SAT.",
    topics: ["Algebra", "Advanced Math", "Problem-Solving & Data Analysis", "Geometry & Trigonometry", "Statistics & Probability"],
    color: "text-accent bg-accent/10",
  },
];

const SCORE_BANDS = [
  { range: "1400–1600", label: "Exceptional", desc: "Top 5% — competitive for Ivy League and elite universities", color: "bg-primary text-primary-foreground" },
  { range: "1200–1390", label: "Strong", desc: "Top 25% — competitive for most selective universities", color: "bg-success text-success-foreground" },
  { range: "1000–1190", label: "Average", desc: "50th percentile — meets admission requirements for many schools", color: "bg-chart-4 text-white" },
  { range: "800–990", label: "Below Average", desc: "Needs improvement for competitive university admission", color: "bg-muted text-muted-foreground" },
];

const TIPS = [
  { icon: Brain, title: "Understand the Format", desc: "The digital SAT is adaptive — each module's difficulty adjusts based on your performance in the previous module." },
  { icon: Clock, title: "Time Management", desc: "Practice pacing: ~1.2 min per Reading/Writing question and ~1.6 min per Math question." },
  { icon: Target, title: "Focus on Weaknesses", desc: "Use Elite Tutor's analytics to identify your weak areas and target those topics in your study sessions." },
  { icon: TrendingUp, title: "Practice Daily", desc: "Consistent daily practice (45-60 minutes) for 2-3 months is more effective than cramming." },
  { icon: Calculator, title: "Math Strategy", desc: "Many Math questions can be solved by plugging answer choices or using estimation instead of complex algebra." },
  { icon: BookOpen, title: "Read Actively", desc: "Practice active reading — identify the main idea, author's purpose, and evidence for claims as you read." },
];

export default function SatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border px-6 py-12 text-center sm:px-12">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">International Exams</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">SAT Preparation</h1>
        <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
          The SAT (Scholastic Assessment Test) is a standardized test widely used for US university admissions. Scored on a scale of 400–1600, it tests reading, writing, and mathematical reasoning.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[
            { label: "Total Score", value: "400–1600" },
            { label: "Duration", value: "2 hrs 14 min" },
            { label: "Sections", value: "2" },
            { label: "Format", value: "Digital Adaptive" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/practice"><Button className="gap-2 bg-gradient-hero text-white shadow-hero"><Target className="h-4 w-4" /> Start SAT Practice</Button></Link>
          <Link to="/exams"><Button variant="outline" className="gap-2"><BookOpen className="h-4 w-4" /> Browse Questions</Button></Link>
        </div>
      </div>

      {/* SAT Sections */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">SAT Sections</h2>
        <p className="text-muted-foreground mb-6">The digital SAT consists of two main sections, each split into two modules.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {SAT_SECTIONS.map(s => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.time}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {s.questions}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.topics.map(t => (
                      <span key={t} className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Guide */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">Score Guide</h2>
        <p className="text-muted-foreground mb-6">Understanding what your SAT score means for university admissions.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SCORE_BANDS.map(b => (
            <div key={b.range} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <span className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold ${b.color}`}>{b.range}</span>
              <div>
                <p className="font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">Expert Study Tips</h2>
        <p className="text-muted-foreground mb-6">Strategies from high-scoring students and experienced tutors.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map(t => (
            <div key={t.title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <t.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <p className="font-semibold">{t.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SAT vs IELTS */}
      <div className="mb-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold mb-4">SAT vs Other International Exams</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-semibold">Feature</th>
                <th className="pb-3 text-left font-semibold text-primary">SAT</th>
                <th className="pb-3 text-left font-semibold">IELTS</th>
                <th className="pb-3 text-left font-semibold">GRE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              {[
                ["Purpose", "US undergrad admission", "Language proficiency", "Grad school admission"],
                ["Duration", "2h 14m", "2h 45m", "3h 45m"],
                ["Score Scale", "400–1600", "Band 1–9", "260–340"],
                ["Validity", "5 years", "2 years", "5 years"],
                ["Format", "Digital adaptive", "Paper/Computer", "Computer adaptive"],
              ].map(([feat, sat, ielts, gre]) => (
                <tr key={feat}>
                  <td className="py-3 font-medium text-foreground">{feat}</td>
                  <td className="py-3 text-primary font-medium">{sat}</td>
                  <td className="py-3">{ielts}</td>
                  <td className="py-3">{gre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent/80 p-8 text-center text-white">
        <Award className="mx-auto h-12 w-12 mb-4 opacity-90" />
        <h2 className="font-display text-2xl font-bold">Ready to Ace the SAT?</h2>
        <p className="mt-2 text-white/80">Join thousands of students who improved their scores with Elite Tutor's SAT practice materials and AI-powered study tools.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/signup"><Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">Create Free Account <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
          <Link to="/pricing"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">View Premium Plans</Button></Link>
        </div>
      </div>
    </div>
  );
}
