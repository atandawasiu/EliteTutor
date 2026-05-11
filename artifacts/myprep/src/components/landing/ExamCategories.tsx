import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    region: "Nigeria",
    exams: [
      { name: "JAMB UTME", questions: "15,000+", color: "bg-primary" },
      { name: "WAEC", questions: "20,000+", color: "bg-accent" },
      { name: "NECO", questions: "12,000+", color: "bg-chart-3" },
      { name: "NABTEB", questions: "5,000+", color: "bg-chart-4" },
    ],
  },
  {
    region: "East Africa",
    exams: [
      { name: "KCSE", questions: "8,000+", color: "bg-primary" },
      { name: "UACE", questions: "4,000+", color: "bg-accent" },
      { name: "BECE", questions: "6,000+", color: "bg-chart-3" },
    ],
  },
  {
    region: "International",
    exams: [
      { name: "IELTS", questions: "5,000+", color: "bg-chart-5" },
      { name: "SAT", questions: "8,000+", color: "bg-chart-3" },
      { name: "GRE", questions: "6,000+", color: "bg-primary" },
      { name: "TOEFL", questions: "4,000+", color: "bg-accent" },
      { name: "GMAT", questions: "3,000+", color: "bg-chart-4" },
    ],
  },
];

export function ExamCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          18+ Exams, One Platform
        </h2>
        <p className="mt-3 text-muted-foreground">
          From JAMB to IELTS — practice with real past questions and AI-powered insights.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.region}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground">{cat.region}</h3>
            <div className="mt-4 space-y-3">
              {cat.exams.map((exam) => (
                <Link
                  key={exam.name}
                  to="/exams"
                  className="group flex items-center justify-between rounded-xl bg-secondary p-3 transition-all hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${exam.color}`} />
                    <span className="text-sm font-medium">{exam.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{exam.questions}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
