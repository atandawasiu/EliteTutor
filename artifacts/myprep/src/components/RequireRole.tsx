import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type Role = "admin" | "contributor" | "student" | "agent" | "cbt_centre" | "edu_consultant";

export function RequireRole({ children, role }: { children: ReactNode; role: Role | Role[] }) {
  const { user, loading, roles, isAdmin } = useAuth();
  const navigate = useNavigate();
  const allowed = Array.isArray(role) ? role : [role];
  const hasRole = isAdmin || roles.some((r) => allowed.includes(r));

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    else if (!loading && user && !hasRole) navigate({ to: "/dashboard" });
  }, [user, loading, hasRole, navigate]);

  if (loading || !user || !hasRole) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return <>{children}</>;
}
