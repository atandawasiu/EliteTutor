import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import eliteTutorLogo from "@/assets/elite-tutor-logo.png";

export function CTASection() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
      toast.error("Couldn't subscribe. Please try again.");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're in! 🎉 We'll keep you posted.");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center sm:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative">
          {/* Logo badge */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 p-2 shadow-lg ring-2 ring-white/20 backdrop-blur-sm">
              <img src={eliteTutorLogo} alt="Elite Tutor" className="h-full w-full rounded-xl object-contain" />
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to Crush Your Next Exam?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            Join 250,000+ students already preparing smarter with Elite Tutor. It's free to get started.
          </p>

          {/* Newsletter subscribe */}
          <div className="mx-auto mt-8 max-w-md">
            <p className="mb-3 text-sm font-medium text-white/70">
              📬 Get study tips &amp; exam updates straight to your inbox
            </p>
            {done ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-white">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="font-medium">You're subscribed — we'll be in touch!</span>
              </div>
            ) : (
              <form onSubmit={subscribe} className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/40"
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="secondary"
                  className="gap-1.5 font-semibold"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <><Send className="h-4 w-4" /> Subscribe</>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Primary CTA */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
