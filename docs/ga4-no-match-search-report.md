# GA4 Report: Underserved Area Searches (no-match centre searches)

## What this is

Every time a parent types 3+ characters into the nav centre search box, the site fires a
`nav_centre_search` GA4 event. The event includes:

| Parameter     | Values                         | Meaning                                              |
|---------------|--------------------------------|------------------------------------------------------|
| `search_term` | e.g. `"kolshet"`, `"kalwa"`   | What the parent typed                                |
| `has_match`   | `true` / `false`               | Whether a Rainbow centre matched that search         |
| `context`     | `"desktop"` / `"mobile"`      | Which nav variant triggered the search               |
| `page_path`   | e.g. `"/playgroup"`            | Page the parent was on when they searched            |

When `has_match` is `false`, no Rainbow centre covers that locality — these are the **underserved
areas** worth monitoring for new-centre decisions and locality landing pages.

The tracking code lives in `client/src/lib/analytics.ts` → `trackNavCentreSearch()`.

---

## Step 1 — Create a custom dimension for `has_match`

GA4 does not automatically make custom event parameters available in reports; you must register
them as custom dimensions first.

1. Open **GA4** → **Admin** (bottom-left gear icon)
2. Under **Property**, click **Custom definitions**
3. Click **Create custom dimensions**
4. Fill in:
   - **Dimension name**: `Has Match`
   - **Scope**: `Event`
   - **Description**: `Whether a nav centre search returned at least one matching centre`
   - **Event parameter**: `has_match`
5. Click **Save**

Repeat for the optional `context` dimension (useful for desktop vs. mobile breakdown):
   - **Dimension name**: `Search Context`
   - **Scope**: `Event`
   - **Event parameter**: `context`

> **Note**: Custom dimensions only apply to data collected *after* they are created. Historical
> events already in GA4 will not back-fill, but the raw event data is still queryable in
> Explorations using the parameter name directly.

---

## Step 2 — Build an Exploration report (Free-form)

1. In GA4, click **Explore** in the left sidebar
2. Click **Blank** to start a new exploration
3. Name it: **Underserved Area Searches**

### Variables panel (left column)

**Segments** — add a segment to filter to no-match searches:
1. Click **+** next to Segments → **Create new segment** → **Event segment**
2. Condition: `Event name` exactly matches `nav_centre_search`
3. Add condition: `has_match` exactly matches `false`
   *(If `has_match` is not in the dropdown yet, type it manually as a custom event parameter)*
4. Name the segment **No-Match Searches** and save

**Dimensions** — click **+** next to Dimensions and add:
- `Event name` (to confirm only `nav_centre_search` events appear)
- `Search term` (event-scoped — this is the built-in GA4 `search_term` parameter)
- `Has Match` (the custom dimension you created in Step 1)
- `Search Context` (optional — the custom dimension for desktop/mobile)
- `Page path` (to see which pages trigger no-match searches)

**Metrics** — click **+** next to Metrics and add:
- `Event count`
- `Total users`

### Settings panel (right column)

- **Technique**: Free form
- **Rows**: `Search term`
- **Values**: `Event count`
- **Segments**: drag **No-Match Searches** into the Segment Comparisons box
- Set **Date range** to the last 28 days (or as needed)

### What to look for

Sort by **Event count** descending. The top rows are localities parents searched for most where
no centre exists yet. These are your strongest signals for:

- Where to open the next Rainbow centre
- Which new locality landing pages to build (e.g. `/play-school-near-kolshet-road`)

---

## Step 3 — (Optional) Looker Studio dashboard

For a shareable, auto-refreshing view:

1. Go to [lookerstudio.google.com](https://lookerstudio.google.com) and create a **Blank Report**
2. Add a data source: **Google Analytics** → property `G-G1MX1N0M05`
3. Add a **Table** chart:
   - **Dimension**: `Event parameter value` (parameter: `search_term`)
   - **Metric**: `Event count`
4. Add a filter: `Event name` = `nav_centre_search` AND `Event parameter — has_match` = `false`
5. Add a date range control and share with the team

---

## Quick-access

- GA4 property measurement ID: `G-G1MX1N0M05`
- Event name to filter by: `nav_centre_search`
- Key parameter: `has_match = false`
- Tracking function: `trackNavCentreSearch()` in `client/src/lib/analytics.ts`
