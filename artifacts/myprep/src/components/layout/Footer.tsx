import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Mail, Phone, MapPin, Send, Loader2, Apple, Smartphone, Share2, AtSign, Globe, MessageCircle, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import eliteTutorLogo from "@/assets/elite-tutor-logo.png";

export function Footer() {
  const { settings, footerLinks } = useSiteSettings();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof footerLinks>();
    for (const l of footerLinks) {
      const arr = map.get(l.column_title) ?? [];
      arr.push(l);
      map.set(l.column_title, arr);
    }
    return Array.from(map.entries());
  }, [footerLinks]);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    const payload: Record<string, string> = { email: email.trim().toLowerCase() };
    if (user) payload.user_id = user.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("newsletter_subscribers") as any).upsert(payload, { onConflict: "email" });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") toast.error("You're already subscribed!");
      else toast.error("Couldn't subscribe. Please try again.");
      return;
    }
    toast.success("🎉 Subscribed! Check your inbox for updates.");
    setEmail("");
  };

  const socials = [
    { icon: Share2, href: settings.social_facebook, label: "Facebook" },
    { icon: AtSign, href: settings.social_twitter, label: "Twitter / X" },
    { icon: MessageCircle, href: settings.social_instagram, label: "Instagram" },
    { icon: Video, href: settings.social_youtube, label: "YouTube" },
    { icon: Globe, href: settings.social_linkedin, label: "LinkedIn" },
    { icon: MessageCircle, href: settings.social_whatsapp, label: "WhatsApp" },
  ].filter((s) => s.href && s.href.trim() !== "");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="mb-12 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">📬 Stay ahead of every exam</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get updates, study tips & admission news — straight to your inbox.</p>
            </div>
            <form onSubmit={subscribe} className="flex w-full gap-2">
              <Input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
              <Button type="submit" disabled={submitting} className="gap-1 bg-gradient-hero text-white shadow-hero hover:opacity-90">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Subscribe</>}
              </Button>
            </form>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={settings.logo_url || eliteTutorLogo}
                alt={settings.brand_name}
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="font-display text-lg font-bold">{settings.brand_name}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">{settings.footer_about}</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4" /><span>{settings.contact_email}</span>
                </a>
              )}
              {settings.contact_phone && (
                <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" /><span>{settings.contact_phone}</span>
                </a>
              )}
              {settings.contact_address && (
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{settings.contact_address}</span></p>
              )}
            </div>
          </div>

          {grouped.map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-foreground">{title}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App download badges */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">Coming soon:</span>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-left transition-colors hover:bg-secondary">
              <Apple className="h-6 w-6" />
              <div className="text-xs"><p className="text-muted-foreground">Download on</p><p className="font-semibold">App Store</p></div>
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-left transition-colors hover:bg-secondary">
              <Smartphone className="h-6 w-6" />
              <div className="text-xs"><p className="text-muted-foreground">Get it on</p><p className="font-semibold">Google Play</p></div>
            </button>
          </div>

          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.copyright_text.replace(/^©\s*/, "")}</p>
          <p>{settings.legal_tagline}</p>
        </div>
      </div>
    </footer>
  );
}
