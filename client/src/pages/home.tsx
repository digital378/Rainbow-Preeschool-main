import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeroSection } from "@/components/hero-section";
import { ProgrammeCard } from "@/components/programme-card";
import { BranchCard } from "@/components/branch-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { WhyChooseUs } from "@/components/why-choose-us";
import { MethodologySection } from "@/components/methodology-section";
import { CTASection } from "@/components/cta-section";
import { ContactForm } from "@/components/contact-form";
import { programmes, branches, testimonials } from "@shared/schema";
import { ArrowRight, Star } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Contact Form Section - Get In Touch */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Get In Touch</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Request A Callback</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Submit your details and queries here. We'd be glad to help you out!
              </p>
              <div className="rounded-xl overflow-hidden shadow-md">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-auto"
                  data-testid="video-walkthrough"
                >
                  <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">About</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Rainbow Preschool International</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Founded in 2007, Rainbow Preschool International has nurtured over 50,000 young learners through joyful early childhood education. Being one of the most trusted preschools in Thane, we provide a safe, secure, and happy learning environment built on a strong play-based philosophy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our age-appropriate curriculum helps children develop confidence, creativity, and early academic skills, preparing them smoothly for primary schooling while respecting every child's unique pace of growth.
              </p>
              <Link href="/about">
                <Button variant="outline" data-testid="button-learn-more">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary mb-2 stat-3d">50K+</p>
                  <p className="text-sm text-muted-foreground">Students Taught</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary mb-2 stat-3d">18+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary mb-2 stat-3d">06</p>
                  <p className="text-sm text-muted-foreground">Centres</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <p className="text-4xl font-bold text-primary stat-3d">4.7</p>
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">Google Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Programmes</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for Every Stage</h2>
            <p className="text-muted-foreground text-lg">
              From playgroup to kindergarten, we offer age-appropriate programmes that nurture your child's growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.slice(0, 6).map((programme, index) => (
              <ProgrammeCard key={programme.id} programme={programme} index={index} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/programmes">
              <Button variant="outline" size="lg" data-testid="button-view-programmes">
                View All Programmes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <MethodologySection />

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Parents Say</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <SiGoogle className="w-5 h-5" />
              <span className="font-semibold">4.7</span>
              <div className="flex items-center">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-muted-foreground text-sm">(397 reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Centres Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rainbow Preschool Centres</h2>
            <p className="text-muted-foreground text-lg">Find a Rainbow Preschool near you across Thane West.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
