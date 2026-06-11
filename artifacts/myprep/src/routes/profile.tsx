import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save, Copy, CheckCircle2, User as UserIcon, Phone, MapPin, GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: () => (<RequireAuth><ProfilePage /></RequireAuth>),
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  bio: string | null;
  country: string | null;
  state: string | null;
  target_course: string | null;
  target_school: string | null;
  date_of_birth: string | null;
  gender: string | null;
  student_code: string | null;
  daily_goal_minutes: number | null;
};

function ProfilePage() {
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [p, setP] = useState<ProfileRow | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) toast.error(error.message);
      setP(data as ProfileRow | null);
      setLoading(false);
    })();
  }, [user]);

  if (loading || !p) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const set = <K extends keyof ProfileRow>(k: K, v: ProfileRow[K]) => setP(prev => prev ? { ...prev, [k]: v } : prev);

  const save = async () => {
    if (!user || !p) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      whatsapp: p.whatsapp,
      bio: p.bio,
      country: p.country,
      state: p.state,
      target_course: p.target_course,
      target_school: p.target_school,
      date_of_birth: p.date_of_birth,
      gender: p.gender,
      daily_goal_minutes: p.daily_goal_minutes,
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    refresh();
  };

  const copyId = async () => {
    if (!p.student_code) return;
    await navigator.clipboard.writeText(p.student_code);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your personal info, contact details, and study preferences.</p>
      </div>

      {/* Identity card */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-hero text-white">
            {p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> : <UserIcon className="h-7 w-7" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-semibold">{p.full_name ?? "—"}</p>
            <p className="truncate text-sm text-muted-foreground">{p.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-mono">
                {p.student_code ?? "—"}
              </span>
              <button onClick={copyId} className="text-muted-foreground hover:text-foreground" aria-label="Copy student ID">
                {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
              <span className="text-xs text-muted-foreground">your Elite Tutor ID</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Full Name</Label>
            <Input className="mt-1.5" value={p.full_name ?? ""} onChange={e => set("full_name", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload
              label="Profile Photo"
              value={p.avatar_url ?? ""}
              onChange={url => set("avatar_url", url)}
              previewClass="h-20 w-20 rounded-full"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1.5" value={p.email ?? ""} disabled />
            <p className="mt-1 text-xs text-muted-foreground">Email is managed via account settings.</p>
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> WhatsApp</Label>
            <Input className="mt-1.5" placeholder="+234..." value={p.whatsapp ?? ""} onChange={e => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Country</Label>
            <Select value={p.country ?? "Nigeria"} onValueChange={v => set("country", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Nigeria","Ghana","Kenya","South Africa","Cameroon","Uganda","Tanzania","Ethiopia","Rwanda","Other"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>State / Region</Label>
            <Input className="mt-1.5" placeholder="e.g. Lagos" value={p.state ?? ""} onChange={e => set("state", e.target.value)} />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input className="mt-1.5" type="date" value={p.date_of_birth ?? ""} onChange={e => set("date_of_birth", e.target.value)} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={p.gender ?? ""} onValueChange={v => set("gender", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Target Course</Label>
            <Input className="mt-1.5" placeholder="e.g. Computer Science" value={p.target_course ?? ""} onChange={e => set("target_course", e.target.value)} />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><School className="h-3.5 w-3.5" /> Target School</Label>
            <Input className="mt-1.5" placeholder="e.g. University of Lagos" value={p.target_school ?? ""} onChange={e => set("target_school", e.target.value)} />
          </div>
          <div>
            <Label>Daily Study Goal (minutes)</Label>
            <Input className="mt-1.5" type="number" min={5} max={480} value={p.daily_goal_minutes ?? 30} onChange={e => set("daily_goal_minutes", Number(e.target.value))} />
          </div>
          <div className="sm:col-span-2">
            <Label>Bio</Label>
            <Textarea className="mt-1.5" rows={3} placeholder="Tell us a bit about yourself..." value={p.bio ?? ""} onChange={e => set("bio", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving} className="gap-2 bg-gradient-hero text-white hover:opacity-90">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
