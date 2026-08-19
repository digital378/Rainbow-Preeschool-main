# Keyword-overlap tracking across page audits

## Why this exists

Page-level audits (e.g. the getveritas.io Page Audit tool's "Query alignment"
and "Search queries" panels) surface real Google Search Console data: search
terms a page already ranks for, whether that term shows up in its title/H1,
and its position/impressions. Run one page's audit at a time and each report
looks self-contained — but the same or a near-identical search term can quietly
show up on more than one page's report over separate audit sessions. That's
cannibalization forming in real time, and without a shared record it's only
ever caught by chance.

This directory is that shared record. `keyword-overlap-log.json` accumulates
what each audited page ranks for, and `scripts/check-keyword-overlap.ts`
diffs it against itself and against the existing keyword-ownership matrix
(the same one `scripts/check-no-title-cannibalisation.ts` and
`scripts/check-body-copy-cannibalisation.ts` already enforce for titles and
body copy) to flag genuine overlap candidates for a human to review.

This is **detection only**. Nothing here rewrites a title, H1, or paragraph
automatically, and nothing here calls the Search Console API — data only
enters the log when a human supplies a fresh audit.

## Recording a new page's audit

1. Run the page audit and open its query-level data (query-alignment panel,
   search-queries panel, or equivalent).
2. Add or extend the page's entry in `keyword-overlap-log.json`:
   - One object per **page** (`url`), containing an `audits` array.
   - One object per **audit run** (`date`, `source`, `queries`).
   - One object per **query row** (`query`, `position`, `impressions`).
3. For every query row, decide `excludeFromOverlap`:
   - `true` when the query is a **brand name / brand-qualified navigational
     search** (e.g. "rainbow preschool", "rainbow school near me"), a
     **person's name** or other coincidental one-off match, or a clearly
     **mis-tokenized** one-impression query that doesn't represent a real
     recurring search intent.
   - `false` (or omit — it defaults to counted) for **generic commercial or
     locational intent** — the kind of phrase a second page could plausibly
     also try to rank for.
   - Always add `excludeReason` when excluding a row, so a future reviewer
     can see why without re-deriving the judgment call.
   - This judgment call is manual by design — the noise here is precisely
     the kind (proper nouns, tokenization artifacts) that a simple script
     cannot reliably distinguish from a real keyword automatically.
4. Never overwrite a prior audit's query rows to "correct" them — append a
   new `audits` entry with a new `date` instead, so the log preserves how a
   page's ranking picture changed over time.
5. Re-run the detector:
   ```
   npx tsx scripts/check-keyword-overlap.ts
   ```

## What the detector looks for

`scripts/check-keyword-overlap.ts` reads every non-excluded query row across
every page and reports three kinds of signal, weakest evidence last:

1. **Owned-phrase mismatch** — a query recorded on page A exactly matches a
   reserved phrase from the keyword-ownership matrix (mirrored from
   `check-no-title-cannibalisation.ts`) whose canonical owner is a
   *different* URL. This is the strongest signal: the page is already
   ranking for a phrase another page is supposed to own.
2. **Exact cross-page duplicate** — the same normalized query appears against
   2+ distinct page URLs anywhere in the log, even if neither is in the
   owned-phrase matrix yet (i.e. an *emerging* conflict over an unowned
   phrase).
3. **Near-duplicate candidate** — two queries share ≥50% of their significant
   words (stopwords like "in"/"near"/"me"/"school" removed) — e.g. "pre
   school near me" vs "play school near me", or "preschool in thane" vs
   "preschool in thane west". Always reported for human judgment, never
   treated as a confirmed conflict on its own — some near-duplicates are
   genuinely different intents (a city-wide phrase vs. a specific locality
   variant that deserves its own page).

The script is a **reporting tool**, not a CI guard: it always exits 0 and is
not wired into pre-commit/pre-push/predeploy, because its input (fresh audit
data) only changes when a human supplies it — there's nothing to gate a
commit on. Run it manually whenever the log gains a new entry, or whenever
you're about to add a new page's title/H1 and want to sanity-check it doesn't
already show up as competing for an existing owned phrase.

## Corrective playbook — once a genuine overlap is found

Not every flagged row needs action. Use impressions and position as your
severity gate:

- **Low severity (log and move on):** very low impressions (roughly <5) and a
  poor position (roughly >50) on the non-canonical page. This is background
  noise Google hasn't meaningfully associated with the wrong page yet —
  no title/H1/content change needed, just keep it in the log so a future
  audit can tell if it's growing.
- **Escalate (needs a decision):** the non-canonical page has a real position
  (top 20) and/or non-trivial impressions for a phrase another page owns, or
  the same unowned phrase is trending across 2+ pages' audits over time.

When escalating, choose one of two fixes — same two options the body-copy
guard already documents for literal phrase reuse:

1. **Differentiate.** Keep both pages, but make their targeting distinct:
   - Ensure the non-canonical page's title/H1/body copy do *not* contain the
     literal owned phrase (the title and body-copy cannibalisation guards
     will catch a regression here automatically).
   - Add an internal link from the non-canonical page to the canonical page
     near the topic that triggered the overlap, so both the user and Google
     see which page is the intended destination for that intent.
   - Prefer this when the two pages serve genuinely different sub-intents
     (e.g. the homepage brand-overview vs. `/kindergarten`'s program-specific
     page) and can coexist once their targeting is clearly separated.
2. **Consolidate.** If neither page can realistically differentiate — both
   are trying to serve the *identical* search intent — merge them: fold the
   weaker page's unique content into the canonical page and 301-redirect the
   old URL. This mirrors the existing `/playgroup-in-thane` → `/playgroup`
   redirect already in the codebase (see the comment in
   `scripts/check-no-title-cannibalisation.ts`'s ownership matrix) — the
   precedent to follow when a duplicate URL is retired in favor of one
   canonical target.

For an **unowned** phrase that starts appearing on 2+ pages' audits (the
"exact cross-page duplicate" or a promoted near-duplicate), decide whether it
deserves its own canonical entry:

- If it maps to an existing content gap the project already plans to fill
  (for example, a locality query like "preschool near kalwa" lining up with a
  planned Kalwa landing page), that's supporting evidence for the existing
  plan — no new phrase-ownership rule needed yet, just note it as validation
  once that page ships.
- If it's a genuinely new phrase worth owning outright, add it to the
  `OWNED_PHRASES`/`OWNED_PHRASES` matrices in
  `scripts/check-no-title-cannibalisation.ts` and
  `scripts/check-body-copy-cannibalisation.ts` (and this script's mirrored
  copy) once you've picked its canonical URL, so future title/body-copy
  changes are protected the same way the existing phrases are.

## Current baseline (2026-08-19)

The homepage (`/`) is the first page logged. The detector currently flags:

- **Owned-phrase mismatch:** the homepage ranks (position ~61, 2 impressions)
  for "kindergarten in thane", which the matrix assigns to `/kindergarten`.
  Low severity today (poor position, low impressions) — logged for
  monitoring, no action needed yet. Re-check next time either page is
  audited; escalate per the rules above if it climbs.
- **Near-duplicate candidates:** "pre school near me" vs "pre school in
  thane", and "preschool in thane" vs "preschool in thane west" — both
  informational, reflecting that the homepage picks up some locality-flavored
  long-tail queries (Thane West) that a future locality landing page could
  more precisely target.

Add the next page's audit data to `keyword-overlap-log.json` and re-run the
script to extend this baseline.
