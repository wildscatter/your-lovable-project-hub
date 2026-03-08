import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          <span className="text-primary">Blog</span> & Guides
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Expert insights, casino reviews, and crypto gambling strategies.
        </p>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Blog;
