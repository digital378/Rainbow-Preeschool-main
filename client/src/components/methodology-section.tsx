import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import teacherImage from "@assets/New_RPS_Flow_Chart_1766124212525.png";

const curriculumAreas = [
  {
    id: "art",
    label: "Art Studio",
    emoji: "🎨",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-300",
  },
  {
    id: "maths",
    label: "Maths & Science",
    emoji: "🔬",
    bgColor: "bg-sky-500",
    borderColor: "border-sky-300",
  },
  {
    id: "sports",
    label: "Sports & Movement",
    emoji: "⚽",
    bgColor: "bg-teal-600",
    borderColor: "border-teal-400",
  },
  {
    id: "skill",
    label: "Skill Development",
    emoji: "🧠",
    bgColor: "bg-green-500",
    borderColor: "border-green-300",
  },
  {
    id: "aptitude",
    label: "General Aptitude",
    emoji: "💡",
    bgColor: "bg-purple-400",
    borderColor: "border-purple-200",
  },
  {
    id: "bilingual",
    label: "Bilingual Education",
    emoji: "🗣️",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-300",
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
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              {/* Connecting curved lines */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 400 400"
                style={{ zIndex: 0 }}
              >
                {curriculumAreas.map((_, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const centerX = 200;
                  const centerY = 200;
                  const innerRadius = 70;
                  const outerRadius = 130;
                  
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
                      className="stroke-primary/40"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Center Circle - RPS Curriculum */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-4 border-primary/40 flex items-center justify-center shadow-lg z-10">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">
                    <span className="text-primary">R</span>
                    <span className="text-secondary">P</span>
                    <span className="text-accent">S</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Curriculum</p>
                </div>
              </div>

              {/* Curriculum Area Bubbles */}
              {curriculumAreas.map((area, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 145;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div
                    key={area.id}
                    className="absolute top-1/2 left-1/2 flex flex-col items-center gap-2 z-20"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    data-testid={`curriculum-area-${area.id}`}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${area.bgColor} border-4 ${area.borderColor} flex items-center justify-center shadow-lg transition-transform hover:scale-110`}>
                      <span className="text-lg md:text-xl">{area.emoji}</span>
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-foreground text-center whitespace-nowrap">
                      {area.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
