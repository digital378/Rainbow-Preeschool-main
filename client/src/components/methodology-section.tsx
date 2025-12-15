import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award, Heart } from "lucide-react";

const methodologySteps = [
  {
    icon: BookOpen,
    title: "Play-Based Learning",
    description: "Children learn best through play, exploration, and hands-on activities",
  },
  {
    icon: Users,
    title: "Social Development",
    description: "Building friendships, teamwork, and communication skills",
  },
  {
    icon: Award,
    title: "Academic Readiness",
    description: "Preparing children for primary school with foundational concepts",
  },
  {
    icon: Heart,
    title: "Emotional Growth",
    description: "Nurturing confidence, independence, and emotional intelligence",
  },
];

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

            <div className="space-y-4 mb-8">
              {methodologySteps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4"
                  data-testid={`methodology-step-${index}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/programmes">
              <Button size="lg" data-testid="button-methodology-programmes">
                View Our Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Visual representation */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto">
              {/* Flow diagram representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-primary">RPS</span>
                      <p className="text-xs text-muted-foreground mt-1">Methodology</p>
                    </div>
                  </div>

                  {/* Orbiting elements */}
                  {methodologySteps.map((step, index) => {
                    const angle = (index * 90 - 45) * (Math.PI / 180);
                    const radius = 140;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <div
                        key={index}
                        className="absolute top-1/2 left-1/2 w-20 h-20"
                        style={{
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        }}
                      >
                        <div className="w-full h-full rounded-xl bg-card border flex flex-col items-center justify-center p-2 text-center shadow-sm">
                          <step.icon className="w-5 h-5 text-primary mb-1" />
                          <span className="text-xs font-medium leading-tight">{step.title.split(" ")[0]}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="8 4"
                      className="text-border"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
