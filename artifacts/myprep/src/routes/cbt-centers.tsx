import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MapPin, Search, Phone, ExternalLink, Navigation, Building2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cbt-centers")({
  component: CbtCentersPage,
});

type Center = {
  id: number;
  name: string;
  state: string;
  lga: string;
  address: string;
  phone?: string;
  type: "jamb" | "waec" | "both";
  hours?: string;
};

const CENTERS: Center[] = [
  { id: 1, name: "JAMB CBT Centre - University of Lagos", state: "Lagos", lga: "Mushin", address: "University of Lagos, Akoka, Yaba, Lagos", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 2, name: "JAMB CBT Centre - Lagos State University", state: "Lagos", lga: "Ojo", address: "LASU CBT Centre, Badagry Expressway, Ojo, Lagos", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 3, name: "Covenant University CBT Centre", state: "Ogun", lga: "Ota", address: "KM 10 Idiroko Road, Canaan Land, Ota, Ogun State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 4, name: "JAMB CBT Centre - Obafemi Awolowo University", state: "Osun", lga: "Ile-Ife", address: "OAU Campus, Ile-Ife, Osun State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 5, name: "University of Ibadan CBT Centre", state: "Oyo", lga: "Ibadan North", address: "University of Ibadan, Ibadan, Oyo State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 6, name: "JAMB CBT Centre - ABU Zaria", state: "Kaduna", lga: "Zaria", address: "Ahmadu Bello University, Zaria, Kaduna State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 7, name: "JAMB CBT Centre - University of Nigeria", state: "Enugu", lga: "Nsukka", address: "University of Nigeria, Nsukka, Enugu State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 8, name: "University of Benin CBT Centre", state: "Edo", lga: "Ikpoba-Okha", address: "UNIBEN Campus, Ugbowo, Benin City, Edo State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 9, name: "JAMB CBT Centre - Delta State University", state: "Delta", lga: "Abraka", address: "DELSU Campus, Abraka, Delta State", type: "jamb", hours: "Mon–Sat, 8am–4pm" },
  { id: 10, name: "JAMB CBT Centre - UNIPORT", state: "Rivers", lga: "Port Harcourt", address: "University of Port Harcourt, Choba, Rivers State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 11, name: "Federal University of Technology Akure CBT", state: "Ondo", lga: "Akure", address: "FUTA Campus, Akure, Ondo State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 12, name: "JAMB CBT Centre - UNILAG Annex (Surulere)", state: "Lagos", lga: "Surulere", address: "UNILAG Distance Learning, Herbert Macaulay Way, Surulere, Lagos", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 13, name: "Nnamdi Azikiwe University CBT Centre", state: "Anambra", lga: "Awka", address: "UNIZIK Campus, Awka, Anambra State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 14, name: "JAMB CBT Centre - Bayero University Kano", state: "Kano", lga: "Kano Municipal", address: "BUK New Campus, Gwarzo Road, Kano", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 15, name: "University of Maiduguri CBT Centre", state: "Borno", lga: "Maiduguri", address: "UNIMAID Campus, Maiduguri, Borno State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 16, name: "Federal University Oye-Ekiti CBT Centre", state: "Ekiti", lga: "Oye", address: "FUOYE Campus, Oye-Ekiti, Ekiti State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 17, name: "JAMB CBT Centre - FUTO", state: "Imo", lga: "Owerri", address: "Federal University of Technology, Owerri, Imo State", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 18, name: "Michael Okpara University CBT Centre", state: "Abia", lga: "Umudike", address: "MOUAU Campus, Umudike, Abia State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 19, name: "JAMB CBT Centre - University of Abuja", state: "FCT", lga: "Abuja Municipal", address: "UniAbuja Campus, Airport Road, Abuja", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 20, name: "JAMB Headquarters CBT Centre", state: "FCT", lga: "Bwari", address: "JAMB HQ, Plot 781 Bwari, Abuja, FCT", type: "both", hours: "Mon–Sat, 8am–5pm", phone: "07001234567" },
  { id: 21, name: "Abubakar Tafawa Balewa University CBT", state: "Bauchi", lga: "Bauchi", address: "ATBU Campus, Bauchi, Bauchi State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 22, name: "Usmanu Danfodiyo University CBT Centre", state: "Sokoto", lga: "Sokoto", address: "UDUS Campus, Sokoto, Sokoto State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 23, name: "JAMB CBT Centre - Kwara State University", state: "Kwara", lga: "Ilorin West", address: "KWASU Campus, Ilorin, Kwara State", type: "jamb", hours: "Mon–Sat, 8am–4pm" },
  { id: 24, name: "Niger State Polytechnic CBT Centre", state: "Niger", lga: "Bida", address: "Bida, Niger State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 25, name: "Cross River University of Technology CBT", state: "Cross River", lga: "Calabar", address: "CRUTECH Campus, Calabar, Cross River State", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 26, name: "Akwa Ibom State University CBT Centre", state: "Akwa Ibom", lga: "Mkpat Enin", address: "AKSU Campus, Ikot Akpaden, Mkpat Enin, Akwa Ibom", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
  { id: 27, name: "JAMB CBT Centre - Lagos Island", state: "Lagos", lga: "Lagos Island", address: "Federal Government College, Lagos Island, Lagos", type: "jamb", hours: "Mon–Sat, 8am–5pm" },
  { id: 28, name: "Tertiary Education Trust Fund CBT - Abuja", state: "FCT", lga: "Garki", address: "TETFund Building, Area 11, Garki, Abuja", type: "jamb", hours: "Mon–Fri, 8am–4pm" },
];

const STATES = Array.from(new Set(CENTERS.map(c => c.state))).sort();

export default function CbtCentersPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("all");

  const filtered = useMemo(() => CENTERS.filter(c =>
    (state === "all" || c.state === state) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.lga.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase()))
  ), [state, search]);

  const openMaps = (c: Center) => {
    const query = encodeURIComponent(`${c.name} ${c.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">CBT Centre Locator</h1>
            <p className="text-muted-foreground">Find JAMB-accredited Computer-Based Test centres near you across Nigeria.</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <p className="font-medium text-primary">How to use a CBT Centre</p>
          <p className="text-muted-foreground mt-1">Visit any JAMB-accredited CBT centre with your JAMB registration slip and a valid means of identification. Centres charge a small fee (usually ₦700–₦2,000) for mock exam sessions.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search centres, LGA, address..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by state" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States ({CENTERS.length})</SelectItem>
            {STATES.map(s => (
              <SelectItem key={s} value={s}>{s} ({CENTERS.filter(c => c.state === s).length})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} centre{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${c.type === "both" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                    {c.type === "both" ? "JAMB + WAEC" : c.type.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{c.state}</span>
                </div>
                <h3 className="font-display font-semibold text-sm leading-snug">{c.name}</h3>
              </div>
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                {c.address}
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">{c.lga} LGA</span>
              </p>
              {c.hours && (
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {c.hours}
                </p>
              )}
              {c.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {c.phone}
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" onClick={() => openMaps(c)}>
                <Navigation className="h-3.5 w-3.5" /> Get Directions
              </Button>
              <Button size="sm" className="flex-1 gap-1.5 text-xs bg-gradient-hero text-white" onClick={() => openMaps(c)}>
                <ExternalLink className="h-3.5 w-3.5" /> Open Map
              </Button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <MapPin className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">No centres found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or state filter</p>
          </div>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display font-bold text-lg mb-3">Prepare Before Your Visit</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "Practice Online First", desc: "Use Elite Tutor's CBT engine to practice in exam conditions before visiting a physical centre.", icon: "🖥️" },
            { title: "What to Bring", desc: "Registration slip, valid national ID/NIN, printed exam schedule, and small fee for centre usage.", icon: "📋" },
            { title: "Book in Advance", desc: "Some centres require prior booking. Call ahead or visit the centre website to confirm availability.", icon: "📅" },
          ].map(tip => (
            <div key={tip.title} className="rounded-xl bg-secondary p-4">
              <p className="text-2xl mb-2">{tip.icon}</p>
              <p className="font-semibold text-sm">{tip.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
