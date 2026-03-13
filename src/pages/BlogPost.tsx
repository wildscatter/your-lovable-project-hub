import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import { blogPosts } from "@/data/blogPosts";
import SEOHead from "@/components/SEOHead";

const linkify = (text: string) =>
  text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer nofollow sponsored" class="text-primary font-semibold hover:underline">$1</a>'
  );

const boldify = (text: string) =>
  linkify(text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>'));

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author || "WildScatter Team"
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "publisher": {
      "@type": "Organization",
      "name": "WildScatter"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | WildScatter`}
        description={post.metaDescription || post.excerpt}
        canonical={`https://wildscatter.com/blog/${post.slug}`}
        jsonLd={articleJsonLd}
      />
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

          {/* Author Bio */}
          {post.author && post.authorBio && (
            <div className="mt-10 sm:mt-12 rounded-xl border border-border bg-card p-5 sm:p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground mb-1">About {post.author}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.authorBio}</p>
              </div>
            </div>
          )}

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
