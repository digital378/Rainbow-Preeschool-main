import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { branches } from "@shared/schema";
import { cn } from "@/lib/utils";
import logoImage from "@assets/Rainbow_Pre_School.Logo_1766035853658.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programmes", label: "Programmes" },
  { href: "/blog", label: "News & Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
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
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium",
                    location === link.href && "bg-accent"
                  )}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            {/* Centres Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium" data-testid="button-centres-dropdown">
                  Centres <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {branches.map((branch) => (
                  <DropdownMenuItem key={branch.id} asChild>
                    <a
                      href={`tel:${branch.calling?.replace(/\s/g, "")}`}
                      className="flex flex-col items-start gap-1 py-2"
                      data-testid={`link-branch-${branch.id}`}
                    >
                      <span className="font-medium text-sm">{branch.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {branch.calling || ('landline' in branch ? branch.landline : '')}
                      </span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/contact" className="hidden md:block">
              <Button data-testid="button-contact-cta">
                Contact Us
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
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
              
              <div className="pt-4 border-t mt-2">
                <p className="text-sm font-semibold text-muted-foreground mb-2 px-4">Our Centres</p>
                {branches.map((branch) => (
                  <a
                    key={branch.id}
                    href={`tel:${branch.calling?.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover-elevate rounded-md"
                    data-testid={`link-mobile-branch-${branch.id}`}
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{branch.name}</span>
                  </a>
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
