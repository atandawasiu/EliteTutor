import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MenuLink = {
  id: string;
  label: string;
  description: string;
  icon: string;
  url: string;
  sort_order: number;
  visible: boolean;
};

export type MenuSection = {
  id: string;
  label: string;
  icon: string;
  sort_order: number;
  visible: boolean;
  links: MenuLink[];
};

export function useSiteMenu() {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: secs }, { data: links }] = await Promise.all([
      supabase.from("site_menu_sections").select("*").eq("visible", true).order("sort_order"),
      supabase.from("site_menu_links").select("*").eq("visible", true).order("sort_order"),
    ]);

    const secArr = (secs ?? []) as Array<{
      id: string; label: string; icon: string; sort_order: number; visible: boolean;
    }>;
    const linkArr = (links ?? []) as Array<{
      id: string; section_id: string; label: string; description: string;
      icon: string; url: string; sort_order: number; visible: boolean;
    }>;

    const merged: MenuSection[] = secArr.map((s) => ({
      ...s,
      links: linkArr
        .filter((l) => l.section_id === s.id)
        .map(({ id, label, description, icon, url, sort_order, visible }) => ({
          id, label, description, icon, url, sort_order, visible,
        })),
    }));

    setSections(merged);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`site-menu-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_menu_sections" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_menu_links" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return { sections, loading };
}
