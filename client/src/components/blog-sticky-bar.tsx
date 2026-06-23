import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { MessageCircle, X, ClipboardList } from "lucide-react";
import { trackWhatsAppClick, trackCTAClick } from "@/lib/analytics";

const WHATSAPP_URL =
  "https://wa.me/918291568972?text=Hi%2C+I+read+a+Rainbow+Preschool+blog+post+and+would+like+to+know+more+about+admissions.";

export function BlogStickyBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const scrolledPastFold = currentY > 300;
        const scrollingDown = currentY > lastScrollY.current;
        lastScrollY.current = currentY;
        ticking.current = false;

        if (!scrolledPastFold) {
          setVisible(false);
          return;
        }
        if (scrollingDown) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      data-testid="blog-sticky-bar"
      className={[
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg",
        "transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      aria-label="Book a school visit"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight truncate">
            Book a Free School Visit
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
            6 centres in Thane · No entrance test
          </p>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ source_page: "blog_sticky_bar" })}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white rounded-lg text-xs font-semibold hover:bg-[#1ebe5d] active:bg-[#19b356] transition-colors shrink-0"
          data-testid="link-sticky-bar-whatsapp"
          aria-label="WhatsApp us about admissions"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>

        <Link
          href="/preschool-admissions"
          onClick={() => trackCTAClick("blog_sticky_bar_enquire", "sticky_bar")}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-red-700 active:bg-red-800 transition-colors shrink-0"
          data-testid="link-sticky-bar-enquire"
          aria-label="Enquire about admissions"
        >
          <ClipboardList className="w-4 h-4" />
          Enquire Now
        </Link>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
          data-testid="button-sticky-bar-dismiss"
          aria-label="Dismiss this bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
