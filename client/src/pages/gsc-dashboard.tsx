import { useState, useMemo } from "react";
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
  Lightbulb, ExternalLink, Plus, Trash2, Download, ChevronDown, ChevronUp,
  BarChart2, Search, Zap, RefreshCw, Info, Shield, Target, FileText,
  MapPin, Star, ArrowRight, Circle, CheckSquare, Square,
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
      { id: "reviews", label: "10+ genuine parent reviews visible", done: false },
      { id: "comparison", label: "Comparison table or 'Why Rainbow?' section", done: false },
      { id: "wordcount", label: "2,500+ words of substantive content", done: false },
      { id: "cta", label: "Prominent phone/WhatsApp CTA above fold", done: true },
      { id: "map", label: "Interactive map showing all 6 centres", done: true },
      { id: "internal", label: "Linked from homepage quick nav", done: true },
      { id: "citations", label: "NAP matches Justdial/Sulekha/Google Maps", done: false },
      { id: "awards", label: "Awards, accreditations, or trust signals visible", done: false },
      { id: "images", label: "Original campus photos with alt text", done: true },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: true },
    ],
    improvements: [
      { priority: "Critical", text: "Add 10+ genuine parent reviews with star ratings visible on page — critical for E-E-A-T and review schema eligibility." },
      { priority: "High", text: "Add 'Why Rainbow over others?' comparison section (safety record, teacher ratio, curriculum, awards) — targets informational queries from undecided parents." },
      { priority: "High", text: "Build local citations: submit NAP consistently to Justdial, Sulekha, Indiamart, and UrbanPro. Each citation = a local ranking signal." },
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
      { id: "reviews", label: "Parent reviews specific to play school experience", done: false },
      { id: "schedule", label: "Sample daily schedule section", done: true },
      { id: "wordcount", label: "2,500+ words of quality content", done: false },
      { id: "cta", label: "WhatsApp/phone CTA above fold", done: true },
      { id: "map", label: "Map or centre list visible", done: false },
      { id: "internal", label: "Linked from homepage and footer", done: true },
      { id: "citations", label: "GBP categories include 'Play School'", done: false },
      { id: "bothspelling", label: "Both 'playschool' and 'play school' spellings used naturally in body", done: false },
      { id: "age", label: "Age guide clearly visible (1.5-2.5 years focus)", done: true },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: false },
    ],
    improvements: [
      { priority: "Critical", text: "Ensure both spellings 'playschool' and 'play school' appear naturally in the body content — Google treats them as slightly different queries." },
      { priority: "High", text: "Add a centre list/map section so near-me searchers can instantly see locations. Proximity is the #1 factor for 'near me' rankings." },
      { priority: "High", text: "Update all 6 GBP profiles to include 'Play School' as a primary or secondary business category." },
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
      { id: "faq", label: "FAQ section targeting 'playgroup near me' queries", done: false },
      { id: "ageguide", label: "Clear age guide for 1.5-2.5 year olds", done: true },
      { id: "schedule", label: "Sample daily playgroup schedule", done: false },
      { id: "wordcount", label: "2,000+ words of content", done: false },
      { id: "cta", label: "Clear CTA above fold", done: true },
      { id: "nearme", label: "H2 or section targeting 'playgroup near me' explicitly", done: false },
      { id: "internal", label: "Linked from homepage", done: true },
      { id: "reviews", label: "Parent reviews from playgroup parents", done: false },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: false },
      { id: "images", label: "Photos of children in playgroup activities", done: false },
      { id: "curriculum", label: "Curriculum/programme details visible", done: true },
    ],
    improvements: [
      { priority: "High", text: "Add a dedicated 'Playgroup Near Me in Thane' H2 section with all 6 centre addresses — this signals relevance for 'playgroup near me' to Google." },
      { priority: "High", text: "Add FAQ schema targeting 'playgroup near me' queries specifically — e.g. 'Where can I find a playgroup near me in Thane?'" },
      { priority: "Medium", text: "Add a sample day schedule for playgroup — high-value content that parents search for when comparing options." },
      { priority: "Medium", text: "Add parent testimonials from playgroup parents specifically (not generic preschool testimonials)." },
    ],
  },
  {
    path: "/nursery",
    label: "Nursery Programme",
    description: "Targets: 'nursery near me', 'nursery in thane', 'nursery school thane'.",
    checks: [
      { id: "title", label: "Title includes 'nursery near me' or 'nursery in thane'", done: false },
      { id: "meta", label: "Meta description with strong CTA", done: true },
      { id: "h1", label: "H1 targets nursery keyword", done: true },
      { id: "schema", label: "LocalBusiness schema on page", done: true },
      { id: "faq", label: "FAQ section with FAQPage schema", done: false },
      { id: "nearme", label: "'Nursery near me' section or H2", done: false },
      { id: "ageguide", label: "Clear age range for nursery (2.5-3.5 years)", done: true },
      { id: "curriculum", label: "Nursery curriculum details", done: true },
      { id: "wordcount", label: "2,000+ words of content", done: false },
      { id: "cta", label: "CTA above fold", done: true },
      { id: "internal", label: "Linked from homepage and footer", done: true },
      { id: "reviews", label: "Parent reviews from nursery parents", done: false },
      { id: "breadcrumb", label: "BreadcrumbList schema present", done: false },
      { id: "images", label: "Original nursery classroom photos", done: false },
      { id: "admissions", label: "Admission process/dates section", done: false },
    ],
    improvements: [
      { priority: "High", text: "Update page title to include 'nursery near me in Thane' — this directly affects what queries the page ranks for." },
      { priority: "High", text: "Add FAQ schema targeting 'nursery near me' and 'nursery school in Thane' queries." },
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
      { id: "gbp", label: "All 6 GBP listings link to clean www canonical", done: false },
      { id: "internal", label: "Internal links to all primary keyword pages", done: true },
      { id: "socialproof", label: "Student count / years / centre count visible", done: true },
      { id: "cta", label: "Primary CTA above fold", done: true },
      { id: "mobile", label: "Mobile layout tested — CTA visible on phone", done: true },
      { id: "canonical", label: "Canonical tag points to www version", done: true },
    ],
    improvements: [
      { priority: "Critical", text: "Update all 6 GBP profiles to link to https://www.rainbowpreschools.com/ (no UTM parameters) — prevents redirect hop for GBP visitors and consolidates link equity." },
      { priority: "High", text: "Increase total review count across all GBP centres — more reviews = stronger local pack signals for all 'near me' queries." },
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
      { id: "printable", label: "Printable age guide CTA or download", done: false },
      { id: "internal", label: "Internal links from homepage", done: true },
      { id: "relatedlinks", label: "Links to /playgroup-in-thane and /nursery", done: false },
      { id: "wordcount", label: "1,500+ words of substantive content", done: true },
      { id: "images", label: "Illustrative infographic or table", done: false },
      { id: "social", label: "Social sharing prompt (parent will share with others)", done: false },
      { id: "admissioncta", label: "Admission enquiry CTA within content", done: true },
      { id: "structured", label: "Age comparison table (playgroup/nursery/pre-kg/kg)", done: false },
      { id: "citations", label: "References reputable child development research", done: false },
      { id: "updated", label: "Content reviewed and date-stamped for current year", done: false },
    ],
    improvements: [
      { priority: "High", text: "Add a printable/downloadable age guide or infographic — increases time-on-page and generates natural shares/links from parenting blogs." },
      { priority: "High", text: "Add a structured comparison table: Playgroup (1.5-2.5y) / Nursery (2.5-3.5y) / Pre-KG (3.5-4.5y) / KG (4.5-5.5y) — high snippet potential." },
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
  return useQuery<GscSnapshot[]>({ queryKey: ["/api/gsc/snapshots"] });
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

function buildTrafficChartData(snapshots: GscSnapshot[]) {
  const dateMap: Record<string, { clicks: number; impressions: number; date: string }> = {};
  snapshots.forEach(s => {
    if (!dateMap[s.snapshotDate]) {
      dateMap[s.snapshotDate] = { clicks: 0, impressions: 0, date: s.snapshotDate };
    }
    dateMap[s.snapshotDate].clicks += s.clicks;
    dateMap[s.snapshotDate].impressions += s.impressions;
  });
  return Object.values(dateMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ ...d, date: format(parseISO(d.date), "dd MMM") }));
}

