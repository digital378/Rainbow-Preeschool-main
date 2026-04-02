import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { BranchCard } from "@/components/branch-card";
import { SEO } from "@/components/seo";
import { branches } from "@shared/schema";
import { Phone, Mail, Clock, MapPin, Award, ClipboardList, Images, Navigation as NavigationIcon } from "lucide-react";

const centreMapPins = [
  { id: "kasarvadavali", label: "Kasarvadavali", mapUrl: "https://maps.app.goo.gl/9Bs1YpUM1cpBgiYA6", x: 18, y: 16, labelSide: "right" as const },
  { id: "anand-nagar", label: "Anand Nagar", mapUrl: "https://maps.app.goo.gl/XWTsinHiPU5EjH3HA", x: 75, y: 14, labelSide: "left" as const },
  { id: "aggarwal", label: "Manpada", mapUrl: "https://maps.app.goo.gl/4sVVZ3K3x1MYsWFc7", x: 30, y: 46, labelSide: "right" as const },
  { id: "dhokali", label: "Dhokali", mapUrl: "https://maps.app.goo.gl/VFhUJXqVZRxKaeCWA", x: 62, y: 42, labelSide: "left" as const },
  { id: "hariniwas", label: "Hariniwas", mapUrl: "https://maps.app.goo.gl/NyiqKpYEiVsWoZdx5", x: 20, y: 76, labelSide: "right" as const },
  { id: "kalwa", label: "Kalwa", mapUrl: "https://maps.app.goo.gl/riB8TNUQdJa9yiSY7", x: 78, y: 74, labelSide: "left" as const },
];

function MapTree({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <rect x="-1.5" y="0" width="3" height="8" rx="1" fill="#8B6914" />
      <circle cx="0" cy="-4" r="7" fill="#4CAF50" opacity="0.85" />
      <circle cx="-4" cy="-1" r="5" fill="#66BB6A" opacity="0.7" />
      <circle cx="4" cy="-2" r="5.5" fill="#43A047" opacity="0.75" />
      <circle cx="0" cy="-7" r="4" fill="#81C784" opacity="0.6" />
    </g>
  );
}

function MapHouse({ x, y, variant = 0 }: { x: number; y: number; variant?: number }) {
  const colors = [
    { wall: "#FFF3E0", roof: "#E53935", door: "#795548", window: "#BBDEFB" },
    { wall: "#E3F2FD", roof: "#E53935", door: "#5D4037", window: "#FFF9C4" },
    { wall: "#FFF9C4", roof: "#E53935", door: "#6D4C41", window: "#B3E5FC" },
  ];
  const c = colors[variant % 3];
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-14" y="0" width="28" height="20" rx="1.5" fill={c.wall} stroke="#BDBDBD" strokeWidth="0.5" />
      <polygon points="0,-12 -16,0 16,0" fill={c.roof} stroke="#C62828" strokeWidth="0.5" />
      <rect x="-4" y="8" width="8" height="12" rx="1" fill={c.door} />
      <circle cx="2" cy="15" r="0.8" fill="#FFC107" />
      <rect x="-11" y="4" width="5" height="5" rx="0.5" fill={c.window} stroke="#90CAF9" strokeWidth="0.4" />
      <line x1="-8.5" y1="4" x2="-8.5" y2="9" stroke="#90CAF9" strokeWidth="0.3" />
      <rect x="6" y="4" width="5" height="5" rx="0.5" fill={c.window} stroke="#90CAF9" strokeWidth="0.4" />
      <line x1="8.5" y1="4" x2="8.5" y2="9" stroke="#90CAF9" strokeWidth="0.3" />
    </g>
  );
}

