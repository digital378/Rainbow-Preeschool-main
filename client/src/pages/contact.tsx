import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { BranchCard } from "@/components/branch-card";
import { SEO } from "@/components/seo";
import { branches } from "@shared/schema";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-20">
      <SEO
        title="Contact Us - Rainbow Preschool International | Admissions & Enquiries"
        description="Contact Rainbow Preschool International for admissions, school tours & enquiries. 6 centres across Thane West. Call 82915 68972 or visit our nearest centre today."
        keywords="contact rainbow preschool, preschool admissions thane, preschool enquiry, preschool near me thane, kindergarten admissions, nursery admissions thane, school admission 2025, nursery school fees, preschool registration, best playschool near me, kindergarten near me, daycare near me, preschool admission form"
        canonical="https://rainbowpreschools.com/contact"
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
          
          {/* Interactive Google Map with All 6 Centres */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d60280!2d72.965!3d19.225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e2!4m5!1s0x3be7b95ffb8bcb13:0x13688c8325ca683d!2sRainbow%20Preschool%20-%20Aggarwal%20Arcade%20Centre%2C%20Manpada%2C%20Thane!3m2!1d19.2326549!2d72.9710766!4m5!1s0x3be7b975b40427b7:0x242ddb15f6e8ed13!2sRainbow%20Preschool%20-%20Hariniwas%20Centre%2C%20Thane!3m2!1d19.1917133!2d72.966523!4m5!1s0x3be7bb97c41357b7:0x6fb38c5fc413efd!2sRainbow%20Preschool%20-%20Anand%20Nagar%20Centre%2C%20Thane!3m2!1d19.2648723!2d72.9707478!4m5!1s0x3be7b959c655a7df:0xe5f1220ddc82fa0e!2sRainbow%20Preschool%20-%20Dhokali%20Centre%2C%20Thane!3m2!1d19.228991!2d72.9802583!4m5!1s0x3be7b92cb119b52d:0xf0102245760e3e34!2sRainbow%20Preschool%20-%20Kalwa%20Centre%2C%20Thane!3m2!1d19.1990801!2d72.9913522!4m5!1s0x3be7bba6a93f26cb:0x946d1fefba8c8e88!2sRainbow%20Preschool%20-%20Kasarvadavli%20Centre%2C%20Thane!3m2!1d19.2669237!2d72.9634446!5e0!3m2!1sen!2sin!4v1703000000000"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rainbow Preschool International - All 6 Centres in Thane"
              className="w-full"
              data-testid="map-contact-centres"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Click on any marker to view centre details. Use zoom controls to explore all 6 locations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
