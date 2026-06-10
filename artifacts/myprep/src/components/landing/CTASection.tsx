import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center sm:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to Crush Your Next Exam?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            Join 250,000+ students already preparing smarter with Elite Tutor. It's free to get started.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
