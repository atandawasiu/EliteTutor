import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ContentBlock = {
  id: string;
  block_key: string;
  block_type: string;
  page_slug: string;
  title: string;
  subtitle: string;
  body: string;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  icon: string | null;
  sort_order: number;
  visible: boolean;
};

export function useContentBlocks(page_slug = "home", block_type?: string) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const load = async () => {
    let q = supabase.from("content_blocks").select("*").eq("page_slug", page_slug).eq("visible", true).order("sort_order");
    if (block_type) q = q.eq("block_type", block_type);
    const { data } = await q;
    setBlocks((data ?? []) as ContentBlock[]);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`content-blocks-${page_slug}-${block_type ?? "all"}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_blocks" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page_slug, block_type]);

  return blocks;
}
