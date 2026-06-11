import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu, X, BookOpen, LogOut, LayoutDashboard, Shield, Search, Bell,
  GraduationCap, FileText, Newspaper, Calculator, School, Award, Users,
  ChevronDown, Sparkles, Trophy, BookMarked, Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSiteMenu } from "@/hooks/useSiteMenu";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LucideIcon } from "lucide-react";
import eliteTutorLogo from "@/assets/elite-tutor-logo.png";

const iconMap: Record<string, LucideIcon> = {
  BookOpen, FileText, BookMarked, GraduationCap, Award, Globe2, Trophy,
  School, Sparkles, Newspaper, Users, Calculator,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user, profile, isAdmin, roles, signOut } = useAuth();
  const { sections } = useSiteMenu();
  const { settings } = useSiteSettings();
  const isPartner = roles.some((r) => r === "agent" || r === "cbt_centre" || r === "edu_consultant");
  const navigate = useNavigate();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enterMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leaveMenu = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate({ to: "/exams", search: { q: search } as never });
    setSearch("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      {/* Top utility bar */}
      {settings.header_announcement && settings.header_announcement.trim() && (
        <div className="hidden border-b border-border/50 bg-secondary/40 lg:block">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
            <span>{settings.header_announcement}</span>
            <div className="flex items-center gap-4">
              <Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link>
              <Link to="/pricing" className="hover:text-primary">Premium</Link>
              <Link to="/community" className="hover:text-primary">Community</Link>
              <Link to="/blog" className="hover:text-primary">News</Link>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={settings.logo_url || eliteTutorLogo}
            alt={settings.brand_name}
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span className="font-display text-xl font-bold text-foreground">{settings.brand_name}</span>
        </Link>

        {/* Mega menu — database-driven */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {sections.map((m) => {
            const SectionIcon = getIcon(m.icon);
            return (
              <div
                key={m.id}
                className="relative"
                onMouseEnter={() => enterMenu(m.id)}
                onMouseLeave={leaveMenu}
              >
                <button
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    openMenu === m.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {m.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === m.id ? "rotate-180" : ""}`} />
                </button>
                {openMenu === m.id && (
                  <div
                    className="absolute left-1/2 top-full mt-2 w-[min(560px,90vw)] -translate-x-1/2 rounded-2xl border border-border bg-popover p-4 shadow-card-hover"
                    onMouseEnter={() => enterMenu(m.id)}
                    onMouseLeave={leaveMenu}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {m.links.map((l) => {
                        const LinkIcon = getIcon(l.icon);
                        return (
                          <Link
                            key={l.id}
                            to={l.url}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <LinkIcon className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">{l.label}</p>
                              <p className="text-xs text-muted-foreground">{l.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center">
                <Input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => !search && setSearchOpen(false)}
                  placeholder="Search exams, schools, posts…"
                  className="h-9 w-64"
                />
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="h-4.5 w-4.5" />
              </Button>
            )}
          </div>

          <ThemeToggle />
          {user ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-hero text-xs font-semibold text-white">
                      {(profile?.full_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{profile?.full_name ?? user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="gap-2"><Users className="h-4 w-4" /> My Profile</Link>
                  </DropdownMenuItem>
                  {isPartner && (
                    <DropdownMenuItem asChild>
                      <Link to="/portal" className="gap-2"><Award className="h-4 w-4" /> Partner Portal</Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="gap-2"><Shield className="h-4 w-4" /> Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-hero text-white shadow-hero hover:opacity-90">
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button className="rounded-lg p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <form onSubmit={submitSearch} className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-9"
              />
            </div>
          </form>
          <nav className="max-h-[60vh] overflow-y-auto px-3 py-2">
            {sections.map((m) => {
              const SectionIcon = getIcon(m.icon);
              return (
                <details key={m.id} className="group border-b border-border/50 py-1">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                    <span className="flex items-center gap-2"><SectionIcon className="h-4 w-4 text-primary" /> {m.label}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                    {m.links.map((l) => (
                      <Link
                        key={l.id}
                        to={l.url}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </nav>
          <div className="flex flex-col gap-2 border-t border-border p-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Dashboard</Button></Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Admin</Button></Link>}
                <Button onClick={() => { signOut(); setMobileOpen(false); }} variant="destructive" className="w-full">Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Log in</Button></Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}><Button className="w-full bg-gradient-hero text-white">Get Started Free</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
