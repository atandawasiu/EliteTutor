const partners = [
  "JAMB", "WAEC", "NECO", "IELTS", "SAT", "GRE", "TOEFL", "GMAT", "Cambridge", "GCE",
];

export function PartnersMarquee() {
  return (
    <section className="border-y border-border bg-secondary/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Prep for every major exam
        </p>
        <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-12">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="font-display text-2xl font-bold text-muted-foreground/70 hover:text-primary transition-colors"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
