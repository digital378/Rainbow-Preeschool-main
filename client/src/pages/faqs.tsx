import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { ChevronDown, Phone, Search, GraduationCap, Shield, DollarSign, Clock, Bus, BookOpen, Users, Heart } from "lucide-react";
import { FAQ_CATEGORIES } from "@shared/faq-data";

interface FAQ {
  question: string;
  answer: string;
  relatedLink?: { text: string; url: string };
}

interface FAQCategory {
  title: string;
  icon: typeof GraduationCap;
  color: string;
  faqs: FAQ[];
}

// UI-only metadata (icon + colour) for each category, in the same order as FAQ_CATEGORIES.
const UI_META: Array<{ icon: typeof GraduationCap; color: string }> = [
  { icon: GraduationCap, color: "text-red-600 bg-red-50 border-red-200" },   // Admissions & Registration
  { icon: DollarSign,    color: "text-green-600 bg-green-50 border-green-200" }, // Fees & Payments
  { icon: Shield,        color: "text-blue-600 bg-blue-50 border-blue-200" },    // Safety & Security
  { icon: BookOpen,      color: "text-purple-600 bg-purple-50 border-purple-200" }, // Curriculum & Learning
  { icon: Clock,         color: "text-amber-600 bg-amber-50 border-amber-200" },  // Daily Routine & Timings
  { icon: Bus,           color: "text-teal-600 bg-teal-50 border-teal-200" },     // Transport
  { icon: Heart,         color: "text-rose-600 bg-rose-50 border-rose-200" },     // Settling In & Adjustment
  { icon: Users,         color: "text-indigo-600 bg-indigo-50 border-indigo-200" }, // Centres & Locations
];

// Merge shared content with local UI metadata.
// FAQPage JSON-LD is handled by the SSR layer (server/ssr-pages.ts) so Google
// sees it in the raw HTML — no client-side schema duplication needed here.
const faqCategories: FAQCategory[] = FAQ_CATEGORIES.map((cat, i) => ({
  ...cat,
  ...UI_META[i],
}));

const allFAQs = faqCategories.flatMap(cat => cat.faqs);

function FAQItem({ faq, isOpen, onToggle, id }: { faq: FAQ; isOpen: boolean; onToggle: () => void; id: string }) {
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-btn-${id}`;
  return (
    <div className="border-b last:border-b-0">
      <button
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:bg-gray-50/50 transition-colors"
        data-testid={`faq-toggle-${id}`}
      >
        <span className="text-sm sm:text-base font-medium text-gray-900 leading-snug">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-4 pr-8">
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          {faq.relatedLink && (
            <Link href={faq.relatedLink.url} className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium mt-2" data-testid={`faq-link-${id}`}>
              {faq.relatedLink.text} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQs() {
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (key: string) => {
    setOpenFAQs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredCategories = searchQuery.trim()
    ? faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.faqs.length > 0)
    : faqCategories;

  return (
    <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEO
        title="FAQs | Rainbow Preschool International Thane"
        description="Get answers about Rainbow Preschool — admissions, fees, safety, curriculum, timings, and transport. Complete FAQ for parents in Thane."
        keywords="rainbow preschool faq, preschool questions thane, preschool admission faq, preschool fees thane, preschool safety questions, preschool curriculum questions"
        canonical="https://www.rainbowpreschools.com/faqs"
        structuredData={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "FAQs", url: "/faqs" },
        ])}
      />

      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="faq-badge">
            {allFAQs.length} Questions Answered
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Rainbow Preschool International. Can't find your answer? Call us at 82915 68972.
          </p>
        </div>

        <div className="relative mb-8">
          <label htmlFor="faq-search" className="sr-only">Search frequently asked questions</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="faq-search"
            type="text"
            placeholder="Search questions... (e.g., fees, safety, timings)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 text-sm"
            data-testid="faq-search-input"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {faqCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.title}
                href={`#faq-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cat.color} hover:shadow-sm transition-shadow`}
                data-testid={`faq-jump-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="w-3 h-3" />
                {cat.title}
              </a>
            );
          })}
        </div>

        <div className="space-y-8">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card key={cat.title} className="border shadow-sm overflow-hidden" id={`faq-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={`px-5 py-3 border-b flex items-center gap-2 ${cat.color.split(" ").slice(1).join(" ")}`}>
                  <Icon className={`w-4 h-4 ${cat.color.split(" ")[0]}`} />
                  <h2 className={`text-sm font-semibold ${cat.color.split(" ")[0]}`}>{cat.title}</h2>
                  <span className="text-xs text-muted-foreground ml-auto">{cat.faqs.length} questions</span>
                </div>
                <CardContent className="px-5 py-0">
                  {cat.faqs.map((faq, i) => {
                    const key = `${cat.title}-${i}`;
                    return (
                      <FAQItem
                        key={key}
                        faq={faq}
                        isOpen={openFAQs.has(key)}
                        onToggle={() => toggleFAQ(key)}
                        id={key.replace(/\s+/g, "-").toLowerCase()}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No questions match your search.</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} data-testid="faq-clear-search">
              Clear Search
            </Button>
          </div>
        )}

        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still Have Questions?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            We're happy to help! Reach out to us and we'll answer any questions you have about our programmes, centres, or admissions.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" data-testid="faq-cta-contact">
                <Phone className="w-4 h-4" />
                Call 82915 68972
              </Button>
            </Link>
            <Link href="/preschool-admissions">
              <Button variant="outline" className="gap-2" data-testid="faq-cta-admissions">
                <GraduationCap className="w-4 h-4" />
                View Admissions
              </Button>
            </Link>
          </div>
        </div>

        <BlogInternalLinks currentSlug="faqs" />
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/faqs"
          pageName="Frequently Asked Questions | Rainbow Preschool"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          showRating={false}
          schemaId="faqs-eeat"
        />
      </section>

      <CTASection />
    </article>
  );
}
