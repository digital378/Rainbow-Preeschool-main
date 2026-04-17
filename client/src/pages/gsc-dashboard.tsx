import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingUp, TrendingDown, Minus, CheckCircle2, Clock, AlertCircle,
  Lightbulb, ExternalLink, Plus, Download, ChevronDown, ChevronUp,
  BarChart2, Search, Zap, RefreshCw, Info, Shield, Target, FileText,
  MapPin, Star, ArrowRight, Circle, CheckSquare, Square, GitCompare,
} from "lucide-react";
import type { GscSnapshot } from "@shared/schema";

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIMARY_KEYWORDS = [
  "best preschool in thane",
  "preschool near me",
  "rainbow preschool thane",
  "rainbow preschool",
  "pre kg age",
  "pre school thane",
];

const KEYWORD_COLORS: Record<string, string> = {
  "best preschool in thane": "#dc2626",
  "preschool near me": "#ea580c",
  "rainbow preschool thane": "#16a34a",
  "rainbow preschool": "#2563eb",
  "pre kg age": "#7c3aed",
  "pre school thane": "#0891b2",
  "holi activities for kids": "#d97706",
  "national symbols of india for kids": "#db2777",
};

// ─── Keyword-Page Matrix Data ─────────────────────────────────────────────────

type KwEntry = {
  keyword: string;
  page: string;
  pageLabel: string;
  volume: "Very High" | "High" | "Medium";
  priority: "Critical" | "High" | "Medium" | "Brand" | "Winning";
  targetPos: number;
  action: string;
};

const KEYWORD_PAGE_MATRIX: KwEntry[] = [
  {
    keyword: "playschool near me",
    page: "/play-school-near-me",
    pageLabel: "Play School Near Me",
    volume: "Very High",
    priority: "Critical",
    targetPos: 5,
    action: "Add centre-specific LocalBusiness schema. Boost GBP reviews. Build 3 local citations (Justdial, Sulekha, IndiaMART).",
  },
  {
    keyword: "play school near me",
    page: "/play-school-near-me",
    pageLabel: "Play School Near Me",
    volume: "Very High",
    priority: "Critical",
    targetPos: 5,
    action: "Same page as 'playschool near me'. Target both with optimised H1 and FAQ section covering both spellings.",
  },
  {
    keyword: "preschool near me",
    page: "/best-preschool-near-me-in-thane",
    pageLabel: "Best Preschool Near Me",
    volume: "Very High",
    priority: "Critical",
    targetPos: 5,
    action: "Strengthen GBP profiles across all 6 centres. Increase genuine reviews. Improve proximity signals with consistent NAP.",
  },
  {
    keyword: "best preschool in thane",
    page: "/best-preschool-near-me-in-thane",
    pageLabel: "Best Preschool Near Me",
    volume: "High",
    priority: "Critical",
    targetPos: 5,
    action: "Add comparison table (Rainbow vs competitors). 500+ more words on page. Add FAQ targeting this exact phrase.",
  },
  {
    keyword: "best playschool in thane",
    page: "/play-school-near-me",
    pageLabel: "Play School Near Me",
    volume: "High",
    priority: "High",
    targetPos: 8,
    action: "Ensure page title and H1 include 'best playschool in Thane'. Add awards/recognition section.",
  },
  {
    keyword: "playgroup near me",
    page: "/playgroup-in-thane",
    pageLabel: "Playgroup in Thane",
    volume: "High",
    priority: "High",
    targetPos: 8,
    action: "Add a /playgroup-near-me page or ensure /playgroup-in-thane content targets 'near me' queries via H2 and FAQ.",
  },
  {
    keyword: "playgroup in thane",
    page: "/playgroup-in-thane",
    pageLabel: "Playgroup in Thane",
    volume: "Medium",
    priority: "High",
    targetPos: 5,
    action: "Add age guide content (1.5–2.5 years), daily schedule section, and parent testimonials specific to playgroup.",
  },
  {
    keyword: "nursery near me",
    page: "/nursery",
    pageLabel: "Nursery Programme",
    volume: "High",
    priority: "High",
    targetPos: 10,
    action: "Expand nursery page content. Add LocalBusiness schema with all 6 centre addresses. Improve GBP for 'nursery' category.",
  },
  {
    keyword: "nursery in thane",
    page: "/nursery",
    pageLabel: "Nursery Programme",
    volume: "Medium",
    priority: "Medium",
    targetPos: 5,
    action: "Add 'nursery in Thane' to page title and first H2. Include a section listing all Thane nursery centres.",
  },
  {
    keyword: "kindergarten near me",
    page: "/kindergarten",
    pageLabel: "Kindergarten Programme",
    volume: "High",
    priority: "Medium",
    targetPos: 10,
    action: "Strengthen /kindergarten page with curriculum details, LocalBusiness schema, and parent reviews.",
  },
  {
    keyword: "preschool in thane",
    page: "/",
    pageLabel: "Homepage",
    volume: "High",
    priority: "High",
    targetPos: 5,
    action: "Homepage already targets this. Ensure LocalBusiness schema mentions 'Thane' prominently. Build more Thane-specific internal links.",
  },
  {
    keyword: "pre school thane",
    page: "/",
    pageLabel: "Homepage",
    volume: "Medium",
    priority: "Medium",
    targetPos: 5,
    action: "Variant of 'preschool in thane'. Homepage naturally covers this — no extra page needed. Focus on link building.",
  },
  {
    keyword: "pre kg age",
    page: "/pre-kg-age-guide",
    pageLabel: "Pre-KG Age Guide",
    volume: "Medium",
    priority: "Winning",
    targetPos: 2,
    action: "Maintain position. Add printable chart CTA to increase engagement and reduce bounce. Build internal links from homepage.",
  },
  {
    keyword: "rainbow preschool",
    page: "/",
    pageLabel: "Homepage",
    volume: "Medium",
    priority: "Brand",
    targetPos: 3,
    action: "Brand keyword — maintain via consistent GBP presence and review volume.",
  },
  {
    keyword: "rainbow preschool thane",
    page: "/",
    pageLabel: "Homepage",
    volume: "Medium",
    priority: "Brand",
    targetPos: 3,
    action: "Brand keyword — ensure all 6 GBP listings link to clean www canonical URL.",
  },
];

// ─── Per-Page Audit Checklists ────────────────────────────────────────────────

type CheckItem = { id: string; label: string; done: boolean };

type PageAudit = {
  path: string;
  label: string;
  description: string;
  checks: CheckItem[];
  improvements: { priority: "Critical" | "High" | "Medium"; text: string }[];
};

