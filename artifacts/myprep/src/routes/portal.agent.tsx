import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Users, TrendingUp, Share2 } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/portal/agent")({
  component: () => <RequireRole role="agent"><AgentDashboard /></RequireRole>,
});

function AgentDashboard() {
  const stats = [
    { icon: Users, label: "Referred students", value: "0", color: "text-primary bg-primary/10" },
    { icon: TrendingUp, label: "Conversions", value: "0", color: "text-success bg-success/10" },
    { icon: Briefcase, label: "Pending payouts", value: "₦0", color: "text-accent bg-accent/10" },
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
        <h2 className="font-display text-lg font-semibold">Your referral link</h2>
        <p className="mt-1 text-sm text-muted-foreground">Share to earn commission on each premium signup.</p>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary p-3">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <code className="flex-1 truncate text-xs">https://myprep.app/?ref=YOUR_CODE</code>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Referral tracking ships next release.</p>
      </div>
    </div>
  );
}
