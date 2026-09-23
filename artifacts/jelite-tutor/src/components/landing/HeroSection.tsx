import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play, Users, BookCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "250K+", label: "Students" },
  { icon: BookCheck, value: "50K+", label: "Questions" },
  { icon: Trophy, value: "18", label: "Exam Types" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero-subtle" />
      <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 left-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
              Trusted by 250,000+ students across Africa
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Ace Your Exams with{" "}
              <span className="text-gradient-hero">Confidence</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Practice JAMB, WAEC, NECO, IELTS, SAT, GRE and 12+ exams with our AI-powered 
              CBT platform. Track progress, get smart insights, and boost your scores.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero text-white shadow-hero hover:opacity-90 gap-2">
                  Start Practicing Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/exams">
                <Button size="lg" variant="outline" className="gap-2">
                  <Play className="h-4 w-4" /> Browse Exams
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <stat.icon className="h-4 w-4 text-primary" />
                    <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl border border-border bg-card p-6 shadow-hero">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">JAMB Practice Test</h3>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">Live</span>
              </div>
              <div className="space-y-3">
                {["English Language", "Mathematics", "Physics", "Chemistry"].map((subject, i) => (
                  <div key={subject} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <span className="text-sm font-medium">{subject}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-hero"
                          style={{ width: `${[85, 72, 68, 90][i]}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{[85, 72, 68, 90][i]}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-primary/5 p-3 text-center">
                <span className="text-sm font-medium text-primary">⏱ Time Remaining: 1h 45m</span>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 animate-float rounded-xl border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                  <Trophy className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Score: 285/400</p>
                  <p className="text-xs text-muted-foreground">Top 5% nationally</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
