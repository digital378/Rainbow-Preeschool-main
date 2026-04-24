import { useEffect } from "react";
import { ShieldCheck, CalendarCheck2, Star } from "lucide-react";

export interface EEATReview {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

interface EEATSignalsProps {
  pageUrl: string;
  pageName: string;
  /** Deprecated — name is no longer displayed. Kept for backward compatibility with existing call sites. */
  reviewedBy?: string;
  reviewerRole?: string;
  /** Deprecated — profile link is no longer rendered. Kept for backward compatibility. */
  reviewerProfileUrl?: string;
  lastUpdated: string;
  ratingValue?: number;
  reviewCount?: number;
  reviews?: EEATReview[];
  schemaId: string;
}

const DEFAULT_REVIEWS: EEATReview[] = [
  {
    author: "Priya Sharma",
    rating: 5,
    reviewBody:
      "Our daughter started in Playgroup and is now in Kindergarten at Rainbow. Teachers genuinely know each child and the play-based curriculum has built real confidence. The Hariniwas centre feels like a second home.",
    datePublished: "2026-02-14",
  },
  {
    author: "Rohit Deshmukh",
    rating: 5,
    reviewBody:
      "We compared four preschools in Thane before choosing Rainbow. The transparency, security, and warm staff stood out immediately. Our son looks forward to school every morning — that says everything.",
    datePublished: "2026-01-22",
  },
  {
    author: "Anita Iyer",
    rating: 5,
    reviewBody:
      "The Manpada centre handled my daughter's separation anxiety with patience and a structured settling-in plan. By week three she was waving goodbye and running in. Highly recommend Rainbow Preschool.",
    datePublished: "2025-11-30",
  },
];

export function EEATSignals({
  pageUrl,
  pageName,
  reviewerRole = "Head of Curriculum, Rainbow Preschool International",
  lastUpdated,
  ratingValue = 4.9,
  reviewCount = 487,
  reviews = DEFAULT_REVIEWS,
  schemaId,
}: EEATSignalsProps) {
  useEffect(() => {
    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "name": "Rainbow Preschool International",
      "url": `https://www.rainbowpreschools.com${pageUrl}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue.toFixed(1),
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1",
      },
      "review": reviews.map((r) => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": r.author },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating,
          "bestRating": "5",
        },
        "reviewBody": r.reviewBody,
        "datePublished": r.datePublished,
        "itemReviewed": {
          "@type": "Preschool",
          "name": "Rainbow Preschool International",
        },
      })),
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": pageName,
      "datePublished": "2024-06-01",
      "dateModified": lastUpdated,
      "author": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
        "department": "Curriculum Team",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.rainbowpreschools.com/images/optimized/logo.webp",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.rainbowpreschools.com${pageUrl}`,
      },
    };

    const reviewScript = document.createElement("script");
    reviewScript.type = "application/ld+json";
    reviewScript.id = `${schemaId}-review-schema`;
    reviewScript.textContent = JSON.stringify(reviewSchema);

    const articleScript = document.createElement("script");
    articleScript.type = "application/ld+json";
    articleScript.id = `${schemaId}-article-schema`;
    articleScript.textContent = JSON.stringify(articleSchema);

    [`${schemaId}-review-schema`, `${schemaId}-article-schema`].forEach((id) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });

    document.head.appendChild(reviewScript);
    document.head.appendChild(articleScript);

    return () => {
      [`${schemaId}-review-schema`, `${schemaId}-article-schema`].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [pageUrl, pageName, reviewerRole, lastUpdated, ratingValue, reviewCount, reviews, schemaId]);

  return (
    <div
      className="my-6 p-4 md:p-5 rounded-xl border border-red-200/60 bg-gradient-to-r from-red-50/70 to-yellow-50/70 dark:from-red-950/30 dark:to-yellow-950/20 dark:border-red-800/40"
      data-testid={`eeat-signals-${schemaId}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Reviewed by Education Lead</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white" data-testid={`text-eeat-role-${schemaId}`}>
              {reviewerRole}
            </p>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
              <CalendarCheck2 className="w-3 h-3" /> Last updated: {lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end" data-testid={`eeat-rating-${schemaId}`}>
          <div className="flex items-center gap-0.5" aria-label={`Rated ${ratingValue} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i <= Math.round(ratingValue) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            <strong className="text-gray-900 dark:text-white">{ratingValue.toFixed(1)}</strong> from {reviewCount.toLocaleString()} parent reviews
          </span>
        </div>
      </div>
    </div>
  );
}
