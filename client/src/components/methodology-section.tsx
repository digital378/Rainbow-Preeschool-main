import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import flowChartImage from "@assets/New_RPS_Flow_Chart_1766124212525.png";

export function MethodologySection() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Our Methodology
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Research-Based Curriculum for Every Child
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              At Rainbow Preschool, our teachers are dedicated and nurturing. Their singular goal is to help your child meet milestones and become successful. We offer a path toward elementary school that can be personalized to meet each child's needs.
            </p>

            <Link href="/programmes">
              <Button size="lg" data-testid="button-methodology-programmes">
                View Our Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Flow Chart Image */}
          <div className="relative">
            <img 
              src={flowChartImage} 
              alt="Rainbow Preschool Methodology - Art Studio, Maths & Science, Sports & Movement, Skill Development, General Aptitude, Bilingual Education" 
              className="w-full max-w-lg mx-auto"
              data-testid="img-methodology-flowchart"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
