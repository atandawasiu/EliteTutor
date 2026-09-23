import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Loader2, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogComments } from "@/components/BlogComments";

type Post = {
  id: string; title: string; slug: string; content: string;
  excerpt: string | null; category: string | null; cover_url: string | null;
  tags: string[] | null; created_at: string; published: boolean;
};

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      setPost(data as Post | null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!post) return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-muted-foreground">Post not found.</p>
      <Link to="/blog" className="mt-4 inline-block text-sm text-primary hover:underline">← Back to blog</Link>
    </div>
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>

      {post.cover_url && (
        <div className="mb-6 aspect-video overflow-hidden rounded-2xl bg-secondary">
          <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mb-3 flex items-center gap-2">
        {post.category && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <Tag className="h-3 w-3" /> {post.category}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
      {post.excerpt && <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>}

      <div className="prose prose-sm mt-6 max-w-none whitespace-pre-wrap text-foreground">
        {post.content}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">#{t}</span>
          ))}
        </div>
      )}

      <BlogComments postId={post.id} />
    </article>
  );
}