const PAGE_AUDITS: PageAudit[] = [
  {
    path: "/best-preschool-near-me-in-thane",
    label: "Best Preschool Near Me in Thane",
    description: "Primary commercial landing page. Targets: 'preschool near me', 'best preschool in thane'.",
    checks: [
      { id: "title", label: "Title tag contains primary keyword", done: true },
      { id: "meta", label: "Meta description includes strong CTA", done: true },
      { id: "h1", label: "H1 matches 'best preschool in thane' or 'near me'", done: true },
      { id: "schema", label: "LocalBusiness JSON-LD on page", done: true },
      { id: "faq", label: "FAQ section with FAQPage schema", done: true },
      { id: "reviews", label: "10+ genuine parent reviews visible (manual: collect & publish)", done: false },
      { id: "comparison", label: "Comparison table or 'Why Rainbow?' section", done: true },
      { id: "wordcount", label: "2,500+ words of substantive content", done: true },
      { id: "cta", label: "Prominent phone/WhatsApp CTA above fold", done: true },
      { id: "map", label: "Interactive map showing all 6 centres", done: true },
      { id: "internal", label: "Linked from homepage quick nav", done: true },
      { id: "citations", label: "NAP matches Justdial/Sulekha/Google Maps (manual: external listings)", done: false },
      { id: "awards", label: "Awards, accreditations, or trust signals visible", done: true },
      { id: "images", label: "Original campus photos with alt text", done: true },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: true },
    ],
    improvements: [
      { priority: "Critical", text: "MANUAL: Add 10+ genuine parent reviews with star ratings visible on page — critical for E-E-A-T and review schema eligibility. (Collect from Google Business, ask current parents.)" },
      { priority: "High", text: "MANUAL: Build local citations — submit consistent NAP to Justdial, Sulekha, Indiamart, UrbanPro. Each citation = a local ranking signal." },
      { priority: "Medium", text: "Next on-page win: add a Google review widget that pulls live 4.7★ rating from your GBP — boosts trust without extra writing." },
      { priority: "Medium", text: "Add a 'What parents say about admissions' sub-section targeting long-tail admission-related queries." },
    ],
  },
  {
    path: "/play-school-near-me",
    label: "Play School Near Me in Thane",
    description: "Targets: 'playschool near me', 'play school near me', 'best playschool in thane'.",
    checks: [
      { id: "title", label: "Title tag includes 'playschool near me'", done: true },
      { id: "meta", label: "Meta description has strong CTA", done: true },
      { id: "h1", label: "H1 targets 'playschool near me' or 'play school near me'", done: true },
      { id: "schema", label: "LocalBusiness JSON-LD on page", done: true },
      { id: "faq", label: "FAQ section with FAQPage schema", done: true },
      { id: "reviews", label: "Parent reviews specific to play school experience (manual: collect & publish)", done: false },
      { id: "schedule", label: "Sample daily schedule section", done: true },
      { id: "wordcount", label: "2,500+ words of quality content", done: true },
      { id: "cta", label: "WhatsApp/phone CTA above fold", done: true },
      { id: "map", label: "Map or centre list visible", done: true },
      { id: "internal", label: "Linked from homepage and footer", done: true },
      { id: "citations", label: "GBP categories include 'Play School' (manual: update GBP)", done: false },
      { id: "bothspelling", label: "Both 'playschool' and 'play school' spellings used naturally in body", done: true },
      { id: "age", label: "Age guide clearly visible (1.5-2.5 years focus)", done: true },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: true },
    ],
    improvements: [
      { priority: "Critical", text: "MANUAL: Update all 6 Google Business Profiles to include 'Play School' as a primary or secondary category — direct ranking lift for 'play school near me'." },
      { priority: "High", text: "MANUAL: Add 5–6 parent quotes specific to play-school experience (separation, first day, social development) — different from generic preschool reviews." },
      { priority: "Medium", text: "Next on-page win: add a 'First-day-of-play-school checklist' downloadable PDF — strong link-bait for parenting blogs." },
      { priority: "Medium", text: "Add parent testimonials specific to playgroup/play school experience — not generic preschool reviews." },
    ],
  },
  {
    path: "/playgroup-in-thane",
    label: "Playgroup in Thane",
    description: "Targets: 'playgroup in thane', 'playgroup near me', 'toddler playgroup thane'.",
    checks: [
      { id: "title", label: "Title tag includes 'playgroup in thane'", done: true },
      { id: "meta", label: "Meta description with strong CTA", done: true },
      { id: "h1", label: "H1 targets 'playgroup in thane' or 'playgroup near me'", done: true },
      { id: "schema", label: "LocalBusiness JSON-LD on page", done: true },
      { id: "faq", label: "FAQ section targeting 'playgroup near me' queries", done: true },
      { id: "ageguide", label: "Clear age guide for 1.5-2.5 year olds", done: true },
      { id: "schedule", label: "Sample daily playgroup schedule", done: true },
      { id: "wordcount", label: "2,000+ words of content", done: true },
      { id: "cta", label: "Clear CTA above fold", done: true },
      { id: "nearme", label: "H2 or section targeting 'playgroup near me' explicitly", done: true },
      { id: "internal", label: "Linked from homepage", done: true },
      { id: "reviews", label: "Parent reviews from playgroup parents (manual: collect & publish)", done: false },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: true },
      { id: "images", label: "Photos of children in playgroup activities (manual: needs real photos)", done: false },
      { id: "curriculum", label: "Curriculum/programme details visible", done: true },
    ],
    improvements: [
      { priority: "High", text: "MANUAL: Add 4–6 photos of children in actual playgroup activities (sensory play, art, circle time) with descriptive alt text." },
      { priority: "High", text: "MANUAL: Collect 6–8 video testimonials from playgroup parents (30 sec each) and embed on page — huge dwell-time + trust lift." },
      { priority: "Medium", text: "Next on-page win: add an interactive 'Is my toddler ready for playgroup?' 5-question quiz — proven to lower bounce rate." },
      { priority: "Medium", text: "Add a sample day schedule for playgroup — high-value content that parents search for when comparing options." },
      { priority: "Medium", text: "Add parent testimonials from playgroup parents specifically (not generic preschool testimonials)." },
    ],
  },
  {
    path: "/nursery",
    label: "Nursery Programme",
    description: "Targets: 'nursery near me', 'nursery in thane', 'nursery school thane'.",
    checks: [
      { id: "title", label: "Title includes 'nursery near me' or 'nursery in thane'", done: true },
      { id: "meta", label: "Meta description with strong CTA", done: true },
      { id: "h1", label: "H1 targets nursery keyword", done: true },
      { id: "schema", label: "LocalBusiness schema on page", done: true },
      { id: "faq", label: "FAQ section with FAQPage schema", done: true },
      { id: "nearme", label: "'Nursery near me' section or H2", done: true },
      { id: "ageguide", label: "Clear age range for nursery (2.5-3.5 years)", done: true },
      { id: "curriculum", label: "Nursery curriculum details", done: true },
      { id: "wordcount", label: "2,000+ words of content", done: true },
      { id: "cta", label: "CTA above fold", done: true },
      { id: "internal", label: "Linked from homepage and footer", done: true },
      { id: "reviews", label: "Parent reviews from nursery parents (manual: collect & publish)", done: false },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: true },
      { id: "images", label: "Original nursery classroom photos (manual: needs real photos)", done: false },
      { id: "admissions", label: "Admission process/dates section", done: true },
    ],
    improvements: [
      { priority: "High", text: "MANUAL: Replace stock illustrations with original nursery classroom photos (kids reading, phonics activity, art table) — big credibility signal." },
      { priority: "High", text: "MANUAL: Add 5+ nursery-specific parent reviews mentioning phonics/numeracy progress — feeds into AggregateRating eligibility." },
      { priority: "Medium", text: "Next on-page win: add a 'Nursery curriculum month-by-month' expandable timeline — increases time-on-page and demonstrates depth." },
      { priority: "Medium", text: "Add admission dates and process section — 'nursery school admission' is a high-volume query in March-May and August-September." },
      { priority: "Medium", text: "Add nursery-specific parent reviews for E-E-A-T and review schema stars." },
    ],
  },
  {
    path: "/",
    label: "Homepage",
    description: "Targets: 'preschool in thane', 'rainbow preschool', 'best preschool thane', 'rainbow preschool thane'.",
    checks: [
      { id: "title", label: "Title tag targets brand + 'preschool in thane'", done: true },
      { id: "meta", label: "Meta description compelling with CTA", done: true },
      { id: "h1", label: "H1 clear and keyword-relevant", done: true },
      { id: "schema", label: "EducationalOrganization + LocalBusiness schema", done: true },
      { id: "faq", label: "FAQ section with FAQPage schema", done: true },
      { id: "video", label: "VideoObject JSON-LD for campus walkthrough", done: true },
      { id: "reviews", label: "AggregateRating schema (enables stars in SERP)", done: true },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: true },
      { id: "lcp", label: "Hero image preloaded (LCP <2.5s)", done: true },
      { id: "gbp", label: "All 6 GBP listings link to clean www canonical (manual: update GBP)", done: false },
      { id: "internal", label: "Internal links to all primary keyword pages", done: true },
      { id: "socialproof", label: "Student count / years / centre count visible", done: true },
      { id: "cta", label: "Primary CTA above fold", done: true },
      { id: "mobile", label: "Mobile layout tested — CTA visible on phone", done: true },
      { id: "canonical", label: "Canonical tag points to www version", done: true },
    ],
    improvements: [
      { priority: "Critical", text: "MANUAL: Update all 6 GBP profiles to link to https://www.rainbowpreschools.com/ (no UTM parameters) — prevents redirect hop and consolidates link equity." },
      { priority: "High", text: "MANUAL: Run a review drive — request reviews from current parents at all 6 centres. More reviews = stronger local pack signals for all 'near me' queries." },
      { priority: "Medium", text: "Next on-page win: build a dedicated /awards page that consolidates all media mentions (India Today, ScooNews, Economic Times) with publication logos and links." },
      { priority: "Medium", text: "Add a 'Featured in' or 'Recognised by' section if any press/awards exist — boosts E-E-A-T signals for the whole domain." },
    ],
  },
  {
    path: "/pre-kg-age-guide",
    label: "Pre-KG Age Guide",
    description: "Targets: 'pre kg age', 'what age for pre kg', 'pre kg admission age'. Currently ranking #2 — protect and grow.",
    checks: [
      { id: "title", label: "Title targets 'pre kg age' exactly", done: true },
      { id: "meta", label: "Meta description with CTA", done: true },
      { id: "h1", label: "H1 includes 'pre kg age'", done: true },
      { id: "schema", label: "FAQPage or Article schema", done: true },
      { id: "breadcrumb", label: "BreadcrumbList schema", done: true },
      { id: "printable", label: "Printable age guide CTA or download", done: true },
      { id: "internal", label: "Internal links from homepage", done: true },
      { id: "relatedlinks", label: "Links to /playgroup-in-thane and /nursery", done: true },
      { id: "wordcount", label: "1,500+ words of substantive content", done: true },
      { id: "images", label: "Illustrative infographic or table", done: true },
      { id: "social", label: "Social sharing prompt (parent will share with others)", done: true },
      { id: "admissioncta", label: "Admission enquiry CTA within content", done: true },
      { id: "structured", label: "Age comparison table (playgroup/nursery/pre-kg/kg)", done: true },
      { id: "citations", label: "References reputable child development research", done: true },
      { id: "updated", label: "Content reviewed and date-stamped for current year", done: true },
    ],
    improvements: [
      { priority: "Medium", text: "Next on-page win: design a polished PDF infographic version of the age comparison table — share it on Pinterest/parenting groups for natural backlinks." },
      { priority: "Medium", text: "Add a small 'developmental milestones at age 3' checklist (gross motor, language, social) — captures additional long-tail queries." },
      { priority: "Medium", text: "Link to related programme pages (/playgroup-in-thane, /nursery) to distribute link equity and reduce pogo-sticking." },
      { priority: "Medium", text: "Mark content with a 'Last reviewed: [month year]' timestamp — freshness signals help maintain position on advice/guide queries." },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function positionColor(pos: number) {
  if (pos <= 3) return "bg-green-100 text-green-800 border-green-200";
  if (pos <= 10) return "bg-blue-100 text-blue-800 border-blue-200";
  if (pos <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
}

function positionLabel(pos: number) {
  if (pos <= 3) return "Top 3";
  if (pos <= 10) return "Page 1";
  if (pos <= 20) return "Page 2";
  return "Page 3+";
}

function priorityColor(p: string) {
  if (p === "Critical") return "bg-red-100 text-red-700 border-red-200";
  if (p === "High") return "bg-orange-100 text-orange-700 border-orange-200";
  if (p === "Winning") return "bg-green-100 text-green-700 border-green-200";
  if (p === "Brand") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

function volumeColor(v: string) {
  if (v === "Very High") return "bg-purple-100 text-purple-700 border-purple-200";
  if (v === "High") return "bg-indigo-100 text-indigo-700 border-indigo-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function impColor(p: string) {
  if (p === "Critical") return "text-red-600";
  if (p === "High") return "text-orange-600";
  return "text-yellow-600";
}

function TrendIcon({ change }: { change: number }) {
  if (change < -0.5) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (change > 0.5) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "done") return <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />;
  if (status === "pending") return <Clock className="h-5 w-5 text-yellow-500 shrink-0" />;
  return <Lightbulb className="h-5 w-5 text-blue-500 shrink-0" />;
}

function priorityBadge(p: string) {
  if (p === "critical") return "bg-red-100 text-red-700 border-red-200";
  if (p === "high") return "bg-orange-100 text-orange-700 border-orange-200";
  if (p === "medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

const addSnapshotSchema = z.object({
  snapshotDate: z.string().min(1, "Date required"),
  keyword: z.string().min(1, "Keyword required"),
  clicks: z.coerce.number().int().min(0),
  impressions: z.coerce.number().int().min(0),
  ctr: z.coerce.number().min(0).max(100),
  position: z.coerce.number().min(0.1),
  page: z.string().optional(),
  notes: z.string().optional(),
});
type AddSnapshotForm = z.infer<typeof addSnapshotSchema>;

function useGscData() {
  return useQuery<GscSnapshot[]>({
    queryKey: ["/api/gsc/snapshots"],
    refetchInterval: 5 * 60 * 1000,
  });
}

function useGscSyncStatus() {
  return useQuery<{ configured: boolean; lastAutoSync: string | null; autoSyncError: string | null }>({
    queryKey: ["/api/gsc/sync/status"],
    refetchInterval: 60 * 1000,
  });
}

function computeKeywordSummary(snapshots: GscSnapshot[]) {
  const byKeyword: Record<string, GscSnapshot[]> = {};
  snapshots.forEach(s => {
    if (!byKeyword[s.keyword]) byKeyword[s.keyword] = [];
    byKeyword[s.keyword].push(s);
  });

  return Object.entries(byKeyword).map(([keyword, rows]) => {
    const sorted = [...rows].sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));
    const latest = sorted[sorted.length - 1];
    const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
    const posChange = prev ? latest.position - prev.position : 0;

    let forecast30: number | null = null;
    let forecast90: number | null = null;
    if (prev) {
      const days = differenceInDays(parseISO(latest.snapshotDate), parseISO(prev.snapshotDate)) || 1;
      const ratePerDay = (latest.position - prev.position) / days;
      forecast30 = Math.max(1, latest.position + ratePerDay * 30);
      forecast90 = Math.max(1, latest.position + ratePerDay * 90);
    }

    return { keyword, latest, prev, posChange, forecast30, forecast90, history: sorted };
  }).sort((a, b) => {
    const aPrimary = PRIMARY_KEYWORDS.includes(a.keyword) ? 0 : 1;
    const bPrimary = PRIMARY_KEYWORDS.includes(b.keyword) ? 0 : 1;
    return aPrimary - bPrimary || a.latest.position - b.latest.position;
  });
}

function buildPositionChartData(snapshots: GscSnapshot[], keywords: string[]) {
  const dateMap: Record<string, Record<string, number>> = {};
  snapshots.filter(s => keywords.includes(s.keyword)).forEach(s => {
    if (!dateMap[s.snapshotDate]) dateMap[s.snapshotDate] = {};
    dateMap[s.snapshotDate][s.keyword] = Math.round(s.position * 10) / 10;
  });
  return Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date: format(parseISO(date), "dd MMM"), ...vals }));
}

