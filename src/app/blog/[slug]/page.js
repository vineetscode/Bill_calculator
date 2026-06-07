import React from "react";
import Link from "next/link";
import { blogArticles } from "../../../data/blogArticles";
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from "lucide-react";

// Generate static params for all articles
export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata dynamically per article for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) {
    return {
      title: "Article Not Found | Flowtix",
    };
  }
  return {
    title: `${article.title} | Flowtix Savings Blog`,
    description: article.excerpt,
  };
}

// Custom Markdown Parser to avoid heavy dependency libraries
function renderMarkdown(content) {
  if (!content) return null;
  
  return content.split("\n\n").map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Heading 2
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mt-8 mb-4 font-sans border-b border-gray-100 dark:border-gray-800 pb-2">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3 font-sans">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }

    // Code Block
    if (trimmed.startsWith("```")) {
      const code = trimmed.replace(/```/g, "").trim();
      return (
        <pre key={i} className="bg-gray-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 md:p-5 font-mono text-[10px] md:text-xs text-gray-700 dark:text-gray-300 overflow-x-auto leading-relaxed my-6 shadow-inner text-left">
          {code}
        </pre>
      );
    }

    // Unordered List
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.includes("\n• ") || trimmed.includes("\n- ")) {
      return (
        <ul key={i} className="list-disc pl-6 my-4 space-y-2 text-left">
          {trimmed.split("\n").map((li, j) => {
            const cleanLi = li.replace(/^[•-]\s*/, "").trim();
            
            // Check for inline **bold** inside list item
            const parts = cleanLi.split(/(\*\*.*?\*\*)/g);
            const liElements = parts.map((part, k) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={k} className="font-extrabold text-gray-900 dark:text-white">
                    {part.replace(/\*\n/g, "").replace(/\*\*/g, "")}
                  </strong>
                );
              }
              return part;
            });

            return (
              <li key={j} className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {liElements}
              </li>
            );
          })}
        </ul>
      );
    }

    // Divider
    if (trimmed === "---") {
      return <hr key={i} className="border-gray-250/50 dark:border-gray-800/80 my-8" />;
    }

    // Normal Paragraph with **bold** parser
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    const contentElements = parts.map((part, k) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={k} className="font-extrabold text-gray-900 dark:text-white">
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }
      return part;
    });

    return (
      <p key={i} className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-left font-sans">
        {contentElements}
      </p>
    );
  });
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <Link href="/blog" className="text-sm font-bold text-emerald-500 hover:underline">
          Back to Blog List
        </Link>
      </div>
    );
  }

  // Find related articles (same category, excluding current)
  const relatedArticles = blogArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div className="text-left print:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Savings Blog
          </Link>
        </div>

        {/* Article Meta */}
        <header className="text-left space-y-4 border-b border-gray-200/50 dark:border-gray-800/50 pb-6">
          <span className="inline-block text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            {article.title}
          </h1>
          
          <div className="flex gap-4 items-center text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Vineet Singh
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose dark:prose-invert max-w-none">
          {renderMarkdown(article.content)}
        </article>

        {/* E-E-A-T Author Bio Section */}
        <section className="mt-12 p-6 md:p-8 rounded-3xl bg-gray-50 dark:bg-gray-950/25 border border-gray-150 dark:border-gray-805 flex flex-col sm:flex-row items-center gap-6 print:hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-black shrink-0 border border-emerald-200 dark:border-emerald-900/20 select-none">
            VS
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Vineet Singh</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
              Vineet Singh is our Lead Utility Research Analyst. He compiles and audits rate tables, structural equations, and savings tips across the site. Vineet holds a background in energy efficiency auditing and utility billing analysis.
            </p>
          </div>
        </section>

        {/* Related Posts */}
        {relatedArticles.length > 0 && (
          <section className="pt-8 border-t border-gray-200/50 dark:border-gray-800/50 space-y-4 text-left print:hidden">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white font-sans">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.slug}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 space-y-2.5"
                >
                  <span className="text-[9px] font-extrabold uppercase text-emerald-500 tracking-wider">
                    {rel.category}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug hover:text-emerald-500 font-sans">
                    <Link href={`/blog/${rel.slug}`} className="no-underline text-inherit">
                      {rel.title}
                    </Link>
                  </h4>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-[10px] font-extrabold text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5 no-underline"
                  >
                    Read Article
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
