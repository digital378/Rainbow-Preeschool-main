import { Link } from "wouter";
import { MessageCircle, ClipboardList } from "lucide-react";
import { trackWhatsAppClick, trackCTAClick } from "@/lib/analytics";

export type BlogCTATopic = "playgroup" | "nursery" | "kindergarten" | "admissions" | "general";

interface BlogCTAProps {
  topic?: BlogCTATopic;
  variant?: "mid" | "bottom";
}

const WHATSAPP_URL =
  "https://wa.me/918291568972?text=Hi%2C+I+read+a+Rainbow+Preschool+blog+post+and+would+like+to+know+more+about+admissions.";

const TOPIC_DESTINATIONS: Record<BlogCTATopic, string> = {
  playgroup: "/playgroup",
  nursery: "/nursery",
  kindergarten: "/kindergarten",
  admissions: "/preschool-admissions",
  general: "/preschool-admissions",
};

export function BlogCTA({ topic = "general", variant = "mid" }: BlogCTAProps) {
  const isMid = variant === "mid";
  const enquireHref = TOPIC_DESTINATIONS[topic];

  return (
    <div
      className="my-8 p-5 md:p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border-l-4 border-l-primary border border-red-100 dark:border-red-900/30"
      data-testid={`section-blog-cta-${variant}`}
    >
      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
        Rainbow Preschool International
      </p>
      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1">
        {isMid ? "Book a Free School Visit" : "Interested in Rainbow Preschool?"}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {isMid
          ? "18+ years · 6 centres in Thane · 1 lakh+ students"
          : "Trusted by 1,00,000+ Thane families since 2007 · 4.7★ Google rating · No entrance test"}
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ source_page: `blog_cta_${variant}` })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-semibold hover:bg-[#1ebe5d] transition-colors"
          data-testid={`link-blog-cta-whatsapp-${variant}`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp Us
        </a>
        <Link
          href={enquireHref}
          onClick={() => trackCTAClick("blog_enquire_now", `${variant}_${topic}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          data-testid={`link-blog-cta-enquire-${variant}`}
        >
          <ClipboardList className="w-4 h-4" />
          Enquire Now
        </Link>
      </div>
    </div>
  );
}