function buildTrafficChartData(siteTotals: GscSnapshot[], days = 28) {
  // Use only the daily site-wide GSC totals (auto-synced) so the chart is
  // continuous day-by-day, not just whichever dates a manual snapshot exists.
  const dateMap: Record<string, { clicks: number; impressions: number }> = {};
  siteTotals.forEach(s => {
    dateMap[s.snapshotDate] = {
      clicks: (dateMap[s.snapshotDate]?.clicks || 0) + s.clicks,
      impressions: (dateMap[s.snapshotDate]?.impressions || 0) + s.impressions,
    };
  });

  const today = new Date();
  const out: { date: string; clicks: number; impressions: number; iso: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const iso = format(d, "yyyy-MM-dd");
    const entry = dateMap[iso] || { clicks: 0, impressions: 0 };
    out.push({ iso, date: format(d, "dd MMM"), clicks: entry.clicks, impressions: entry.impressions });
  }
  return out;
}

const SEO_ACTIONS: { id: string; status: "done" | "pending" | "opportunity"; priority: string; category: string; title: string; detail: string; impact: string; trackedKeyword?: string }[] = [
  {
    id: "fix-redirect-loop",
    status: "done", priority: "critical", category: "Technical",
    title: "Fixed 24 live pages incorrectly redirecting to /blog",
    detail: "Server redirect map was overriding active routes. Google's bot was receiving 301s for all high-traffic content pages — directly causing the March impressions cliff (~85% drop). Removed from redirects.ts on Apr 17.",
    impact: "Expect impressions recovery to ~4,000–8,000/day within 2–4 weeks as Google re-crawls.",
  },
  {
    id: "utm-stripping",
    status: "done", priority: "high", category: "Technical",
    title: "UTM parameter stripping — canonical URL consolidation",
    detail: "All URLs with UTM parameters now 301-redirect to clean canonical path. Prevents duplicate content from UTM-tagged GBP/social links accumulating separate indexing.",
    impact: "Consolidates link equity to single canonical URL.",
  },
  {
    id: "remove-discontinued-links",
    status: "done", priority: "high", category: "Technical",
    title: "Removed internal links to discontinued programmes",
    detail: "Kids Activity Club and Summer Camp had 8 live internal links across blog content. Server 301 redirects to /programmes already existed. Links replaced with /happy-times and /programmes.",
    impact: "Google will stop re-crawling discontinued URLs and consolidate signals to /programmes.",
  },
  {
    id: "bot-ssr-schema",
    status: "done", priority: "medium", category: "Technical",
    title: "Bot SSR — structured data for all major pages",
    detail: "LocalBusiness schema with per-centre geo coordinates, Review schema, VideoObject JSON-LD, FAQPage schema, BreadcrumbList, Person schema (E-E-A-T).",
    impact: "Enables rich results (stars, FAQ snippets) in SERPs.",
  },
  {
    id: "request-reindexing",
    status: "pending", priority: "critical", category: "Technical",
    title: "Request re-indexing of 24 recovered content pages via GSC",
    detail: "Go to GSC → URL Inspection → paste each URL → Request Indexing. Priority order: /national-symbols-of-india-for-kids, /holi-activities-for-kids, /36-motivational-thoughts-of-the-day-for-kids, /sports-day-activities-for-kindergarten, /pre-kg-age-guide. GSC allows ~10 requests/day.",
    impact: "Speeds up impressions recovery by 1–2 weeks vs. waiting for natural re-crawl.",
  },
  {
    id: "gbp-website-url",
    status: "pending", priority: "high", category: "Local SEO",
    title: "Update Google Business Profile website URL",
    detail: "GBP profile should link to https://www.rainbowpreschools.com/ (clean canonical, no UTM). Currently may include UTM parameters that trigger redirect before visitors reach the site. Do this in GBP manager for all 6 centre listings.",
    impact: "Removes redirect hop for GBP visitors; consolidates link equity.",
  },
  {
    id: "kw-best-preschool-thane",
    trackedKeyword: "best preschool in thane",
    status: "opportunity", priority: "high", category: "Content",
    title: "\"best preschool in thane\" — sitting at position 16",
    detail: "Primary commercial keyword. Target page: /best-preschool-near-me-in-thane. Page needs more in-depth content — parent FAQ section, comparison tables, additional genuine reviews, and more local schema signals. Also needs more backlinks from local education/parenting sites.",
    impact: "Moving from pos 16 → pos 5 = ~8× more clicks. Primary lead generation lever.",
  },
  {
    id: "kw-preschool-near-me",
    trackedKeyword: "preschool near me",
    status: "opportunity", priority: "high", category: "Content",
    title: "\"preschool near me\" — sitting at position 23",
    detail: "Near-me searches have strong local intent. Target page: /best-preschool-near-me-in-thane. Page needs proximity signals: LocalBusiness schema for all 6 centres with precise geo, NAP citations in Justdial/Sulekha/Indiamart, consistent address formatting across web.",
    impact: "Near-me ranks are heavily GBP-influenced. Focus on GBP completeness + reviews.",
  },
  {
    id: "informational-recovery",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Informational pages — long-tail traffic recovery",
    detail: "Pages like /national-symbols-of-india-for-kids (95K impressions), /holi-activities-for-kids (56K), and /36-motivational-thoughts had massive traffic before the March redirect issue. Now they should recover, but adding new content sections (printables, activity sheets) can accelerate it.",
    impact: "Restoring informational traffic brings brand awareness and top-of-funnel leads.",
  },
  {
    id: "mobile-ctr",
    status: "opportunity", priority: "low", category: "Technical",
    title: "Mobile CTR (0.58%) vs Desktop CTR (0.76%)",
    detail: "Mobile drives 75% of traffic but has lower CTR. Consider updating meta descriptions to be more compelling on mobile SERPs. Rich snippet eligibility (stars, FAQ) can boost mobile CTR without changing position.",
    impact: "0.2% CTR improvement on 299K mobile impressions = ~600 extra clicks/quarter.",
  },
];

