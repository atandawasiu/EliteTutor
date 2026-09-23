import { Outlet, Link, createRootRoute, useLocation } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteAnnouncementBanner } from "@/components/SiteAnnouncementBanner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-hero">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-lg bg-gradient-hero px-5 py-2.5 text-sm font-medium text-white shadow-hero hover:opacity-90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useLocation();
  const isCBT = location.pathname.startsWith("/cbt/");

  return (
    <ThemeProvider>
      <AuthProvider>
        {!isCBT && <SiteAnnouncementBanner />}
        {!isCBT && <Header />}
        <main>
          <Outlet />
        </main>
        {!isCBT && <Footer />}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