const SEO_ACTIONS = [
  {
    status: "done", priority: "critical", category: "Technical",
    title: "Fixed 24 live pages incorrectly redirecting to /blog",
    detail: "Server redirect map was overriding active routes. Google's bot was receiving 301s for all high-traffic content pages — directly causing the March impressions cliff (~85% drop). Removed from redirects.ts on Apr 17.",
    impact: "Expect impressions recovery to ~4,000–8,000/day within 2–4 weeks as Google re-crawls.",
  },
  {
    status: "done", priority: "high", category: "Technical",
    title: "UTM parameter stripping — canonical URL consolidation",
    detail: "All URLs with UTM parameters now 301-redirect to clean canonical path. Prevents duplicate content from UTM-tagged GBP/social links accumulating separate indexing.",
    impact: "Consolidates link equity to single canonical URL.",
  },
  {
    status: "done", priority: "high", category: "Technical",
    title: "Removed internal links to discontinued programmes",
    detail: "Kids Activity Club and Summer Camp had 8 live internal links across blog content. Server 301 redirects to /programmes already existed. Links replaced with /happy-times and /programmes.",
    impact: "Google will stop re-crawling discontinued URLs and consolidate signals to /programmes.",
  },
  {
    status: "done", priority: "medium", category: "Technical",
    title: "Bot SSR — structured data for all major pages",
    detail: "LocalBusiness schema with per-centre geo coordinates, Review schema, VideoObject JSON-LD, FAQPage schema, BreadcrumbList, Person schema (E-E-A-T).",
    impact: "Enables rich results (stars, FAQ snippets) in SERPs.",
  },
  {
    status: "pending", priority: "critical", category: "Technical",
    title: "Request re-indexing of 24 recovered content pages via GSC",
    detail: "Go to GSC → URL Inspection → paste each URL → Request Indexing. Priority order: /national-symbols-of-india-for-kids, /holi-activities-for-kids, /36-motivational-thoughts-of-the-day-for-kids, /sports-day-activities-for-kindergarten, /pre-kg-age-guide. GSC allows ~10 requests/day.",
    impact: "Speeds up impressions recovery by 1–2 weeks vs. waiting for natural re-crawl.",
  },
  {
    status: "pending", priority: "high", category: "Local SEO",
    title: "Update Google Business Profile website URL",
    detail: "GBP profile should link to https://www.rainbowpreschools.com/ (clean canonical, no UTM). Currently may include UTM parameters that trigger redirect before visitors reach the site. Do this in GBP manager for all 6 centre listings.",
    impact: "Removes redirect hop for GBP visitors; consolidates link equity.",
  },
  {
    status: "opportunity", priority: "high", category: "Content",
    title: "\"best preschool in thane\" — sitting at position 16",
    detail: "Primary commercial keyword. Target page: /best-preschool-near-me-in-thane. Page needs more in-depth content — parent FAQ section, comparison tables, additional genuine reviews, and more local schema signals. Also needs more backlinks from local education/parenting sites.",
    impact: "Moving from pos 16 → pos 5 = ~8× more clicks. Primary lead generation lever.",
  },
  {
    status: "opportunity", priority: "high", category: "Content",
    title: "\"preschool near me\" — sitting at position 23",
    detail: "Near-me searches have strong local intent. Target page: /best-preschool-near-me-in-thane. Page needs proximity signals: LocalBusiness schema for all 6 centres with precise geo, NAP citations in Justdial/Sulekha/Indiamart, consistent address formatting across web.",
    impact: "Near-me ranks are heavily GBP-influenced. Focus on GBP completeness + reviews.",
  },
  {
    status: "opportunity", priority: "medium", category: "Content",
    title: "Informational pages — long-tail traffic recovery",
    detail: "Pages like /national-symbols-of-india-for-kids (95K impressions), /holi-activities-for-kids (56K), and /36-motivational-thoughts had massive traffic before the March redirect issue. Now they should recover, but adding new content sections (printables, activity sheets) can accelerate it.",
    impact: "Restoring informational traffic brings brand awareness and top-of-funnel leads.",
  },
  {
    status: "opportunity", priority: "low", category: "Technical",
    title: "Mobile CTR (0.58%) vs Desktop CTR (0.76%)",
    detail: "Mobile drives 75% of traffic but has lower CTR. Consider updating meta descriptions to be more compelling on mobile SERPs. Rich snippet eligibility (stars, FAQ) can boost mobile CTR without changing position.",
    impact: "0.2% CTR improvement on 299K mobile impressions = ~600 extra clicks/quarter.",
  },
];

