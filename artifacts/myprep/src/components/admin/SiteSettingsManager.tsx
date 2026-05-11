import { useEffect, useState } from "react";
import { Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Settings = Record<string, string | null>;

const SECTIONS: { title: string; fields: { key: string; label: string; long?: boolean; placeholder?: string }[] }[] = [
  {
    title: "Site Identity",
    fields: [
      { key: "brand_name", label: "Brand name" },
      { key: "tagline", label: "Tagline" },
      { key: "logo_url", label: "Logo URL", placeholder: "https://..." },
      { key: "header_announcement", label: "Header announcement bar (leave empty to hide)" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "contact_email", label: "Email" },
      { key: "contact_phone", label: "Phone" },
      { key: "contact_address", label: "Address" },
    ],
  },
  {
    title: "Social Media (full URLs, leave empty to hide icon)",
    fields: [
      { key: "social_facebook", label: "Facebook URL" },
      { key: "social_twitter", label: "Twitter / X URL" },
      { key: "social_instagram", label: "Instagram URL" },
      { key: "social_youtube", label: "YouTube URL" },
      { key: "social_linkedin", label: "LinkedIn URL" },
      { key: "social_whatsapp", label: "WhatsApp URL" },
    ],
  },
  {
    title: "Footer & Legal",
    fields: [
      { key: "footer_about", label: "Footer about text", long: true },
      { key: "copyright_text", label: "Copyright line" },
      { key: "legal_tagline", label: "Legal tagline" },
    ],
  },
];

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (data) setSettings(data as Settings);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`admin-site-settings-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const save = async () => {
    if (!settings?.id) return;
    setSaving(true);
    const { id, ...rest } = settings;
    const { error } = await supabase.from("site_settings").update(rest as never).eq("id", id as string);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Site settings saved — live on the website now");
  };

  if (!settings) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold">Header & Footer Settings</h3>
        </div>
        <Button onClick={save} disabled={saving} className="gap-1.5 bg-gradient-hero text-white">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SECTIONS.map((sec) => (
          <div key={sec.title} className="rounded-2xl border border-border bg-card p-5">
            <h4 className="mb-4 font-display text-sm font-semibold">{sec.title}</h4>
            <div className="space-y-3">
              {sec.fields.map((f) => (
                <div key={f.key}>
                  <Label className="text-xs">{f.label}</Label>
                  {f.long ? (
                    <Textarea
                      value={(settings[f.key] as string) ?? ""}
                      onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={(settings[f.key] as string) ?? ""}
                      onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                      className="mt-1"
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
