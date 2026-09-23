import { motion } from "framer-motion";
import {
  Timer, Brain, BarChart3, Calculator,
  GraduationCap, MessageSquare, Bell, Sparkles,
} from "lucide-react";

const features = [
  { icon: Timer, title: "Timed CBT Practice", desc: "Real exam conditions with auto-scoring and section-based tests." },
  { icon: Brain, title: "AI Study Assistant", desc: "Get instant explanations, study tips, and personalized recommendations." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Track scores, identify weak areas, and watch your improvement over time." },
  { icon: Calculator, title: "Score Calculator", desc: "Calculate your aggregate score and predict admission probability." },
  { icon: GraduationCap, title: "School Directory", desc: "Browse schools, cut-off marks, fees, and admission requirements." },
  { icon: MessageSquare, title: "Community Forum", desc: "Connect with fellow students, ask questions, and share study tips." },
  { icon: Bell, title: "Daily Challenges", desc: "Stay sharp with daily questions, leaderboards, and achievement badges." },
  { icon: Sparkles, title: "Premium Access", desc: "Unlock full CBT, AI assistant, and ad-free experience with Premium." },
];

export function FeaturesSection() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-3 text-muted-foreground">
            Powerful tools designed to help you prepare smarter, not harder.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-hero group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