// ─── Checklist storage (localStorage) ────────────────────────────────────────

const STORAGE_KEY = "rpi_page_audits_v1";

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

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function GscDashboard() {
  const { data: snapshots = [], isLoading } = useGscData();
  const [activeTab, setActiveTab] = useState<"overview" | "keywords">("overview");
  const [showForm, setShowForm] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(PRIMARY_KEYWORDS.slice(0, 4));

  const summary = useMemo(() => computeKeywordSummary(snapshots), [snapshots]);
  const positionChartData = useMemo(() => buildPositionChartData(snapshots, selectedKeywords), [snapshots, selectedKeywords]);
  const trafficChartData = useMemo(() => buildTrafficChartData(snapshots), [snapshots]);

  const latestDate = snapshots.length ? snapshots[snapshots.length - 1].snapshotDate : null;
  const latestSnapshots = latestDate ? snapshots.filter(s => s.snapshotDate === latestDate) : [];
  const totalClicks = latestSnapshots.reduce((a, s) => a + s.clicks, 0);
  const totalImpressions = latestSnapshots.reduce((a, s) => a + s.impressions, 0);
  const avgCtr = latestSnapshots.length ? latestSnapshots.reduce((a, s) => a + s.ctr, 0) / latestSnapshots.length : 0;
  const avgPos = latestSnapshots.length ? latestSnapshots.reduce((a, s) => a + s.position, 0) / latestSnapshots.length : 0;

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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Performance Dashboard</h1>
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">NOINDEX · Internal Only</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rainbow Preschools · rainbowpreschools.com · Last snapshot: {latestDate ? format(parseISO(latestDate), "dd MMM yyyy") : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { setSyncResult(null); syncMutation.mutate(); }}
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${syncMutation.isPending ? "animate-spin" : ""}`} />
              {syncMutation.isPending ? "Syncing…" : "Sync from GSC"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowApiGuide(v => !v)}>
              <Zap className="h-4 w-4 mr-1" />
              Setup
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

        {/* GSC API Guide */}
        {showApiGuide && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Zap className="h-4 w-4" />
                Automate data fetching — Google Search Console API (Free)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-900 dark:text-blue-100 space-y-3">
              <p>The GSC API is completely free. Setup takes about 15 minutes:</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li><strong>Go to</strong> <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">console.cloud.google.com</a> → Create a new project (free)</li>
                <li><strong>Enable API:</strong> APIs &amp; Services → Enable APIs → search "Search Console API" → Enable</li>
                <li><strong>Create credentials:</strong> APIs &amp; Services → Credentials → Create Service Account → download the JSON key file</li>
                <li><strong>Grant access in GSC:</strong> Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline">GSC</a> → Settings → Users &amp; permissions → Add user → paste the service account email → set permission to "Full"</li>
                <li><strong>Share the JSON key</strong> with your developer — they will store it as a secret and wire up a daily auto-sync route</li>
              </ol>
              <p className="text-xs opacity-70 pt-1">Cost: ₹0. The Search Console API has no usage fees and allows 25,000 queries/day.</p>
            </CardContent>
          </Card>
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
            {/* Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Clicks", value: totalClicks.toLocaleString(), sub: "latest snapshot", icon: <Search className="h-4 w-4" /> },
                { label: "Total Impressions", value: totalImpressions.toLocaleString(), sub: "latest snapshot", icon: <BarChart2 className="h-4 w-4" /> },
                { label: "Avg CTR", value: `${(avgCtr * 100).toFixed(2)}%`, sub: "across tracked keywords", icon: <TrendingUp className="h-4 w-4" /> },
                { label: "Avg Position", value: avgPos.toFixed(1), sub: `${latestSnapshots.length} keywords tracked`, icon: <Minus className="h-4 w-4" /> },
              ].map(card => (
                <Card key={card.label}>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{card.label}</span>
                      <span className="text-gray-400">{card.icon}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Keyword Performance Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Keyword Performance</CardTitle>
                <CardDescription>Position trends and 30/90-day forecast based on observed rate of change. Lower position = better ranking.</CardDescription>
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
                        <th className="pb-2 px-3 font-medium text-center">Change</th>
                        <th className="pb-2 px-3 font-medium text-right">Clicks</th>
                        <th className="pb-2 px-3 font-medium text-right">Impr.</th>
                        <th className="pb-2 px-3 font-medium text-right">CTR</th>
                        <th className="pb-2 px-3 font-medium text-center">30d Forecast</th>
                        <th className="pb-2 pl-3 font-medium text-center">90d Forecast</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {summary.map(({ keyword, latest, posChange, forecast30, forecast90 }) => (
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
                            <div className="flex items-center justify-center gap-1">
                              <TrendIcon change={posChange} />
                              <span className={`text-xs font-medium ${posChange < -0.5 ? "text-green-600" : posChange > 0.5 ? "text-red-500" : "text-gray-400"}`}>
                                {posChange !== 0 ? (posChange > 0 ? "+" : "") + posChange.toFixed(1) : "—"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{latest.clicks}</td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{latest.impressions.toLocaleString()}</td>
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
                      ))}
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
                  <CardTitle className="text-base">Clicks &amp; Impressions Over Time</CardTitle>
                  <CardDescription className="text-xs">Aggregate across all tracked keywords per snapshot date.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={trafficChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="clicks" name="Clicks" fill="#dc2626" radius={[3, 3, 0, 0]} />
                      <Bar yAxisId="right" dataKey="impressions" name="Impressions" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                {(["done", "pending", "opportunity"] as const).map(statusGroup => {
                  const items = SEO_ACTIONS.filter(a => a.status === statusGroup);
                  const label = statusGroup === "done" ? "Completed" : statusGroup === "pending" ? "Pending Action (Manual)" : "Opportunities";
                  return (
                    <div key={statusGroup}>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon status={statusGroup} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                        <Badge variant="outline" className="text-xs">{items.length}</Badge>
                      </div>
                      <div className="space-y-2 ml-7">
                        {items.map((action, i) => (
                          <SuggestionCard key={i} action={action} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raw Data Table */}
            <div>
              <button
                onClick={() => setShowRawData(v => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {showRawData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Raw Snapshot Data ({snapshots.length} entries)
              </button>
              {showRawData && (
                <Card className="mt-3">
                  <CardContent className="overflow-x-auto pt-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b text-left text-gray-500 uppercase tracking-wide">
                          {["Date", "Keyword", "Pos", "Clicks", "Impr.", "CTR", "Page", "Notes", ""].map(h => (
                            <th key={h} className="pb-2 pr-3 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {[...snapshots].reverse().map(s => (
                          <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                            <td className="py-1.5 pr-3 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">{s.snapshotDate}</td>
                            <td className="py-1.5 pr-3 max-w-[160px] truncate">{s.keyword}</td>
                            <td className="py-1.5 pr-3 font-mono">{s.position.toFixed(1)}</td>
                            <td className="py-1.5 pr-3 font-mono">{s.clicks}</td>
                            <td className="py-1.5 pr-3 font-mono">{s.impressions.toLocaleString()}</td>
                            <td className="py-1.5 pr-3 font-mono">{(s.ctr * 100).toFixed(2)}%</td>
                            <td className="py-1.5 pr-3 max-w-[120px] truncate text-gray-400">{s.page ?? "—"}</td>
                            <td className="py-1.5 pr-3 max-w-[160px] truncate text-gray-400">{s.notes ?? ""}</td>
                            <td className="py-1.5">
                              <button
                                onClick={() => deleteMutation.mutate(s.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
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

function SuggestionCard({ action }: { action: typeof SEO_ACTIONS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-lg border p-3 bg-white dark:bg-gray-900 ${action.status === "done" ? "opacity-75" : ""}`}>
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
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 mt-0.5"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
