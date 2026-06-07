"use client";

import React, { useState } from "react";
import Link from "next/link";
import { blogArticles } from "../../data/blogArticles";
import { Search, Calendar, Clock, ChevronRight } from "lucide-react";

export default function BlogListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electricity", "Gas", "Water", "Savings Tips"];

  const filteredArticles = blogArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Flowtix Utility Savings Blog
          </h1>
          <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 max-w-xl mx-auto leading-relaxed font-sans">
            In-depth guides, mathematical analyses, and conservation tips written by Vineet Singh to help you audit and optimize your home utility expenses.
          </p>
        </section>

        {/* Filter Controls Bar */}
        <section className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 border border-gray-250/60 dark:border-gray-805/60 p-4.5 rounded-3xl shadow-sm">
          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </section>

        {/* Blog Post Grid */}
        {filteredArticles.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5"
              >
                {/* Visual Category Label */}
                <div className="p-6 pb-2">
                  <span className="inline-block text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                    {article.category}
                  </span>
                </div>

                {/* Article Header & Excerpt */}
                <div className="px-6 flex-grow space-y-2.5">
                  <h2 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-500 transition-colors font-sans">
                    <Link href={`/blog/${article.slug}`} className="no-underline text-inherit">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>
                </div>

                {/* Article Footer details */}
                <div className="px-6 py-4.5 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5 hover:underline font-extrabold no-underline"
                  >
                    Read
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="py-20 text-center space-y-2">
            <p className="text-base font-bold text-gray-500 dark:text-gray-400">No articles matched your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              type="button"
              className="text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
