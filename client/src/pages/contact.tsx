import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { BranchCard } from "@/components/branch-card";
import { SEO } from "@/components/seo";
import { branches } from "@shared/schema";
import { Phone, Mail, Clock, MapPin, Award, ClipboardList, Images, Navigation as NavigationIcon } from "lucide-react";

const centreMapLinks = [
  { id: "aggarwal", label: "Manpada", mapUrl: "https://maps.app.goo.gl/4sVVZ3K3x1MYsWFc7", lat: 19.2327, lng: 72.9711 },
  { id: "anand-nagar", label: "Anand Nagar", mapUrl: "https://maps.app.goo.gl/XWTsinHiPU5EjH3HA", lat: 19.2649, lng: 72.9707 },
  { id: "dhokali", label: "Dhokali", mapUrl: "https://maps.app.goo.gl/VFhUJXqVZRxKaeCWA", lat: 19.2290, lng: 72.9803 },
  { id: "hariniwas", label: "Hariniwas", mapUrl: "https://maps.app.goo.gl/NyiqKpYEiVsWoZdx5", lat: 19.1917, lng: 72.9665 },
  { id: "kalwa", label: "Kalwa", mapUrl: "https://maps.app.goo.gl/riB8TNUQdJa9yiSY7", lat: 19.1991, lng: 72.9914 },
  { id: "kasarvadavali", label: "Kasarvadavali", mapUrl: "https://maps.app.goo.gl/9Bs1YpUM1cpBgiYA6", lat: 19.2669, lng: 72.9634 },
];

const mapBounds = { minLat: 19.185, maxLat: 19.275, minLng: 72.950, maxLng: 73.000 };

function latLngToPosition(lat: number, lng: number) {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

function Interactive3DMap() {
  const [hoveredCentre, setHoveredCentre] = useState<string | null>(null);

  return (
    <div className="mb-12" data-testid="map-3d-centres">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"
        style={{
          perspective: "1200px",
        }}
      >
        <div
          className="relative w-full"
          style={{
            transform: "rotateX(15deg) rotateZ(-2deg)",
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-green-950/40 dark:via-blue-950/40 dark:to-emerald-950/40 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="road-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#road-grid)" />
              </svg>
            </div>

            <div className="absolute top-3 left-3 md:top-5 md:left-5 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">Rainbow Preschool</p>
              <p className="text-[9px] md:text-[11px] text-muted-foreground">6 Centres Across Thane</p>
            </div>

            <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] md:text-[11px] font-medium text-foreground">Click a pin to open Google Maps</span>
            </div>

            {centreMapLinks.map((centre) => {
              const pos = latLngToPosition(centre.lat, centre.lng);
              const isHovered = hoveredCentre === centre.id;
              return (
                <a
                  key={centre.id}
                  href={centre.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -100%)",
                    zIndex: isHovered ? 30 : 10,
                  }}
                  onMouseEnter={() => setHoveredCentre(centre.id)}
                  onMouseLeave={() => setHoveredCentre(null)}
                  data-testid={`map-pin-${centre.id}`}
                >
                  <div
                    className="flex flex-col items-center transition-transform duration-300"
                    style={{
                      transform: isHovered ? "translateY(-8px) scale(1.15)" : "translateY(0) scale(1)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className={`
                      relative px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-lg mb-1
                      transition-all duration-300
                      ${isHovered
                        ? "bg-primary text-white shadow-primary/40 shadow-xl"
                        : "bg-white dark:bg-gray-800 text-foreground shadow-md border border-gray-200 dark:border-gray-600"
                      }
                    `}
                      style={{
                        transform: "translateZ(20px)",
                      }}
                    >
                      <span className="text-[9px] md:text-xs font-bold whitespace-nowrap block">{centre.label}</span>
                      <div className={`
                        flex items-center gap-0.5 mt-0.5 transition-all duration-300
                        ${isHovered ? "opacity-100 max-h-6" : "opacity-0 max-h-0"}
                      `}>
                        <NavigationIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span className="text-[8px] md:text-[10px]">Get Directions</span>
                      </div>
                      <div className={`
                        absolute left-1/2 -bottom-1.5 w-3 h-3 rotate-45 -translate-x-1/2 transition-colors duration-300
                        ${isHovered
                          ? "bg-primary"
                          : "bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-600"
                        }
                      `} />
                    </div>

                    <div className="relative flex flex-col items-center" style={{ transform: "translateZ(10px)" }}>
                      <svg width="24" height="36" viewBox="0 0 24 36" className="md:w-[30px] md:h-[44px] drop-shadow-lg">
                        <defs>
                          <linearGradient id={`pin-grad-${centre.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
                          fill={`url(#pin-grad-${centre.id})`}
                          className="transition-all duration-300"
                          style={{ filter: isHovered ? "brightness(1.2)" : "brightness(1)" }}
                        />
                        <circle cx="12" cy="11" r="5" fill="white" opacity="0.9" />
                        <circle cx="12" cy="11" r="2.5" fill="hsl(var(--primary))" />
                      </svg>
                    </div>

                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/20 dark:bg-black/40 blur-sm transition-all duration-300"
                      style={{
                        width: isHovered ? "20px" : "14px",
                        height: isHovered ? "6px" : "4px",
                        transform: `translateX(-50%) translateZ(-5px)`,
                      }}
                    />
                  </div>
                </a>
              );
            })}

            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" viewBox="0 0 100 100" preserveAspectRatio="none">
              {(() => {
                const points = centreMapLinks.map(c => latLngToPosition(c.lat, c.lng));
                const sorted = [...points].sort((a, b) => a.y - b.y);
                const pathData = sorted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                return (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="hsl(var(--primary) / 0.15)"
                    strokeWidth="0.3"
                    strokeDasharray="1 0.8"
                  />
                );
              })()}
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.05) 100%)",
        }} />
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4 mb-8">
        Click on any centre pin to open directions in Google Maps.
      </p>
    </div>
  );
}

