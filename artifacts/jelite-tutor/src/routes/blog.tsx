import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_url: string | null;
  created_at: string;
};

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, category, cover_url, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`blog-public-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">Latest exam news, study tips, and admission updates.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No published posts yet. Check back soon!</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">← Back home</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-card-hover"
            >
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
                {post.cover_url && (
                  <div className="aspect-video w-full overflow-hidden bg-secondary">
                    <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <Tag className="h-3 w-3" /> {post.category ?? "general"}
                    </span>
                  </div>
                  <h2 className="font-display text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.created_at).toLocaleDateString()}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
