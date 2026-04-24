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

// ─── 15 Commercial Keywords (Task #26 — weekly top-3 tracker) ────────────────
// Mapped to 5 destination pages. Order mirrors TARGET_KEYWORDS in
// server/gsc-sync.ts — keep the two in sync.

type CommercialKeyword = {
  keyword: string;
  page: string;
  pageLabel: string;
};

const COMMERCIAL_15_KEYWORDS: CommercialKeyword[] = [
  { keyword: "playschool near me",        page: "/play-school-near-me",             pageLabel: "Play School Near Me" },
  { keyword: "play school near me",       page: "/play-school-near-me",             pageLabel: "Play School Near Me" },
  { keyword: "best playschool in thane",  page: "/play-school-near-me",             pageLabel: "Play School Near Me" },
  { keyword: "best playschool near me",   page: "/play-school-near-me",             pageLabel: "Play School Near Me" },
  { keyword: "preschool near me",         page: "/best-preschool-near-me-in-thane", pageLabel: "Best Preschool in Thane" },
  { keyword: "preschool in thane",        page: "/best-preschool-near-me-in-thane", pageLabel: "Best Preschool in Thane" },
  { keyword: "preschool near me in thane",page: "/best-preschool-near-me-in-thane", pageLabel: "Best Preschool in Thane" },
  { keyword: "best preschool in thane",   page: "/best-preschool-near-me-in-thane", pageLabel: "Best Preschool in Thane" },
  { keyword: "best preschool near me",    page: "/best-preschool-near-me-in-thane", pageLabel: "Best Preschool in Thane" },
  { keyword: "playgroup near me",         page: "/playgroup",                       pageLabel: "Playgroup Programme" },
  { keyword: "playgroup in thane",        page: "/playgroup",                       pageLabel: "Playgroup Programme" },
  { keyword: "nursery near me",           page: "/nursery",                         pageLabel: "Nursery Programme" },
  { keyword: "nursery in thane",          page: "/nursery",                         pageLabel: "Nursery Programme" },
  { keyword: "kindergarten near me",      page: "/kindergarten",                    pageLabel: "Kindergarten Programme" },
  { keyword: "best kindergarten in thane",page: "/kindergarten",                    pageLabel: "Kindergarten Programme" },
];

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
    page: "/playgroup",
    pageLabel: "Playgroup Programme",
    volume: "High",
    priority: "High",
    targetPos: 8,
    action: "Strengthen 'Playgroup in Thane' H2 and 'near me' FAQ on /playgroup. The legacy /playgroup-in-thane URL now 301s here.",
  },
  {
    keyword: "playgroup in thane",
    page: "/playgroup",
    pageLabel: "Playgroup Programme",
    volume: "Medium",
    priority: "High",
    targetPos: 5,
    action: "Add age guide content (1.5–2.5 years), daily schedule section, and parent testimonials specific to playgroup. Canonical is /playgroup.",
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
    path: "/playgroup",
    label: "Playgroup Programme",
    description: "Targets: 'playgroup in thane', 'playgroup near me', 'toddler playgroup thane'. Canonical for the playgroup keyword cluster.",
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
      { id: "relatedlinks", label: "Links to /playgroup and /nursery", done: true },
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
      { priority: "Medium", text: "Link to related programme pages (/playgroup, /nursery) to distribute link equity and reduce pogo-sticking." },
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
    status: "done", priority: "critical", category: "Technical",
    title: "Request re-indexing of recovered content pages via GSC",
    detail: "Go to GSC → URL Inspection → paste each URL → Request Indexing. GSC allows ~10 requests/day. PRIORITY 1 (top traffic): /national-symbols-of-india-for-kids, /holi-activities-for-kids, /36-motivational-thoughts-of-the-day-for-kids, /sports-day-activities-for-kindergarten, /pre-kg-age-guide. PRIORITY 2 (commercial canonicals only): /, /best-preschool-near-me-in-thane, /play-school-near-me, /preschool-admissions, /nursery, /playgroup, /kindergarten. PRIORITY 3 (routed alias — submit so Google sees the canonical link): /preschool-near-me. Skip /admissions, /centres, /best-preschool-in-thane, /preschool-in-thane, /playgroup-in-thane, /play-school-in-thane, /nursery-school-near-me, /playschool-near-me, /preschool-vs-daycare, /nursery-school-admission, /preparing-your-child-for-preschool — these now 301-redirect to canonical pages.",
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
  // ─── New tasks added 22 Apr 2026 ─────────────────────────────────────────────
  {
    id: "gbp-fresh-reviews",
    status: "pending", priority: "critical", category: "Local SEO",
    title: "Get 5 fresh Google reviews this week (one per centre)",
    detail: "Single biggest lever for 'preschool near me' (#41) and 'playschool near me'. Pick 5 happy parents — one from each of the 5 most-visited centres — and WhatsApp them the direct review link for that centre's Google Business Profile. Goal: 5 new reviews in 7 days, then keep adding 3–5 per month. Review velocity (recent + steady, not bulk) is what Google weights highest.",
    impact: "Each fresh review can move 'near me' position 1–3 spots. 5 reviews could lift 'preschool near me' from #41 to #25–30 within 4 weeks.",
  },
  {
    id: "justdial-sulekha-listings",
    status: "pending", priority: "high", category: "Local SEO",
    title: "List all 6 centres on Justdial + Sulekha (12 free listings)",
    detail: "Justdial.com → 'Add Free Listing' → create one listing per centre with that centre's exact NAP (name + locality suffix, exact address, exact phone). Repeat on Sulekha.com → 'List Your Business'. Use the EXACT same address format the centre uses on its website page and Google Business Profile — even 'Rd' vs 'Road' hurts. Total time: ~2 hours. Cost: free.",
    impact: "Major NAP citation boost. Expect +5–10 spots on all 'near me' and locality keywords within 4–6 weeks of indexing.",
  },
  {
    id: "gbp-photos-monthly",
    status: "pending", priority: "high", category: "Local SEO",
    title: "Add 3 fresh photos per centre to GBP every month",
    detail: "Each centre's GBP needs new visual signals monthly. Mix: 1 classroom shot, 1 activity in progress, 1 exterior/signage. Avoid stock images — Google detects them and they don't help. Set a monthly recurring reminder. 6 centres × 3 photos = 18 photos/month total.",
    impact: "Fresh photo signals correlate with map pack inclusion. Centres with monthly photo uploads see 30–50% more GBP impressions vs. dormant ones.",
  },
  {
    id: "gbp-reply-reviews",
    status: "pending", priority: "medium", category: "Local SEO",
    title: "Reply to every existing Google review across all 6 centres",
    detail: "Open each centre's GBP → Reviews tab → reply to ALL reviews (even old / 5-star ones). Personalised reply, mention centre + child by first name if mentioned, 2–3 sentences. For negative reviews: respond calmly, offer to discuss offline. One-time catch-up effort, then keep up with new reviews same week they arrive.",
    impact: "Engagement signal to Google + improves conversion when prospects read reviews (replies show you care).",
  },
  {
    id: "internal-links-best-thane",
    status: "opportunity", priority: "high", category: "Content",
    title: "Add 3 internal links to /best-preschool-in-thane from top blog posts",
    detail: "/best-preschool-in-thane jumped from #15 to #7 (page 1) — defend and push it to top 3 with internal links. Add a contextual link from these 3 high-traffic blog posts: /national-symbols-of-india-for-kids, /36-motivational-thoughts-of-the-day-for-kids, /sports-day-activities-for-kindergarten. Use anchor text 'best preschool in Thane' (exact match), 'top preschool in Thane' (variation), and 'leading preschool in Thane' (synonym).",
    impact: "Targeted internal links can push a #7 page to top 3 within 2–4 weeks. Top 3 = 3–5× more clicks than #7.",
  },
  {
    id: "refresh-national-symbols",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Refresh /national-symbols-of-india-for-kids before July 2026",
    detail: "Page slipped from #7.7 → #15 (off page 1) post Republic Day. Independence Day is the next peak (15 Aug). Refresh by mid-July: add downloadable PDF colouring/activity sheet, embed a 30-second symbol overview video, update publish date, add an FAQ section ('Why is the lotus our national flower?', etc.), add 2026 to title. Submit to GSC after refresh.",
    impact: "Defends a 95K-impression page. A successful refresh should restore page 1 ranking ahead of Aug 15 traffic peak.",
  },
  {
    id: "holi-2027-calendar",
    status: "opportunity", priority: "low", category: "Content",
    title: "Calendar-mark Holi 2027 refresh for late February",
    detail: "/holi-activities-for-kids dropped to #82 — entirely seasonal, normal post-Holi behaviour. Set a calendar reminder for 22 Feb 2027 (3 weeks before Holi 2027) to refresh: update year in title to 2027, add 2–3 new activity ideas, refresh the publish date, add fresh photos. Same pattern works for any festival page.",
    impact: "Recovers a 56K-impression page automatically each year. Refresh 3 weeks before peak captures the rising-search wave.",
  },
  {
    id: "nap-consistency-audit",
    status: "pending", priority: "high", category: "Local SEO",
    title: "Verify NAP consistency for all 6 centres across web",
    detail: "For each centre, confirm Name + Address + Phone are written EXACTLY the same on: (1) the centre's page on rainbowpreschools.com, (2) its Google Business Profile, (3) Justdial listing, (4) Sulekha listing, (5) Facebook page, (6) Instagram bio. Pick one canonical format per centre and propagate. Common slip-ups: 'Rd' vs 'Road', 'Thane W' vs 'Thane West', different phone formatting (+91 vs 0).",
    impact: "Google trusts a centre more when its details match across the web. Inconsistencies cap how high a centre can rank locally.",
  },
  // ─── New tasks added 24 Apr 2026 (SEO recovery sprint) ─────────────────────
  {
    id: "monthly-eeat-refresh",
    status: "pending", priority: "high", category: "Content",
    title: "Bump 'Last Updated' on the 6 commercial pages — first Monday each month",
    detail: "The 6 commercial pages now render an EEATSignals component with a visible 'Last updated' line and dateModified JSON-LD. Each month, edit each page file and update the lastUpdated prop to today's date IF a meaningful copy change was made (a paragraph rewrite is enough to count). Canonical pages with EEATSignals installed: (1) best-preschool-in-thane.tsx → /best-preschool-near-me-in-thane (also doubles as 'preschool near me' canonical), (2) play-school-near-me.tsx → /play-school-near-me, (3) playgroup-landing.tsx → /playgroup, (4) nursery-landing.tsx → /nursery, (5) kindergarten-landing.tsx → /kindergarten, (6) preschool-admissions.tsx → /preschool-admissions. See docs/seo-topic-url-map.md.",
    impact: "Fresh dateModified is a measurable Google freshness signal. Monthly bumps with real edits typically lift commercial keyword positions 1–2 spots over a quarter.",
  },
  {
    id: "seasonal-playbook-monthly",
    status: "pending", priority: "high", category: "Content",
    title: "Run the monthly task from docs/seo-seasonal-refresh-playbook.md",
    detail: "First Monday each month: open docs/seo-seasonal-refresh-playbook.md → 'Monthly tasks'. Steps: (1) GSC review for keyword/page drops, (2) bump Last Updated on commercial pages where copy changed, (3) refresh ONE blog post with high impressions but CTR<1.5%, (4) check internal-link health. The seasonal calendar table tells you which post to publish + which to refresh for the upcoming month.",
    impact: "Counters the mid-March 2026 70% impression collapse. Steady monthly cadence prevents content from going stale and matches Indian preschool seasonality.",
  },
  {
    id: "seasonal-playbook-quarterly",
    status: "pending", priority: "medium", category: "Content",
    title: "Quarterly deep refresh of 6 commercial pages + top 10 blog posts",
    detail: "First week of each quarter: follow 'Quarterly deep refresh' in docs/seo-seasonal-refresh-playbook.md. Per commercial page: re-read top-to-bottom, update stats, add 1 FAQ, refresh oldest review in EEATSignals, add 1 internal link to a recent blog post, bump lastUpdated. Per top-10 blog post: add 300+ word section, refresh title with current year, add a fresh EXPLORE_MORE callout, request re-indexing in GSC.",
    impact: "Quarterly deep refresh on Tier 1 pages is the strongest defence against algorithm volatility. Pages that get this treatment routinely re-enter top 3 within 30–60 days.",
  },
  {
    id: "topic-url-map-discipline",
    status: "pending", priority: "medium", category: "Content",
    title: "Consult docs/seo-topic-url-map.md before any new page or blog post",
    detail: "All keyword → canonical URL ownership is now documented in docs/seo-topic-url-map.md. Before writing any new page, blog post, or even ad landing page: (1) find the keyword family in the map, (2) confirm there's no existing canonical that already targets it, (3) if writing supporting content, link back to the canonical with the exact anchor text listed in the map. New pages must add a row before publishing. Treat this as the cannibalisation firewall.",
    impact: "Keyword cannibalisation was responsible for /playgroup-in-thane, /nursery-in-thane, /kindergarten-in-thane being 301'd in the April 2026 sprint. The map prevents that pattern from repeating.",
  },
  {
    id: "annual-content-audit",
    status: "opportunity", priority: "low", category: "Content",
    title: "Run annual content audit every January (next: Jan 5, 2027)",
    detail: "Once a year, follow 'Annual content audit' in docs/seo-seasonal-refresh-playbook.md. Pull every URL from sitemap.xml + 12-month GSC data, sunset pages with <5 clicks AND <500 impressions (consolidate into stronger pages with 301s), then full rewrite of the 6 commercial pages, then schema validation pass on every commercial + locality page.",
    impact: "Single biggest yearly compounding effect. Pruning weak URLs concentrates link equity on canonical pages and lifts site-wide quality signals.",
  },
  {
    id: "seasonal-republic-day",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Republic Day content — publish/refresh by 10 Jan (annual)",
    detail: "Annual reminder: publish 'Republic Day Activities for Preschoolers (YYYY)' AND refresh existing Republic Day blog by 10 Jan each year so it indexes before the 26 Jan peak. Update title year, swap 2-3 photos, add 1 new craft idea, refresh datePublished. See docs/seo-seasonal-refresh-playbook.md → Jan row.",
    impact: "Republic Day searches spike 15-26 Jan; content published <2 weeks ahead barely indexes in time. Locking in the 10 Jan deadline captures the full peak window.",
  },
  {
    id: "seasonal-holi",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Holi content — refresh by 28 Feb (3 weeks before Holi, annual)",
    detail: "Annual reminder: refresh /holi-activities-for-kids by 28 Feb (3 weeks before Holi). Update title year, refresh hero image, add 2-3 new ideas. /holi-activities-for-kids dropped to #82 post-Holi 2026 — predictable seasonal cycle. See docs/seo-seasonal-refresh-playbook.md → Mar row.",
    impact: "Holi content historically drives ~180 clicks/year. Hitting the 28 Feb refresh deadline restores rankings to top-10 by mid-March.",
  },
  {
    id: "seasonal-independence-day",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Independence Day content — publish/refresh by 25 Jul (annual)",
    detail: "Annual reminder: publish 'Independence Day Activities for Preschoolers (YYYY)' AND refresh /national-symbols-of-india-for-kids by 25 Jul (3 weeks before 15 Aug). Update year, add new craft, refresh datePublished. See docs/seo-seasonal-refresh-playbook.md → Aug row.",
    impact: "/national-symbols-of-india-for-kids = 95k impressions / 104 clicks in last 3 months. Annual refresh keeps this top-traffic asset compounding.",
  },
  {
    id: "seasonal-sports-day",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Sports Day content — refresh by 20 Aug (3-4 weeks before sports days, annual)",
    detail: "Annual reminder: refresh /sports-day-activities-for-kindergarten by 20 Aug. Schools across Thane hold sports days from mid-Sep to mid-Oct, so parents/teachers search Aug-Sep. Update photos, add this year's class theme suggestions, refresh year in title. See docs/seo-seasonal-refresh-playbook.md → Sep row.",
    impact: "/sports-day-activities-for-kindergarten = 16k impressions / 101 clicks last 3 months. Hitting the lead-time deadline doubles peak-season clicks.",
  },
  {
    id: "seasonal-childrens-day",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Children's Day content — publish by 25 Oct (annual, 3 weeks before 14 Nov)",
    detail: "Annual reminder: publish 'Children's Day Celebration Ideas for Preschoolers (YYYY)' by 25 Oct so it indexes before 14 Nov. Pair with a refresh of /nursery (canonical for 'playgroup near me' cluster) — bump EEATSignals lastUpdated and add a Pandit Nehru–themed craft section. See docs/seo-seasonal-refresh-playbook.md → Nov row.",
    impact: "Children's Day is the only festival peak we currently have NO dedicated content for — pure greenfield. Capturing the Nov spike also lifts /nursery rankings during the Dec admissions warm-up.",
  },
  {
    id: "seasonal-diwali",
    status: "opportunity", priority: "medium", category: "Content",
    title: "Diwali content — refresh by 25 Sep (3 weeks before Diwali, annual)",
    detail: "Annual reminder: refresh /diwali-activity-for-kindergarten by 25 Sep. Bump year in title, refresh hero image, add a fresh activity, update datePublished. See docs/seo-seasonal-refresh-playbook.md → Oct row.",
    impact: "Diwali is India's largest festival peak; 3-week lead time is the difference between page-1 and page-3 during the Oct surge.",
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

// ─── 15 Commercial Keywords Panel ─────────────────────────────────────────────
// Per-keyword view of the 15 commercial terms with current position, 7-day
// change and the destination URL each one should rank for. Source data is
// the per-day per-keyword rows (`__daily__:<keyword>`) that the GSC sync
// writes for the last 8 days; we fall back to the main keyword snapshots
// when no daily data is available yet.

type Commercial15Row = {
  keyword: string;
  page: string;
  pageLabel: string;
  position: number | null;
  change7d: number | null;
  imprLatest: number;
  daysOfData: number;
};

function computeCommercial15Rows(
  dailySnaps: GscSnapshot[],
  fallbackPositions: Record<string, { position: number; clicks: number; impressions: number }>,
): Commercial15Row[] {
  const byKw: Record<string, GscSnapshot[]> = {};
  dailySnaps.forEach(s => {
    const kw = s.keyword.replace(/^__daily__:/, "").toLowerCase();
    (byKw[kw] ||= []).push(s);
  });

  return COMMERCIAL_15_KEYWORDS.map(({ keyword, page, pageLabel }) => {
    const rows = (byKw[keyword] || []).slice().sort((a, b) =>
      a.snapshotDate.localeCompare(b.snapshotDate)
    );
    const latest = rows[rows.length - 1];
    const oldest = rows[0];

    let position: number | null = latest ? latest.position : null;
    let change7d: number | null = null;
    if (latest && oldest && latest !== oldest) {
      // Lower position = better, so a NEGATIVE change means the keyword improved.
      change7d = +(latest.position - oldest.position).toFixed(1);
    }

    // Fall back to the main keyword snapshot (90-day average) when the daily
    // window has no data — this keeps the panel populated even on a fresh DB.
    if (position === null) {
      const fallback = fallbackPositions[keyword.toLowerCase()];
      if (fallback) position = fallback.position;
    }

    return {
      keyword,
      page,
      pageLabel,
      position,
      change7d,
      imprLatest: latest?.impressions ?? 0,
      daysOfData: rows.length,
    };
  });
}

function commercial15ChangeClasses(change: number | null) {
  if (change === null) return "text-gray-400";
  // Negative change = position got smaller = improved (good)
  if (change < -0.5) return "text-green-600 dark:text-green-400";
  if (change > 0.5) return "text-red-500 dark:text-red-400";
  return "text-gray-500 dark:text-gray-400";
}

function Commercial15Panel({ rows }: { rows: Commercial15Row[] }) {
  // Group by destination page to make the canonical → keyword cluster obvious.
  const grouped = useMemo(() => {
    const m = new Map<string, { pageLabel: string; items: Commercial15Row[] }>();
    rows.forEach(r => {
      if (!m.has(r.page)) m.set(r.page, { pageLabel: r.pageLabel, items: [] });
      m.get(r.page)!.items.push(r);
    });
    return Array.from(m.entries());
  }, [rows]);

  const inTop3 = rows.filter(r => r.position !== null && r.position <= 3).length;
  const onPage1 = rows.filter(r => r.position !== null && r.position > 3 && r.position <= 10).length;
  const beyond  = rows.filter(r => r.position !== null && r.position > 10).length;
  const noData  = rows.filter(r => r.position === null).length;

  return (
    <Card data-testid="card-commercial-15-keywords">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-red-600" />
              15 Commercial Keywords
              <Badge variant="outline" className="text-xs font-normal">Weekly tracker</Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              The 15 commercial keywords mapped to their 5 destination pages. Auto-synced every 6 hours from Google Search Console (well above the weekly cadence). 7-day change is the day-over-day delta from the oldest to newest day in the last 8 days of GSC data — green means the keyword improved (lower position = better).
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" data-testid="stat-commercial15-top3">
              <CheckCircle2 className="h-3 w-3" /> {inTop3} in top 3
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" data-testid="stat-commercial15-page1">
              {onPage1} on page 1
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800" data-testid="stat-commercial15-beyond">
              {beyond} beyond #10
            </span>
            {noData > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700" data-testid="stat-commercial15-nodata">
                {noData} no data yet
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {grouped.map(([page, { pageLabel, items }]) => (
          <div key={page} data-testid={`group-commercial15-${page}`}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{pageLabel}</h3>
              <Badge variant="outline" className="text-xs">{items.length} {items.length === 1 ? "keyword" : "keywords"}</Badge>
              <a
                href={page}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-red-600 inline-flex items-center gap-1"
                data-testid={`link-commercial15-page-${page}`}
              >
                {page} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="pb-2 pr-4 font-medium">Keyword</th>
                    <th className="pb-2 px-3 font-medium text-center">Position</th>
                    <th className="pb-2 px-3 font-medium text-center" title="Change in average position over the last 7 days. Negative (green) = improved.">7-day Δ</th>
                    <th className="pb-2 px-3 font-medium text-right">Impr (latest day)</th>
                    <th className="pb-2 pl-3 font-medium">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map(row => {
                    const kwId = row.keyword.replace(/\s+/g, "-");
                    return (
                      <tr key={row.keyword} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors" data-testid={`row-commercial15-${kwId}`}>
                        <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-white" data-testid={`text-commercial15-keyword-${kwId}`}>
                          {row.keyword}
                        </td>
                        <td className="py-2.5 px-3 text-center" data-testid={`badge-commercial15-position-${kwId}`}>
                          {row.position === null ? (
                            <span className="text-xs text-gray-300">no data</span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${positionColor(row.position)}`}>
                              #{row.position.toFixed(1)} <span className="opacity-60 font-normal">{positionLabel(row.position)}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center" data-testid={`text-commercial15-change-${kwId}`}>
                          {row.change7d === null ? (
                            <span className="text-xs text-gray-300">—</span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${commercial15ChangeClasses(row.change7d)}`}>
                              <TrendIcon change={row.change7d} />
                              {row.change7d === 0 ? "0" : (row.change7d > 0 ? "+" : "") + row.change7d.toFixed(1)}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-xs text-gray-600 dark:text-gray-400">
                          {row.imprLatest > 0 ? row.imprLatest.toLocaleString() : "—"}
                        </td>
                        <td className="py-2.5 pl-3 text-xs">
                          <a
                            href={row.page}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            data-testid={`link-commercial15-destination-${kwId}`}
                          >
                            {row.page} <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
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
    const out: Record<string, { posDelta: number | null; perDayRate: number | null; imprDelta: number | null; latestDate: string | null }> = {};
    Object.entries(byKw).forEach(([kw, rows]) => {
      const sorted = rows.slice().sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));
      const latest = sorted[sorted.length - 1];
      const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

      // Smoothed position delta: average of the last up-to-7 day-over-day
      // changes. Single-day deltas on low-impression keywords are wildly
      // noisy in GSC (a one-impression query in pos 5 vs pos 50 swings the
      // average by ~45), so we always smooth before projecting.
      let rawAvg: number | null = null;
      const window = sorted.slice(-8); // need 8 rows to get 7 deltas
      if (window.length >= 2) {
        const dailyDeltas: number[] = [];
        for (let i = 1; i < window.length; i++) {
          dailyDeltas.push(window[i].position - window[i - 1].position);
        }
        rawAvg = dailyDeltas.reduce((a, b) => a + b, 0) / dailyDeltas.length;
      }

      // 24h projection: cap at ±3 positions/day so freak spikes can't
      // produce silly numbers like "+16.9 → #38".
      const posDelta = rawAvg === null ? null : +Math.max(-3, Math.min(3, rawAvg)).toFixed(1);

      // Long-horizon (30d / 90d) per-day rate: cap much tighter at
      // ±0.3 positions/day. Realistic SEO movement rarely exceeds
      // ~10 positions/month even on actively-optimised keywords.
      const perDayRate = rawAvg === null ? null : +Math.max(-0.3, Math.min(0.3, rawAvg)).toFixed(2);

      out[kw] = {
        posDelta,
        perDayRate,
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

  // ─── 15 commercial keywords data (Task #26) ──────────────────────────────
  // The panel + the synthetic action items below both depend on this.
  const commercial15Rows = useMemo(
    () => computeCommercial15Rows(dailyKeywordSnaps, latestKeywordPositions),
    [dailyKeywordSnaps, latestKeywordPositions]
  );

  // Synthetic action items for any of the 15 commercial keywords that drop out
  // of the top-3 SERP. These are merged into the existing SEO_ACTIONS list so
  // they show up in the dashboard's ACTION_ITEMS section without manual entry.
  const commercial15Actions = useMemo<typeof SEO_ACTIONS>(() => {
    return commercial15Rows
      .filter(r => r.position === null || r.position > 3)
      .map(r => {
        const id = `commercial15-${r.keyword.replace(/\s+/g, "-")}`;
        const isCritical = r.position !== null && r.position > 20;
        const isHigh = r.position !== null && r.position > 10 && r.position <= 20;
        const priority = r.position === null ? "medium" : isCritical ? "critical" : isHigh ? "high" : "medium";

        if (r.position === null) {
          return {
            id,
            trackedKeyword: r.keyword,
            status: "opportunity" as const,
            priority,
            category: "Content",
            title: `"${r.keyword}" — outside top 3 (no GSC data yet)`,
            detail: `Target page: ${r.page} (${r.pageLabel}). The keyword has no impressions in the last 90 days, so we have nothing to track yet. Add an exact-match H2 + a parent-intent FAQ entry on ${r.page} using this exact phrase, then request indexing in GSC. Once Google starts showing the page for this query, the row above will populate and this action item will recompute.`,
            impact: "Indexing the target phrase is the prerequisite to ranking for it.",
          };
        }

        const posStr = r.position.toFixed(1);
        const trend = r.change7d === null
          ? ""
          : r.change7d < -0.5
            ? ` Improving (${r.change7d.toFixed(1)} over 7d) — keep pushing.`
            : r.change7d > 0.5
              ? ` Slipping (+${r.change7d.toFixed(1)} over 7d) — defend immediately.`
              : ` Holding steady over 7d.`;

        return {
          id,
          trackedKeyword: r.keyword,
          status: "opportunity" as const,
          priority,
          category: "Content",
          title: `"${r.keyword}" — outside top 3 (#${posStr})`,
          detail: `Target page: ${r.page} (${r.pageLabel}). Currently ranking #${posStr}, outside the top-3 goal for the weekly tracker.${trend} Push it inside top-3 by: (1) confirming the exact phrase appears as an H2 + FAQ entry on ${r.page}, (2) adding 1 internal link from a top-traffic blog post using this phrase as anchor text, (3) bumping the EEATSignals lastUpdated on the target page after a real copy change.`,
          impact: "Top-3 SERP placement captures ~75% of clicks for the keyword. Each spot recovered here directly grows admissions enquiries.",
        };
      });
  }, [commercial15Rows]);

  const dynamicActions = useMemo(() => {
    const merged = [...SEO_ACTIONS, ...commercial15Actions];
    return merged.map(a => {
      let status = a.status;
      let title = a.title;
      let detail = a.detail;
      // Auto-update keyword opportunities from live data.
      if (a.trackedKeyword && latestKeywordPositions[a.trackedKeyword]) {
        const { position } = latestKeywordPositions[a.trackedKeyword];
        const posStr = position.toFixed(1);
        // commercial15-* actions track a stricter top-3 goal. Everything
        // else uses the legacy top-10 promotion threshold.
        const isCommercial15 = a.id.startsWith("commercial15-");
        const threshold = isCommercial15 ? 3 : 10;
        const tierLabel = isCommercial15 ? "top 3" : "top 10";
        title = isCommercial15
          ? a.title // keep "outside top 3 (#X)" framing for commercial15 items
          : `"${a.trackedKeyword}" — sitting at position ${posStr}`;
        if (position > 0 && position <= threshold) {
          status = "done";
          detail = `Auto-promoted to Completed — latest GSC position is ${posStr} (${tierLabel}). ${a.detail}`;
        }
      }
      // Manual override always wins.
      if (actionOverrides[a.id] === "done") status = "done";
      return { ...a, status, title, detail };
    });
  }, [latestKeywordPositions, actionOverrides, commercial15Actions]);

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

  // Per-keyword totals for the selected period (sums clicks/impressions across
  // the daily snapshots in the window so the Keyword Performance table
  // respects the period selector instead of always showing the 90-day total).
  // Earliest / latest dates we actually have data for, used to show a real
  // date range in the "All time" label instead of the vague phrase.
  const allDataDates = useMemo(() => {
    const dates = allSnapshots.map(s => s.snapshotDate).filter(Boolean).sort();
    return { first: dates[0] || null, last: dates[dates.length - 1] || null };
  }, [allSnapshots]);
  const allTimeLabel = allDataDates.first && allDataDates.last
    ? `${format(parseISO(allDataDates.first), "d MMM yyyy")} – ${format(parseISO(allDataDates.last), "d MMM yyyy")}`
    : "All time";
  const periodLabel: Record<typeof perfPeriod, string> = {
    latest: "Last 24h",
    "7d": "Last 7 days",
    "28d": "Last 28 days",
    "3mo": "Last 3 months",
    all: allTimeLabel,
  };
  const perKeywordPeriodTotals = useMemo(() => {
    const out: Record<string, { clicks: number; impressions: number; ctr: number; position: number }> = {};
    const byKw: Record<string, GscSnapshot[]> = {};
    dailyKeywordSnaps.forEach(s => {
      const kw = s.keyword.replace(/^__daily__:/, "").toLowerCase();
      (byKw[kw] ||= []).push(s);
    });
    Object.entries(byKw).forEach(([kw, rows]) => {
      const sorted = [...rows].sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));
      let windowRows: GscSnapshot[] = [];
      if (perfPeriod === "latest") {
        windowRows = sorted.slice(-1);
      } else {
        const days = perfPeriod === "7d" ? 7 : perfPeriod === "28d" ? 28 : perfPeriod === "3mo" ? 90 : null;
        if (days) {
          const cutoff = format(new Date(Date.now() - days * 86400000), "yyyy-MM-dd");
          windowRows = sorted.filter(s => s.snapshotDate >= cutoff);
        } else {
          windowRows = sorted;
        }
      }
      if (windowRows.length === 0) return;
      const clicks = windowRows.reduce((a, r) => a + r.clicks, 0);
      const impressions = windowRows.reduce((a, r) => a + r.impressions, 0);
      const ctr = impressions > 0 ? clicks / impressions : 0;
      const position = windowRows.reduce((a, r) => a + r.position, 0) / windowRows.length;
      out[kw] = { clicks, impressions, ctr, position };
    });
    return out;
  }, [dailyKeywordSnaps, perfPeriod]);

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
            {/* 15 Commercial Keywords (Task #26) — top of overview because
                this is the team's weekly top-3 watch list. */}
            <Commercial15Panel rows={commercial15Rows} />

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
                    { key: "clicks",      label: `Total clicks (${periodLabel[perfPeriod]})`,      color: "#1a73e8", fmt: (v: number) => v.toLocaleString() },
                    { key: "impressions", label: `Total impressions (${periodLabel[perfPeriod]})`, color: "#9333ea", fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v.toString() },
                    { key: "ctr",         label: `Average CTR (${periodLabel[perfPeriod]})`,       color: "#059669", fmt: (v: number) => `${v}%` },
                    { key: "position",    label: `Average position (${periodLabel[perfPeriod]})`,  color: "#dc2626", fmt: (v: number) => v.toString() },
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
                <CardTitle className="text-base">Keyword Performance <span className="text-xs font-normal text-gray-500">({periodLabel[perfPeriod]})</span></CardTitle>
                <CardDescription>Clicks, impressions and CTR are summed across the selected period above. 24h projection and 30/90-day forecasts use the latest day-over-day trend (smoothed). Lower position = better ranking. <span className="text-amber-600 dark:text-amber-400">Note: Google Search Console caps per-keyword daily data to the top ~1,000 queries/day, so per-keyword totals here will undercount low-volume queries vs the un-dimensioned site total above.</span></CardDescription>
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
                        <th className="pb-2 px-3 font-medium text-right">Clicks <span className="text-gray-400 normal-case font-normal">({periodLabel[perfPeriod]})</span></th>
                        <th className="pb-2 px-3 font-medium text-right">Impr. <span className="text-gray-400 normal-case font-normal">({periodLabel[perfPeriod]})</span></th>
                        <th className="pb-2 px-3 font-medium text-center" title="24h impressions change vs previous day">Impr Δ 24h</th>
                        <th className="pb-2 px-3 font-medium text-right">CTR</th>
                        <th className="pb-2 px-3 font-medium text-center">30d Forecast</th>
                        <th className="pb-2 pl-3 font-medium text-center">90d Forecast</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {summary.map(({ keyword, latest, posChange }) => {
                        const d24 = deltas24h[keyword.toLowerCase()];
                        const pos24 = d24?.posDelta ?? null;
                        const impr24 = d24?.imprDelta ?? null;
                        // Period-aware metrics: sum over selected window when daily data exists.
                        const period = perKeywordPeriodTotals[keyword.toLowerCase()];
                        const dispClicks = period ? period.clicks : latest.clicks;
                        const dispImpr = period ? period.impressions : latest.impressions;
                        const dispCtr = period ? period.ctr : latest.ctr;
                        const dispPosition = period ? period.position : latest.position;
                        // Long-horizon forecast uses the smoothed per-day rate
                        // (capped ±0.3/day) and is clamped to a sensible 1-100 range.
                        const rate = d24?.perDayRate ?? null;
                        const forecast30 = rate === null ? null : +Math.max(1, Math.min(100, dispPosition + rate * 30)).toFixed(1);
                        const forecast90 = rate === null ? null : +Math.max(1, Math.min(100, dispPosition + rate * 90)).toFixed(1);
                        return (
                        <tr key={keyword} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{keyword}</div>
                            {latest.page && (
                              <div className="text-xs text-gray-400 truncate max-w-[200px]">{latest.page}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${positionColor(dispPosition)}`}>
                              #{dispPosition.toFixed(1)} <span className="opacity-60 font-normal">{positionLabel(dispPosition)}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {pos24 === null ? (
                              <span className="text-xs text-gray-300">—</span>
                            ) : (() => {
                              const projected = Math.max(1, dispPosition + pos24);
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
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{dispClicks.toLocaleString()}</td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{dispImpr.toLocaleString()}</td>
                          <td className="py-3 px-3 text-center">
                            {impr24 === null ? (
                              <span className="text-xs text-gray-300">—</span>
                            ) : (
                              <span className={`text-xs font-medium ${impr24 > 0 ? "text-green-600" : impr24 < 0 ? "text-red-500" : "text-gray-400"}`}>
                                {impr24 === 0 ? "0" : (impr24 > 0 ? "+" : "") + impr24.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-gray-700 dark:text-gray-300">{(dispCtr * 100).toFixed(1)}%</td>
                          <td className="py-3 px-3 text-center">
                            {forecast30 !== null ? (
                              <span className={`text-xs font-semibold ${forecast30 < dispPosition ? "text-green-600" : "text-red-500"}`}>
                                #{forecast30.toFixed(1)}
                              </span>
                            ) : <span className="text-xs text-gray-300">—</span>}
                          </td>
                          <td className="py-3 pl-3 text-center">
                            {forecast90 !== null ? (
                              <span className={`text-xs font-semibold ${forecast90 < dispPosition ? "text-green-600" : "text-red-500"}`}>
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
                      <CardTitle className="text-base">Clicks &amp; Impressions <span className="text-xs font-normal text-gray-500">({chartDays} days, daily)</span></CardTitle>
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
