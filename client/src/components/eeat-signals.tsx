import { useEffect } from "react";
import { ShieldCheck, CalendarCheck2, Star } from "lucide-react";

interface EEATSignalsProps {
  pageUrl: string;
  pageName: string;
  /** Reviewer display name. Must be one of the approved org labels. Emitted as an Organization `reviewedBy` in the Article schema. */
  reviewedBy?: string;
  reviewerRole?: string;
  /** Short comma-separated credentials line. */
  reviewerCredentials?: string;
  /** Optional 1-2 sentence biography rendered under the reviewer block. */
  reviewerBio?: string;
  /** Optional public profile link for the reviewer. */
  reviewerProfileUrl?: string;
  /** Optional named author surfaced into the Article schema as an Organization. Must be one of the approved org labels. */
  authorName?: string;
  authorRole?: string;
  authorCredentials?: string;
  lastUpdated: string;
  /** ISO-8601 date string used for the Article JSON-LD `dateModified`. Falls back to `lastUpdated` for backwards compatibility, but callers should pass an ISO date when possible. */
  lastUpdatedIso?: string;
  ratingValue?: number;
  reviewCount?: number;
  /** When false, suppresses the star/rating display and the AggregateRating JSON-LD block. */
  showRating?: boolean;
  schemaId: string;
}

export function EEATSignals({
  pageUrl,
  pageName,
  reviewedBy = "Rainbow Preschool Curriculum Team",
  reviewerRole = "Curriculum Team, Rainbow Preschool International",
  reviewerCredentials,
  reviewerBio,
  reviewerProfileUrl,
  authorName,
  authorRole,
  authorCredentials,
  lastUpdated,
  lastUpdatedIso,
  ratingValue = 4.9,
  reviewCount = 487,
  showRating = true,
  schemaId,
}: EEATSignalsProps) {
  // AUDIT-206: Retained — SSR bot-ssr.ts emits a generic Article (no reviewedBy)
  // and the org-level AggregateRating only. This useEffect adds the `reviewedBy`
  // E-E-A-T signal (unique per page) and a page-specific AggregateRating node.
  // Remove once SSR blog-post structuredData entries include Article + reviewedBy.
  useEffect(() => {
    // AggregateRating only; no per-Review nodes.
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
    };

    // Author / reviewer always emitted as Organization, never Person.
    const articleAuthor = authorName
      ? {
          "@type": "Organization",
          "name": authorName,
          ...(authorName !== "Rainbow Preschool International"
            ? {
                "parentOrganization": {
                  "@type": "Organization",
                  "name": "Rainbow Preschool International",
                },
              }
            : {}),
        }
      : {
          "@type": "Organization",
          "name": "Rainbow Preschool International",
          "department": "Curriculum Team",
        };

    const articleReviewer = reviewedBy
      ? {
          "@type": "Organization",
          "name": reviewedBy,
          ...(reviewerProfileUrl ? { "url": reviewerProfileUrl } : {}),
          ...(reviewedBy !== "Rainbow Preschool International"
            ? {
                "parentOrganization": {
                  "@type": "Organization",
                  "name": "Rainbow Preschool International",
                },
              }
            : {}),
        }
      : null;

    const articleSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": pageName,
      "datePublished": "2024-06-01",
      "dateModified": lastUpdatedIso ?? lastUpdated,
      "author": articleAuthor,
      ...(articleReviewer ? { "reviewedBy": articleReviewer } : {}),
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

    const articleScript = document.createElement("script");
    articleScript.type = "application/ld+json";
    articleScript.id = `${schemaId}-article-schema`;
    articleScript.textContent = JSON.stringify(articleSchema);

    [`${schemaId}-review-schema`, `${schemaId}-article-schema`].forEach((id) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });

    if (showRating) {
      const reviewScript = document.createElement("script");
      reviewScript.type = "application/ld+json";
      reviewScript.id = `${schemaId}-review-schema`;
      reviewScript.textContent = JSON.stringify(reviewSchema);
      document.head.appendChild(reviewScript);
    }
    document.head.appendChild(articleScript);

    return () => {
      [`${schemaId}-review-schema`, `${schemaId}-article-schema`].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [pageUrl, pageName, reviewedBy, reviewerRole, reviewerCredentials, reviewerProfileUrl, authorName, authorRole, authorCredentials, lastUpdated, lastUpdatedIso, ratingValue, reviewCount, showRating, schemaId]);

  const reviewerEyebrow = "Reviewed by";

  return (
    <div
      className="my-6 p-4 md:p-5 rounded-xl border border-red-200/60 bg-gradient-to-r from-red-50/70 to-yellow-50/70 dark:from-red-950/30 dark:to-yellow-950/20 dark:border-red-800/40"
      data-testid={`eeat-signals-${schemaId}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{reviewerEyebrow}</p>
            {reviewedBy ? (
              <p className="text-sm font-semibold text-gray-900 dark:text-white" data-testid={`text-eeat-reviewer-${schemaId}`}>
                {reviewedBy}
                {reviewerCredentials ? (
                  <span className="font-normal text-muted-foreground"> — {reviewerCredentials}</span>
                ) : null}
              </p>
            ) : null}
            <p
              className={`${reviewedBy ? "text-xs text-muted-foreground" : "text-sm font-semibold text-gray-900 dark:text-white"}`}
              data-testid={`text-eeat-role-${schemaId}`}
            >
              {reviewerRole}
            </p>
            {reviewerBio ? (
              <p className="text-xs text-muted-foreground mt-1 max-w-md" data-testid={`text-eeat-bio-${schemaId}`}>
                {reviewerBio}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
              <CalendarCheck2 className="w-3 h-3" /> Last updated: {lastUpdated}
            </p>
          </div>
        </div>
        {showRating && (
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
        )}
      </div>
    </div>
  );
}
