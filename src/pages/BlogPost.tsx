import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import { blogPosts } from "@/data/blogPosts";
import { useEffect } from "react";

const renderMarkdown = (content: string) => {
  return content
    .trim()
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("### "))
        return `<h3 class="text-lg sm:text-xl font-bold text-foreground mt-6 sm:mt-8 mb-3">${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith("## "))
        return `<h2 class="text-xl sm:text-2xl font-bold text-primary mt-8 sm:mt-10 mb-4">${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
        const items = trimmed.split("\n").map((line) => {
          const text = line.replace(/^[-\d]+[.)]\s*/, "");
          return `<li class="text-muted-foreground leading-relaxed">${boldify(text)}</li>`;
        });
        const tag = trimmed.startsWith("1.") ? "ol" : "ul";
        const cls = tag === "ol" ? "list-decimal" : "list-disc";
        return `<${tag} class="${cls} pl-5 sm:pl-6 my-4 space-y-2">${items.join("")}</${tag}>`;
      }
      return `<p class="text-sm sm:text-base text-muted-foreground leading-relaxed my-4">${boldify(trimmed)}</p>`;
    })
    .join("");
};

const boldify = (text: string) =>
  text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | WildScatter`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.metaDescription || post.excerpt);
    }
    return () => {
      document.title = "WildScatter – Best Crypto Casino Reviews";
    };
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-20">
        <article className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary font-semibold mb-6 sm:mb-8 hover:underline min-h-[44px] py-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 sm:mb-4 leading-snug">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-8 sm:mb-10">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}
          </div>

          <div
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline min-h-[44px] py-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
