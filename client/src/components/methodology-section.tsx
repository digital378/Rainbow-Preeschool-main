import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Brain, Dumbbell, Lightbulb, Languages, Sparkles } from "lucide-react";

const curriculumAreas = [
  {
    id: "art",
    label: "Art Studio",
    icon: Palette,
    color: "bg-orange-500",
    borderColor: "border-orange-400",
    position: "top-0 left-1/2 -translate-x-1/2 -translate-y-4",
  },
  {
    id: "maths",
    label: "Maths & Science",
    icon: Brain,
    color: "bg-sky-500",
    borderColor: "border-sky-400",
    position: "top-1/4 right-0 translate-x-4",
  },
  {
    id: "sports",
    label: "Sports & Movement",
    icon: Dumbbell,
    color: "bg-teal-600",
    borderColor: "border-teal-500",
    position: "bottom-1/4 right-0 translate-x-4",
  },
  {
    id: "skill",
    label: "Skill Development",
    icon: Sparkles,
    color: "bg-green-500",
    borderColor: "border-green-400",
    position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-4",
  },
  {
    id: "aptitude",
    label: "General Aptitude",
    icon: Lightbulb,
    color: "bg-purple-400",
    borderColor: "border-purple-300",
    position: "bottom-1/4 left-0 -translate-x-4",
  },
  {
    id: "bilingual",
    label: "Bilingual Education",
    icon: Languages,
    color: "bg-amber-500",
    borderColor: "border-amber-400",
    position: "top-1/4 left-0 -translate-x-4",
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

            <Link href="/programmes">
              <Button size="lg" data-testid="button-methodology-programmes">
                View Our Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Curriculum Areas Visual - Theme Adaptive */}
          <div className="relative flex items-center justify-center" data-testid="curriculum-visual">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Center Circle with Teacher Illustration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl mb-1">
                    <span className="text-primary">R</span>
                    <span className="text-secondary">P</span>
                    <span className="text-accent">S</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Curriculum</p>
                </div>
              </div>

              {/* Curriculum Area Bubbles */}
              {curriculumAreas.map((area, index) => {
                const Icon = area.icon;
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div
                    key={area.id}
                    className="absolute top-1/2 left-1/2 flex flex-col items-center gap-1"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    data-testid={`curriculum-area-${area.id}`}
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${area.color} border-4 ${area.borderColor} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-foreground text-center whitespace-nowrap max-w-20 md:max-w-24 leading-tight">
                      {area.label}
                    </span>
                  </div>
                );
              })}

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                {curriculumAreas.map((_, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const innerRadius = 70;
                  const outerRadius = 115;
                  const centerX = 192;
                  const centerY = 192;
                  const x1 = centerX + Math.cos(angle) * innerRadius;
                  const y1 = centerY + Math.sin(angle) * innerRadius;
                  const x2 = centerX + Math.cos(angle) * outerRadius;
                  const y2 = centerY + Math.sin(angle) * outerRadius;
                  
                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className="stroke-muted-foreground/30"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
