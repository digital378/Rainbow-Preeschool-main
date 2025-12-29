import { useQuery } from "@tanstack/react-query";
import { BlogCard, BlogCardSkeleton } from "@/components/blog-card";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { type BlogPost } from "@shared/schema";

const defaultBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "What To Ask During A Tour Of A Preschool In Thane",
    slug: "what-to-ask-during-a-tour-of-a-preschool-in-thane",
    excerpt: "Visiting preschools honestly feels a bit like house-hunting. You step in, look around for a few seconds, and something inside you instantly says either 'hmm' or 'yes!'",
    content: "",
    imageUrl: null,
    publishedAt: new Date("2025-11-15"),
    isPublished: true,
  },
  {
    id: "2",
    title: "Understanding the Importance of Preschool in Early Childhood Development",
    slug: "understanding-the-importance-of-preschool-in-early-childhood-development",
    excerpt: "The first few years of a child's life are filled with wonder moments, lots of Whys and Hows, and endless curiosity to discover new things.",
    content: "",
    imageUrl: null,
    publishedAt: new Date("2025-10-20"),
    isPublished: true,
  },
  {
    id: "3",
    title: "How Play-Based Learning Shapes Young Minds",
    slug: "how-play-based-learning-shapes-young-minds",
    excerpt: "Play is not just fun for children—it's essential for their cognitive, social, and emotional development. Learn how play-based learning at Rainbow Preschool nurtures growth.",
    content: "",
    imageUrl: null,
    publishedAt: new Date("2025-09-10"),
    isPublished: true,
  },
  {
    id: "4",
    title: "Preparing Your Child for Their First Day at Preschool",
    slug: "preparing-your-child-for-first-day-preschool",
    excerpt: "Starting preschool is a big milestone. Here are practical tips to help both parents and children navigate the transition smoothly.",
    content: "",
    imageUrl: null,
    publishedAt: new Date("2025-08-05"),
    isPublished: true,
  },
  {
    id: "5",
    title: "The Role of Parents in Early Education",
    slug: "role-of-parents-early-education",
    excerpt: "Parents are a child's first teachers. Discover how your involvement at home complements what children learn at preschool.",
    content: "",
    imageUrl: null,
    publishedAt: new Date("2025-07-22"),
    isPublished: true,
  },
  {
    id: "6",
    title: "Creating a Safe and Nurturing Learning Environment",
    slug: "creating-safe-nurturing-learning-environment",
    excerpt: "A child's learning environment significantly impacts their development. See how Rainbow Preschool ensures safety and warmth in every classroom.",
    content: "",
    imageUrl: null,
    publishedAt: new Date("2025-06-18"),
    isPublished: true,
  },
];

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const displayPosts = posts?.length ? posts : defaultBlogPosts;

  return (
    <div className="pt-20">
      <SEO
        title="Blog & News - Rainbow Preschool International | Parenting Tips & Updates"
        description="Read the latest news, parenting tips & early education articles from Rainbow Preschool Thane. Expert advice on child development, preschool preparation & learning activities."
        keywords="preschool blog, parenting tips, early childhood education articles, child development tips, preschool preparation, rainbow preschool news, how to choose preschool, preschool activities for kids, child learning tips, first day of school tips, toddler learning activities, parenting advice, school readiness"
        canonical="https://rainbowpreschools.com/blog"
      />
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">News & Blog</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Latest Updates & Articles</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get all the latest news, fun facts, education-related articles, and much more!
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
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