function Interactive3DMap() {
  const [hoveredCentre, setHoveredCentre] = useState<string | null>(null);

  return (
    <div className="mb-12" data-testid="map-3d-centres">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        <svg viewBox="0 0 800 500" className="w-full h-auto block" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="map-bg" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#E8F5E9" />
              <stop offset="40%" stopColor="#C8E6C9" />
              <stop offset="100%" stopColor="#A5D6A7" />
            </linearGradient>
            <linearGradient id="road-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9E9E9E" />
              <stop offset="50%" stopColor="#BDBDBD" />
              <stop offset="100%" stopColor="#9E9E9E" />
            </linearGradient>
            <filter id="map-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          <rect width="800" height="500" fill="url(#map-bg)" rx="16" />

          <g opacity="0.08">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={`grass-${i}`} cx={40 + (i * 41) % 780} cy={30 + (i * 67) % 470} r={3 + (i % 3)} fill="#2E7D32" />
            ))}
          </g>

          <g opacity="0.5">
            <path d="M0,220 Q120,200 200,250 Q300,310 400,280 Q500,250 600,270 Q700,290 800,260" fill="none" stroke="#9E9E9E" strokeWidth="12" strokeLinecap="round" />
            <path d="M0,220 Q120,200 200,250 Q300,310 400,280 Q500,250 600,270 Q700,290 800,260" fill="none" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="8 12" />

            <path d="M300,0 Q280,80 310,160 Q340,250 320,340 Q300,420 330,500" fill="none" stroke="#9E9E9E" strokeWidth="10" strokeLinecap="round" />
            <path d="M300,0 Q280,80 310,160 Q340,250 320,340 Q300,420 330,500" fill="none" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="8 12" />

            <path d="M550,0 Q570,100 540,180 Q510,260 550,350 Q580,430 560,500" fill="none" stroke="#9E9E9E" strokeWidth="8" strokeLinecap="round" />
            <path d="M550,0 Q570,100 540,180 Q510,260 550,350 Q580,430 560,500" fill="none" stroke="#E0E0E0" strokeWidth="0.8" strokeDasharray="6 10" />
          </g>

          <MapTree x={60} y={80} size={0.9} />
          <MapTree x={720} y={60} size={1.1} />
          <MapTree x={130} y={310} size={0.8} />
          <MapTree x={680} y={180} size={1} />
          <MapTree x={450} y={120} size={0.7} />
          <MapTree x={100} y={440} size={0.9} />
          <MapTree x={400} y={430} size={0.85} />
          <MapTree x={700} y={400} size={1} />
          <MapTree x={500} y={340} size={0.75} />
          <MapTree x={200} y={170} size={0.65} />
          <MapTree x={370} y={170} size={0.7} />
          <MapTree x={640} y={330} size={0.8} />
          <MapTree x={50} y={200} size={0.6} />
          <MapTree x={750} y={280} size={0.7} />

          <MapHouse x={144} y={68} variant={0} />
          <MapHouse x={600} y={58} variant={1} />
          <MapHouse x={240} y={218} variant={2} />
          <MapHouse x={496} y={198} variant={0} />
          <MapHouse x={160} y={368} variant={1} />
          <MapHouse x={624} y={358} variant={2} />
        </svg>

        <div className="absolute inset-0">
          <div className="absolute top-3 left-3 md:top-5 md:left-5 z-20">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs md:text-sm font-bold text-primary uppercase tracking-wider">Rainbow Preschool</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">6 Centres Across Thane</p>
            </div>
          </div>

          <div className="absolute top-3 right-3 md:top-5 md:right-5 z-20">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
              <span className="text-[10px] md:text-xs font-medium text-foreground">Click a pin to open Google Maps</span>
            </div>
          </div>

          {centreMapPins.map((centre) => {
            const isHovered = hoveredCentre === centre.id;
            const isLeft = centre.labelSide === "left";
            return (
              <a
                key={centre.id}
                href={centre.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute cursor-pointer group"
                style={{
                  left: `${centre.x}%`,
                  top: `${centre.y}%`,
                  zIndex: isHovered ? 30 : 10,
                }}
                onMouseEnter={() => setHoveredCentre(centre.id)}
                onMouseLeave={() => setHoveredCentre(null)}
                data-testid={`map-pin-${centre.id}`}
              >
                <div className="relative flex items-end gap-1" style={{ transform: "translate(-12px, -36px)" }}>
                  <div className={`order-${isLeft ? "1" : "2"} flex flex-col items-center transition-transform duration-300`}
                    style={{ transform: isHovered ? "translateY(-4px)" : "translateY(0)" }}
                  >
                    <svg width="24" height="36" viewBox="0 0 24 36" className="drop-shadow-lg">
                      <defs>
                        <linearGradient id={`pg-${centre.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E53935" />
                          <stop offset="100%" stopColor="#C62828" />
                        </linearGradient>
                      </defs>
                      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill={`url(#pg-${centre.id})`} />
                      <circle cx="12" cy="11" r="5" fill="white" opacity="0.95" />
                      <circle cx="12" cy="11" r="2.5" fill="#E53935" />
                    </svg>
                    <div className="w-2 h-1 rounded-full bg-black/20 mt-[-2px]" />
                  </div>

                  <div
                    className={`order-${isLeft ? "0" : "3"} transition-all duration-300 ${isLeft ? "mr-1" : "ml-1"}`}
                    style={{
                      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                      marginBottom: "10px",
                    }}
                  >
                    <div className={`
                      relative px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg transition-all duration-300
                      ${isHovered
                        ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md border border-gray-200 dark:border-gray-600"
                      }
                    `}>
                      <span className="text-[10px] md:text-xs font-bold whitespace-nowrap block leading-tight">{centre.label}</span>
                      <div className={`
                        flex items-center justify-center gap-1 transition-all duration-300 overflow-hidden
                        ${isHovered ? "opacity-100 max-h-5 mt-1" : "opacity-0 max-h-0 mt-0"}
                      `}>
                        <NavigationIcon className="w-2.5 h-2.5" />
                        <span className="text-[8px] md:text-[10px] whitespace-nowrap">Directions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M18,16 L30,46" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
            <path d="M75,14 L62,42" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
            <path d="M30,46 L62,42" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
            <path d="M30,46 L20,76" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
            <path d="M62,42 L78,74" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
            <path d="M20,76 L78,74" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.2" strokeDasharray="1 1" />
          </svg>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4 mb-8" data-testid="text-map-cta">
        Click on any pin to open directions in Google Maps
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
