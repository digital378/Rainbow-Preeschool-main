import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, MapPin, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { centres } from "@shared/centre-data";
import { pushToDataLayer } from "@/lib/analytics";
import { cn } from "@/lib/utils";
const logoImage = "/images/optimized/rainbow-logo.webp";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programmes", label: "Programmes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Only use transparent header on homepage
  const isHomepage = location === "/";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Use transparent header only on homepage when not scrolled
  const useTransparentHeader = isHomepage && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        useTransparentHeader
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md border-b shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 h-20 md:h-24">
          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="Rainbow Preschool International" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                width={80}
                height={80}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center rounded-md overflow-hidden bg-primary">
            {/* Home link */}
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white",
                  location === "/" && "bg-white/20"
                )}
                data-testid="link-nav-home"
              >
                Home
              </Button>
            </Link>
            
            {/* About Us link */}
            <Link href="/about">
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white",
                  location === "/about" && "bg-white/20"
                )}
                data-testid="link-nav-about-us"
              >
                About Us
              </Button>
            </Link>
            
            {/* Programmes link */}
            <Link href="/programmes">
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white",
                  location.startsWith("/programmes") && "bg-white/20"
                )}
                data-testid="link-nav-programmes"
              >
                Programmes
              </Button>
            </Link>
            
            {/* Gallery link */}
            <Link href="/gallery">
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white",
                  location === "/gallery" && "bg-white/20"
                )}
                data-testid="link-nav-gallery"
              >
                Gallery
              </Button>
            </Link>

            {/* Blogs link */}
            <Link href="/blog">
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white",
                  location === "/blog" && "bg-white/20"
                )}
                data-testid="link-nav-blogs"
              >
                Blogs
              </Button>
            </Link>
            
            {/* Contact link */}
            <Link href="/contact">
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white",
                  location === "/contact" && "bg-white/20"
                )}
                data-testid="link-nav-contact"
              >
                Contact
              </Button>
            </Link>
            
            {/* Centres Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white"
                  data-testid="button-centres-dropdown"
                >
                  Centres <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {centres.map((centre) => (
                  <DropdownMenuItem key={centre.id} asChild>
                    <Link
                      href={centre.preschoolLandingUrl}
                      onClick={() => {
                        pushToDataLayer({
                          event: 'header_centre_click',
                          centre: centre.name,
                          locality: centre.localityName,
                          slug: centre.preschoolLandingUrl,
                        });
                      }}
                      className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                      data-testid={`link-centre-${centre.id}`}
                    >
                      <span className="font-medium text-sm">{centre.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Preschool in {centre.localityName}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <div className={cn("hidden sm:block", useTransparentHeader && "[&_button]:text-white [&_button]:hover:text-white [&_button]:hover:bg-white/20")}>
              <ThemeToggle />
            </div>

            {/* Book Visit — Call CTA */}
            <a
              href="tel:+918291568972"
              onClick={() => pushToDataLayer({ event: 'header_book_visit_call', phone: '8291568972' })}
              data-testid="button-header-book-visit"
              aria-label="Book a visit — call 8291568972"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 shadow-md transition-colors whitespace-nowrap"
            >
              <Phone className="h-4 w-4" fill="currentColor" />
              <span>Book Visit</span>
            </a>

            {/* Admissions — WhatsApp CTA */}
            <a
              href="https://wa.me/918291568972?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20admissions%20at%20Rainbow%20Preschool."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => pushToDataLayer({ event: 'header_admissions_whatsapp', phone: '8291568972' })}
              data-testid="button-header-admissions-whatsapp"
              aria-label="Admissions enquiry on WhatsApp"
              className="inline-flex items-center gap-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 shadow-md transition-colors whitespace-nowrap"
            >
              <SiWhatsapp className="h-4 w-4" />
              <span>Admissions</span>
            </a>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden",
                useTransparentHeader && "text-white hover:text-white hover:bg-white/20"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t bg-background/95 backdrop-blur-md absolute left-0 right-0 top-full">
            <div className="flex flex-col gap-2 px-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Centres Section */}
              <div className="pt-4 border-t mt-2">
                <p className="text-sm font-semibold text-muted-foreground mb-2 px-4">Our Centres</p>
                {centres.map((centre) => (
                  <Link
                    key={centre.id}
                    href={centre.preschoolLandingUrl}
                    onClick={() => {
                      pushToDataLayer({
                        event: 'mobile_centre_click',
                        centre: centre.name,
                        locality: centre.localityName,
                        slug: centre.preschoolLandingUrl,
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover-elevate rounded-md"
                    data-testid={`link-mobile-centre-${centre.id}`}
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{centre.name}</span>
                  </Link>
                ))}
              </div>
              
              <Link href="/contact" className="mt-4">
                <Button className="w-full" data-testid="button-mobile-contact">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
