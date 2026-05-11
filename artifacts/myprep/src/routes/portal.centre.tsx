import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users, BookOpen, Calendar } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/portal/centre")({
  component: () => <RequireRole role="cbt_centre"><CentreDashboard /></RequireRole>,
});

function CentreDashboard() {
  const stats = [
    { icon: Users, label: "Registered students", value: "0", color: "text-primary bg-primary/10" },
    { icon: BookOpen, label: "Active sessions", value: "0", color: "text-accent bg-accent/10" },
    { icon: Calendar, label: "Tests this week", value: "0", color: "text-success bg-success/10" },
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
        <h2 className="font-display text-lg font-semibold">CBT Centre tools</h2>
        <p className="mt-1 text-sm text-muted-foreground">Bulk-register students and assign mock exams.</p>
        <p className="mt-3 text-xs text-muted-foreground">Bulk roster upload, session scheduling and proctoring controls coming soon.</p>
      </div>
    </div>
  );
}
