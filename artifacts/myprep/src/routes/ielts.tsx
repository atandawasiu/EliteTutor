import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, Target, TrendingUp, Award, ArrowRight, Brain, Mic, Headphones, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ielts")({
  component: IeltsPage,
});

const IELTS_SECTIONS = [
  {
    icon: Headphones,
    title: "Listening",
    time: "30 minutes",
    questions: "40 questions",
    description: "Listen to 4 recordings (monologues and conversations) and answer questions. Tests comprehension of spoken English in a variety of accents.",
    topics: ["Short conversations", "Monologues", "Academic lectures", "Social discussions"],
    color: "text-primary bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Reading",
    time: "60 minutes",
    questions: "40 questions",
    description: "Read 3 long passages and answer various question types. Academic version uses academic texts; General Training uses everyday texts.",
    topics: ["Multiple choice", "True/False/Not Given", "Matching headings", "Sentence completion"],
    color: "text-accent bg-accent/10",
  },
  {
    icon: FileText,
    title: "Writing",
    time: "60 minutes",
    questions: "2 tasks",
    description: "Academic: Describe a graph/chart (Task 1) + write an essay (Task 2). General: Write a letter (Task 1) + write an essay (Task 2).",
    topics: ["Graph/chart description", "Formal letter writing", "Opinion essays", "Argument essays"],
    color: "text-chart-3 bg-chart-3/10",
  },
  {
    icon: Mic,
    title: "Speaking",
    time: "11–14 minutes",
    questions: "3 parts",
    description: "Face-to-face interview with an examiner. Covers personal topics, a 2-minute talk on a given subject, and an in-depth discussion.",
    topics: ["Personal introduction", "Long turn (2-min talk)", "Two-way discussion", "Fluency & coherence"],
    color: "text-success bg-success/10",
  },
];

const BAND_SCORES = [
  { band: "9", label: "Expert User", color: "bg-primary text-primary-foreground" },
  { band: "8", label: "Very Good User", color: "bg-primary/80 text-white" },
  { band: "7", label: "Good User", color: "bg-success text-success-foreground" },
  { band: "6", label: "Competent User", color: "bg-chart-4 text-white" },
  { band: "5", label: "Modest User", color: "bg-chart-5 text-white" },
  { band: "4", label: "Limited User", color: "bg-muted text-muted-foreground" },
];

const TIPS = [
  { icon: Brain, title: "Know Both Versions", desc: "Academic IELTS is for university admission. General Training is for work/migration. Make sure you take the right version." },
  { icon: Clock, title: "Time Your Practice", desc: "Listening: 30 min. Reading: 60 min exactly. Writing: allocate 20 min for Task 1, 40 min for Task 2." },
  { icon: BookOpen, title: "Read Widely", desc: "Read English newspapers, academic articles, and books daily to improve vocabulary and reading speed." },
  { icon: Mic, title: "Practice Speaking Aloud", desc: "Record yourself speaking on various topics. Focus on fluency, pronunciation, and using a wide vocabulary range." },
  { icon: FileText, title: "Writing Templates", desc: "Learn essay structures and graph description templates, but personalize them — examiners penalize formulaic writing." },
  { icon: Target, title: "Know the Question Types", desc: "IELTS has specific question types that repeat. Practice each type (True/False/NG, matching, gap-fill) individually." },
];

const REQUIREMENTS: Record<string, string> = {
  "Undergraduate Study (UK/Australia/Canada)": "5.5 – 6.5",
  "Postgraduate Study": "6.5 – 7.5",
  "Medical/Law Professions": "7.0 – 8.0",
  "Canadian Immigration (IRCC)": "6.0 – 7.0",
  "Australian Immigration": "6.0 – 8.0",
  "UK Skilled Worker Visa": "4.0 – 5.5",
};

export default function IeltsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 rounded-3xl bg-gradient-to-br from-accent/10 via-background to-primary/10 border border-border px-6 py-12 text-center sm:px-12">
        <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent">International English</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">IELTS Preparation</h1>
        <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
          The International English Language Testing System (IELTS) is the world's most popular English language proficiency test, accepted by over 11,000 organisations in 140+ countries.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[
            { label: "Band Score", value: "1–9" },
            { label: "Duration", value: "2h 45min" },
            { label: "Sections", value: "4" },
            { label: "Validity", value: "2 Years" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-bold text-accent">{s.value}</p>
              <p className="text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/practice"><Button className="gap-2 bg-gradient-hero text-white shadow-hero"><Target className="h-4 w-4" /> Start IELTS Practice</Button></Link>
          <Link to="/exams"><Button variant="outline" className="gap-2"><BookOpen className="h-4 w-4" /> Browse Questions</Button></Link>
        </div>
      </div>

      {/* Sections */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">The 4 IELTS Sections</h2>
        <p className="text-muted-foreground mb-6">IELTS tests four English language skills. All four are scored and averaged for your overall band score.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {IELTS_SECTIONS.map(s => (
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

      {/* Band Score Guide */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">Band Score Guide</h2>
        <p className="text-muted-foreground mb-6">IELTS uses a 9-band scoring system. Each section is scored individually and averaged for the Overall Band Score.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BAND_SCORES.map(b => (
            <div key={b.band} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <span className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${b.color}`}>{b.band}</span>
              <div>
                <p className="font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">Band {b.band}.0</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Requirements */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">Typical Score Requirements</h2>
        <p className="text-muted-foreground mb-6">Band scores required for different purposes. Always check with the specific institution or immigration authority.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(REQUIREMENTS).map(([purpose, score]) => (
            <div key={purpose} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-sm font-medium">{purpose}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-accent/10 px-3 py-1 text-sm font-bold text-accent">{score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2">Expert Study Tips</h2>
        <p className="text-muted-foreground mb-6">Strategies proven to improve IELTS band scores quickly and efficiently.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map(t => (
            <div key={t.title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <t.icon className="h-4.5 w-4.5 text-accent" />
                </div>
                <p className="font-semibold">{t.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic vs General */}
      <div className="mb-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold mb-4">Academic vs General Training</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
            <h3 className="font-semibold text-primary mb-2">Academic IELTS</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ University and college admission worldwide</li>
              <li>✓ Professional registration (medicine, nursing)</li>
              <li>✓ More complex reading and writing tasks</li>
              <li>✓ Required for most postgraduate programs</li>
            </ul>
          </div>
          <div className="rounded-xl bg-accent/5 border border-accent/20 p-5">
            <h3 className="font-semibold text-accent mb-2">General Training IELTS</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Work experience and training programs</li>
              <li>✓ Immigration to Australia, Canada, UK, NZ</li>
              <li>✓ Everyday text types in reading</li>
              <li>✓ Letter writing in Task 1</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-accent via-accent/90 to-primary/80 p-8 text-center text-white">
        <Award className="mx-auto h-12 w-12 mb-4 opacity-90" />
        <h2 className="font-display text-2xl font-bold">Start Your IELTS Journey</h2>
        <p className="mt-2 text-white/80">Access thousands of IELTS-style practice questions, AI writing feedback, and expert study plans — all in one place.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/signup"><Button size="lg" className="bg-white text-accent hover:bg-white/90 font-semibold">Create Free Account <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
          <Link to="/pricing"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">View Premium Plans</Button></Link>
        </div>
      </div>
    </div>
  );
}
