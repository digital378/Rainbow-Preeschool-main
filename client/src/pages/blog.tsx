import { useState, useMemo } from "react";
import { Link } from "wouter";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { legacyPagesData } from "@shared/legacy-pages-data";
import { ArrowRight, Search, BookOpen } from "lucide-react";

interface BlogEntry {
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Education": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Parenting Tips": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  "Learning Activities": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Admissions": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Child Development": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "School Events": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "About": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
};

const DEFAULT_CATEGORY_COLOR = { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

const CATEGORY_NORMALIZE: Record<string, string> = {
  "About Rainbow": "About",
  "About Us": "About",
};

const ACCENT_BORDERS = [
  "border-l-red-500",
  "border-l-blue-500",
  "border-l-green-500",
  "border-l-amber-500",
  "border-l-purple-500",
  "border-l-pink-500",
  "border-l-orange-500",
  "border-l-teal-500",
];

const richBlogPosts: BlogEntry[] = [
  {
    title: "Republic Day 2026 in India: History, Significance, Parade, Speeches, Essays, Quotes, Images & Wishes",
    excerpt: "Celebrate India's 77th Republic Day 2026 with complete information on history, significance, parade highlights, speeches, essays, inspiring quotes, downloadable DP images, and heartfelt wishes.",
    url: "/blog/republic-day-2026",
    category: "School Events",
  },
  {
    title: "What To Ask During A Tour Of A Preschool In Thane: Complete Parent's Guide 2025",
    excerpt: "Visiting preschools honestly feels a bit like house-hunting. You step in, look around for a few seconds, and something inside you instantly says either 'hmm' or 'yes!'",
    url: "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
    category: "Education",
  },
  {
    title: "Understanding the Importance of Preschool in Early Childhood Development",
    excerpt: "The first few years of a child's life are filled with wonder moments, lots of Whys and Hows, and endless curiosity to discover new things.",
    url: "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
    category: "Education",
  },
  {
    title: "How Play-Based Learning Shapes Young Minds",
    excerpt: "Play is not just fun for children—it's essential for their cognitive, social, and emotional development. Learn how play-based learning nurtures growth.",
    url: "/blog/how-play-based-learning-shapes-young-minds",
    category: "Education",
  },
  {
    title: "Preparing Your Child for Their First Day at Preschool",
    excerpt: "Starting preschool is a big milestone. Here are practical tips to help both parents and children navigate the transition smoothly.",
    url: "/blog/preparing-your-child-for-first-day-preschool",
    category: "Parenting Tips",
  },
  {
    title: "The Role of Parents in Early Education",
    excerpt: "Parents are a child's first teachers. Discover how your involvement at home complements what children learn at preschool.",
    url: "/blog/role-of-parents-early-education",
    category: "Parenting Tips",
  },
  {
    title: "Creating a Safe and Nurturing Learning Environment",
    excerpt: "A child's learning environment significantly impacts their development. See how Rainbow Preschool ensures safety and warmth in every classroom.",
    url: "/blog/creating-safe-nurturing-learning-environment",
    category: "Education",
  },
];

function getAllBlogPosts(): BlogEntry[] {
  const legacyEntries: BlogEntry[] = Object.entries(legacyPagesData).map(([key, page]) => {
    const cleanSlug = key.replace(/\/$/, "").replace(/^\//, "");
    return {
      title: page.h1 || page.title.split("|")[0].trim(),
      excerpt: page.metaDescription,
      url: `/${cleanSlug}`,
      category: CATEGORY_NORMALIZE[page.category || ""] || page.category || "Education",
    };
  });

  return [...richBlogPosts, ...legacyEntries];
}

function BlogCard({ post, index }: { post: BlogEntry; index: number }) {
  const colors = CATEGORY_COLORS[post.category] || DEFAULT_CATEGORY_COLOR;
  const accentBorder = ACCENT_BORDERS[index % ACCENT_BORDERS.length];

  return (
    <Link href={post.url}>
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
            Read Article
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const allPosts = useMemo(() => getAllBlogPosts(), []);

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map(p => p.category));
    return ["All", ...Array.from(cats).sort()];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Blogs | Parenting Tips & Early Education Articles | Rainbow Preschool"
        description="Read the latest parenting tips, early education articles, and child development insights from Rainbow Preschool Thane. Expert advice for parents."
        keywords="preschool blog, parenting tips, early childhood education articles, child development tips, preschool preparation, rainbow preschool news"
        canonical="https://www.rainbowpreschools.com/blog"
      />

      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <BookOpen className="w-4 h-4" />
              Our Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-heading">Rainbow Preschool Blog</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Parenting tips, learning activities, child development insights, and updates from Rainbow Preschool.
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
                placeholder="Search articles..."
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
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
          </p>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post, i) => (
                <BlogCard key={post.url} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500 mb-2">No articles found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filter.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Want to Learn More?"
        description="Subscribe to our newsletter for the latest updates and parenting tips."
      />
    </div>
  );
}