export default function Contact() {
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
    <div className="pt-20 md:pt-24">
      <SEO
        title="Contact Rainbow Preschool Thane | Admissions Enquiry"
        description="Contact Rainbow Preschool International for admissions, school tours & enquiries. 6 centres across Thane West. Call 82915 68972 or visit our nearest centre today."
        keywords="contact rainbow preschool, preschool admissions thane, preschool enquiry, nursery admissions thane, school admission 2025, nursery school fees, preschool registration, preschool admission form, rainbow preschool enquiry thane"
        canonical="https://www.rainbowpreschools.com/contact"
      />
      {/* Hero Section */}
      <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions about admissions or want to schedule a tour? We'd love to hear from you!
            </p>
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
                  <h2 className="text-2xl font-bold">Request A Callback</h2>
                  <p className="text-muted-foreground">Fill out the form and we'll get back to you shortly.</p>
                </CardHeader>
                <CardContent>
                  <ContactForm />
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
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:8291568972" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact-phone">
                        82915 68972
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:admin@rainbowpreschools.com" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact-email">
                        admin@rainbowpreschools.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Working Hours</h3>
                      <p className="text-muted-foreground">Monday - Saturday</p>
                      <p className="text-sm text-muted-foreground mt-1">9AM - 6PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Locations</h3>
                      <p className="text-muted-foreground">6 Centres across Thane West</p>
                      <p className="text-sm text-muted-foreground mt-1">Find your nearest centre below</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "The secret of getting ahead is getting started."
                <footer className="mt-2 text-sm font-medium text-foreground">— Mark Twain</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Centres Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Centres</h2>
            <p className="text-muted-foreground text-lg">Locate your nearest Rainbow Preschools Centre in Thane.</p>
          </div>
          
          <Interactive3DMap />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/preschool-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-contact-gallery">
              <Images className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ExtraEdge Form Tracking */}
      <div id="ee-form-5" style={{ display: "none" }} />
    </div>
  );
}
