import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar_url: string | null;
};

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  const load = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("id, name, role, quote, rating, avatar_url")
      .eq("approved", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setTestimonials((data ?? []) as Testimonial[]);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`testimonials-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Loved by students across Africa
          </h2>
          <p className="mt-3 text-muted-foreground">Real results from real learners.</p>
        </motion.div>

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 hover-lift hover:shadow-card-hover">
                    <Quote className="h-7 w-7 text-primary opacity-70" />
                    <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.max(0, Math.min(5, t.rating ?? 5)) }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous testimonial" className="hover-scale">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all ${selected === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => emblaApi?.scrollNext()} aria-label="Next testimonial" className="hover-scale">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
