import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  brand_name: string;
  tagline: string;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_linkedin: string | null;
  social_whatsapp: string | null;
  footer_about: string;
  copyright_text: string;
  legal_tagline: string;
  header_announcement: string | null;
};

export type FooterLink = {
  id: string;
  column_title: string;
  label: string;
  url: string;
  sort_order: number;
  visible: boolean;
};

const DEFAULTS: SiteSettings = {
  id: "",
  brand_name: "Elite Tutor",
  tagline: "Africa's leading exam prep platform",
  logo_url: null,
  contact_email: "hello@elitetutor.ng",
  contact_phone: "+234 800 000 0000",
  contact_address: "Lagos, Nigeria",
  social_facebook: "",
  social_twitter: "",
  social_instagram: "",
  social_youtube: "",
  social_linkedin: "",
  social_whatsapp: "",
  footer_about: "Africa's leading exam prep platform.",
  copyright_text: "© Elite Tutor. All rights reserved.",
  legal_tagline: "Made with ❤️ for African students.",
  header_announcement: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  const load = async () => {
    const [{ data: s }, { data: f }] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.from("footer_links").select("*").eq("visible", true).order("sort_order"),
    ]);
    if (s) {
      const row = s as SiteSettings;
      // Migrate legacy brand name
      if (row.brand_name === "MyPrep") row.brand_name = "Elite Tutor";
      if (row.copyright_text?.includes("MyPrep"))
        row.copyright_text = row.copyright_text.replace(/MyPrep/g, "Elite Tutor");
      setSettings({ ...DEFAULTS, ...row });
    }
    setFooterLinks((f ?? []) as FooterLink[]);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel(`site-settings-stream-${Math.random().toString(36).slice(2)}`);
    ch.on("postgres_changes" as never, { event: "*", schema: "public", table: "site_settings" }, load)
      .on("postgres_changes" as never, { event: "*", schema: "public", table: "footer_links" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return { settings, footerLinks };
}
