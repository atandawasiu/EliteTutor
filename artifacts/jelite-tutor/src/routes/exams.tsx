import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Exam = {
  id: string; name: string; slug: string; description: string | null;
  region: string; country: string | null; duration_minutes: number;
  subjects: { id: string; name: string; slug: string }[];
};

export const Route = createFileRoute("/exams")({
  component: ExamsPage,
});

function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("exams")
        .select("id, name, slug, description, region, country, duration_minutes, subjects(id, name, slug)")
        .order("name");
      setExams((data ?? []) as Exam[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Browse Exams</h1>
        <p className="mt-2 text-muted-foreground">Choose an exam, pick a subject, and start practicing.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, i) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-semibold">{exam.name}</h3>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                  {exam.region}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{exam.description}</p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{exam.subjects?.length ?? 0} subjects</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{exam.duration_minutes}min</span>
              </div>

              {exam.subjects && exam.subjects.length > 0 ? (
                <div className="mt-4 space-y-1.5">
                  {exam.subjects.slice(0, 4).map((s) => (
                    <Link
                      key={s.id}
                      to="/cbt/$subjectId"
                      params={{ subjectId: s.id }}
                      className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <span>{s.name}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              ) : (
                <Button size="sm" disabled className="mt-4 w-full">Coming soon</Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
