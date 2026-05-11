import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Briefcase, Building2, Users, BookOpen, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/portal")({
  component: () => <RequireAuth><PortalLayout /></RequireAuth>,
});

function PortalLayout() {
  const { roles } = useAuth();
  const isAgent = roles.includes("agent");
  const isCentre = roles.includes("cbt_centre");
  const isConsultant = roles.includes("edu_consultant");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Partner Portal</h1>
        <p className="text-sm text-muted-foreground">Tools for agents, CBT centres and education consultants.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {isAgent && <Link to="/portal/agent" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-secondary [&.active]:bg-primary [&.active]:text-primary-foreground" activeProps={{ className: "active" }}>Agent</Link>}
        {isCentre && <Link to="/portal/centre" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-secondary [&.active]:bg-primary [&.active]:text-primary-foreground" activeProps={{ className: "active" }}>CBT Centre</Link>}
        {isConsultant && <Link to="/portal/consultant" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-secondary [&.active]:bg-primary [&.active]:text-primary-foreground" activeProps={{ className: "active" }}>Consultant</Link>}
        {!isAgent && !isCentre && !isConsultant && (
          <p className="text-sm text-muted-foreground">You don't have a partner role yet. Contact admin to get access.</p>
        )}
      </div>

      <Outlet />
    </div>
  );
}
