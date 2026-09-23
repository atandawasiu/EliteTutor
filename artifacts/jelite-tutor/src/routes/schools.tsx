import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Loader2, GraduationCap, ExternalLink, Navigation, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type School = {
  id: string; name: string; location: string | null; state: string | null;
  cutoff_score: number | null; fees_min: number | null; fees_max: number | null;
  courses: string[] | null; description: string | null;
  school_type: string; ownership: string; accreditation: string; country: string;
  website_url?: string | null; map_embed_url?: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  university: "University", polytechnic: "Polytechnic", college_of_education: "College of Education",
  monotechnic: "Monotechnic", secondary: "Secondary", other: "Other",
};
const OWN_LABELS: Record<string, string> = { federal: "Federal", state: "State", private: "Private", other: "Other" };

export const Route = createFileRoute("/schools")({
  component: SchoolsPage,
});

function getMapSearchUrl(school: School) {
  const query = encodeURIComponent(`${school.name} ${school.location ?? ""} ${school.state ?? ""} ${school.country}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [ownership, setOwnership] = useState("all");
  const [loading, setLoading] = useState(true);
  const [mapOpen, setMapOpen] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("schools").select("*").order("name");
    setSchools((data ?? []) as School[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel(`schools-public-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "schools" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => schools.filter(s => {
    const q = search.toLowerCase();
    return (
      (q === "" || s.name.toLowerCase().includes(q) || (s.state ?? "").toLowerCase().includes(q)) &&
      (type === "all" || s.school_type === type) &&
      (ownership === "all" || s.ownership === ownership)
    );
  }), [schools, search, type, ownership]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Schools Directory</h1>
        <p className="mt-2 text-muted-foreground">Universities, polytechnics, colleges and more — with cutoff marks, fees, admission details and maps.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search schools or states..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All institution types</SelectItem>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={ownership} onValueChange={setOwnership}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ownership</SelectItem>
            {Object.entries(OWN_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => (
            <div key={s.id} className="rounded-2xl border border-border bg-card hover:shadow-card-hover transition-all overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-none">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold">{s.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" /> {[s.location, s.state, s.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{TYPE_LABELS[s.school_type] ?? s.school_type}</span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">{OWN_LABELS[s.ownership] ?? s.ownership}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-secondary p-2"><p className="text-muted-foreground">Cut-off</p><p className="font-bold text-primary">{s.cutoff_score ?? "—"}</p></div>
                  <div className="rounded-lg bg-secondary p-2"><p className="text-muted-foreground">Fees</p><p className="font-bold">{s.fees_min ? `₦${((s.fees_min) / 1000).toFixed(0)}k+` : "—"}</p></div>
                </div>
                {s.courses && s.courses.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.courses.slice(0, 3).map(c => <span key={c} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">{c}</span>)}
                    {s.courses.length > 3 && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">+{s.courses.length - 3} more</span>}
                  </div>
                )}
              </div>

              {/* Map & links section */}
              <div className="border-t border-border/50 bg-secondary/30 px-4 py-3 flex items-center gap-2 flex-wrap">
                {s.map_embed_url ? (
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 flex-1"
                    onClick={() => setMapOpen(mapOpen === s.id ? null : s.id)}>
                    <MapPin className="h-3.5 w-3.5" />
                    {mapOpen === s.id ? "Hide map" : "View map"}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 flex-1"
                    onClick={() => window.open(getMapSearchUrl(s), "_blank")}>
                    <Navigation className="h-3.5 w-3.5" /> Get Directions
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5"
                  onClick={() => window.open(getMapSearchUrl(s), "_blank")}>
                  <ExternalLink className="h-3.5 w-3.5" /> Maps
                </Button>
                {s.website_url && (
                  <a href={s.website_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5">
                      <Globe className="h-3.5 w-3.5" /> Website
                    </Button>
                  </a>
                )}
              </div>

              {/* Embedded map (when admin has provided map_embed_url) */}
              {mapOpen === s.id && s.map_embed_url && (
                <div className="border-t border-border">
                  <iframe
                    src={s.map_embed_url}
                    width="100%"
                    height="220"
                    loading="lazy"
                    allowFullScreen
                    className="block"
                    title={`Map of ${s.name}`}
                  />
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-12">No schools match your filters.</p>}
        </div>
      )}
    </div>
  );
}
