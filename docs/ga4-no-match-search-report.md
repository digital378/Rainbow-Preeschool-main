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

## Step 4 — Set up automated weekly alerts (choose one or both)

### Option A — GA4 custom alert (spike notification)

GA4 Insights alerts fire an email the moment a threshold is crossed, so the team gets
notified immediately when unserved-area searches spike rather than waiting for the weekly
review.

1. Open **GA4** → **Insights** (left sidebar, below Explore)
2. Click **View all insights** → **Create**
3. Choose **Custom insight** → **Anomaly detection** or **Threshold**  
   *(Threshold is simpler and more predictable; Anomaly detection adapts to your traffic baseline)*

#### Threshold alert setup

| Field | Value |
|-------|-------|
| **Insight name** | Unserved area searches spike |
| **Frequency** | Weekly |
| **Segment** | All users |
| **Metric** | Event count |
| **Filter — Event name** | exactly matches `nav_centre_search` |
| **Filter — has_match** | exactly matches `false` |
| **Condition** | Event count **greater than** `20` in the last **7 days** |

4. Under **Notifications**, add the email addresses of everyone who should receive the alert
5. Click **Create**

> **Threshold note**: 20 events / 7 days is a suggested starting point. After a month of
> data, review the baseline in your Exploration report and raise the threshold to 2–3× the
> typical weekly count so only genuine spikes alert.

#### Anomaly detection alert setup (alternative)

If you prefer GA4 to learn the baseline automatically:

1. Follow steps 1–3 above but choose **Anomaly detection**
2. Set the same event-name and `has_match = false` filters
3. Set **Sensitivity** to **Medium**
4. Add notification emails and click **Create**

---

### Option B — Looker Studio scheduled email (weekly digest)

A scheduled Looker Studio report lands in the team's inbox every Monday morning with the
top unserved localities table — no login required.

#### Build the report (extends Step 3)

If you already completed the optional Step 3 dashboard, open it. Otherwise:

1. Go to [lookerstudio.google.com](https://lookerstudio.google.com) → **Blank Report**
2. **Add data** → **Google Analytics** → property `G-G1MX1N0M05`

#### Configure the no-match table

3. Insert → **Chart** → **Table**
4. Set **Dimension**: `Event parameter value` (parameter name: `search_term`)
5. Set **Metric**: `Event count`
6. Add a **Filter**:
   - `Event name` **=** `nav_centre_search`
   - `Event parameter — has_match` **=** `false`
7. Sort by **Event count Descending** and cap **Rows per page** at 20
8. Add a **Date range control** and set default to **Last 7 days**

#### Schedule the email delivery

9. Click **Share** (top-right) → **Schedule email delivery**
10. Fill in:

| Field | Value |
|-------|-------|
| **Recipients** | Team email addresses (comma-separated) |
| **Frequency** | Weekly |
| **Day** | Monday |
| **Time** | 08:00 (so it's in inboxes before the team standup) |
| **Subject** | Unserved area searches — weekly digest |

11. Click **Save** — Looker Studio will send the report every Monday automatically

> **Tip**: Pin the Looker Studio report URL in the team Slack channel or bookmark bar so
> anyone can view the live data between scheduled emails.

---

### Which option to use?

| | GA4 Alert | Looker Studio Email |
|---|---|---|
| **Best for** | Catching sudden spikes mid-week | Regular Monday digest with ranked list |
| **Setup effort** | ~5 minutes | ~15 minutes |
| **Content** | Simple threshold breach notification | Full ranked table of unserved localities |
| **Recommendation** | ✅ Set up both — they complement each other |  |

---

## Quick-access

- GA4 property measurement ID: `G-G1MX1N0M05`
- Event name to filter by: `nav_centre_search`
- Key parameter: `has_match = false`
- Tracking function: `trackNavCentreSearch()` in `client/src/lib/analytics.ts`
- Suggested alert threshold: 20 no-match events in 7 days (adjust after first month)
- Suggested Looker Studio schedule: every Monday 08:00
