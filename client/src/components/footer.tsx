import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import logoImage from "@assets/Rainbow_Pre_School.Logo_1766035853658.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      {/* Rainbow strip */}
      <div className="h-1 rainbow-gradient" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="Rainbow Preschool International" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Laying the foundation for tomorrow since 2007. Over 50,000 young students have completed their Pre-Primary education with us.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/rainbowpreschools"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover-elevate"
                data-testid="link-social-facebook"
              >
                <SiFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/rainbowpreschools"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover-elevate"
                data-testid="link-social-instagram"
              >
                <SiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/rainbowpreschools"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover-elevate"
                data-testid="link-social-youtube"
              >
                <SiYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-programmes">
                  Our Programmes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">
                  News & Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-semibold text-base mb-4">Our Programmes</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/playgroup"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-programme-playgroup"
                >
                  Playgroup
                </Link>
              </li>
              <li>
                <Link
                  href="/nursery"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-programme-nursery"
                >
                  Nursery
                </Link>
              </li>
              <li>
                <Link
                  href="/kindergarten"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-programme-kindergarten"
                >
                  Kindergarten
                </Link>
              </li>
              <li>
                <Link
                  href="/kids-activity-club"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-programme-kids-activity-club"
                >
                  Kids Activity Club
                </Link>
              </li>
              <li>
                <Link
                  href="/summer-camp"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-programme-summer-camp"
                >
                  Summer Camp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-base mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  2nd Floor, Chestnut Plaza, Opp. Edenwoods, Khewra Cir Marg, Manpada, Thane (W), 400610 (Head Office)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:8291568972"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-phone-1"
                  >
                    82915 68972
                  </a>
                  <a
                    href="tel:02261147114"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-phone-2"
                  >
                    022 6114 7114
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:admin@rainbowpreschools.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-email"
                >
                  admin@rainbowpreschools.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Mon - Sat: 9 AM - 6 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Rainbow Preschool International. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
