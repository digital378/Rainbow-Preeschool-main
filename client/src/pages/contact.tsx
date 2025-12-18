import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { BranchCard } from "@/components/branch-card";
import { branches } from "@shared/schema";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Contact Us</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions about admissions or want to schedule a tour? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Request A Callback</h2>
                  <p className="text-muted-foreground">Fill out the form and we'll get back to you within 24 hours.</p>
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
                      <a href="tel:9321239367" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact-phone">
                        93212 39367
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">Available Mon-Sat, 8am-6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:info@rainbowpreschools.com" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact-email">
                        info@rainbowpreschools.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Working Hours</h3>
                      <p className="text-muted-foreground">Monday - Saturday</p>
                      <p className="text-sm text-muted-foreground mt-1">8:00 AM - 6:00 PM</p>
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
            <p className="text-muted-foreground text-lg">Find a Rainbow Preschool near you across Thane West.</p>
          </div>
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
