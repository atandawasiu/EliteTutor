import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Search, Users, BookOpen, School, GraduationCap, ClipboardCheck, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickActions = [
  { label: "Find a Tutor", icon: Users, to: "/schools" },
  { label: "Browse Courses", icon: BookOpen, to: "/learn" },
  { label: "Find a School", icon: School, to: "/schools" },
  { label: "Practice CBT", icon: ClipboardCheck, to: "/practice" },
  { label: "Scholarships", icon: Award, to: "/blog" },
  { label: "Resources", icon: FileText, to: "/blog" },
];

const stats = [
  { value: "250K+", label: "Students learning" },
  { value: "50K+", label: "Practice questions" },
  { value: "18", label: "Exam categories" },
];

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero-subtle" />
      <div className="absolute -right-24 top-20 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-24 bottom-0 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <GraduationCap className="size-4" /> Nigeria&apos;s learning and education discovery platform
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Learn better. Find the right tutor. <span className="text-gradient-hero">Build your future.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Discover tutors, schools, courses, scholarships and trusted exam resources in one focused place built for Nigerian learners.
            </p>
            <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-hero sm:flex-row" onSubmit={(event) => { event.preventDefault(); navigate({ to: "/exams", search: { q: new FormData(event.currentTarget).get("q") ?? "" } as never }); }}>
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3"><Search className="size-5 shrink-0 text-muted-foreground" /><Input name="q" aria-label="Search Jelite Tutor" placeholder="Search tutors, subjects, schools, courses or resources..." className="border-0 bg-transparent shadow-none focus-visible:ring-0" /></div>
              <Button type="submit" size="lg" className="bg-gradient-hero text-white shadow-hero hover:opacity-90">Search</Button>
            </form>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/signup"><Button size="lg" className="gap-2 bg-gradient-hero text-white shadow-hero hover:opacity-90">Get started free <ArrowRight className="size-4" /></Button></Link><Link to="/practice"><Button size="lg" variant="outline">Practice an exam</Button></Link></div>
          </motion.div>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{quickActions.map(({ label, icon: Icon, to }) => <Link key={label} to={to} className="group rounded-2xl border border-border/80 bg-card/80 p-4 text-center transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"><Icon className="mx-auto size-5 text-primary" /><span className="mt-2 block text-sm font-semibold text-foreground">{label}</span></Link>)}</div>
        <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-5 border-t border-border/70 pt-8">{stats.map((stat) => <div key={stat.label} className="text-center"><p className="font-display text-2xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>)}</div>
      </div>
    </section>
  );
}
