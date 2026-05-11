import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, Target } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/portal/consultant")({
  component: () => <RequireRole role="edu_consultant"><ConsultantDashboard /></RequireRole>,
});

function ConsultantDashboard() {
  const stats = [
    { icon: Users, label: "My students", value: "0", color: "text-primary bg-primary/10" },
    { icon: GraduationCap, label: "Admissions", value: "0", color: "text-success bg-success/10" },
    { icon: Target, label: "Avg score", value: "—", color: "text-accent bg-accent/10" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}><s.icon className="h-4.5 w-4.5" /></div>
            <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Education consultant tools</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track your students' performance and recommend schools.</p>
        <p className="mt-3 text-xs text-muted-foreground">Student linking, performance reports and school recommender shipping next.</p>
      </div>
    </div>
  );
}
