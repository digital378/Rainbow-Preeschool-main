import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/cta-section";
import { HOME_VISITOR_FAQS } from "@/pages/visitor-page-copy";
import { HOME_VISITOR_INTERLINK_SEGMENTS } from "@/pages/visitor-page-copy";

const helpfulLinks = [
  { href: "/about", label: "About Rainbow" },
  { href: "/programmes", label: "Programmes" },
  { href: "/playgroup", label: "Playgroup" },
  { href: "/nursery", label: "Nursery" },
  { href: "/kindergarten", label: "Kindergarten" },
  { href: "/happy-times", label: "Happy Times" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faqs", label: "FAQs" },
  { href: "/testimonials", label: "Parent reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/preschool-admissions", label: "Admissions" },
  { href: "/play-school-near-me", label: "Find a centre" },
  { href: "/best-preschool-near-me-in-thane", label: "Best preschool guide" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

export function AfterWalkthrough() {
  return (
    <div id="after-walkthrough" className="walk-after">
      <section className="walk-after-faq" aria-labelledby="walk-faq-heading">
        <div className="walk-after-inner">
          <p className="walk-eyebrow"><i />A few helpful answers</p>
          <h2 id="walk-faq-heading">Frequently asked questions</h2>
          <p className="walk-after-intro">A quick guide to programmes, centres, and visiting Rainbow Preschool.</p>
          <div className="walk-faq-list">
            {HOME_VISITOR_FAQS.map((faq, index) => (
              <details key={faq.question} className="walk-faq">
                <summary>{faq.question}</summary>
                <p>
                  {faq.answerSegments.map((segment, segmentIndex) =>
                    segment.href
                      ? <a href={segment.href} key={`${index}-${segmentIndex}`}>{segment.text}</a>
                      : <span key={`${index}-${segmentIndex}`}>{segment.text}</span>
                  )}
                </p>
              </details>
            ))}
          </div>
          <nav className="walk-helpful-links" aria-label="More from Rainbow">
            {helpfulLinks.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight aria-hidden="true" /></Link>
            ))}
            {HOME_VISITOR_INTERLINK_SEGMENTS.filter((segment) => segment.href).map((segment) => (
              <Link key={segment.href} href={segment.href!}>{segment.text}<ArrowUpRight aria-hidden="true" /></Link>
            ))}
            <a href="https://www.google.com/maps/search/Rainbow+Preschool+Thane" target="_blank" rel="noopener noreferrer">
              Find Rainbow on Google Maps<ArrowUpRight aria-hidden="true" />
            </a>
            <a href="https://wa.me/918291568972?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20admissions%20at%20Rainbow%20Preschool." target="_blank" rel="noopener noreferrer">
              WhatsApp Rainbow<ArrowUpRight aria-hidden="true" />
            </a>
          </nav>
        </div>
      </section>
      <div className="walk-after-cta">
        <CTASection />
        <a className="walk-back-top" href="#experience">Back to the walkthrough <ArrowRight aria-hidden="true" /></a>
      </div>
      <Footer />
    </div>
  );
}

export default AfterWalkthrough;