// ─── Checklist storage (localStorage) ────────────────────────────────────────

const STORAGE_KEY = "rpi_page_audits_v1";
const ACTION_OVERRIDES_KEY = "rpi_action_overrides_v1";

function loadActionOverrides(): Record<string, "done" | null> {
  try { return JSON.parse(localStorage.getItem(ACTION_OVERRIDES_KEY) || "{}"); }
  catch { return {}; }
}
function saveActionOverrides(data: Record<string, "done" | null>) {
  localStorage.setItem(ACTION_OVERRIDES_KEY, JSON.stringify(data));
}

function loadChecks(): Record<string, Record<string, boolean>> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveChecks(data: Record<string, Record<string, boolean>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Keywords & Pages Tab ─────────────────────────────────────────────────────

function KeywordsTab({ snapshots }: { snapshots: GscSnapshot[] }) {
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [checksState, setChecksState] = useState<Record<string, Record<string, boolean>>>(loadChecks);
  const [filter, setFilter] = useState<"all" | "Critical" | "High" | "Medium" | "Brand" | "Winning">("all");

  const summary = useMemo(() => computeKeywordSummary(snapshots), [snapshots]);
  const posMap = useMemo(() => {
    const m: Record<string, number> = {};
    summary.forEach(s => { m[s.keyword] = s.latest.position; });
    return m;
  }, [summary]);

  function toggleCheck(pagePath: string, checkId: string, currentDone: boolean) {
    const updated = {
      ...checksState,
      [pagePath]: {
        ...(checksState[pagePath] || {}),
        [checkId]: !currentDone,
      },
    };
    setChecksState(updated);
    saveChecks(updated);
  }

  function getCheckDone(pagePath: string, checkId: string, defaultDone: boolean): boolean {
    return checksState[pagePath]?.[checkId] ?? defaultDone;
  }

  const filtered = filter === "all" ? KEYWORD_PAGE_MATRIX : KEYWORD_PAGE_MATRIX.filter(k => k.priority === filter);

  // Summary counts
  const counts = { winning: 0, page1: 0, page2: 0, page3: 0, untracked: 0 };
  KEYWORD_PAGE_MATRIX.forEach(k => {
    const pos = posMap[k.keyword];
    if (!pos) counts.untracked++;
    else if (pos <= 3) counts.winning++;
    else if (pos <= 10) counts.page1++;
    else if (pos <= 20) counts.page2++;
    else counts.page3++;
  });

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Winning (Top 3)", value: counts.winning, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          { label: "Page 1 (4-10)", value: counts.page1, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Page 2 (11-20)", value: counts.page2, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
          { label: "Page 3+ (21+)", value: counts.page3, color: "text-red-600", bg: "bg-red-50 border-red-200" },
          { label: "Not Tracked", value: counts.untracked, color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
        ].map(card => (
          <div key={card.label} className={`rounded-lg border p-3 ${card.bg}`}>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Keyword-Page Matrix */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-red-600" />
                Keyword–Page Matrix
              </CardTitle>
              <CardDescription className="text-xs">All primary commercial keywords and their target pages. Current position pulled from latest GSC snapshot.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all", "Critical", "High", "Medium", "Brand", "Winning"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded-full text-xs border transition-all ${filter === f ? "bg-red-600 text-white border-red-600" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-gray-900">
                <th className="py-2 px-4 font-medium">Keyword</th>
                <th className="py-2 px-3 font-medium">Target Page</th>
                <th className="py-2 px-3 font-medium text-center">Volume</th>
                <th className="py-2 px-3 font-medium text-center">Priority</th>
                <th className="py-2 px-3 font-medium text-center">Current Pos</th>
                <th className="py-2 px-3 font-medium text-center">Target</th>
                <th className="py-2 px-3 font-medium text-center">Gap</th>
                <th className="py-2 px-4 font-medium">#1 Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(kw => {
                const pos = posMap[kw.keyword];
                const gap = pos ? Math.round(pos - kw.targetPos) : null;
                return (
                  <tr key={kw.keyword} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{kw.keyword}</div>
                    </td>
                    <td className="py-3 px-3">
                      <a href={kw.page} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        {kw.page}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${volumeColor(kw.volume)}`}>{kw.volume}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${priorityColor(kw.priority)}`}>{kw.priority}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {pos ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${positionColor(pos)}`}>
                          #{pos.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not tracked</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">#{kw.targetPos}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {gap !== null ? (
                        <span className={`text-xs font-bold ${gap <= 0 ? "text-green-600" : gap <= 5 ? "text-yellow-600" : "text-red-500"}`}>
                          {gap <= 0 ? "✓ Met" : `+${gap}`}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">{kw.action}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Per-Page Improvement Cards */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-red-600" />
          Page-by-Page Improvement Checklist
        </h2>
        <p className="text-xs text-gray-500 mb-4">Check off items as you complete them — progress is saved in your browser.</p>
        <div className="space-y-3">
          {PAGE_AUDITS.map(audit => {
            const checks = audit.checks.map(c => ({ ...c, done: getCheckDone(audit.path, c.id, c.done) }));
            const doneCount = checks.filter(c => c.done).length;
            const totalCount = checks.length;
            const pct = Math.round((doneCount / totalCount) * 100);
            const isOpen = expandedPage === audit.path;

            return (
              <div key={audit.path} className="rounded-lg border bg-white dark:bg-gray-900 overflow-hidden">
                <button
                  onClick={() => setExpandedPage(isOpen ? null : audit.path)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{audit.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{audit.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full max-w-[160px]">
                        <div
                          className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : pct >= 30 ? "bg-yellow-500" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{doneCount}/{totalCount} complete ({pct}%)</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t">
                    <p className="text-xs text-gray-500 py-3">{audit.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
                      {checks.map(check => (
                        <button
                          key={check.id}
                          onClick={() => toggleCheck(audit.path, check.id, check.done)}
                          className="flex items-start gap-2 text-left rounded p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          {check.done
                            ? <CheckSquare className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            : <Square className="h-4 w-4 text-gray-300 group-hover:text-gray-400 shrink-0 mt-0.5" />
                          }
                          <span className={`text-xs leading-relaxed ${check.done ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-300"}`}>
                            {check.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Improvement Actions</p>
                      {audit.improvements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-2 rounded p-2 bg-gray-50 dark:bg-gray-800">
                          <span className={`text-xs font-semibold shrink-0 mt-0.5 ${impColor(imp.priority)}`}>{imp.priority}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{imp.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Data Explorer ────────────────────────────────────────────────────────────

function DataExplorer({ snapshots }: { snapshots: GscSnapshot[] }) {
  const today = new Date().toISOString().split("T")[0];
  const [mode, setMode] = useState<"browse" | "compare">("browse");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [kwFilter, setKwFilter] = useState("");
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");

  const allDates = useMemo(() =>
    Array.from(new Set(snapshots.map(s => s.snapshotDate))).sort((a, b) => b.localeCompare(a)),
    [snapshots]
  );

  useEffect(() => {
    if (allDates.length >= 1) {
      if (!compareA) setCompareA(allDates[0]);
      if (!compareB && allDates.length >= 2) setCompareB(allDates[1]);
      if (!fromDate && !toDate) { setFromDate(allDates[0]); setToDate(allDates[0]); }
    }
  }, [allDates.length]);

  const subDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  };

  const setPreset = (preset: string) => {
    if (preset === "today") { setFromDate(today); setToDate(today); }
    else if (preset === "7d") { setFromDate(subDays(7)); setToDate(today); }
    else if (preset === "30d") { setFromDate(subDays(30)); setToDate(today); }
    else if (preset === "90d") { setFromDate(subDays(90)); setToDate(today); }
    else { setFromDate(""); setToDate(""); }
  };

  const browsed = useMemo(() =>
    [...snapshots].reverse().filter(s => {
      const dateOk = (!fromDate || s.snapshotDate >= fromDate) && (!toDate || s.snapshotDate <= toDate);
      const kwOk = !kwFilter || s.keyword.toLowerCase().includes(kwFilter.toLowerCase());
      return dateOk && kwOk;
    }),
    [snapshots, fromDate, toDate, kwFilter]
  );

  const { mapA, mapB, compareKeywords } = useMemo(() => {
    const mapA = new Map(snapshots.filter(s => s.snapshotDate === compareA).map(s => [s.keyword, s]));
    const mapB = new Map(snapshots.filter(s => s.snapshotDate === compareB).map(s => [s.keyword, s]));
    const compareKeywords = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();
    return { mapA, mapB, compareKeywords };
  }, [snapshots, compareA, compareB]);

  const inputCls = "px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400";
  const modeBtnCls = (active: boolean) => `px-3 py-1.5 text-xs rounded-md border font-medium transition-colors flex items-center gap-1.5 ${
    active ? "bg-red-600 text-white border-red-600" : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-red-300"
  }`;

  return (
    <Card className="mt-3">
      <CardContent className="pt-4 space-y-4">
        {/* Mode toggle */}
        <div className="flex items-center gap-2 pb-3 border-b">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-1">View</span>
          <button onClick={() => setMode("browse")} className={modeBtnCls(mode === "browse")}>
            <Search className="h-3.5 w-3.5" /> Browse
          </button>
          <button onClick={() => setMode("compare")} className={modeBtnCls(mode === "compare")}>
            <GitCompare className="h-3.5 w-3.5" /> Compare
          </button>
        </div>

        {/* ── BROWSE MODE ── */}
        {mode === "browse" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">From</span>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inputCls} max={today} />
              <span className="text-xs text-gray-500">to</span>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inputCls} max={today} />
              <div className="flex gap-1 ml-1 flex-wrap">
                {([["Today", "today"], ["7d", "7d"], ["30d", "30d"], ["90d", "90d"], ["All", "all"]] as [string, string][]).map(([label, preset]) => (
                  <button key={preset} onClick={() => setPreset(preset)}
                    className="px-2 py-1 text-xs border rounded text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors">
                    {label}
                  </button>
                ))}
              </div>
              {(fromDate || toDate) && (
                <button onClick={() => { setFromDate(""); setToDate(""); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors">✕ Clear dates</button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Filter by keyword…" value={kwFilter}
                  onChange={e => setKwFilter(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400" />
              </div>
              {kwFilter && (
                <button onClick={() => setKwFilter("")} className="text-xs text-gray-400 hover:text-red-500 transition-colors">✕ Clear</button>
              )}
              <span className="text-xs text-gray-400 ml-auto">{browsed.length} of {snapshots.length} rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left text-gray-500 uppercase tracking-wide">
                    {["Date", "Keyword", "Pos", "Clicks", "Impr.", "CTR", "Page", "Notes"].map(h => (
                      <th key={h} className="pb-2 pr-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {browsed.length === 0 ? (
                    <tr><td colSpan={8} className="py-6 text-center text-gray-400">No entries match your filter.</td></tr>
                  ) : browsed.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="py-1.5 pr-3 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">{s.snapshotDate}</td>
                      <td className="py-1.5 pr-3 max-w-[160px] truncate">{s.keyword}</td>
                      <td className="py-1.5 pr-3 font-mono">{s.position.toFixed(1)}</td>
                      <td className="py-1.5 pr-3 font-mono">{s.clicks}</td>
                      <td className="py-1.5 pr-3 font-mono">{s.impressions.toLocaleString()}</td>
                      <td className="py-1.5 pr-3 font-mono">{(s.ctr * 100).toFixed(2)}%</td>
                      <td className="py-1.5 pr-3 max-w-[120px] truncate text-gray-400">{s.page ?? "—"}</td>
                      <td className="py-1.5 pr-3 max-w-[200px] truncate text-gray-400">{s.notes ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── COMPARE MODE ── */}
        {mode === "compare" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 pb-3 border-b items-center">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Period A</span>
                <select value={compareA} onChange={e => setCompareA(e.target.value)}
                  className="px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  {allDates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Period B</span>
                <select value={compareB} onChange={e => setCompareB(e.target.value)}
                  className="px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400">
                  {allDates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {compareA !== compareB && (
                <span className="text-xs text-gray-400 ml-auto">{compareKeywords.length} keywords</span>
              )}
            </div>
            {!compareA || !compareB || compareA === compareB ? (
              <p className="text-xs text-gray-400 text-center py-6">Select two different snapshot dates to compare.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-gray-500 uppercase tracking-wide">
                      <th className="pb-2 pr-3 font-medium">Keyword</th>
                      <th className="pb-2 pr-3 font-medium text-blue-600">Pos A</th>
                      <th className="pb-2 pr-3 font-medium text-orange-500">Pos B</th>
                      <th className="pb-2 pr-3 font-medium">Δ Pos</th>
                      <th className="pb-2 pr-3 font-medium text-blue-600">Clicks A</th>
                      <th className="pb-2 pr-3 font-medium text-orange-500">Clicks B</th>
                      <th className="pb-2 pr-3 font-medium">Δ Clicks</th>
                      <th className="pb-2 pr-3 font-medium text-blue-600">Impr. A</th>
                      <th className="pb-2 pr-3 font-medium text-orange-500">Impr. B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {compareKeywords.map(kw => {
                      const a = mapA.get(kw);
                      const b = mapB.get(kw);
                      const dPos = a && b ? +(a.position - b.position).toFixed(1) : null;
                      const dClk = a && b ? a.clicks - b.clicks : null;
                      return (
                        <tr key={kw} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="py-1.5 pr-3 max-w-[180px] truncate font-medium">{kw}</td>
                          <td className="py-1.5 pr-3 font-mono text-blue-600">{a ? a.position.toFixed(1) : <span className="text-gray-300">—</span>}</td>
                          <td className="py-1.5 pr-3 font-mono text-orange-500">{b ? b.position.toFixed(1) : <span className="text-gray-300">—</span>}</td>
                          <td className="py-1.5 pr-3 font-mono font-semibold">
                            {dPos !== null
                              ? <span className={dPos < 0 ? "text-green-600" : dPos > 0 ? "text-red-500" : "text-gray-400"}>
                                  {dPos < 0 ? "▲" : dPos > 0 ? "▼" : "—"} {Math.abs(dPos)}
                                </span>
                              : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="py-1.5 pr-3 font-mono text-blue-600">{a ? a.clicks : <span className="text-gray-300">—</span>}</td>
                          <td className="py-1.5 pr-3 font-mono text-orange-500">{b ? b.clicks : <span className="text-gray-300">—</span>}</td>
                          <td className="py-1.5 pr-3 font-mono font-semibold">
                            {dClk !== null
                              ? <span className={dClk > 0 ? "text-green-600" : dClk < 0 ? "text-red-500" : "text-gray-400"}>
                                  {dClk > 0 ? "+" : ""}{dClk}
                                </span>
                              : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="py-1.5 pr-3 font-mono text-blue-600">{a ? a.impressions.toLocaleString() : <span className="text-gray-300">—</span>}</td>
                          <td className="py-1.5 pr-3 font-mono text-orange-500">{b ? b.impressions.toLocaleString() : <span className="text-gray-300">—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function GscDashboard() {
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "robots";
      document.head.appendChild(tag);
    }
    const prev = tag.content;
    tag.content = "noindex, nofollow";
    return () => { tag!.content = prev; };
  }, []);

  const { data: allSnapshots = [], isLoading } = useGscData();
  const { data: syncStatus } = useGscSyncStatus();

  // Separate site-total rows from per-keyword rows
  const siteTotals = allSnapshots.filter(s => s.keyword === "__site_total__");
  const dailyKeywordSnaps = allSnapshots.filter(s => s.keyword.startsWith("__daily__:"));
  const snapshots = allSnapshots.filter(s => s.keyword !== "__site_total__" && !s.keyword.startsWith("__daily__:"));

  // Compute true 24-hour deltas per keyword from daily snapshots:
  // pos24h = latest day's position − previous day's position (lower = better)
  // impr24h = latest day's impressions − previous day's impressions
  const deltas24h = useMemo(() => {
    const byKw: Record<string, typeof dailyKeywordSnaps> = {};
    dailyKeywordSnaps.forEach(s => {
      const kw = s.keyword.replace(/^__daily__:/, "");
      (byKw[kw] ||= []).push(s);
    });
    const out: Record<string, { posDelta: number | null; imprDelta: number | null; latestDate: string | null }> = {};
    Object.entries(byKw).forEach(([kw, rows]) => {
      const sorted = rows.slice().sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));
      const latest = sorted[sorted.length - 1];
      const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
      out[kw] = {
        posDelta: prev ? +(latest.position - prev.position).toFixed(1) : null,
        imprDelta: prev ? latest.impressions - prev.impressions : null,
        latestDate: latest?.snapshotDate ?? null,
      };
    });
    return out;
  }, [dailyKeywordSnaps]);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords">("overview");
  const [showForm, setShowForm] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(PRIMARY_KEYWORDS.slice(0, 4));
  const [perfPeriod, setPerfPeriod] = useState<"latest" | "7d" | "28d" | "3mo" | "all">("all");
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(["clicks", "impressions"]));

  const toggleMetric = (key: string) =>
    setActiveMetrics(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const summary = useMemo(() => computeKeywordSummary(snapshots), [snapshots]);
  const positionChartData = useMemo(() => buildPositionChartData(snapshots, selectedKeywords), [snapshots, selectedKeywords]);
  const [chartDays, setChartDays] = useState<7 | 28 | 90>(28);
  const trafficChartData = useMemo(() => buildTrafficChartData(siteTotals, chartDays), [siteTotals, chartDays]);
  const trafficChartTotals = useMemo(() => {
    const sum = trafficChartData.reduce((a, d) => ({ clicks: a.clicks + d.clicks, impressions: a.impressions + d.impressions }), { clicks: 0, impressions: 0 });
    return { ...sum, daysWithData: trafficChartData.filter(d => d.impressions > 0).length };
  }, [trafficChartData]);

  // ─── Dynamic SEO actions ─────────────────────────────────────────────────
  const [actionOverrides, setActionOverrides] = useState<Record<string, "done" | null>>(() => loadActionOverrides());
  const toggleActionDone = (id: string) => {
    setActionOverrides(prev => {
      const next = { ...prev };
      if (next[id] === "done") delete next[id];
      else next[id] = "done";
      saveActionOverrides(next);
      return next;
    });
  };

  // Latest tracked-keyword averages so opportunity titles auto-update from real data.
  const latestKeywordPositions = useMemo(() => {
    const out: Record<string, { position: number; clicks: number; impressions: number }> = {};
    const trackedSnaps = snapshots.filter(s => !s.keyword.startsWith("__"));
    const byKw: Record<string, GscSnapshot[]> = {};
    trackedSnaps.forEach(s => { (byKw[s.keyword] ||= []).push(s); });
    Object.entries(byKw).forEach(([kw, rows]) => {
      const sorted = [...rows].sort((a, b) => b.snapshotDate.localeCompare(a.snapshotDate));
      const latest = sorted[0];
      if (latest) out[kw] = { position: latest.position, clicks: latest.clicks, impressions: latest.impressions };
    });
    return out;
  }, [snapshots]);

  const dynamicActions = useMemo(() => {
    return SEO_ACTIONS.map(a => {
      let status = a.status;
      let title = a.title;
      let detail = a.detail;
      // Auto-update keyword opportunities from live data.
      if (a.trackedKeyword && latestKeywordPositions[a.trackedKeyword]) {
        const { position } = latestKeywordPositions[a.trackedKeyword];
        const posStr = position.toFixed(1);
        title = `"${a.trackedKeyword}" — sitting at position ${posStr}`;
        // Auto-promote to done if it's broken into the top 10.
        if (position > 0 && position <= 10) {
          status = "done";
          detail = `Auto-promoted to Completed — latest GSC position is ${posStr} (top 10). ${a.detail}`;
        }
      }
      // Manual override always wins.
      if (actionOverrides[a.id] === "done") status = "done";
      return { ...a, status, title, detail };
    });
  }, [latestKeywordPositions, actionOverrides]);

  const latestDate = snapshots.length ? snapshots[snapshots.length - 1].snapshotDate : null;
  const latestSnapshots = latestDate ? snapshots.filter(s => s.snapshotDate === latestDate) : [];
  const totalClicks = latestSnapshots.reduce((a, s) => a + s.clicks, 0);
  const totalImpressions = latestSnapshots.reduce((a, s) => a + s.impressions, 0);
  const avgCtr = latestSnapshots.length ? latestSnapshots.reduce((a, s) => a + s.ctr, 0) / latestSnapshots.length : 0;
  const avgPos = latestSnapshots.length ? latestSnapshots.reduce((a, s) => a + s.position, 0) / latestSnapshots.length : 0;

  const filterByPeriod = <T extends { snapshotDate: string }>(rows: T[]) => {
    const allDates = [...new Set(rows.map(s => s.snapshotDate))].sort((a, b) => b.localeCompare(a));
    if (perfPeriod === "latest") return rows.filter(s => s.snapshotDate === allDates[0]);
    const days = perfPeriod === "7d" ? 7 : perfPeriod === "28d" ? 28 : perfPeriod === "3mo" ? 90 : null;
    if (days) {
      const cutoff = format(new Date(Date.now() - days * 86400000), "yyyy-MM-dd");
      return rows.filter(s => s.snapshotDate >= cutoff);
    }
    return rows;
  };

  const perfSnapshots = useMemo(() => filterByPeriod(snapshots), [snapshots, perfPeriod]);
  const perfSiteTotals = useMemo(() => filterByPeriod(siteTotals), [siteTotals, perfPeriod]);

  // Chart: use ONLY per-day site totals (true site-wide numbers from GSC).
  // Keyword data is excluded — it covers only ~20 tracked queries, not all queries,
  // so mixing it in would distort the chart with wrong-magnitude points.
  const perfChartData = useMemo(() => {
    return perfSiteTotals
      .slice()
      .sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate))
      .map(s => ({
        date: format(parseISO(s.snapshotDate), "dd MMM"),
        clicks: s.clicks,
        impressions: s.impressions,
        ctr: +(s.ctr * 100).toFixed(2),
        position: s.position,
      }));
  }, [perfSiteTotals]);

  // Metric cards: use site-totals only (true site-wide GSC numbers).
  // Sum per-day clicks/impressions; derive CTR from totals; impression-weight position.
  const perfSummary = useMemo(() => {
    if (perfSiteTotals.length > 0) {
      const totalClicks = perfSiteTotals.reduce((a, s) => a + s.clicks, 0);
      const totalImpr = perfSiteTotals.reduce((a, s) => a + s.impressions, 0);
      const ctr = totalImpr > 0 ? +((totalClicks / totalImpr) * 100).toFixed(2) : 0;
      const weightedPosSum = perfSiteTotals.reduce((a, s) => a + s.position * s.impressions, 0);
      const avgPos = totalImpr > 0
        ? +(weightedPosSum / totalImpr).toFixed(1)
        : +(perfSiteTotals.reduce((a, s) => a + s.position, 0) / perfSiteTotals.length).toFixed(1);
      return { clicks: totalClicks, impressions: totalImpr, ctr, position: avgPos };
    }
    return {
      clicks: perfSnapshots.reduce((a, s) => a + s.clicks, 0),
      impressions: perfSnapshots.reduce((a, s) => a + s.impressions, 0),
      ctr: perfSnapshots.length ? +(perfSnapshots.reduce((a, s) => a + s.ctr * 100, 0) / perfSnapshots.length).toFixed(2) : 0,
      position: perfSnapshots.length ? +(perfSnapshots.reduce((a, s) => a + s.position, 0) / perfSnapshots.length).toFixed(1) : 0,
    };
  }, [perfSnapshots, perfSiteTotals]);

  const form = useForm<AddSnapshotForm>({
    resolver: zodResolver(addSnapshotSchema),
    defaultValues: {
      snapshotDate: format(new Date(), "yyyy-MM-dd"),
      keyword: "",
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      page: "",
      notes: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: AddSnapshotForm) =>
      apiRequest("POST", "/api/gsc/snapshots", { ...data, ctr: data.ctr / 100 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gsc/snapshots"] });
      form.reset();
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/gsc/snapshots/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/gsc/snapshots"] }),
  });

  const [syncResult, setSyncResult] = useState<{ synced: number; skipped: number; date: string; error?: string } | null>(null);
  const syncMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/gsc/sync"),
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/gsc/snapshots"] });
      setSyncResult(data);
    },
    onError: async (err: any) => {
      let msg = "Sync failed";
      try { const d = await err.json(); msg = d.error || msg; } catch {}
      setSyncResult({ synced: 0, skipped: 0, date: "", error: msg });
    },
  });

  function exportCsv() {
    const headers = "id,date,keyword,clicks,impressions,ctr,position,page,notes";
    const rows = snapshots.map(s =>
      `${s.id},${s.snapshotDate},"${s.keyword}",${s.clicks},${s.impressions},${(s.ctr * 100).toFixed(2)},${s.position},"${s.page ?? ""}","${s.notes ?? ""}"`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gsc-data-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onSubmit(data: AddSnapshotForm) {
    addMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
              <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">SEO Performance Dashboard</h1>
              <Badge variant="outline" className="text-[10px] sm:text-xs bg-red-50 text-red-700 border-red-200">NOINDEX · Internal Only</Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Rainbow Preschools · rainbowpreschools.com · Last snapshot: {latestDate ? format(parseISO(latestDate), "dd MMM yyyy") : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {syncStatus?.lastAutoSync && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                Last update: {(() => {
                  const diff = Math.round((Date.now() - new Date(syncStatus.lastAutoSync).getTime()) / 60000);
                  return diff < 2 ? "just now" : diff < 60 ? `${diff} min ago` : `${Math.round(diff / 60)} hr ago`;
                })()}
              </span>
            )}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { setSyncResult(null); syncMutation.mutate(); }}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${syncMutation.isPending ? "animate-spin" : ""}`} />
              {syncMutation.isPending ? "Syncing…" : "Sync from GSC"}
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowForm(v => !v)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Data
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
          {([
            { id: "overview", label: "GSC Overview", icon: <BarChart2 className="h-4 w-4" /> },
            { id: "keywords", label: "Keywords & Pages", icon: <Target className="h-4 w-4" /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-red-600 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sync Result Banner */}
        {syncResult && (
          <div className={`rounded-lg border p-3 flex items-start gap-3 ${syncResult.error ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
            {syncResult.error
              ? <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              : <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            }
            <div className="text-sm">
              {syncResult.error
                ? <><strong className="text-red-700">Sync failed:</strong> <span className="text-red-600">{syncResult.error}</span></>
                : <><strong className="text-green-700">Sync complete!</strong> <span className="text-green-700">{syncResult.synced} keywords updated, {syncResult.skipped} not found in GSC data for the last 3 days.</span></>
              }
            </div>
            <button onClick={() => setSyncResult(null)} className="ml-auto text-gray-400 hover:text-gray-600 shrink-0">✕</button>
          </div>
        )}

        {/* Add Snapshot Form */}
        {showForm && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add GSC Snapshot</CardTitle>
              <CardDescription>Manually enter data from Google Search Console for a specific date and keyword.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input type="date" {...form.register("snapshotDate")} />
                  {form.formState.errors.snapshotDate && <p className="text-xs text-red-500">{form.formState.errors.snapshotDate.message}</p>}
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Keyword</Label>
                  <Input placeholder="e.g. playschool near me" {...form.register("keyword")} list="keyword-suggestions" />
                  <datalist id="keyword-suggestions">
                    {KEYWORD_PAGE_MATRIX.map(k => <option key={k.keyword} value={k.keyword} />)}
                  </datalist>
                  {form.formState.errors.keyword && <p className="text-xs text-red-500">{form.formState.errors.keyword.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Position</Label>
                  <Input type="number" step="0.1" placeholder="e.g. 14.5" {...form.register("position")} />
                </div>
                <div className="space-y-1">
                  <Label>Clicks</Label>
                  <Input type="number" placeholder="0" {...form.register("clicks")} />
                </div>
                <div className="space-y-1">
                  <Label>Impressions</Label>
                  <Input type="number" placeholder="0" {...form.register("impressions")} />
                </div>
                <div className="space-y-1">
                  <Label>CTR %</Label>
                  <Input type="number" step="0.01" placeholder="e.g. 1.2" {...form.register("ctr")} />
                </div>
                <div className="space-y-1">
                  <Label>Target Page (optional)</Label>
                  <Input placeholder="/best-preschool-near-me-in-thane" {...form.register("page")} />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Notes (optional)</Label>
                  <Textarea placeholder="Context for this data point..." rows={2} {...form.register("notes")} />
                </div>
                <div className="col-span-2 sm:col-span-4 flex gap-2 pt-2">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Saving..." : "Save Snapshot"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* ── Performance Overview ── */}
            <Card>
              <CardContent className="pt-5 pb-5">
                {/* Period buttons */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {([["24 hours", "latest"], ["7 days", "7d"], ["28 days", "28d"], ["3 months", "3mo"], ["All time", "all"]] as [string, string][]).map(([label, val]) => (
                    <button key={val} onClick={() => setPerfPeriod(val as typeof perfPeriod)}
                      className={`px-3.5 py-1.5 text-xs rounded-full font-medium border transition-colors ${
                        perfPeriod === val
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {([
                    { key: "clicks",      label: "Total clicks",      color: "#1a73e8", fmt: (v: number) => v.toLocaleString() },
                    { key: "impressions", label: "Total impressions",  color: "#9333ea", fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v.toString() },
                    { key: "ctr",         label: "Average CTR",       color: "#059669", fmt: (v: number) => `${v}%` },
                    { key: "position",    label: "Average position",   color: "#dc2626", fmt: (v: number) => v.toString() },
                  ] as const).map(metric => {
                    const active = activeMetrics.has(metric.key);
                    const val = perfSummary[metric.key];
                    return (
                      <button key={metric.key} onClick={() => toggleMetric(metric.key)}
                        className={`text-left p-3.5 rounded-lg border-2 transition-all ${
                          active ? "" : "border-gray-100 dark:border-gray-800 opacity-55 hover:opacity-80"
                        }`}
                        style={active ? { borderColor: metric.color } : {}}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: metric.color, backgroundColor: active ? metric.color : "transparent" }}>
                            {active && <svg className="w-2 h-2 text-white" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{metric.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white" style={active ? { color: metric.color } : {}}>
                          {metric.fmt(val)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Performance line chart */}
                {perfChartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={perfChartData} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        interval="preserveStartEnd"
                        minTickGap={28}
                      />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} width={32} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} width={42} />
                      <Tooltip
                        contentStyle={{ fontSize: 12 }}
                        formatter={(v: number, name: string) =>
                          name === "Impressions" ? [v.toLocaleString(), name] :
                          name === "CTR %" ? [`${v}%`, name] :
                          name === "Avg Position" ? [`#${v}`, name] :
                          [v, name]
                        }
                      />
                      {activeMetrics.has("clicks") && (
                        <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#1a73e8" strokeWidth={2} dot={perfChartData.length > 30 ? false : { r: 3, fill: "#1a73e8" }} activeDot={{ r: 5 }} name="Clicks" />
                      )}
                      {activeMetrics.has("impressions") && (
                        <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#9333ea" strokeWidth={2} dot={perfChartData.length > 30 ? false : { r: 3, fill: "#9333ea" }} activeDot={{ r: 5 }} name="Impressions" />
                      )}
                      {activeMetrics.has("ctr") && (
                        <Line yAxisId="left" type="monotone" dataKey="ctr" stroke="#059669" strokeWidth={2} strokeDasharray="5 3" dot={perfChartData.length > 30 ? false : { r: 3, fill: "#059669" }} activeDot={{ r: 5 }} name="CTR %" />
                      )}
                      {activeMetrics.has("position") && (
                        <Line yAxisId="right" type="monotone" dataKey="position" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 3" dot={perfChartData.length > 30 ? false : { r: 3, fill: "#dc2626" }} activeDot={{ r: 5 }} name="Avg Position" />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
                    {perfChartData.length === 0 ? "No data for selected period." : "Only one snapshot in this period — select a wider range to see trends."}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Keyword Performance Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Keyword Performance</CardTitle>
                <CardDescription>24-hour deltas vs previous day, plus 30/90-day forecast. Lower position = better ranking.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {isLoading ? (
                  <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
                        <th className="pb-2 pr-4 font-medium">Keyword</th>
                        <th className="pb-2 px-3 font-medium text-center">Position</th>
                        <th className="pb-2 px-3 font-medium text-center" title="Projected position in the next 24 hours based on the latest day-over-day trend. Green = improving (moving up), Red = slipping.">Pos in 24h</th>
                        <th className="pb-2 px-3 font-medium text-right">Clicks</th>
                        <th className="pb-2 px-3 font-medium text-right">Impr.</th>
                        <th className="pb-2 px-3 font-medium text-center" title="24h impressions change vs previous day">Impr Δ 24h</th>
                        <th className="pb-2 px-3 font-medium text-right">CTR</th>
                        <th className="pb-2 px-3 font-medium text-center">30d Forecast</th>
                        <th className="pb-2 pl-3 font-medium text-center">90d Forecast</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {summary.map(({ keyword, latest, posChange, forecast30, forecast90 }) => {
                        const d24 = deltas24h[keyword.toLowerCase()];
                        const pos24 = d24?.posDelta ?? null;
                        const impr24 = d24?.imprDelta ?? null;
                        return (
                        <tr key={keyword} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{keyword}</div>
                            {latest.page && (
                              <div className="text-xs text-gray-400 truncate max-w-[200px]">{latest.page}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${positionColor(latest.position)}`}>
                              #{latest.position.toFixed(1)} <span className="opacity-60 font-normal">{positionLabel(latest.position)}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {pos24 === null ? (
                              <span className="text-xs text-gray-300">—</span>
                            ) : (() => {
                              const projected = Math.max(1, latest.position + pos24);
                              const improving = pos24 < -0.1;
                              const worsening = pos24 > 0.1;
                              const cls = improving
                                ? "text-green-700 bg-green-50 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                                : worsening
                                ? "text-red-700 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                                : "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
                              return (
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`} title={improving ? "Improving" : worsening ? "Slipping" : "Holding"}>
                                  #{projected.toFixed(1)}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{latest.clicks}</td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{latest.impressions.toLocaleString()}</td>
                          <td className="py-3 px-3 text-center">
                            {impr24 === null ? (
                              <span className="text-xs text-gray-300">—</span>
                            ) : (
                              <span className={`text-xs font-medium ${impr24 > 0 ? "text-green-600" : impr24 < 0 ? "text-red-500" : "text-gray-400"}`}>
                                {impr24 === 0 ? "0" : (impr24 > 0 ? "+" : "") + impr24.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{(latest.ctr * 100).toFixed(1)}%</td>
                          <td className="py-3 px-3 text-center">
                            {forecast30 !== null ? (
                              <span className={`text-xs font-semibold ${forecast30 < latest.position ? "text-green-600" : "text-red-500"}`}>
                                #{forecast30.toFixed(1)}
                              </span>
                            ) : <span className="text-xs text-gray-300">—</span>}
                          </td>
                          <td className="py-3 pl-3 text-center">
                            {forecast90 !== null ? (
                              <span className={`text-xs font-semibold ${forecast90 < latest.position ? "text-green-600" : "text-red-500"}`}>
                                #{forecast90.toFixed(1)}
                              </span>
                            ) : <span className="text-xs text-gray-300">—</span>}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Position Over Time</CardTitle>
                  <CardDescription className="text-xs">Lower = better. Select keywords to compare.</CardDescription>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Array.from(new Set(snapshots.map(s => s.keyword))).map(kw => (
                      <button
                        key={kw}
                        onClick={() => setSelectedKeywords(prev =>
                          prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
                        )}
                        className={`px-2 py-0.5 rounded-full text-xs border transition-all ${selectedKeywords.includes(kw)
                          ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200"
                          : "border-gray-200 text-gray-500 hover:border-gray-400"
                        }`}
                        style={selectedKeywords.includes(kw) && KEYWORD_COLORS[kw]
                          ? { borderColor: KEYWORD_COLORS[kw], color: KEYWORD_COLORS[kw], backgroundColor: KEYWORD_COLORS[kw] + "15" }
                          : {}}
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={positionChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis reversed tick={{ fontSize: 11 }} domain={["auto", "auto"]} label={{ value: "Pos", angle: -90, position: "insideLeft", fontSize: 10 }} />
                      <Tooltip formatter={(val: number) => [`#${val}`, ""]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {selectedKeywords.map(kw => (
                        <Line
                          key={kw}
                          type="monotone"
                          dataKey={kw}
                          name={kw.length > 20 ? kw.slice(0, 20) + "…" : kw}
                          stroke={KEYWORD_COLORS[kw] || "#6b7280"}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <CardTitle className="text-base">Clicks &amp; Impressions — Last {chartDays} Days (Daily)</CardTitle>
                      <CardDescription className="text-xs">
                        Site-wide totals from Google Search Console, one bar per day. Total: {trafficChartTotals.clicks.toLocaleString()} clicks · {trafficChartTotals.impressions.toLocaleString()} impressions over {trafficChartTotals.daysWithData} days with data.
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {([7, 28, 90] as const).map(d => (
                        <button
                          key={d}
                          onClick={() => setChartDays(d)}
                          className={`text-xs px-2.5 py-1 rounded-full border ${chartDays === d ? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-gray-800 text-gray-600 border-gray-200 dark:border-gray-700"}`}
                          data-testid={`button-chart-${d}d`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={trafficChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={chartDays > 28 ? 6 : chartDays > 7 ? 2 : 0} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="clicks" name="Clicks" fill="#dc2626" radius={[3, 3, 0, 0]} />
                      <Bar yAxisId="right" dataKey="impressions" name="Impressions" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  {trafficChartTotals.daysWithData === 0 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      No daily site totals synced yet. Click <strong>Sync from GSC</strong> at the top to pull the last 28 days from Google Search Console.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Forecast Note */}
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-3 items-start">
                  <Info className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900 dark:text-yellow-100">
                    <strong>Forecast disclaimer:</strong> Projections use a simple linear trend between the two most recent snapshots. They do not account for seasonality, algorithm updates, or the non-linear recovery expected from the Apr 17 redirect fix.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Action Items */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-red-600" />
                SEO Action Items &amp; Suggestions
              </h2>
              <div className="space-y-3">
                {(["pending", "opportunity", "done"] as const).map(statusGroup => {
                  const items = dynamicActions.filter(a => a.status === statusGroup);
                  if (items.length === 0) return null;
                  const label = statusGroup === "done" ? "Completed" : statusGroup === "pending" ? "Pending Action (Manual)" : "Opportunities";
                  return (
                    <div key={statusGroup}>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon status={statusGroup} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                        <Badge variant="outline" className="text-xs">{items.length}</Badge>
                      </div>
                      <div className="space-y-2 ml-7">
                        {items.map(action => (
                          <SuggestionCard
                            key={action.id}
                            action={action}
                            isOverridden={actionOverrides[action.id] === "done"}
                            onToggleDone={() => toggleActionDone(action.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raw Data / Data Explorer */}
            <div>
              <button
                onClick={() => setShowRawData(v => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {showRawData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Data Explorer ({snapshots.length} entries)
              </button>
              {showRawData && (
                <DataExplorer snapshots={snapshots} />
              )}
            </div>
          </div>
        )}

        {/* ── KEYWORDS & PAGES TAB ── */}
        {activeTab === "keywords" && (
          <KeywordsTab snapshots={snapshots} />
        )}

        {/* Footer note */}
        <div className="flex items-center gap-2 text-xs text-gray-400 pb-4 border-t pt-4">
          <Shield className="h-3.5 w-3.5" />
          This page is marked noindex and will not appear in search results. Do not share the URL publicly.
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ action, isOverridden, onToggleDone }: { action: typeof SEO_ACTIONS[number]; isOverridden?: boolean; onToggleDone?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-lg border p-3 bg-white dark:bg-gray-900 ${action.status === "done" ? "opacity-75" : ""}`} data-testid={`card-action-${action.id}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${priorityBadge(action.priority)}`}>{action.priority}</span>
            <span className="text-xs text-gray-400">{action.category}</span>
          </div>
          {open && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">{action.detail}</p>
              <div className="flex items-start gap-1.5 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 rounded p-2">
                <TrendingUp className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span><strong>Expected impact:</strong> {action.impact}</span>
              </div>
              {onToggleDone && (
                <button
                  onClick={onToggleDone}
                  className={`text-xs px-2.5 py-1 rounded border font-medium ${isOverridden ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600" : "bg-green-600 text-white border-green-600 hover:bg-green-700"}`}
                  data-testid={`button-toggle-done-${action.id}`}
                >
                  {isOverridden ? "↩ Move back to active" : "✓ Mark complete"}
                </button>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 mt-0.5"
          data-testid={`button-expand-${action.id}`}
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
