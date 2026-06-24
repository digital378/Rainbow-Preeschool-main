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
  pageUrl: _pageUrl,
  pageName: _pageName,
  reviewedBy = "Rainbow Preschool Curriculum Team",
  reviewerRole = "Curriculum Team, Rainbow Preschool International",
  reviewerCredentials,
  reviewerBio,
  reviewerProfileUrl: _reviewerProfileUrl,
  authorName: _authorName,
  authorRole: _authorRole,
  authorCredentials: _authorCredentials,
  lastUpdated,
  lastUpdatedIso: _lastUpdatedIso,
  ratingValue = 4.9,
  reviewCount = 487,
  showRating = true,
  schemaId,
}: EEATSignalsProps) {
  // Schema injection removed — Task #212.
  // Article with reviewedBy + Preschool/AggregateRating are now emitted by
  // server/bot-ssr.ts for all pages that have `lastModified` in their SSR entry,
  // so bots receive them without executing JavaScript.
  // This component is now UI-only: it renders the visible E-E-A-T strip
  // (reviewer byline, date, star rating) but no longer touches the DOM schema.

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
