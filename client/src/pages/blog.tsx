import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import type { BlogPost } from "@shared/schema";
import { ArrowRight, Search, BookOpen } from "lucide-react";
import { BLOG_LIST_COPY, blogPostToListEntry, legacyBlogListEntries, type BlogListEntry } from "@shared/blog-list-copy";

function BlogCard({ post, index }: { post: BlogListEntry; index: number }) {
  const colors = BLOG_LIST_COPY.categoryColors[post.category] || BLOG_LIST_COPY.defaultCategoryColor;
  const accentBorder = BLOG_LIST_COPY.accentBorders[index % BLOG_LIST_COPY.accentBorders.length];

  return (
    <a href={post.url}>
      <article
        className={`group h-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 ${accentBorder} cursor-pointer`}
        data-testid={`blog-card-${index}`}
      >
        <div className="p-5 sm:p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
              {post.category}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
            {BLOG_LIST_COPY.readArticle}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </a>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(BLOG_LIST_COPY.allCategory);

  // The blog index is the same source of truth as /sitemap.xml — both pull
  // from `storage.getBlogPosts()`. This means publishing a post via the
  // seed file or the admin API makes it appear here automatically; no
  // hand-edit of this page is required.
  const { data: apiPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const allPosts = useMemo<BlogListEntry[]>(() => {
    const blogEntries = (apiPosts ?? []).map(blogPostToListEntry);
    // Prefer the real DB article on any duplicate final URL.
    const entriesByFinalUrl = new Map<string, BlogListEntry>();
    for (const entry of [...blogEntries, ...legacyBlogListEntries()]) {
      if (!entriesByFinalUrl.has(entry.url)) {
        entriesByFinalUrl.set(entry.url, entry);
      }
    }
    return Array.from(entriesByFinalUrl.values());
  }, [apiPosts]);

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map(p => p.category));
    return [BLOG_LIST_COPY.allCategory, ...Array.from(cats).sort()];
  }, [allPosts]);

  const filteredPosts = useMemo<BlogListEntry[]>(() => {
    return allPosts.filter(post => {
      const matchesSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === BLOG_LIST_COPY.allCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  return (
    <article className="pt-20 md:pt-24">
      <SEO
        title="Parenting Tips & Education Articles | Rainbow Preschool"
        description="Read the latest parenting tips, early education articles, and child development insights from Rainbow Preschool Thane. Expert advice for parents."
        keywords="preschool blog, parenting tips, early childhood education articles, child development tips, preschool preparation, rainbow preschool news"
        canonical="https://www.rainbowpreschools.com/blog"
      />

      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <BookOpen className="w-4 h-4" />
              {BLOG_LIST_COPY.eyebrow}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-heading">{BLOG_LIST_COPY.h1}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {BLOG_LIST_COPY.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={BLOG_LIST_COPY.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                data-testid="input-blog-search"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                  data-testid={`filter-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6" data-testid="text-blog-count">
            {isLoading
              ? BLOG_LIST_COPY.loading
              : BLOG_LIST_COPY.articleCountPattern
                .replace("{count}", String(filteredPosts.length))
                .replace("{plural}", filteredPosts.length === 1 ? "" : "s")}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="blog-loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse"
                />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post, i) => (
                <BlogCard key={post.url} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500 mb-2">{BLOG_LIST_COPY.noArticles}</p>
              <p className="text-sm text-gray-400">{BLOG_LIST_COPY.adjustSearch}</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(BLOG_LIST_COPY.allCategory); }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                {BLOG_LIST_COPY.clearFilters}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/blog"
          pageName="Rainbow Preschool Blog"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          showRating={false}
          schemaId="blog-eeat"
        />
      </section>

      <CTASection
        title={BLOG_LIST_COPY.ctaTitle}
        description={BLOG_LIST_COPY.ctaDescription}
      />
    </article>
  );
}
