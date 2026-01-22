import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { type BlogPost } from "@shared/schema";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.publishedAt 
    ? format(new Date(post.publishedAt), "MMM dd, yyyy")
    : "Recent";

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card 
        className="group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
        data-testid={`card-blog-${post.slug}`}
      >
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={400}
              height={225}
            />
          </div>
        )}
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Education
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-primary pt-2">
            Read More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Placeholder blog card for loading state
export function BlogCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-5 bg-muted rounded animate-pulse" />
          <div className="w-20 h-4 bg-muted rounded animate-pulse" />
        </div>
        <div className="w-full h-6 bg-muted rounded animate-pulse" />
        <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
        <div className="w-1/2 h-4 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
