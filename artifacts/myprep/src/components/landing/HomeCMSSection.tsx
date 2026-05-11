import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Sparkles, HelpCircle } from "lucide-react";

export function HomeCMSSection() {
  const widgets = useContentBlocks("home", "widget");
  const faqs = useContentBlocks("home", "faq");

  if (widgets.length === 0 && faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {widgets.length > 0 && (
        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {widgets.map((w) => (
            <div key={w.id} className="rounded-2xl border border-border bg-card p-6 hover-lift">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{w.title}</h3>
              {w.subtitle && <p className="mt-1 text-sm text-primary">{w.subtitle}</p>}
              {w.body && <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>}
              {w.link_url && (
                <a href={w.link_url} className="mt-3 inline-block text-sm font-medium text-primary story-link">
                  {w.link_label || "Learn more"} →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center mb-2">Frequently asked</h2>
          <p className="text-center text-muted-foreground mb-8">Answers managed live by the team.</p>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="rounded-xl border border-border bg-card p-4 group">
                <summary className="flex cursor-pointer items-center gap-2 font-medium">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  {f.title}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
