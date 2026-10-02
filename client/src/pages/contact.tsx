import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { BranchCard } from "@/components/branch-card";
import { SEO } from "@/components/seo";
import { EEATSignals } from "@/components/eeat-signals";
import { CONTACT_PAGE_COPY, CONTACT_PAGE_SCHEMA, CONTACT_BREADCRUMB_SCHEMA } from "@shared/contact-page-copy";
import { Phone, Mail, Clock, MapPin, Award, ClipboardList, Images, Navigation as NavigationIcon } from "lucide-react";

export default function Contact() {
  const emailLinkRef = useRef<HTMLAnchorElement>(null);
  const hasFirstPaintHeading = useRef(
    typeof document !== "undefined" && !!document.getElementById("contact-initial-h1")
  );

  useLayoutEffect(() => {
    if (hasFirstPaintHeading.current) {
      document.getElementById("contact-initial")?.classList.add("contact-hydrated");
      return () => document.getElementById("contact-initial")?.remove();
    }
  }, []);

  useEffect(() => {
    const link = emailLinkRef.current;
    if (!link?.parentNode) return;
    const start = document.createComment("email_off");
    const end = document.createComment("/email_off");
    link.parentNode.insertBefore(start, link);
    link.parentNode.insertBefore(end, link.nextSibling);
    return () => {
      start.remove();
      end.remove();
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://eeconfigstaticfiles.blob.core.windows.net/staticfiles/rpsinternational/ee-form-widget/form-5/widget.js";
    script.async = true;
    const container = document.getElementById("ee-form-5");
    if (container) {
      container.appendChild(script);
    }
    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <article className="contact-page pt-20 md:pt-24">
      <SEO
        title={CONTACT_PAGE_COPY.title}
        description={CONTACT_PAGE_COPY.description}
        keywords={null}
        canonical="/contact"
        lang="en-IN"
        ogImage={CONTACT_PAGE_COPY.ogImage}
        ogImageAlt={CONTACT_PAGE_COPY.ogImageAlt}
        ogImageType="image/jpeg"
        ogImageWidth={1200}
        ogImageHeight={630}
        structuredData={hasFirstPaintHeading.current ? undefined : [CONTACT_PAGE_SCHEMA, CONTACT_BREADCRUMB_SCHEMA]}
      />
      {/* Hero Section */}
      <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {hasFirstPaintHeading.current
              ? <div aria-hidden="true" className="text-4xl md:text-5xl font-bold mb-6" style={{ visibility: "hidden" }}>{CONTACT_PAGE_COPY.h1}</div>
              : <h1 className="text-4xl md:text-5xl font-bold mb-6">{CONTACT_PAGE_COPY.h1}</h1>}
            {hasFirstPaintHeading.current
              ? <p aria-hidden="true" className="text-lg text-muted-foreground leading-relaxed" style={{ visibility: "hidden" }}>{CONTACT_PAGE_COPY.intro}</p>
              : <p className="text-lg text-muted-foreground leading-relaxed">
                  {CONTACT_PAGE_COPY.introSegments.map((segment, index) =>
                    "href" in segment
                      ? <a key={index} href={segment.href} className="hover:text-primary transition-colors">{segment.text}</a>
                      : <span key={index}>{segment.text}</span>
                  )}
                </p>}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section id="enquiry-form" className="py-16 md:py-20 lg:py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">{CONTACT_PAGE_COPY.callbackHeading}</h2>
                  <p className="text-muted-foreground">{CONTACT_PAGE_COPY.callbackDescription}</p>
                </CardHeader>
                <CardContent>
              <ContactForm copy={CONTACT_PAGE_COPY.form} />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{CONTACT_PAGE_COPY.phoneLabel}</h3>
                      <a href="tel:+918291568972" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact-phone">
                        {CONTACT_PAGE_COPY.generalPhone}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">{CONTACT_PAGE_COPY.phoneSecondary}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{CONTACT_PAGE_COPY.emailLabel}</h3>
                      <a ref={emailLinkRef} href="mailto:admin@rainbowpreschools.com" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact-email">
                        {CONTACT_PAGE_COPY.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{CONTACT_PAGE_COPY.workingHoursLabel}</h3>
                      <p className="text-muted-foreground">{CONTACT_PAGE_COPY.workingDays}</p>
                      <p className="text-sm text-muted-foreground mt-1">{CONTACT_PAGE_COPY.workingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{CONTACT_PAGE_COPY.locationsLabel}</h3>
                      <p className="text-muted-foreground">{CONTACT_PAGE_COPY.locationCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">{CONTACT_PAGE_COPY.nearestCentrePrompt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {CONTACT_PAGE_COPY.quote}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Centres Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{CONTACT_PAGE_COPY.centresHeading}</h2>
            <p className="text-muted-foreground text-lg">{CONTACT_PAGE_COPY.centresDescription}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTACT_PAGE_COPY.branches.map((branch) => {
              const details = CONTACT_PAGE_COPY.centreDetails[branch.id as keyof typeof CONTACT_PAGE_COPY.centreDetails];
              if (!details) throw new Error(`Missing contact details for ${branch.id}`);
              return (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  classesText={details.classes}
                  daycareText={"daycare" in details ? details.daycare : undefined}
                  image={details.image}
                  copy={{ ...CONTACT_PAGE_COPY.branchCard, localPages: CONTACT_PAGE_COPY.localPages }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">{CONTACT_PAGE_COPY.exploreHeading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href={CONTACT_PAGE_COPY.links[0].href} className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{CONTACT_PAGE_COPY.links[0].label}</span>
            </Link>
            <Link href={CONTACT_PAGE_COPY.links[1].href} className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{CONTACT_PAGE_COPY.links[1].label}</span>
            </Link>
            <Link href={CONTACT_PAGE_COPY.links[2].href} className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{CONTACT_PAGE_COPY.links[2].label}</span>
            </Link>
            <Link href={CONTACT_PAGE_COPY.links[3].href} className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-gallery">
              <Images className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{CONTACT_PAGE_COPY.links[3].label}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/contact"
          pageName="Contact Rainbow Preschool Thane"
          lastUpdated={CONTACT_PAGE_COPY.publishDateDisplay}
          lastUpdatedIso={CONTACT_PAGE_COPY.publishDate}
          showRating={false}
          schemaId="contact-eeat"
        />
      </section>

      {/* ExtraEdge Form Tracking */}
      <div id="ee-form-5" style={{ display: "none" }} />
    </article>
  );
}
